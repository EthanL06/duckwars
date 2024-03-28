import React, { useContext } from "react";

import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";
import { cn } from "../../../lib/utils";
import { GameContext } from "../../../context/GameContext";
import { MoveShipContext } from "../../../context/MoveShipContext";
import { Position } from "../../../lib/types";

type PlacementCellProps = {
  x: number;
  y: number;
  isSelected: boolean;
};

const PlacementCell: React.FC<PlacementCellProps> = ({
  x,
  y,
  isSelected = false,
}) => {
  const { board } = useContext(GameContext);
  const {
    selected,
    setSelected,
    selectedCells,
    isMoving,
    moveShip,
    rotateShip,
    isValidPosition,
  } = useContext(MoveShipContext);

  // const selectCellImage = () => {
  //   switch (state) {
  //     case "hit":
  //       return Hit;
  //     case "miss":
  //       return MissSplash;
  //     case "target":
  //       return Target;
  //     default:
  //       return "";
  //   }
  // };

  const selectDuckComponent = () => {
    const { x: shipX, y: shipY } = board.cells[x][y].ship?.position || {
      shipX: 0,
      shipY: 0,
    };
    const shipType = board.cells[x][y].ship?.type || "default";

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
    return board?.cells?.[x]?.[y]?.ship?.type !== undefined;
  };

  const onCellClick = () => {
    const cellHasDuck = hasDuck();
    const cellIsSelected = selectedCells.some(
      (cell) => cell.x === x && cell.y === y,
    );

    const deselectAndRotate = (pos: Position) => {
      rotateShip(board.cells[pos.x][pos.y]);
      setSelected(null);
    };

    const moveSelectedShip = (oldPos: Position) => {
      console.log("moving ship");
      moveShip({
        oldPosition: oldPos,
        newPosition: { x, y },
      });
    };

    const isValidCellToMoveTo = () => {
      if (selected == null || !isMoving) return false;

      const ship = board.cells[selected.x][selected.y].ship;
      if (ship == null) return false;

      return isValidPosition(ship, { x, y });
    };

    const selectCell = () => {
      const { x: shipX, y: shipY } = board.cells[x][y].ship?.position || {
        x,
        y,
      };
      setSelected({ x: shipX, y: shipY });
    };

    if (selected && isMoving && !cellHasDuck && !isValidCellToMoveTo()) {
      setSelected(null);
    } else if (cellHasDuck && !cellIsSelected) {
      selectCell();
    } else if (selected) {
      const isThisCellSelected = selected.x === x && selected.y === y;

      isThisCellSelected
        ? deselectAndRotate(selected)
        : isMoving && moveSelectedShip(selected);
    }
  };

  const isValidCellToMoveTo = () => {
    if (selected == null || !isMoving) return false;

    const ship = board.cells[selected.x][selected.y].ship;
    if (ship == null) return false;

    return isValidPosition(ship, { x, y });
  };

  const isMovingClasses = () => {
    if (
      isValidCellToMoveTo() &&
      !selectedCells.some((cell) => cell.x === x && cell.y === y)
    ) {
      return "hover:cursor-pointer bg-green-300";
    } else if (!hasDuck()) {
      return "hover:cursor-not-allowed";
    }

    return "";
  };

  return (
    <button
      tabIndex={-1}
      onClick={onCellClick}
      // disabled={isDisabled()}
      className={cn(
        "aspect-square w-[10%] rounded bg-cell hover:cursor-pointer disabled:cursor-default",
        isSelected && "animate-pulse bg-gray-300 ",
        selected?.x === x &&
          selected?.y === y &&
          "outline-solid outline outline-4 -outline-offset-[1px]  outline-black",
        isMoving && isMovingClasses(),
      )}
    >
      {hasDuck() && (
        <div className="size-full select-none">{selectDuckComponent()}</div>
      )}
    </button>
  );
};

export default PlacementCell;
