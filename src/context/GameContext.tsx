import { createContext, useEffect, useState } from "react";
import { GameState } from "../logic";
import { Board, Cell, Ship } from "../lib/types";

interface GameContextValue {
  /**
   * The current game state. Connected to the Rune client and updated when the game state changes.
   */
  game: GameState;
  /**
   * The game board with cells and ships.
   */
  board: Board;
  setBoard: (board: Board) => void;
  gamePhase: "placement" | "player" | "opponent" | "end";
  setGamePhase: (phase: "placement" | "player" | "opponent" | "end") => void;
  /**
   * The currently selected cell during the game phase
   */
  selectedCell: Cell | null;
  setSelectedCell: (cell: Cell | null) => void;
}

const GameContext = createContext<GameContextValue>({
  game: {
    boards: {},
    allPlayersId: [],
    turn: "",
    state: "placement",
  },
  board: {
    cells: [],
    ships: [],
  },
  setBoard: () => {
    return;
  },
  gamePhase: "placement",
  setGamePhase: () => {
    return;
  },
  setSelectedCell: () => {
    return;
  },
  selectedCell: null,
});

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [game, setGame] = useState<GameState>({
    boards: {},
    allPlayersId: [],
    turn: "",
    state: "placement",
  });

  const [board, setBoard] = useState<Board>({
    cells: [],
    ships: [],
  });

  const [gamePhase, setGamePhase] = useState<
    "placement" | "player" | "opponent" | "end"
  >("placement");

  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    const createShips = (): Ship[] => [
      {
        type: "default",
        count: 5,
        orientation: "horizontal",
        position: { x: 0, y: 4 },
      },
      {
        type: "scarf",
        count: 4,
        orientation: "vertical",
        position: { x: 5, y: 3 },
      },
      {
        type: "hat",
        count: 3,
        orientation: "horizontal",
        position: { x: 5, y: 7 },
      },
      {
        type: "pirate",
        count: 2,
        orientation: "vertical",
        position: { x: 6, y: 1 },
      },
    ];

    const createCells = (): Board["cells"] =>
      Array.from({ length: 10 }, (_, rowIndex) =>
        Array.from({ length: 10 }, (_, colIndex) => ({
          x: rowIndex,
          y: colIndex,
          ship: null,
          state: "default",
          id: `${rowIndex}-${colIndex}`,
        })),
      );

    const placeShipsOnBoard = (ships: Ship[], cells: Board["cells"]) => {
      ships.forEach((ship) => {
        const { x, y } = ship.position;
        const isVertical = ship.orientation === "vertical";

        for (let i = 0; i < ship.count; i++) {
          const cell =
            cells[x - (isVertical ? i : 0)][y - (isVertical ? 0 : i)];
          cell.ship = ship;
        }
      });
    };

    const initBoard = () => {
      const ships = createShips();
      const cells = createCells();

      placeShipsOnBoard(ships, cells);

      setBoard({ cells, ships });
    };

    Rune.initClient({
      onChange: ({ game }) => {
        console.log("Game state changed", game);
        setGame(game);
      },
    });

    initBoard();
  }, []);

  return (
    <GameContext.Provider
      value={{
        game,
        board,
        setBoard,
        gamePhase,
        setGamePhase,
        selectedCell,
        setSelectedCell,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameContext, GameProvider };
