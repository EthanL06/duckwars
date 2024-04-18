import React, { useContext } from "react";

import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";
import { cn, isValidPosition, moveShip, rotateShip } from "../../../lib/utils";
import { GameContext } from "../../../context/GameContext";
import { Cell, Ship } from "../../../logic";
import { PlayFunction } from "use-sound";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";

type PlacementCellProps = {
  x: number;
  y: number;
  isSelected: boolean;
  setSelectedCells: React.Dispatch<React.SetStateAction<Cell[]>>;
  selectedShip: Ship | null;
  isMoving: boolean;
  setIsMoving: React.Dispatch<React.SetStateAction<boolean>>;
  setClickedCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  clickedCell: Cell | null;
  playSound: PlayFunction;
};

const PlacementCell: React.FC<PlacementCellProps> = ({
  x,
  y,
  isSelected,
  setSelectedCells,
  selectedShip,
  isMoving,
  setIsMoving,
  setClickedCell,
  clickedCell,
  playSound,
}) => {
  const { state, playerID } = useContext(GameContext);
  const board = state.boards[playerID];

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

  const highlightShip = () => {
    const ship = board[x][y].ship;

    const cellsWithShip = [] as Cell[];

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell.ship?.type === ship?.type) {
          cellsWithShip.push(cell);
        }
      });
    });

    setClickedCell(board[x][y]);
    setSelectedCells(cellsWithShip);
  };

  const onCellClick = () => {
    const canMoveShipToCell = () => {
      return (
        isMoving &&
        selectedShip &&
        (board[x][y].ship == undefined ||
          board[x][y].ship?.type == selectedShip?.type) &&
        isValidCellToMoveTo()
      );
    };

    // To rotate ship
    if (isMoving && clickedCell?.x === x && clickedCell?.y === y) {
      rotateShip(board, clickedCell);
      playSound({
        id: "duck-2",
      });
      setIsMoving(false);
      setSelectedCells([]);
      setClickedCell(null);
      return;
    }

    // To move ship
    if (canMoveShipToCell()) {
      moveShip(board, selectedShip as Ship, board[x][y]);
      playSound({
        id: "duck-1",
      });
      setIsMoving(false);
      setSelectedCells([]);
      setClickedCell(null);
      return;
    }

    const cellHasDuck = hasDuck();
    if (!cellHasDuck) return;

    highlightShip();
    setIsMoving(true);
  };

  const isValidCellToMoveTo = () => {
    if (!isMoving || !selectedShip) return false;
    return isValidPosition(board, selectedShip, { x, y });
  };

  const isMovingClasses = () => {
    if (isValidCellToMoveTo() && !isSelected) {
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
      className={cn(
        "aspect-square w-[10%] scale-100 rounded bg-cell transition-all hover:cursor-pointer disabled:cursor-default",
        isSelected && "animate-pulse bg-gray-300",
        isMoving && isMovingClasses(),
      )}
    >
      <AnimatePresence mode="wait">
        {hasDuck() && (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={isSelected ? "scaleUp" : "animateIn"}
            exit={{ scale: 0 }}
            variants={{
              scaleUp: {
                scale: 1.25,
                transition: {
                  bounce: 0.75,
                  type: "spring",
                },
              },
              animateIn: {
                scale: 1,
                transition: {
                  bounce: 0.75,
                  type: "spring",
                },
              },
            }}
            key={"duck"}
            className="size-full select-none"
          >
            {selectDuckComponent()}
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default PlacementCell;
