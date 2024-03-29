import PlacementCell from "./cells/placement-cell";
import { cn } from "../../lib/utils";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";
import { Cell } from "../../logic";

type GameBoardProps = {
  className?: string;
};

const GameBoard = ({ className }: GameBoardProps) => {
  const { board, state } = useContext(GameContext);
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMoving, setIsMoving] = useState(false);

  const renderCell = (x: number, y: number) => {
    switch (state.state) {
      case "placement":
        return (
          <PlacementCell
            x={x}
            y={y}
            isSelected={selectedCells.some(
              (cell) => cell.x === x && cell.y === y,
            )}
            setSelectedCells={setSelectedCells}
            selectedShip={selectedCells[0]?.ship || null}
            setIsMoving={setIsMoving}
            isMoving={isMoving}
            setClickedCell={setClickedCell}
            clickedCell={clickedCell}
          />
        );
      case "game":
        return <GameCell x={x} y={y} />;
    }
  };

  if (board === undefined) {
    return null;
  }

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-[1px] min-[200px]:space-y-0.5 min-[250px]:space-y-1",
        className,
      )}
    >
      {board.map((row, i) => (
        <div
          key={i}
          className="flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1 "
        >
          {row.map((cell, j) => (
            <React.Fragment key={`${i}-${j}`}>
              {renderCell(i, j)}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
