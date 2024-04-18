import React, { useContext } from "react";
import { GameContext } from "../../context/GameContext";
import { cn } from "../../lib/utils";

const PlayerProfiles = ({ className }: { className?: string }) => {
  const { state } = useContext(GameContext);

  const placementClasses = (playerId: string) => {
    return state.ready[playerId] ? "opacity-100" : "opacity-15";
  };

  const gameClasses = (playerId: string) => {
    return playerId === state.turn
      ? "brightness-100"
      : "opacity-30 brightness-50";
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      {state.playerIds.map((playerId, index) => {
        const playerInfo = Rune.getPlayerInfo(playerId);
        return (
          <React.Fragment key={index}>
            {playerInfo && (
              <img
                style={{ zIndex: state.playerIds.length - index }}
                src={playerInfo.avatarUrl}
                alt="avatar"
                className={cn(
                  "relative right-1 h-6 w-6 rounded-full first:right-0",
                  state.phase === "placement" && placementClasses(playerId),
                  state.phase === "game" && gameClasses(playerId),
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default PlayerProfiles;
