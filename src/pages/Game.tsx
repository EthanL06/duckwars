import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GameBoard from "../components/board/game-board";
import Button from "../components/buttons/button";
import { MoveShipProvider } from "../context/MoveShipContext";
import { GameContext } from "../context/GameContext";
import Timer from "../components/board/timer";
import TubParts from "../assets/misc/tub-parts.svg";

const Game = () => {
  const { game, setGamePhase } = useContext(GameContext);

  useEffect(() => {
    // If the user presses Ctrl + Alt + D, add the .debug class to all elements.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === "KeyD") {
        // Toggle the .debug class on all elements.
        const elements = document.querySelectorAll("*");
        elements.forEach((el) => el.classList.toggle("debug"));
      }
    };

    setGamePhase("player");

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col justify-around gap-y-5 overflow-x-hidden ">
      <div className="flex flex-col justify-between px-4 xxs:px-4 ">
        <div className="grow basis-0">
          {/* <Timer /> */}
          <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
            Your Turn
          </h1>
          <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
            Tap a square to fire on it
          </p>
        </div>

        <MoveShipProvider>
          <div>
            <GameBoard isGame={true} className="mt-9" />
          </div>
        </MoveShipProvider>

        <div className="grow basis-0"></div>
      </div>

      {/* <Link className="mx-auto w-full max-w-[400px]" to={"/"}>
        <Button
          variant={show ? "fire" : "ready"}
          onClick={() => setShow(!show)}
        />
      </Link> */}

      <img className="relative" src={TubParts} />
    </div>
  );
};

export default Game;
