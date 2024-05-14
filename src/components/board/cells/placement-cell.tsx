import React, { useEffect, useRef } from "react";

import Default from "../../ducks/default";
import Scarf from "../../ducks/scarf";
import Hat from "../../ducks/hat";
import Pirate from "../../ducks/pirate";
import { cn, moveShip, rotateShip } from "../../../lib/utils";
import { Board, Cell, Ship } from "../../../logic";
import { PlayFunction } from "use-sound";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { isMobile } from "react-device-detect";

type PlacementCellProps = {
  x: number;
  y: number;
  playSound: PlayFunction;
  selectedDraggingCell: Cell | null;
  setSelectedDraggingCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  // board: Board;
  isRotating: boolean;
  cell: Cell;
  isValidRotate: (
    ship: Ship,
    currentPosition: { x: number; y: number },
  ) => boolean;

  isValidPosition: (
    ship: Ship,
    newPosition: { x: number; y: number },
  ) => boolean;

  getCell: (x: number, y: number) => Cell;
};

const PlacementCell: React.FC<PlacementCellProps> = React.memo(
  ({
    x,
    y,
    playSound,
    selectedDraggingCell,
    setSelectedDraggingCell,
    // board,
    isRotating,
    cell,
    isValidRotate,
    isValidPosition,
    getCell,
  }) => {
    // const prevProps = useRef({
    //   x,
    //   y,
    //   playSound,
    //   selectedDraggingCell,
    //   setSelectedDraggingCell,
    //   // draggedOverCell,
    //   // setDraggedOverCell,
    //   // board,
    //   isRotating,
    // });

    // useEffect(() => {
    //   const changedProps = Object.entries({
    //     x,
    //     y,
    //     playSound,
    //     // setIsDragging,
    //     // isDragging,
    //     selectedDraggingCell,
    //     setSelectedDraggingCell,
    //     // draggedOverCell,
    //     // setDraggedOverCell,
    //     // board,
    //     isRotating,
    //   }).reduce((p: { [key: string]: any }, [k, v]) => {
    //     if (prevProps.current[k as keyof typeof prevProps.current] !== v) {
    //       p[k] = [prevProps.current[k as keyof typeof prevProps.current], v];
    //     }
    //     return p;
    //   }, {});

    //   if (Object.keys(changedProps).length > 0) {
    //     console.log(x, y, "Changed props:", changedProps);
    //   }

    //   prevProps.current = {
    //     x,
    //     y,
    //     playSound,
    //     // setIsDragging,
    //     // isDragging,
    //     selectedDraggingCell,
    //     setSelectedDraggingCell,
    //     // draggedOverCell,
    //     // setDraggedOverCell,
    //     // board,
    //     isRotating,
    //   };
    // }, [
    //   x,
    //   y,
    //   playSound,
    //   // setIsDragging,
    //   // isDragging,
    //   selectedDraggingCell,
    //   setSelectedDraggingCell,
    //   // draggedOverCell,
    //   // setDraggedOverCell,
    //   // board,
    //   isRotating,
    // ]);

    useEffect(() => {
      console.log("Cell updated");
    }, []);
    const selectDuckComponent = () => {
      const ship = cell.ship;
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
      return cell.ship != undefined;
    };

    const isBeingDragged = () => {
      return selectedDraggingCell && selectedDraggingCell?.ship == cell.ship;
    };

    const onDragStart = () => {
      if (!hasDuck() || isRotating) return;

      setSelectedDraggingCell(cell);
    };

    const getCellFromDragMobile = (e: React.TouchEvent) => {
      const touch = e.changedTouches[e.changedTouches.length - 1];

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
      const cell = getCell(Number(cellX), Number(cellY));

      if (cell.x === x && cell.y === y) return null;

      return cell;
    };

    const getCellFromDrag = (e: React.DragEvent) => {
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
      const cell = getCell(Number(cellX), Number(cellY));

      if (cell.x === x && cell.y === y) return null;

      return cell;
    };

    const onDragEndMobile = (e: React.TouchEvent) => {
      console.log("Drag end mobile");
      if (
        // !isDragging ||
        !selectedDraggingCell ||
        !selectedDraggingCell.ship ||
        isRotating
      )
        return;

      setSelectedDraggingCell(null);

      const draggedOverCell = getCellFromDragMobile(e);
      console.log("Dragged over cell", draggedOverCell);

      if (!draggedOverCell) return;

      if (!isValidPosition(selectedDraggingCell.ship, draggedOverCell)) {
        return;
      }

      // moveShip(board, selectedDraggingCell.ship as Ship, draggedOverCell);

      Rune.actions.moveShip({
        ship: selectedDraggingCell.ship,
        newCell: draggedOverCell,
      });

      playSound({
        id: "duck-1",
      });
    };

    const onDragEnd = (e: React.DragEvent) => {
      if (!selectedDraggingCell || !selectedDraggingCell.ship || isRotating)
        return;

      setSelectedDraggingCell(null);

      const draggedOverCell = getCellFromDrag(e);

      if (!draggedOverCell) return;

      if (!isValidPosition(selectedDraggingCell.ship, draggedOverCell)) {
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

      // moveShip(board, selectedDraggingCell.ship as Ship, draggedOverCell);

      Rune.actions.moveShip({
        ship: selectedDraggingCell.ship,
        newCell: draggedOverCell,
      });
      playSound({
        id: "duck-1",
      });
    };

    const canRotate = () => {
      const ship = cell.ship;
      if (!ship) return false;

      const startingPosition = ship.startingPosition;

      return (
        isRotating &&
        isValidRotate(cell.ship as Ship, {
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
            // rotateShip(board, cell);

            Rune.actions.rotateShip(cell);
            playSound({
              id: "duck-2",
            });
          }
        }}
        draggable={true}
        onDragStart={onDragStart}
        onDragEnd={(e) => {
          if (!isRotating) {
            onDragEnd(e);
            return;
          }

          if (!hasDuck()) return;

          // rotateShip(board, cell);
          Rune.actions.rotateShip(cell);
          playSound({
            id: "duck-2",
          });
        }}
        onTouchStart={onDragStart}
        onTouchEnd={(e) => {
          if (!isRotating) {
            onDragEndMobile(e);
            return;
          }

          if (!hasDuck() || !isMobile) return;

          // rotateShip(board, cell);
          Rune.actions.rotateShip(cell);
          playSound({
            id: "duck-2",
          });
        }}
        className={cn(
          "aspect-square w-[10%] scale-100 rounded bg-cell transition-all hover:cursor-pointer disabled:cursor-default",
          isBeingDragged() && "animate-pulse bg-gray-300",
          canRotate() && "bg-green-300",
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
  },
);

export default PlacementCell;
