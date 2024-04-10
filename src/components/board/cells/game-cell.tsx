import { useContext, useState } from "react";

import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";
import MissSplash from "../../../assets/cell/miss-splash.svg";
import Hit from "../../../assets/cell/hit.svg";
import Target from "../../../assets/cell/target.svg";
import { cn } from "../../../lib/utils";
import { GameContext } from "../../../context/GameContext";
import { useLongPress } from "@uidotdev/usehooks";
import { PlayerId } from "rune-games-sdk";
import { PlayFunction } from "use-sound";
import { Cell } from "../../../logic";
import { AnimatePresence, motion } from "framer-motion";

type GameCellProps = {
  x: number;
  y: number;
  playSound: PlayFunction;
};

const GameCell = ({ x, y, playSound }: GameCellProps) => {
  const { board, selectedCell, setSelectedCell, state, playerID } =
    useContext(GameContext);

  const bombCell = (cell: Cell) => {
    if (isCellSelected()) {
      Rune.actions.bombCell(cell);

      setSelectedCell(null);
      setTimeout(() => {
        Rune.actions.nextTurn();
      }, 5200);
    } else {
      setSelectedCell(cell);
    }
  };

  const attrs = useLongPress(() => {}, {
    onFinish: (event) => {
      event.preventDefault();
      bombCell(board[x][y]);
    },
    threshold: 500,
  });

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

  const hasDuck = () => {
    return board[x][y].ship != undefined;
  };

  const isCellSelected = () => {
    return selectedCell?.x === x && selectedCell?.y === y;
  };

  const selectCellImage = () => {
    // When opponent's turn
    if (state.turn !== playerID) {
      if (board[x][y].state === undefined && hasDuck()) {
        return selectDuckComponent();
      } else {
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
              <img
                className="size-full scale-[0.8]"
                src={MissSplash}
                alt="miss"
              />
            );
          default:
            return "";
        }
      }
    }

    // When player's turn
    if (isCellSelected()) {
      return (
        <img className="scale-up-down size-full" src={Target} alt="target" />
      );
    }

    const opponentsBoard =
      state.boards[state.playerIds.find((id) => id !== playerID) as PlayerId];

    switch (opponentsBoard[x][y].state) {
      case "hit":
        return (
          <img
            className="scale-up-down size-full scale-[0.8]"
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

  const onCellClick = () => {
    const opponentsBoard =
      state.boards[state.playerIds.find((id) => id !== playerID) as PlayerId];
    if (state.turn !== playerID || opponentsBoard[x][y].state != undefined)
      return;

    playSound({ id: "duck-1" });
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
