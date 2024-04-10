import PlacementCell from "./cells/placement-cell";
import { cn, duckSoundSpriteMap } from "../../lib/utils";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";
import { Cell } from "../../logic";
import useSound from "use-sound";
import rubberDuckSound from "../../assets/sfx/rubber_duck.wav";
import Event from "../events/event";
import { AnimatePresence, motion } from "framer-motion";
import Timer from "./timer";
import { useCountdown, useClickAnyWhere } from "usehooks-ts";

type GameBoardProps = {
  className?: string;
};

const GameBoard = ({ className }: GameBoardProps) => {
  const { board, state, playerID } = useContext(GameContext);
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [play] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 10,
      intervalMs: 1000,
    });

  useClickAnyWhere(() => {
    resetCountdown();
    startCountdown();
  });

  useEffect(() => {
    if (state.phase === "game" && state.turn === playerID) {
      startCountdown();
    } else {
      stopCountdown();
    }
  }, [playerID, startCountdown, state.phase, state.turn, stopCountdown]);

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
      {count <= 5 && <Timer count={count} />}

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

      <Event />
    </div>
  );
};

export default GameBoard;
