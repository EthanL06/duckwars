import React, { useContext, useEffect } from "react";
import { GameContext } from "../../context/GameContext";
import { cn } from "../../lib/utils";
import useSound from "use-sound";
import joinSound from "../../assets/sfx/join.wav";

const PlayerProfiles = ({
  className,
  onSpectatorClick,
}: {
  className?: string;
  onSpectatorClick?: (playerId: string) => void;
}) => {
  const { state, playerID } = useContext(GameContext);
  const [play] = useSound(joinSound);
  const placementClasses = (playerId: string) => {
    return state.ready[playerId] ? "opacity-100" : "opacity-15";
  };

  useEffect(() => {
    // If one player is ready
    if (state.ready[state.playerIds[1]] || state.ready[state.playerIds[0]]) {
      play();
    }
  }, [state.ready, play, state.playerIds]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {state.playerIds.map((playerId, index) => {
        const playerInfo = Rune.getPlayerInfo(playerId);
        return (
          <React.Fragment key={index}>
            {playerInfo && (
              <button
                onClick={() => {
                  if (onSpectatorClick) {
                    onSpectatorClick(playerInfo.playerId);
                  }
                }}
                style={{ zIndex: state.playerIds.length - index }}
                className={cn(
                  "relative right-1 h-6 w-6 rounded-full first:right-0",
                  playerID == undefined ||
                    (state.winner && "outline-green-500 active:outline"),
                )}
              >
                <img
                  src={playerInfo.avatarUrl}
                  alt="avatar"
                  className={cn(
                    state.phase === "placement" && placementClasses(playerId),
                  )}
                />
              </button>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PlayerProfiles;
