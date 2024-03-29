import React from "react";
import Button from "../components/buttons/button";
import GameBoard from "../components/board/game-board";
import { useNavigate } from "react-router-dom";

type Props = {};

const Placement = (props: Props) => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col justify-around gap-y-5 px-4 xxs:px-4 ">
      <div>
        <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          Place Your Ducks
        </h1>
        <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
          Double tap selected duck to rotate vertically or horizontally
        </p>
        <GameBoard className="mt-5" />
      </div>

      <div className="mx-auto w-full max-w-[400px]">
        <Button
          variant="ready"
          // variant={show ? "fire" : "ready"}
          onClick={() => {
            Rune.actions.completePlacement();
            navigate("/game");
          }}
        />
      </div>
    </div>
  );
};

export default Placement;
