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
    phase: "placement",
    boards: {},
    ships: {},
    playerIds: [],
    ready: {},
    turn: "",
    lastEvent: null,
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
    phase: "placement",
    boards: {},
    ships: {},
    playerIds: [],
    ready: {},
    turn: "",
    lastEvent: null,
    winner: "",
  });
  const [playerID, setPlayerID] = useState<PlayerId>("");
  const [board, setBoard] = useState<Board>([]);
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [gamePhase, setGamePhase] = useState<string>("placement");

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        console.log("Game updated: ", game);

        setPlayerID(yourPlayerId as PlayerId);
        setGame(game);
        setBoard(game.boards[yourPlayerId as PlayerId]);

        if (game.phase !== gamePhase) {
          setGamePhase(game.phase);
        }

        if (game.lastEvent != null) {
          if (game.winner && game.phase === "game") {
            Rune.showGameOverPopUp();
            return;
          }

          setTimeout(() => {
            Rune.actions.clearLastEvent();
          }, 5000);
        }
      },
    });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state: game,
        playerID,
        board,
        selectedCell,
        setSelectedCell,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
