import { PlayerId, RuneClient } from "rune-games-sdk";

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
  phase: "placement" | "game";
  boards: Record<PlayerId, Board>;
  ships: Record<PlayerId, Ship[]>;
  playerIds: PlayerId[];
  turn: PlayerId;
  lastEvent: "hit" | "miss" | "sunk" | "inactive" | "game over" | null;
  ready: Record<PlayerId, boolean>;
  winner?: PlayerId;
}

type GameActions = {
  bombCell: (cell: Cell) => void;
  updateBoard: (board: Board) => void;
  nextTurn: () => void;
  setReady: (ready: boolean) => void;
  startGame: () => void;
  gameEnd: () => void;
  setLastEvent: (event: "hit" | "miss" | "sunk" | "inactive") => void;
  clearLastEvent: () => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

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

const isShipSunk = (board: Board, ship: Ship) => {
  const allCells = [] as Cell[];

  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.ship?.type === ship.type) {
        allCells.push(cell);
      }
    });
  });

  return allCells.every((cell) => cell.state == "hit");
};

const haveAllShipsSunk = (board: Board) => {
  const allShips = [] as Ship[];

  board.forEach((row) => {
    row.forEach((cell) => {
      if (cell.ship && !allShips.includes(cell.ship)) {
        allShips.push(cell.ship);
      }
    });
  });

  return allShips.every((ship) => isShipSunk(board, ship));
};

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds: PlayerId[]) => {
    const defaultShipPositions: Ship[] = [
      // {
      //   type: "default",
      //   count: 5,
      //   orientation: "horizontal",
      //   startingPosition: { x: 4, y: 5 },
      // },
      // {
      //   type: "scarf",
      //   count: 4,
      //   orientation: "vertical",
      //   startingPosition: { x: 3, y: 8 },
      // },
      // {
      //   type: "hat",
      //   count: 3,
      //   orientation: "horizontal",
      //   startingPosition: { x: 8, y: 7 },
      // },
      {
        type: "pirate",
        count: 2,
        orientation: "vertical",
        startingPosition: { x: 8, y: 2 },
      },
    ];

    const defaultBoard: Board = Array.from({ length: 10 }, (_, x) =>
      Array.from({ length: 10 }, (_, y) => ({ x, y, ship: undefined })),
    );

    const board = placeShipsOnBoard(defaultBoard, defaultShipPositions);

    return {
      phase: "placement",
      boards: {
        [allPlayerIds[0]]: board,
        [allPlayerIds[1]]: board,
      },
      ships: {
        [allPlayerIds[0]]: defaultShipPositions,
        [allPlayerIds[1]]: defaultShipPositions,
      },
      playerIds: allPlayerIds,
      turn: allPlayerIds[Math.floor(Math.random() * allPlayerIds.length)],
      ready: {
        [allPlayerIds[0]]: false,
        [allPlayerIds[1]]: false,
      },
      lastEvent: null,
    };
  },
  actions: {
    setReady: (ready, { game, playerId }) => {
      if (game.phase !== "placement") {
        throw Rune.invalidAction();
      }

      game.ready[playerId] = ready;

      if (game.ready[game.playerIds[0]] && game.ready[game.playerIds[1]]) {
        game.phase = "game";
      }
    },

    startGame: (_, { game }) => {
      if (game.phase !== "placement") {
        throw Rune.invalidAction();
      }

      game.phase = "game";
    },

    bombCell: (cell, { game, playerId }) => {
      if (game.phase !== "game") {
        throw Rune.invalidAction();
      }

      const targetPlayerId = game.playerIds.find((id) => id !== playerId);
      const targetBoard = game.boards[targetPlayerId as PlayerId];

      const targetCell = targetBoard[cell.x][cell.y];

      if (targetCell.state != undefined) {
        throw Rune.invalidAction();
      }

      if (targetCell.ship) {
        targetCell.state = "hit";

        if (haveAllShipsSunk(targetBoard)) {
          game.lastEvent = "game over";
          game.winner = playerId;
          Rune.gameOver({
            players: {
              [game.playerIds[0]]:
                game.playerIds[0] === playerId ? "WON" : "LOST",
              [game.playerIds[1]]:
                game.playerIds[1] === playerId ? "WON" : "LOST",
            },
            delayPopUp: true,
          });

          return;
        }

        if (isShipSunk(targetBoard, targetCell.ship)) {
          game.lastEvent = "sunk";
        } else {
          game.lastEvent = "hit";
        }
      } else {
        targetCell.state = "miss";
        game.lastEvent = "miss";
      }
    },

    updateBoard: (board, { game, playerId }) => {
      game.boards[playerId] = board;

      console.log("Player", playerId, "updated board", board);
    },

    nextTurn: (_, { game }) => {
      if (game.phase !== "game") {
        throw Rune.invalidAction();
      }

      const currentPlayerIndex = game.playerIds.indexOf(game.turn);
      const nextPlayerIndex = (currentPlayerIndex + 1) % game.playerIds.length;
      game.turn = game.playerIds[nextPlayerIndex];
    },

    gameEnd: (_, { game }) => {
      if (!game.winner) {
        throw Rune.invalidAction();
      }

      Rune.gameOver({
        players: {
          [game.playerIds[0]]:
            game.playerIds[0] === game.winner ? "WON" : "LOST",
          [game.playerIds[1]]:
            game.playerIds[1] === game.winner ? "WON" : "LOST",
        },
      });
    },

    setLastEvent: (event, { game }) => {
      game.lastEvent = event;
    },

    clearLastEvent: (_, { game }) => {
      game.lastEvent = null;
    },
  },
  events: {
    playerJoined(playerId, { game }) {
      return;
    },
  },
});
