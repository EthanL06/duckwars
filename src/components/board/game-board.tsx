import PlacementCell from "./cells/placement-cell";
import { cn, duckSoundSpriteMap } from "../../lib/utils";
import React, { useContext, useState } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";
import { Cell } from "../../logic";
import useSound from "use-sound";
import rubberDuckSound from "../../assets/sfx/rubber_duck.wav";
import Event from "../events/hit";

type GameBoardProps = {
  className?: string;
};

const GameBoard = ({ className }: GameBoardProps) => {
  const { board, state } = useContext(GameContext);
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [play] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });

  const renderCell = (x: number, y: number) => {
    switch (state.phase) {
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
            playSound={play}
          />
        );
      case "game":
        return <GameCell x={x} y={y} playSound={play} />;
    }
  };

  if (board === undefined) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[400px] flex-col items-center justify-center space-y-[1px] min-[200px]:space-y-0.5 min-[250px]:space-y-1",
        className,
      )}
    >
      {board.map((row, i) => (
        <div
          key={i}
          className=" flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1"
        >
          {row.map((cell, j) => (
            <React.Fragment key={`${i}-${j}`}>
              {renderCell(i, j)}
            </React.Fragment>
          ))}
        </div>
      ))}

      <Event type="hit" />
    </div>
  );
};

export default GameBoard;
