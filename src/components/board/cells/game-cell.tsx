import React, { useContext } from "react";

import MissSplash from "../../../assets/cell/miss-splash.svg";
import Hit from "../../../assets/cell/hit.svg";
import Target from "../../../assets/cell/target.svg";
import { cn } from "../../../lib/utils";
import { GameContext } from "../../../context/GameContext";
import { useLongPress } from "@uidotdev/usehooks";

type GameCellProps = {
  x: number;
  y: number;
};

const GameCell = ({ x, y }: GameCellProps) => {
  const { board, selectedCell, setSelectedCell } = useContext(GameContext);

  const attrs = useLongPress(() => {}, {
    onFinish: (event) => {
      if (isCellSelected()) {
        Rune.actions.bombCell(board[x][y]);
        setSelectedCell(null);
      } else {
        setSelectedCell(board[x][y]);
      }
    },
    threshold: 500,
  });

  const isCellSelected = () => {
    return selectedCell?.x === x && selectedCell?.y === y;
  };

  const selectCellImage = () => {
    if (isCellSelected()) {
      return <img className="size-full" src={Target} alt="target" />;
    }

    // if (gamePhase !== "player") return "";

    switch (board[x][y].state) {
      case "hit":
        return <img src={Hit} alt="hit" />;
      case "miss":
        return <img src={MissSplash} alt="miss" />;
      default:
        return "";
    }
  };

  const onCellClick = () => {
    setSelectedCell(board[x][y]);
  };

  return (
    <button
      tabIndex={-1}
      onClick={onCellClick}
      {...attrs}
      className={cn(
        "aspect-square w-[10%] rounded bg-cell hover:cursor-pointer disabled:cursor-default",
      )}
    >
      <div
        className={cn(
          "size-full select-none",
          isCellSelected() && "animate-pulse",
        )}
      >
        {selectCellImage()}
      </div>
    </button>
  );
};

export default GameCell;
