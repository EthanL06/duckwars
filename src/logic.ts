import type { RuneClient } from "rune-games-sdk/multiplayer";
import { Board, Position } from "./lib/types";

export interface GameState {
  boards: Record<string, Board>;
  allPlayersId: string[];
  turn: string;
  state: "placement" | "player" | "opponent" | "end";
}

type GameActions = {
  // increment: (params: { amount: number }) => void;
  // moveDuck: (params: { positi: Position }) => void;
  finishPlacement: (params: { board: Board; id: string }) => void;
};

declare global {
  const Rune: RuneClient<GameState, GameActions>;
}

// export function getCount(game: GameState) {
//   return game.count;
// }

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayersId): GameState => {
    const board: Board = {
      cells: [],
      ships: [],
    };

    return {
      boards: {
        [allPlayersId[0]]: board,
        [allPlayersId[1]]: board,
      },
      allPlayersId,
      turn: allPlayersId[0],
      state: "placement",
    };
  },
  actions: {
    // increment: ({ amount }, { game }) => {
    //   game.count += amount;
    // },
    // moveDuck: ({ position }, { game }) => {
    //   game.duckPosition = position;
    // },

    finishPlacement: ({ board, id }, { game }) => {
      game.boards[id] = board;
    },
  },
});
