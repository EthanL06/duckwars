import React from "react";
import { cn } from "../../../lib/utils";
import Hit from "../../../assets/cell/hit.svg";
import MissSplash from "../../../assets/cell/miss-splash.svg";
import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";

import { Board } from "../../../logic";
type Props = {
  x: number;
  y: number;
  board: Board;
};

const SpectatorCell = ({ x, y, board }: Props) => {
  const hasDuck = () => {
    return board[x][y].ship != undefined;
  };

  const selectDuckComponent = () => {
    const ship = board[x][y].ship;
    if (ship == null || ship == undefined) return null;

    const { x: shipX, y: shipY } = ship.startingPosition;
    const shipType = ship.type;

    const ShipComponents = {
      default: Default,
      scarf: Scarf,
      hat: Hat,
      pirate: Pirate,
    };

    const ShipComponent = ShipComponents[shipType] || Default;

    return (
      <ShipComponent
        className={cn(
          x === shipX && y === shipY ? "scale-100" : "scale-[0.8]",
          "size-full select-none",
        )}
      />
    );
  };

  const selectCellImage = () => {
    if (board[x][y].state == undefined && hasDuck()) {
      return selectDuckComponent();
    }

    switch (board[x][y].state) {
      case "hit":
        return (
          <img
            className={cn("scale-up-down size-full scale-[0.8]")}
            src={Hit}
            alt="hit"
          />
        );
      case "miss":
        return (
          <img className="size-full scale-[0.8]" src={MissSplash} alt="miss" />
        );
      default:
        return "";
    }
  };

  return (
    <div
      tabIndex={-1}
      className={cn(
        "aspect-square w-[10%] rounded bg-cell hover:cursor-pointer disabled:cursor-default",
      )}
    >
      <div className="size-full select-none">{selectCellImage()}</div>
    </div>
  );
};

export default SpectatorCell;
