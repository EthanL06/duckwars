import PlacementCell from "./cells/placement-cell";
import { cn, duckSoundSpriteMap } from "../../lib/utils";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";
import { Cell } from "../../logic";
import useSound from "use-sound";
import rubberDuckSound from "../../assets/sfx/rubber_duck.wav";
import selectSound from "../../assets/sfx/click.ogg";
import Event from "../events/event";
import Timer from "./timer";
import { useCountdown, useClickAnyWhere } from "usehooks-ts";
import PlayerProfiles from "./player-profiles";
import SpectatorCell from "./cells/spectator-cell";
import { PlayerId } from "rune-games-sdk";

type GameBoardProps = {
  className?: string;
};

const GameBoard = ({ className }: GameBoardProps) => {
  const { board, state, playerID, setSelectedCell } = useContext(GameContext);
  const [clickedCell, setClickedCell] = useState<Cell | null>(null);
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [playDuckSound] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });
  const [playSelectSound] = useSound(selectSound);
  const [isTimerShown, setIsTimerShown] = useState(false);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 25,
      intervalMs: 1000,
    });
  const [showingEvent, setShowingEvent] = useState(true);

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
            playSound={playDuckSound}
          />
        );
      case "game":
        return (
          <GameCell
            x={x}
            y={y}
            playTargetSound={playSelectSound}
            onBombCell={() => {
              stopCountdown();
              resetCountdown();
              console.log("bomb cell");
            }}
          />
        );
    }
  };

  if (board === undefined || !showingEvent) {
    return (
      <div className={className}>
        <SpectatorView />
      </div>
    );
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

        <Event shown={showingEvent} setShown={setShowingEvent} />
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
          ? "Double tap a square to fire on it"
          : "Wait until your opponent fires"}
      </p>
    </>
  );
};

const SpectatorView = () => {
  const [playerViewId, setPlayerViewId] = useState<PlayerId | null>(null);

  const { state } = useContext(GameContext);

  const onSpectatorClick = (playerId: PlayerId) => {
    setPlayerViewId(playerId);
  };

  useEffect(() => {
    setPlayerViewId(state.playerIds[0]);
  }, [state.playerIds]);

  return (
    <div>
      <PlayerProfiles onSpectatorClick={onSpectatorClick} className="mt-6" />
      <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
        {playerViewId != null && Rune.getPlayerInfo(playerViewId)?.displayName}
        's Board
      </h1>
      <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
        Click on user's image above to switch between board view
      </p>

      <div
        className={cn(
          "relative mx-auto mt-5 flex w-full max-w-[400px] flex-col items-center justify-center space-y-[1px] min-[200px]:space-y-0.5 min-[250px]:space-y-1",
        )}
      >
        {playerViewId != null &&
          state.boards[playerViewId]?.map((row, i) => (
            <div
              key={i}
              className=" flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1"
            >
              {row.map((cell, j) => (
                <React.Fragment key={`${i}-${j}`}>
                  <SpectatorCell
                    x={i}
                    y={j}
                    board={state.boards[playerViewId]}
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
};
export default GameBoard;
