import { createContext, useContext, useEffect, useState } from "react";
import { Cell, Position, Ship } from "../lib/types";
import { GameContext } from "./GameContext";

interface MoveShipContextValue {
  /**
   * Whether the ship is being moved or not.
   */
  isMoving: boolean;

  /**
   * Sets the value of isMoving.
   */
  setIsMoving: (isMoving: boolean) => void;

  /**
   * The position of the selected ship.
   */
  selected: Position | null;

  /**
   * Sets the position of the selected ship.
   * @param position - The position of the selected ship.
   * @returns
   */
  setSelected: (position: Position | null) => void;

  /**
   * An array of cells that are part of the selected ship.
   */
  selectedCells: Cell[];

  /**
   * Moves the ship to the new position.
   * @param params - The old and new position of the ship.
   */
  moveShip: (params: { oldPosition: Position; newPosition: Position }) => void;

  /**
   * Checks if the new position is valid for the ship.
   * @param ship - The ship to be moved.
   * @param newPosition - The new position of the ship.
   * @returns Whether the new position is valid or not.
   */
  isValidPosition: (ship: Ship, newPosition: Position) => boolean;

  /**
   * Rotates the selected ship.
   * @param selectedCell - The selected cell.
   */
  rotateShip: (selectedCell: Cell) => void;
}

const MoveShipContext = createContext<MoveShipContextValue>({
  isMoving: false,
  setIsMoving: () => {
    return;
  },
  selected: null,
  setSelected: () => {
    return;
  },
  selectedCells: [],
  moveShip: () => {
    return;
  },
  isValidPosition: () => {
    return false;
  },
  rotateShip: () => {
    return;
  },
});

const MoveShipProvider = ({ children }: { children: React.ReactNode }) => {
  const { board, setBoard } = useContext(GameContext);
  const [selected, setSelected] = useState<Position | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const getSelectedCells = () => {
      const selectedCellsArr = [] as Cell[];

      if (!selected) {
        return selectedCellsArr;
      }

      const selectedShip = board.cells[selected.x][selected.y].ship;
      if (!selectedShip) {
        return selectedCellsArr;
      }

      // The selected ships are the ships that are the same as the ship in the selected position.
      for (const row of board.cells) {
        for (const cell of row) {
          if (cell.ship && cell.ship.type === selectedShip.type) {
            selectedCellsArr.push(cell);
          }
        }
      }

      return selectedCellsArr;
    };

    const selectedCells = getSelectedCells();

    // Update the selected cells. Make sure it rerenders
    setSelectedCells([...selectedCells]);
  }, [selected, board.cells, board.ships]);

  useEffect(() => {
    setIsMoving(selected && selectedCells.length > 0 ? true : false);
  }, [selected, selectedCells]);

  // --- VALIDATING POSITION ---

  const isValidPosition = (ship: Ship, newPosition: Position) => {
    const { orientation, count, position: frontShip } = ship;

    const isWithinBoard = (orientation: string) => {
      if (orientation === "horizontal") {
        return newPosition.y - count >= -1;
      } else if (orientation === "vertical") {
        return newPosition.x - count >= -1;
      }
      return false;
    };

    const isCellOccupied = (orientation: string) => {
      for (let i = 0; i < count; i++) {
        const cellShip =
          orientation === "horizontal"
            ? board.cells[newPosition.x][newPosition.y - i].ship
            : board.cells[newPosition.x - i][newPosition.y].ship;

        if (cellShip && cellShip.position !== frontShip) {
          return true;
        }
      }
      return false;
    };

    return isWithinBoard(orientation) && !isCellOccupied(orientation);
  };

  // --- MOVING SHIP ---

  const moveShip = ({
    oldPosition,
    newPosition,
  }: {
    oldPosition: Position;
    newPosition: Position;
  }) => {
    const ship = board.cells[oldPosition.x][oldPosition.y].ship;

    if (!isMoving || !ship || !isValidPosition(ship, newPosition)) {
      return;
    }

    const newBoard = { ...board };
    const isVertical = ship.orientation === "vertical";
    const count = ship.count;
    const type = ship.type;

    // Update the ship position
    ship.position = newPosition;

    const { x: newX, y: newY } = newPosition;

    // Remove the ship from the old position
    newBoard.cells.forEach((row) => {
      row.forEach((cell) => {
        if (cell.ship && cell.ship.type === type) {
          cell.ship = null;
        }
      });
    });

    // Place the ship on the new position
    for (let i = 0; i < count; i++) {
      const cell =
        newBoard.cells[newX - (isVertical ? i : 0)][
          newY - (isVertical ? 0 : i)
        ];
      cell.ship = ship;
    }

    // Update the board
    setBoard({
      ...newBoard,
    });

    setIsMoving(false);
    setSelected(null);
  };

  // --- ROTATING SHIP ---

  const toggleOrientation = (orientation: string) =>
    orientation === "vertical" ? "horizontal" : "vertical";

  const rotateShip = (selectedCell: Cell) => {
    const ship = board.ships.find(
      (ship) =>
        ship.position.x === selectedCell.x &&
        ship.position.y === selectedCell.y,
    );

    if (!ship) {
      return;
    }

    const newOrientation = toggleOrientation(ship.orientation);

    const isValid = isValidPosition(
      {
        ...ship,
        orientation: newOrientation,
      },
      ship.position,
    );

    if (!isValid) {
      return;
    }

    ship.orientation = newOrientation;

    moveShip({
      oldPosition: ship.position,
      newPosition: ship.position,
    });
  };
  return (
    <MoveShipContext.Provider
      value={{
        selected,
        setSelected,
        selectedCells,
        isMoving,
        setIsMoving,
        moveShip,
        isValidPosition,
        rotateShip,
      }}
    >
      {children}
    </MoveShipContext.Provider>
  );
};

export { MoveShipProvider, MoveShipContext };
