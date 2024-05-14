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
import { PlayerId } from "rune-games-sdk";
import { PlayFunction } from "use-sound";
import { Cell } from "../../../logic";
import { useDoubleClick } from "@zattoo/use-double-click";
import { EVENT_DURATION } from "../../../lib/constants";

type GameCellProps = {
  x: number;
  y: number;
  playTargetSound: PlayFunction;
  onBombCell: (cell: Cell) => void;
  isBombing: boolean;
  setIsBombing: (isBombing: boolean) => void;
};

const GameCell = ({
  x,
  y,
  playTargetSound,
  onBombCell,
  isBombing,
  setIsBombing,
}: GameCellProps) => {
  const { board, selectedCell, setSelectedCell, state, playerID } =
    useContext(GameContext);
  const [showCellImage, setShowCellImage] = useState(true);

  const bombCell = (cell: Cell) => {
    if (isCellSelected() && state.lastEvent == null && !isBombing) {
      setShowCellImage(false);
      Rune.actions.bombCell(cell);
      onBombCell(cell);
      setIsBombing(true);

      setTimeout(() => {
        setSelectedCell(null);
        setIsBombing(false);
        setShowCellImage(true);
        Rune.actions.nextTurn();
      }, EVENT_DURATION);
    } else {
      const opponentsBoard =
        state.boards[state.playerIds.find((id) => id !== playerID) as PlayerId];

      if (opponentsBoard[x][y].state == undefined) setSelectedCell(cell);
    }
  };

  const onCellClick = () => {
    if (
      state.winner ||
      state.turn != playerID ||
      state.lastEvent != null ||
      isBombing
    )
      return;

    console.log("clicked!");

    const opponentsBoard =
      state.boards[state.playerIds.find((id) => id !== playerID) as PlayerId];

    if (opponentsBoard[x][y].state != undefined) return;

    playTargetSound();
    setSelectedCell(board[x][y]);
  };

  const hybridClick = useDoubleClick(
    () => {
      if (state.winner || state.turn != playerID) return;

      bombCell(board[x][y]);
    },
    onCellClick,
    {
      timeout: 50,
    },
  );

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

  return (
    <div
      tabIndex={-1}
      onClick={hybridClick}
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
        {showCellImage ? (
          selectCellImage()
        ) : (
          <img className="scale-up-down size-full" src={Target} alt="target" />
        )}
      </div>
    </div>
  );
};

export default GameCell;
