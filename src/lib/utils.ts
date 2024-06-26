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

export const isValidRotation = (
  board: Board,
  ship: Ship,
  currentPosition: Position,
) => {
  const newOrientation = toggleOrientation(ship.orientation) as
    | "horizontal"
    | "vertical";

  const newShip = { ...ship, orientation: newOrientation };

  return isValidPosition(board, newShip, currentPosition);
};

export const rotateShip = (board: Board, selectedCell: Cell) => {
  const ship = selectedCell.ship;

  if (!ship) {
    return false;
  }

  const newOrientation = toggleOrientation(ship.orientation) as
    | "horizontal"
    | "vertical";

  const newShip = { ...ship, orientation: newOrientation };

  const isValid = isValidPosition(board, newShip, ship.startingPosition);

  if (!isValid) {
    return false;
  }

  moveShip(board, newShip, ship.startingPosition);
  return true;
};

// For future update
// Say the player moves to an invalid spot, use this function to attempt it to the nearest valid spot with respect to their orientation
// export const moveToOptimalPosition = (
//   board: Board,
//   position: Position,
//   ship: Ship,
// ) => {
//   const { x, y } = position;
//   const { orientation, count } = ship;
//   const boardSize = 10;

//   // If the ship is on the edges of the board
//   if (
//     x >= count - 1 &&
//     x <= boardSize - count - 1 &&
//     y >= count - 1 &&
//     y <= boardSize - count - 1
//   ) {
//     return false;
//   }

//   const isCellOccupied = (x: number, y: number) => {
//     return board[x][y].ship !== undefined;
//   };

//   const isCellValid = (x: number, y: number) => {
//     return !isCellOccupied(x, y);
//   };

//   if (orientation == "horizontal") {
//     if (y > boardSize - count) return false;
//     for (let i = 1; i <= count; i++) {
//       if (!isCellValid(x, count - i)) {
//         return false;
//       }
//     }

//     moveShip(board, ship, { x, y: count - 1 });
//     return true;
//   } else {
//     for (let i = 1; i <= count; i++) {
//       if (!isCellValid(count - i, y)) {
//         return false;
//       }
//     }

//     moveShip(board, ship, { x: count - 1, y });
//     return true;
//   }
// };

export const duckSoundSpriteMap: { [key: string]: [number, number] } = {
  "duck-1": [200, 500],
  "duck-2": [3800, 300],
  "duck-3": [2000, 1000],
  "duck-4": [3000, 1000],
  "duck-5": [4000, 1000],
};
