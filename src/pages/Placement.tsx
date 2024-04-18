import React, { useContext } from "react";
import Button from "../components/buttons/button";
import GameBoard from "../components/board/game-board";
import { motion } from "framer-motion";
import PlayerProfiles from "../components/board/player-profiles";
import { GameContext } from "../context/GameContext";

const Placement = () => {
  const { state, playerID } = useContext(GameContext);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
      className="flex min-h-screen flex-col justify-around gap-y-5 bg-white px-4 xxs:px-4"
    >
      <div>
        <PlayerProfiles />
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
          variant={state.ready[playerID] ? "unready" : "ready"}
          onClick={() => {
            Rune.actions.setReady(!state.ready[playerID]);
          }}
        />
      </div>
    </motion.div>
  );
};

export default Placement;
