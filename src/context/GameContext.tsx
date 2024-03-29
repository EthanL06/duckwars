import { createContext, useEffect, useState } from "react";
import { Board, Cell, GameState } from "../logic";
import { PlayerId } from "rune-games-sdk";

interface GameContextType {
  state: GameState;
  playerID: PlayerId;
  board: Board;
  selectedCell: Cell | null;
  setSelectedCell: (cell: Cell | null) => void;
}

export const GameContext = createContext<GameContextType>({
  state: {
    state: "placement",
    boards: {},
    ships: {},
    playerIds: [],
  },
  playerID: "",
  board: [],
  selectedCell: null,
  setSelectedCell: () => {
    return null;
  },
});

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<GameState>({
    state: "placement",
    boards: {},
    ships: {},
    playerIds: [],
  });
  const [playerID, setPlayerID] = useState<PlayerId>("");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        console.log("Game updated", game);
        setPlayerID(yourPlayerId as PlayerId);
        setGame(game);
        setBoard(game.boards[yourPlayerId as PlayerId]);
      },
    });
  }, [playerID]);

  return (
    <GameContext.Provider
      value={{ state: game, playerID, board, selectedCell, setSelectedCell }}
    >
      {children}
    </GameContext.Provider>
  );
};
