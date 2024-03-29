import type { PlayerId, RuneClient } from "rune-games-sdk";

export interface Position {
  x: number;
  y: number;
}

export interface Cell extends Position {
  ship?: Ship;
  state?: "hit" | "miss";
}

export type Board = Cell[][];

export interface Ship {
  type: "default" | "hat" | "pirate" | "scarf";
  orientation: "horizontal" | "vertical";
  count: number;
  startingPosition: Cell;
}

export interface GameState {
  state: "placement" | "game" | "end";
  boards: Record<PlayerId, Board>;
  ships: Record<PlayerId, Ship[]>;
  playerIds: PlayerId[];
  turn: PlayerId;
}

type GameActions = {
  completePlacement: () => void;
  bombCell: (cell: Cell) => void;
  updateBoard: (board: Board) => void;
  nextTurn: () => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

// const updateShipsOnBoard = (board: Board, ships: Ship[]): Board => {
//   let newBoard = [...board];

//   ships.forEach((ship) => {
//     newBoard = newBoard.map((row) =>
//       row.map((cell) => {
//         if (ship.orientation === "horizontal") {
//           if (
//             cell.x >= ship.startingPosition.x &&
//             cell.x < ship.startingPosition.x + ship.count &&
//             cell.y === ship.startingPosition.y
//           ) {
//             return { ...cell, ship };
//           }
//         } else if (ship.orientation === "vertical") {
//           if (
//             cell.y >= ship.startingPosition.y &&
//             cell.y < ship.startingPosition.y + ship.count &&
//             cell.x === ship.startingPosition.x
//           ) {
//             return { ...cell, ship };
//           }
//         }

//         return cell;
//       }),
//     );
//   });

//   return newBoard;
// };

const placeShipsOnBoard = (board: Board, ships: Ship[]): Board => {
  const newBoard = JSON.parse(JSON.stringify(board)); // Deep copy

  ships.forEach((ship) => {
    const { x, y } = ship.startingPosition;
    const isVertical = ship.orientation === "vertical";

    for (let i = 0; i < ship.count; i++) {
      const cell = newBoard[x - (isVertical ? i : 0)][y - (isVertical ? 0 : i)];
      cell.ship = ship;
    }
  });

  return newBoard;
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds: PlayerId[]) => {
    const defaultShipPositions: Ship[] = [
      {
        type: "default",
        count: 5,
        orientation: "horizontal",
        startingPosition: { x: 0, y: 4 },
      },
      {
        type: "scarf",
        count: 4,
        orientation: "vertical",
        startingPosition: { x: 5, y: 3 },
      },
      {
        type: "hat",
        count: 3,
        orientation: "horizontal",
        startingPosition: { x: 5, y: 7 },
      },
      {
        type: "pirate",
        count: 2,
        orientation: "vertical",
        startingPosition: { x: 6, y: 1 },
      },
    ];

    const defaultBoard: Board = Array.from({ length: 10 }, (_, x) =>
      Array.from({ length: 10 }, (_, y) => ({ x, y, ship: undefined })),
    );

    const board = placeShipsOnBoard(defaultBoard, defaultShipPositions);
    console.log("Board", board);
    return {
      state: "placement",
      boards: {
        [allPlayerIds[0]]: board,
        [allPlayerIds[1]]: board,
      },
      ships: {
        [allPlayerIds[0]]: defaultShipPositions,
        [allPlayerIds[1]]: defaultShipPositions,
      },
      playerIds: allPlayerIds,
      turn: allPlayerIds[0],
    };
  },
  actions: {
    completePlacement: (_, { game, playerId }) => {
      if (game.state !== "placement") {
        throw Rune.invalidAction();
      }

      game.state = "game";
    },

    bombCell: (cell, { game, playerId }) => {
      if (game.state !== "game") {
        throw Rune.invalidAction();
      }

      const targetPlayerId = game.playerIds.find((id) => id !== playerId);
      const targetBoard = game.boards[targetPlayerId as PlayerId];

      const targetCell = targetBoard[cell.x][cell.y];

      if (targetCell.ship) {
        game.boards[playerId][cell.x][cell.y].state = "hit";
        // targetCell.state = "hit";
      } else {
        game.boards[playerId][cell.x][cell.y].state = "miss";
        // targetCell.state = "miss";
      }
    },

    updateBoard: (board, { game, playerId }) => {
      // if (game.state !== "game") {
      //   throw Rune.invalidAction();
      // }

      game.boards[playerId] = board;

      console.log("Player", playerId, "updated board", board);
    },

    nextTurn: (_, { game }) => {
      const currentPlayerIndex = game.playerIds.indexOf(game.turn);
      const nextPlayerIndex = (currentPlayerIndex + 1) % game.playerIds.length;
      game.turn = game.playerIds[nextPlayerIndex];
    },
  },
});
