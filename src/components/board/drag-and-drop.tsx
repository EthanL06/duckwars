import React, { useEffect, useState } from "react";
import { Cell } from "../../logic";
import useTouch from "beautiful-react-hooks/useTouch";
import Default from "../ducks/default";
import Scarf from "../ducks/scarf";
import Hat from "../ducks/hat";
import Pirate from "../ducks/pirate";
import { cn } from "../../lib/utils";

type Props = {
  isDragging: boolean;
  selectedDraggingCell: Cell | null;
  boardRef: React.RefObject<HTMLDivElement>;
};

const DragAndDrop = ({ isDragging, selectedDraggingCell, boardRef }: Props) => {
  const [touches, { onTouchStart, onTouchEnd }] = useTouch();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    // Set x and y relative to the board
    if (!touches || touches.length === 0) {
      return;
    }

    const touch = touches[0];

    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    // Make sure to account for the image size of the duck so that it's centered

    const duckSize = 6;

    setX(touch.clientX - rect.left - duckSize / 2);
    setY(touch.clientY - rect.top - 60 / 2);
  }, [touches, boardRef]);

  if (
    !isDragging ||
    !selectedDraggingCell ||
    !selectedDraggingCell.ship ||
    !touches ||
    touches.length === 0
  ) {
    return null;
  }

  const { count, orientation, startingPosition, type } =
    selectedDraggingCell.ship;

  const duckImages = {
    default: Default,
    scarf: Scarf,
    hat: Hat,
    pirate: Pirate,
  };

  const startingCell = document.querySelector(
    `[data-x="${startingPosition.x}"][data-y="${startingPosition.y}"]`,
  );

  console.log("STARTING: ", startingCell);

  return (
    <div
      style={{
        position: "absolute",
        top: orientation == "horizontal" ? y : y - count * 25,
        left: orientation == "horizontal" ? x - count * 30 : x - 10,
        zIndex: 100,
      }}
      className={cn(
        "flex",
        orientation === "vertical" ? "flex-col-reverse" : "flex-row-reverse",
      )}
    >
      {Array.from({ length: count }).map((_, i) => {
        const DuckImage = duckImages[type];
        return <DuckImage key={i} className={`size-8 opacity-50`} />;
      })}
    </div>
  );
};

export default DragAndDrop;
