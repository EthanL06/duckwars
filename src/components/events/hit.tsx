import React, { useContext } from "react";
import { createPortal } from "react-dom";
import hitImage from "../../assets/cell/hit.svg";
import missImage from "../../assets/cell/miss-splash.svg";
import { GameContext } from "../../context/GameContext";

type Props = {
  type: "hit" | "miss";
};

const Event = ({ type }: Props) => {
  return <>{createPortal(<EventContent type={type} />, document.body)}</>;
};

const EventContent = ({ type }: { type: "hit" | "miss" }) => {
  const { playerID, state } = useContext(GameContext);

  return (
    <div className="absolute left-1/2 top-1/2 z-10 flex h-full w-full -translate-x-1/2   -translate-y-1/2 flex-col items-center justify-center rounded border-2 border-gray-300 bg-slate-950/90 px-6  py-5 text-center text-6xl font-bold text-white">
      <img
        src={type === "hit" ? hitImage : missImage}
        alt={type}
        className="h-20 w-20"
      />

      <div>
        {type === "hit" ? "HIT!" : "MISS!"}
        <div className="mt-1 text-2xl font-medium text-gray-300">
          {state.turn === playerID ? "Your turn is over" : "Your turn is next"}
        </div>
      </div>
    </div>
  );
};

export default Event;
