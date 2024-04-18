import React, { useContext } from "react";
import { createPortal } from "react-dom";
import hitImage from "../../assets/cell/hit.svg";
import missImage from "../../assets/cell/miss-splash.svg";
import inactiveImage from "../../assets/misc/inactive.svg";
import { GameContext } from "../../context/GameContext";
import { AnimatePresence, motion } from "framer-motion";

const Event = () => {
  const { state } = useContext(GameContext);

  return (
    <>{createPortal(<EventContent type={state.lastEvent} />, document.body)}</>
  );
};

const EventContent = ({
  type,
}: {
  type: "hit" | "miss" | "sunk" | "inactive" | "game over" | null;
}) => {
  const { playerID, state } = useContext(GameContext);

  const images = {
    hit: hitImage,
    miss: missImage,
    inactive: inactiveImage,
    sunk: hitImage,
    "game over": hitImage,
  };

  const message = {
    hit: "HIT!",
    miss: "MISS!",
    inactive: "SKIP!",
    sunk: "SUNK!",
    "game over": "OVER!",
  };

  const subtitle = {
    default:
      state.turn === playerID ? "Your turn is over..." : "Your turn is next...",
    "game over": state.winner === playerID ? "You win!" : "You lose!",
  };

  return (
    <AnimatePresence>
      {type != null && (
        <motion.div
          key={"event"}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.5,
            },
          }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          className="absolute left-0 top-0 z-10 flex h-full w-full  flex-col items-center justify-center rounded border-2 border-gray-300 bg-slate-950/90 px-6  py-5 text-center text-6xl font-bold text-white"
        >
          <motion.img
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: {
                scale: {
                  delay: 0.7,
                  type: "spring",
                  bounce: 0.75,
                },
                opacity: {
                  delay: 0.7,
                },
              },
            }}
            src={images[type]}
            alt={type}
            className="h-20 w-20"
          />

          <div>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,

                transition: {
                  scale: {
                    delay: 1,
                    type: "spring",
                    bounce: 0.75,
                  },
                  opacity: {
                    delay: 1,
                  },
                },
              }}
              className="relative"
            >
              {message[type]}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, left: 50 }}
              animate={{
                opacity: 1,
                left: 0,
                transition: {
                  delay: 1.75,
                },
              }}
              exit={{ opacity: 0, left: -50 }}
              className="relative mt-1 text-2xl font-medium text-slate-400"
            >
              {type === "game over"
                ? subtitle["game over"]
                : subtitle["default"]}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Event;
