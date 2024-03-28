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
  const { board, selectedCell, setSelectedCell, gamePhase } =
    useContext(GameContext);

  const attrs = useLongPress(() => {}, {
    onFinish: (event) => {
      if (isCellSelected()) {
        console.log("Fire!");
      } else {
        setSelectedCell(board.cells[x][y]);
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

    if (gamePhase !== "player") return "";

    switch (board.cells[x][y].state) {
      case "hit":
        return <img src={Hit} alt="hit" />;
      case "miss":
        return <img src={MissSplash} alt="miss" />;
      default:
        return "";
    }
  };

  const onCellClick = () => {
    setSelectedCell(board.cells[x][y]);
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
