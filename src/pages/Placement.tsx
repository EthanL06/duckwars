import { useContext } from "react";
import Button from "../components/buttons/button";
import GameBoard from "../components/board/game-board";
import { motion } from "framer-motion";
import PlayerProfiles from "../components/board/player-profiles";
import { GameContext } from "../context/GameContext";
import Default from "../assets/ducks/duck.svg";
import useSound from "use-sound";
import rubberDuckSound from "../assets/sfx/rubber_duck.wav";
import { cn, duckSoundSpriteMap } from "../lib/utils";

const Placement = () => {
  const { state, playerID, setIsRotating, isRotating } =
    useContext(GameContext);

  if (playerID == undefined) {
    return <SpectatorPlacementView />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex h-full max-h-screen min-h-screen touch-none flex-col justify-around gap-y-5 bg-white px-4 xxs:px-4"
    >
      <div>
        <PlayerProfiles />
        <h1 className="text-balance text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          Place Your Ducks
        </h1>
        <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
          Drag the ducks to move on the board
        </p>
        <div className="flex items-center justify-center ">
          <button
            onClick={() => {
              setIsRotating(!isRotating);
            }}
            className={cn(
              "scale-75 rounded-full border-2  p-2 transition-all active:scale-[0.6]",
              isRotating
                ? "border-green-300 bg-green-300"
                : "border-gray-300 bg-white",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className={cn(
                "transition-all",
                isRotating ? "stroke-white" : "stroke-gray-400",
              )}
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>

          <span className="text-sm font-medium text-gray-500">
            {isRotating ? "Disable" : "Enable"} rotation
          </span>
        </div>
        <GameBoard />
      </div>

      <div className="mx-auto w-full max-w-[400px]">
        <Button
          variant={state.ready[playerID] ? "unready" : "ready"}
          onClick={() => {
            Rune.actions.setReady(!state.ready[playerID]);
          }}
        />
      </div>
    </motion.div>
  );
};

const SpectatorPlacementView = () => {
  const [play] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex h-full max-h-screen min-h-screen flex-col justify-around gap-y-5 bg-white px-4 xxs:px-4"
    >
      <div className="mt-8 grow basis-0">
        <PlayerProfiles />
        <h1 className="text-pretty text-center font-bold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          Wait for game to start...
        </h1>
        <p className=" mx-auto max-w-[280px] text-balance text-center font-medium [font-size:_clamp(0.4rem,4vw,1rem)]">
          The players are placing their ducks
        </p>
      </div>

      <div className="mx-auto flex flex-col items-center justify-center">
        <button
          onClick={() => {
            play({
              id: "duck-1",
            });
          }}
          className="size-20 transition-all hover:scale-110 active:scale-90"
        >
          <img className="size-full" src={Default} />
        </button>

        <div className="mt-1 text-center font-semibold leading-none [font-size:_clamp(0.8rem,8vw,2rem)]">
          Click me!
        </div>
      </div>

      <div className="grow basis-0" />
    </motion.div>
  );
};

export default Placement;
