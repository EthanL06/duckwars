import { useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import hitImage from "../../assets/cell/hit.svg";
import missImage from "../../assets/cell/miss-splash.svg";
import inactiveImage from "../../assets/misc/inactive.svg";
import sunkImage from "../../assets/misc/duck_sunk.png";
import winImage from "../../assets/misc/win.svg";
import loseImage from "../../assets/misc/lose.svg";
import { GameContext } from "../../context/GameContext";
import { AnimatePresence, motion } from "framer-motion";
import hitSound from "../../assets/sfx/hit.wav";
import missSound from "../../assets/sfx/miss.wav";
import skipSound from "../../assets/sfx/skip.flac";
import winSound from "../../assets/sfx/win.wav";
import loseSound from "../../assets/sfx/lose.wav";
import useSound from "use-sound";

const Event = ({
  shown,
  setShown,
}: {
  shown: boolean;
  setShown: (shown: boolean) => void;
}) => {
  const { state, playerID } = useContext(GameContext);

  const [playHit] = useSound(hitSound);
  const [playMiss] = useSound(missSound);
  const [playSkip] = useSound(skipSound);
  const [playWin] = useSound(winSound);
  const [playLose] = useSound(loseSound);

  useEffect(() => {
    switch (state.lastEvent) {
      case "hit":
      case "sunk":
        // Wait 0.7 seconds before playing the sound
        setTimeout(() => {
          playHit();
        }, 700);
        break;
      case "miss":
        setTimeout(() => {
          playMiss();
        }, 700);
        break;
      case "inactive":
        setTimeout(() => {
          playSkip();
        }, 700);
        break;
      case "game over":
        if (state.winner === playerID) {
          setTimeout(() => {
            playWin();
          }, 700);
        } else {
          setTimeout(() => {
            playLose();
          }, 700);
        }
        break;
    }
  }, [
    playHit,
    playLose,
    playMiss,
    playSkip,
    playWin,
    playerID,
    state.lastEvent,
    state.winner,
  ]);

  return (
    <>
      {createPortal(
        <EventContent
          type={state.lastEvent}
          shown={shown}
          setShown={setShown}
        />,
        document.body,
      )}
    </>
  );
};

const EventContent = ({
  type,
  shown,
  setShown,
}: {
  type: "hit" | "miss" | "sunk" | "inactive" | "game over" | null;
  shown: boolean;
  setShown: (shown: boolean) => void;
}) => {
  const { playerID, state } = useContext(GameContext);

  const images = {
    hit: hitImage,
    miss: missImage,
    inactive: inactiveImage,
    sunk: sunkImage,
    "game over": state.winner === playerID ? winImage : loseImage,
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
      {type != null && shown && (
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
          className="absolute left-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden  bg-slate-950/90 px-6  py-5 text-center text-6xl font-bold text-white"
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

              {type == "game over" && (
                <div>
                  <motion.button
                    onClick={() => {
                      setShown(false);
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        delay: 2,
                      },
                    }}
                    className="relative mt-4 w-full text-pretty rounded bg-black p-2 text-white transition-transform active:scale-90"
                  >
                    View Board
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Event;
