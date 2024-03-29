import React, { useContext } from "react";
import Button from "../components/buttons/button";
import GameBoard from "../components/board/game-board";
import TubParts from "../assets/misc/tub-parts.svg";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";

type Props = {};

const Game = (props: Props) => {
  const { state } = useContext(GameContext);

  return (
    <div className="flex min-h-screen flex-col justify-around gap-y-5 px-4 xxs:px-4 ">
      <div>
        <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          Your turn
        </h1>
        <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
          Tap a square to fire on it
        </p>
        <GameBoard className="mt-5" />
      </div>

      <div className="mx-auto w-full max-w-[400px]">
        <img src={TubParts} alt="Tub Parts" className="mx-auto mt-5" />
      </div>
    </div>
  );
};

export default Game;
