import React, { useEffect, useRef } from "react";

import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";
import {
  cn,
  isValidPosition,
  isValidRotation,
  moveShip,
  rotateShip,
} from "../../../lib/utils";
import { Board, Cell, Ship } from "../../../logic";
import { PlayFunction } from "use-sound";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";

type PlacementCellProps = {
  x: number;
  y: number;
  playSound: PlayFunction;
  // setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  // isDragging: boolean;
  selectedDraggingCell: Cell | null;
  setSelectedDraggingCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  draggedOverCell: Cell | null;
  setDraggedOverCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  board: Board;
  isRotating: boolean;
};

const PlacementCell: React.FC<PlacementCellProps> = ({
  x,
  y,
  playSound,
  // setIsDragging,
  // isDragging,
  selectedDraggingCell,
  setSelectedDraggingCell,
  draggedOverCell,
  setDraggedOverCell,
  board,
  isRotating,
}) => {
  const prevProps = useRef({
    x,
    y,
    playSound,
    // setIsDragging,
    // isDragging,
    selectedDraggingCell,
    setSelectedDraggingCell,
    draggedOverCell,
    setDraggedOverCell,
    board,
    isRotating,
  });

  useEffect(() => {
    const changedProps = Object.entries({
      x,
      y,
      playSound,
      // setIsDragging,
      // isDragging,
      selectedDraggingCell,
      setSelectedDraggingCell,
      draggedOverCell,
      setDraggedOverCell,
      board,
      isRotating,
    }).reduce((p, [k, v]) => {
      if (prevProps.current[k] !== v) {
        p[k] = [prevProps.current[k], v];
      }
      return p;
    }, {});

    if (Object.keys(changedProps).length > 0) {
      console.log(x, y, "Changed props:", changedProps);
    }

    prevProps.current = {
      x,
      y,
      playSound,
      // setIsDragging,
      // isDragging,
      selectedDraggingCell,
      setSelectedDraggingCell,
      draggedOverCell,
      setDraggedOverCell,
      board,
      isRotating,
    };
  }, [
    x,
    y,
    playSound,
    // setIsDragging,
    // isDragging,
    selectedDraggingCell,
    setSelectedDraggingCell,
    draggedOverCell,
    setDraggedOverCell,
    board,
    isRotating,
  ]);

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

  const isBeingDragged = () => {
    return (
      selectedDraggingCell && selectedDraggingCell?.ship == board[x][y].ship
    );
  };

  const isBeingDraggedOnto = () => {
    if (!selectedDraggingCell || !selectedDraggingCell.ship || !draggedOverCell)
      return false;

    return (
      draggedOverCell.x == x &&
      draggedOverCell.y == y &&
      isValidPosition(board, selectedDraggingCell.ship as Ship, board[x][y])
    );
  };

  const onDragStart = () => {
    if (!hasDuck() || isRotating) return;

    setSelectedDraggingCell(board[x][y]);
  };

  const onDragMoveMobile = (e: React.TouchEvent) => {
    if (isRotating) return;

    // Get what cell is being touched
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;

    // Get the element that is being touched
    const elements = document.elementsFromPoint(x, y);
    const element = elements.filter(
      (element) => element.getAttribute("data-cell") === "true",
    )[0];

    if (!element) return;

    // Get the x and y of the element
    const cellX = element.getAttribute("data-x") as string;
    const cellY = element.getAttribute("data-y") as string;

    // Get the cell
    const cell = board[Number(cellX)][Number(cellY)];

    if (cell.x === x && cell.y === y) return;
    setDraggedOverCell(cell);
  };

  const onDragMove = (e: React.DragEvent) => {
    if (isRotating) return;

    const x = e.clientX;
    const y = e.clientY;

    // Get the element that is being touched
    const elements = document.elementsFromPoint(x, y);
    const element = elements.filter(
      (element) => element.getAttribute("data-cell") === "true",
    )[0];

    if (!element) return;

    // Get the x and y of the element
    const cellX = element.getAttribute("data-x") as string;
    const cellY = element.getAttribute("data-y") as string;

    // Get the cell
    const cell = board[Number(cellX)][Number(cellY)];
    setDraggedOverCell(cell);
  };

  const onDragEnd = () => {
    if (!selectedDraggingCell || isRotating) return;

    if (!selectedDraggingCell || !selectedDraggingCell.ship || !draggedOverCell)
      return;

    if (!isValidPosition(board, selectedDraggingCell.ship, draggedOverCell)) {
      // const result = moveToOptimalPosition(
      //   board,
      //   {
      //     x: draggedOverCell.x,
      //     y: draggedOverCell.y,
      //   },
      //   selectedDraggingCell.ship,
      // );
      // if (result) {
      //   playSound({
      //     id: "duck-1",
      //   });
      //   setSelectedDraggingCell(null);
      // }

      return;
    }

    moveShip(board, selectedDraggingCell.ship as Ship, draggedOverCell);
    playSound({
      id: "duck-1",
    });
    setSelectedDraggingCell(null);
  };

  const canRotate = () => {
    const ship = board[x][y].ship;
    if (!ship) return false;

    const startingPosition = ship.startingPosition;

    return (
      isRotating &&
      board[x][y].ship &&
      isValidRotation(board, board[x][y].ship as Ship, {
        x: startingPosition.x,
        y: startingPosition.y,
      })
    );
  };

  return (
    <div
      data-cell="true"
      data-x={x}
      data-y={y}
      tabIndex={-1}
      onClick={() => {
        if (isRotating && !isMobile) {
          rotateShip(board, board[x][y]);
          playSound({
            id: "duck-2",
          });
        }
      }}
      draggable={true}
      onDragStart={onDragStart}
      onDrag={onDragMove}
      onDragEnd={() => {
        if (!isRotating) {
          onDragEnd();
          return;
        }

        if (!hasDuck()) return;

        rotateShip(board, board[x][y]);
        playSound({
          id: "duck-2",
        });
      }}
      onTouchStart={onDragStart}
      onTouchMove={onDragMoveMobile}
      onTouchEnd={() => {
        if (!isRotating) {
          onDragEnd();
          return;
        }

        if (!hasDuck() || !isMobile) return;

        const rotated = rotateShip(board, board[x][y]);
        if (rotated) {
          playSound({
            id: "duck-2",
          });
        }
      }}
      className={cn(
        "aspect-square w-[10%] scale-100 rounded bg-cell transition-all hover:cursor-pointer disabled:cursor-default",
        isBeingDragged() && "animate-pulse bg-gray-300",
        (isBeingDraggedOnto() || canRotate()) && "bg-green-300",
      )}
    >
      <AnimatePresence mode="wait">
        {hasDuck() && (
          <motion.div
            initial={{ scale: 0.5 }}
            animate={"animateIn"}
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
    </div>
  );
};

export default PlacementCell;
