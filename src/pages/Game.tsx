import GameBoard from "../components/board/game-board";
import TubParts from "../assets/misc/tub-parts.svg";
import { motion } from "framer-motion";

const Game = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex max-h-screen min-h-screen flex-col justify-between  gap-y-5  bg-white"
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
