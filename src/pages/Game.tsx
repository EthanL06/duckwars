import React, { useContext } from "react";
import Button from "../components/buttons/button";
import GameBoard from "../components/board/game-board";
import TubParts from "../assets/misc/tub-parts.svg";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

type Props = {};

const Game = (props: Props) => {
  const { state, playerID } = useContext(GameContext);

  const isTurn = state.turn === playerID;

  return (
    <div className="flex h-full min-h-screen flex-col justify-between gap-y-5 ">
      <div className="mt-8 px-4 xxs:px-4">
        <div className="flex items-center justify-center">
          {state.playerIds.map((playerId, index) => {
            const playerInfo = Rune.getPlayerInfo(playerId);
            return (
              <React.Fragment key={index}>
                {playerInfo && (
                  <img
                    style={{ zIndex: state.playerIds.length - index }}
                    src={playerInfo.avatarUrl}
                    alt="avatar"
                    className="relative right-1 h-6 w-6 rounded-full first:right-0"
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          {isTurn ? "Your Turn" : "Opponent's Turn"}
        </h1>
        <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
          {isTurn
            ? "Tap a square to fire on it"
            : "Wait until your opponent fires"}
        </p>
        <GameBoard className="mt-5" />
      </div>

      <div className="mx-auto w-full">
        <img
          src={TubParts}
          alt="Tub Parts"
          className="relative mx-auto w-full"
        />
      </div>
    </div>
  );
};

export default Game;
