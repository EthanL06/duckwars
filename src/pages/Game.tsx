import GameBoard from "../components/board/game-board";
import TubParts from "../assets/misc/tub-parts.svg";
import { motion } from "framer-motion";
import backgroundSound from "../assets/sfx/background.mp3";
import useSound from "use-sound";
import { useContext, useEffect } from "react";
import { GameContext } from "../context/GameContext";

const Game = () => {
  const { state } = useContext(GameContext);

  const [play, { stop }] = useSound(backgroundSound, {
    loop: true,
    volume: 0.1,
  });

  useEffect(() => {
    if (state.winner) {
      stop();
    } else {
      play();
    }
  }, [play, stop, state.winner]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex max-h-screen min-h-screen flex-col justify-between gap-y-5  overflow-y-hidden  bg-white"
    >
      <div className="">
        <GameBoard className="px-4 pt-4 xxs:px-4" />
      </div>

      <div className="mx-auto w-full ">
        <img src={TubParts} alt="Tub Parts" className="mx-auto mt-5 w-full" />
      </div>
    </motion.div>
  );
};

export default Game;
