import React, { useContext } from "react";

import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";
import { cn, isValidPosition, moveShip, rotateShip } from "../../../lib/utils";
import { GameContext } from "../../../context/GameContext";
import { Cell, Ship } from "../../../logic";

type PlacementCellProps = {
  x: number;
  y: number;
  isSelected: boolean;
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell[]>>;
  selectedShip: Ship | null;
  isMoving: boolean;
  setIsMoving: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  clickedCell: Cell | null;
};

const PlacementCell: React.FC<PlacementCellProps> = ({
  x,
  y,
  isSelected,
  setSelectedCells,
  selectedShip,
  isMoving,
  setIsMoving,
  setClickedCell,
  clickedCell,
}) => {
  const { state, playerID } = useContext(GameContext);
  const board = state.boards[playerID];
  const ships = state.ships[playerID];

  // const {
  //   selected,
  //   setSelected,
  //   selectedCells,
  //   isMoving,
  //   moveShip,
  //   rotateShip,
  //   isValidPosition,
  // } = useContext(MoveShipContext);

  const selectDuckComponent = () => {
    const ship = board[x][y].ship;
    if (ship == null || ship == undefined) return null;

    const { x: shipX, y: shipY } = ship.startingPosition;
    const shipType = ship.type;

    const ShipComponents = {
      default: Default,
      scarf: Scarf,
      hat: Hat,
      pirate: Pirate,
    };

    const ShipComponent = ShipComponents[shipType] || Default;

    return (
      <ShipComponent
        className={cn(
          x === shipX && y === shipY ? "scale-100" : "scale-[0.8]",
          "size-full select-none",
        )}
      />
    );
  };

  const hasDuck = () => {
    return board[x][y].ship != undefined;
  };

  const highlightShip = () => {
    const ship = board[x][y].ship;

    const cellsWithShip = [] as Cell[];

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.ship?.type === ship?.type) {
          cellsWithShip.push(cell);
        }
      });
    });

    setClickedCell(board[x][y]);
    setSelectedCells(cellsWithShip);
  };

  const onCellClick = () => {
    const canMoveShipToCell = () => {
      return (
        isMoving &&
        selectedShip &&
        (board[x][y].ship == undefined ||
          board[x][y].ship?.type == selectedShip?.type) &&
        isValidCellToMoveTo()
      );
    };

    if (isMoving && clickedCell?.x === x && clickedCell?.y === y) {
      rotateShip(board, clickedCell);
      setIsMoving(false);
      setSelectedCells([]);
      setClickedCell(null);
      return;
    }

    if (canMoveShipToCell()) {
      moveShip(board, selectedShip as Ship, board[x][y]);
      setIsMoving(false);
      setSelectedCells([]);
      setClickedCell(null);
      return;
    }

    const cellHasDuck = hasDuck();
    if (!cellHasDuck) return;

    highlightShip();
    setIsMoving(true);
  };

  // const onCellClick = () => {
  //   const cellHasDuck = hasDuck();
  //   const cellIsSelected = selectedCells.some(
  //     (cell) => cell.x === x && cell.y === y,
  //   );

  //   const deselectAndRotate = (pos: Position) => {
  //     rotateShip(board.cells[pos.x][pos.y]);
  //     setSelected(null);
  //   };

  //   const moveSelectedShip = (oldPos: Position) => {
  //     console.log("moving ship");
  //     moveShip({
  //       oldPosition: oldPos,
  //       newPosition: { x, y },
  //     });
  //   };

  const isValidCellToMoveTo = () => {
    if (!isMoving || !selectedShip) return false;
    return isValidPosition(board, selectedShip, { x, y });
  };

  const isMovingClasses = () => {
    if (isValidCellToMoveTo() && !isSelected) {
      return "hover:cursor-pointer bg-green-300";
    } else if (!hasDuck()) {
      return "hover:cursor-not-allowed";
    }

    return "";
  };

  return (
    <button
      tabIndex={-1}
      onClick={onCellClick}
      // disabled={isDisabled()}
      className={cn(
        "aspect-square w-[10%] rounded bg-cell hover:cursor-pointer disabled:cursor-default",
        isSelected && "animate-pulse bg-gray-300",

        // selected?.x === x &&
        //   selected?.y === y &&
        //   "outline-solid outline outline-4 -outline-offset-[1px]  outline-black",
        isMoving && isMovingClasses(),
      )}
    >
      {hasDuck() && (
        <div className="size-full select-none">{selectDuckComponent()}</div>
      )}
    </button>
  );
};

export default PlacementCell;
