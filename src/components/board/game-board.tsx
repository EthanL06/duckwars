import PlacementCell from "./cells/placement-cell";
import { cn, duckSoundSpriteMap } from "../../lib/utils";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";
import { Cell } from "../../logic";
import useSound from "use-sound";
import rubberDuckSound from "../../assets/sfx/rubber_duck.wav";
import Event from "../events/event";
import Timer from "./timer";
import { useCountdown, useClickAnyWhere } from "usehooks-ts";
import PlayerProfiles from "./player-profiles";

type GameBoardProps = {
  className?: string;
};

const GameBoard = ({ className }: GameBoardProps) => {
  const { board, state, playerID, setSelectedCell } = useContext(GameContext);
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [play] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });
  const [isTimerShown, setIsTimerShown] = useState(false);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 25,
      intervalMs: 1000,
    });

  useClickAnyWhere(() => {
    if (state.phase === "game" && state.turn === playerID) {
      setIsTimerShown(false);
      resetCountdown();
      startCountdown();

      // wait 2 seconds and then set the timer to be shown
      setTimeout(() => {
        setIsTimerShown(true);
      }, 2000);
    }
  });

  useEffect(() => {
    if (state.phase === "game" && state.turn === playerID) {
      setIsTimerShown(true);
      startCountdown();
    } else {
      stopCountdown();
    }
  }, [playerID, startCountdown, state.phase, state.turn, stopCountdown]);

  useEffect(() => {
    if (count === 0) {
      stopCountdown();
      resetCountdown();
      Rune.actions.setLastEvent("inactive");

      setSelectedCell(null);
      setTimeout(() => {
        Rune.actions.nextTurn();
      }, 5150);
    }
  }, [count, resetCountdown, setSelectedCell, stopCountdown]);

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
        return (
          <GameCell
            x={x}
            y={y}
            playSound={play}
            onBombCell={() => {
              stopCountdown();
              resetCountdown();
              console.log("bomb cell");
            }}
          />
        );
    }
  };

  if (board === undefined) {
    return null;
  }

  return (
    <div className={className}>
      {state.phase === "game" && (
        <>
          <Timer
            className={count <= 5 ? "visible" : "invisible"}
            enabled={isTimerShown}
            count={count}
          />
          <PlayerProfiles className="mt-3" />
          <GameHeader />
        </>
      )}

      <div
        className={cn(
          "relative mx-auto mt-5 flex w-full max-w-[400px] flex-col items-center justify-center space-y-[1px] min-[200px]:space-y-0.5 min-[250px]:space-y-1",
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

        <Event />
      </div>
    </div>
  );
};

const GameHeader = () => {
  const { state, playerID } = useContext(GameContext);
  const isTurn = state.turn === playerID;

  return (
    <>
      <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
        {isTurn ? "Your Turn" : "Opponent's Turn"}
      </h1>
      <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
        {isTurn
          ? "Tap a square to fire on it"
          : "Wait until your opponent fires"}
      </p>
    </>
  );
};

export default GameBoard;
