import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Board, Cell, Position, Ship } from "../logic";

/**
 * Merges class names into a single string.
 *
 * @param inputs - An array of class values to be merged.
 * @returns A string of merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isValidPosition = (
  board: Board,
  ship: Ship,
  newPosition: Position,
) => {
  const { orientation, count } = ship;

  const isWithinBoard = (orientation: string) => {
    if (orientation === "horizontal") {
      return newPosition.y - count >= -1;
    } else if (orientation === "vertical") {
      return newPosition.x - count >= -1;
    }
    return false;
  };

  // Function to check if a cell is occupied by a ship
  const isCellOccupied = () => {
    if (orientation === "horizontal") {
      for (let i = 0; i < count; i++) {
        if (
          board[newPosition.x][newPosition.y - i].ship !== undefined &&
          board[newPosition.x][newPosition.y - i].ship?.type !== ship?.type
        ) {
          return true;
        }
      }
    } else if (orientation === "vertical") {
      for (let i = 0; i < count; i++) {
        if (
          board[newPosition.x - i][newPosition.y].ship !== undefined &&
          board[newPosition.x - i][newPosition.y].ship?.type !== ship?.type
        ) {
          return true;
        }
      }
    }
  };

  return isWithinBoard(orientation) && !isCellOccupied();
};

export const moveShip = (board: Board, ship: Ship, newCell: Cell) => {
  // Create deep copy of the board
  const newBoard = JSON.parse(JSON.stringify(board));

  const allShips = [] as Cell[];

  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.ship?.type === ship.type) {
        allShips.push(cell);
      }
    });
  });

  allShips.forEach((cell) => {
    newBoard[cell.x][cell.y].ship = undefined;
  });

  const newShip = { ...ship, startingPosition: { x: newCell.x, y: newCell.y } };

  if (ship.orientation === "horizontal") {
    for (let i = 0; i < ship.count; i++) {
      newBoard[newCell.x][newCell.y - i].ship = newShip;
    }
  } else if (ship.orientation === "vertical") {
    for (let i = 0; i < ship.count; i++) {
      newBoard[newCell.x - i][newCell.y].ship = newShip;
    }
  }

  Rune.actions.updateBoard(newBoard);
};

const toggleOrientation = (orientation: string) =>
  orientation === "vertical" ? "horizontal" : "vertical";

export const rotateShip = (board: Board, selectedCell: Cell) => {
  const ship = selectedCell.ship;

  if (!ship) {
    return;
  }

  const newOrientation = toggleOrientation(ship.orientation) as
    | "horizontal"
    | "vertical";

  const newShip = { ...ship, orientation: newOrientation };

  const isValid = isValidPosition(board, newShip, ship.startingPosition);

  if (!isValid) {
    return;
  }

  moveShip(board, newShip, ship.startingPosition);
};
