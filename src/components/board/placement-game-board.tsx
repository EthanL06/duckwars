import React, { useContext, useRef, useState } from "react";
import { Cell } from "../../logic";
import { GameContext } from "../../context/GameContext";
import useSound from "use-sound";
import rubberDuckSound from "../../assets/sfx/rubber_duck.wav";
import { cn, duckSoundSpriteMap } from "../../lib/utils";
import PlacementCell from "./cells/placement-cell";
import DragAndDrop from "./drag-and-drop";
type Props = {};

const PlacementGameBoard = (props: Props) => {
  const { board, state, playerID, isRotating } = useContext(GameContext);

  // The cell we are dragging over
  const [draggedOverCell, setDraggedOverCell] = useState<Cell | null>(null);
  // The cell with the duck we are dragging
  const [selectedDraggingCell, setSelectedDraggingCell] = useState<Cell | null>(
    null,
  );

  const [playDuckSound] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });

  const boardRef = useRef<HTMLDivElement>(null);

  if (board.length === 0) {
    return null;
  }

  const playerBoard = state.boards[playerID];

  return (
    <div>
      <div
        ref={boardRef}
        className={cn(
          "relative mx-auto mt-5 flex w-full max-w-[400px] flex-col items-center justify-center space-y-[1px] min-[200px]:space-y-0.5 min-[250px]:space-y-1",
        )}
      >
        {board.map((row, x) => (
          <div
            key={x}
            className=" flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1"
          >
            {row.map((cell, y) => (
              <PlacementCell
                key={`${x}-${y}`}
                x={x}
                y={y}
                playSound={playDuckSound}
                selectedDraggingCell={selectedDraggingCell}
                setSelectedDraggingCell={setSelectedDraggingCell}
                draggedOverCell={draggedOverCell}
                setDraggedOverCell={setDraggedOverCell}
                board={playerBoard}
                isRotating={isRotating}
              />
            ))}
          </div>
        ))}

        <DragAndDrop
          boardRef={boardRef}
          //   isDragging={isDragging}
          selectedDraggingCell={selectedDraggingCell}
        />
      </div>
    </div>
  );
};

export default PlacementGameBoard;
