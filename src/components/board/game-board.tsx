import { cn } from "../../lib/utils";
import React, { useContext, useEffect, useRef, useState } from "react";
import { GameContext } from "../../context/GameContext";
import GameCell from "./cells/game-cell";
import useSound from "use-sound";
import selectSound from "../../assets/sfx/click.ogg";
import Event from "../events/event";
import Timer from "./timer";
import { useCountdown, useClickAnyWhere } from "usehooks-ts";
import PlayerProfiles from "./player-profiles";
import SpectatorCell from "./cells/spectator-cell";
import { PlayerId } from "rune-games-sdk";
import { EVENT_DURATION } from "../../lib/constants";

type GameBoardProps = {
  className?: string;
};

const GameBoard = ({ className }: GameBoardProps) => {
  const [showingEvent, setShowingEvent] = useState(true);
  const [isTimerShown, setIsTimerShown] = useState(false);
  const [isBombing, setIsBombing] = useState(false);

  const { board, state, playerID, setSelectedCell } = useContext(GameContext);
  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 25,
      intervalMs: 1000,
    });

  const [playSelectSound] = useSound(selectSound);

  const boardRef = useRef<HTMLDivElement>(null);

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
      }, EVENT_DURATION);
    }
  }, [count, resetCountdown, setSelectedCell, stopCountdown]);

  if (board === undefined || !showingEvent) {
    return (
      <div className={className}>
        <SpectatorView />
      </div>
    );
  }

  return (
    <div className={cn(className)}>
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
        ref={boardRef}
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
                <GameCell
                  x={i}
                  y={j}
                  playTargetSound={playSelectSound}
                  onBombCell={() => {
                    stopCountdown();
                    resetCountdown();
                  }}
                  isBombing={isBombing}
                  setIsBombing={setIsBombing}
                />
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

  if (playerViewId == null) return null;

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
        {state.boards[playerViewId]?.map((row, i) => (
          <div
            key={i}
            className=" flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1"
          >
            {row.map((cell, j) => (
              <React.Fragment key={`${i}-${j}`}>
                <SpectatorCell x={i} y={j} board={state.boards[playerViewId]} />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
export default GameBoard;
