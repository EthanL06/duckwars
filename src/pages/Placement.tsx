import { useContext, useEffect, useState } from "react";
import { GameContext } from "../context/GameContext.tsx";
import { MoveShipProvider } from "../context/MoveShipContext.tsx";
import GameBoard from "../components/board/game-board.tsx";
import Button from "../components/buttons/button.tsx";
import { Link } from "react-router-dom";

function Placement() {
  const [show, setShow] = useState(false);
  const { game } = useContext(GameContext);

  useEffect(() => {
    // If the user presses Ctrl + Alt + D, add the .debug class to all elements.
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.code === "KeyD") {
        // Toggle the .debug class on all elements.
        const elements = document.querySelectorAll("*");
        elements.forEach((el) => el.classList.toggle("debug"));
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col justify-around gap-y-5 px-4 xxs:px-4 ">
      <div>
        <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          Place Your Ducks
        </h1>
        <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
          Double tap selected duck to rotate vertically or horizontally
        </p>

        <MoveShipProvider>
          <GameBoard className="mt-5" />
        </MoveShipProvider>
      </div>

      <Link className="mx-auto w-full max-w-[400px]" to={"/game"}>
        <Button
          variant={show ? "fire" : "ready"}
          onClick={() => setShow(!show)}
        />
      </Link>
    </div>
  );
}

export default Placement;
