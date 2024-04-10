import React, { useContext } from "react";
import { createPortal } from "react-dom";
import hitImage from "../../assets/cell/hit.svg";
import missImage from "../../assets/cell/miss-splash.svg";
import { GameContext } from "../../context/GameContext";
import { AnimatePresence, motion } from "framer-motion";
type Props = {
  // type: "hit" | "miss" | "sunk";
};

const Event = ({}: Props) => {
  const { state } = useContext(GameContext);

  return (
    <>{createPortal(<EventContent type={state.lastAction} />, document.body)}</>
  );
};

const EventContent = ({ type }: { type: "hit" | "miss" | "sunk" | null }) => {
  const { playerID, state } = useContext(GameContext);

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
            src={type === "hit" ? hitImage : missImage}
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
              {type === "hit" ? "HIT!" : "MISS!"}
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
              {state.turn === playerID
                ? "Your turn is over"
                : "Your turn is next"}
              ...
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Event;
