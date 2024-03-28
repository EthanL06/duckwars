import PlacementCell from "./cells/placement-cell";
import { cn } from "../../lib/utils";
import { MoveShipContext } from "../../context/MoveShipContext";
import { useContext, useEffect } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";

type GameBoardProps = {
  /**
   * If true, the board will be rendered as a game board instead of a placement board
   */
  isGame?: boolean;
  className?: string;
};

const GameBoard = ({ isGame = false, className }: GameBoardProps) => {
  const { selectedCell, board } = useContext(GameContext);
  const { selectedCells } = useContext(MoveShipContext);

  const isSelected = (x: number, y: number) => {
    if (isGame) {
      return selectedCell?.x === x && selectedCell?.y === y;
    }

    return selectedCells?.some((cell) => cell.x === x && cell.y === y) || false;
  };

  const renderCell = (x: number, y: number, key: number | string) => {
    if (isGame) {
      return <GameCell key={key} x={x} y={y} />;
    }

    return (
      <PlacementCell key={key} x={x} y={y} isSelected={isSelected(x, y)} />
    );
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-[1px] min-[200px]:space-y-0.5 min-[250px]:space-y-1",
        className,
      )}
    >
      {board.cells.map((row, i) => (
        <div
          key={i}
          className="flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1 "
        >
          {row.map((cell, j) => (
            <>{renderCell(i, j, cell.id)}</>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
