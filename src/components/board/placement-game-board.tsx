import React, { useContext, useRef, useState } from "react";
import { Board, Cell, Position, Ship } from "../../logic";
import { GameContext } from "../../context/GameContext";
import useSound from "use-sound";
import rubberDuckSound from "../../assets/sfx/rubber_duck.wav";
import {
  cn,
  duckSoundSpriteMap,
  isValidPosition,
  isValidRotation,
} from "../../lib/utils";
import PlacementCell from "./cells/placement-cell";
import DragAndDrop from "./drag-and-drop";

const PlacementGameBoard = () => {
  const { board, state, playerID, isRotating } = useContext(GameContext);

  // The cell with the duck we are dragging
  const [selectedDraggingCell, setSelectedDraggingCell] = useState<Cell | null>(
    null,
  );

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
            {/* {row.map((cell, y) => (
              <PlacementCell
                key={`${x}-${y}`}
                x={x}
                y={y}
                playSound={playDuckSound}
                selectedDraggingCell={selectedDraggingCell}
                setSelectedDraggingCell={setSelectedDraggingCell}
                board={playerBoard}
                isRotating={isRotating}
              />
            ))} */}

            <PlacementRow
              row={row}
              rowIndex={x}
              board={playerBoard}
              selectedDraggingCell={selectedDraggingCell}
              setSelectedDraggingCell={setSelectedDraggingCell}
              isRotating={isRotating}
            />
          </div>
        ))}

        <DragAndDrop
          boardRef={boardRef}
          selectedDraggingCell={selectedDraggingCell}
        />
      </div>
    </div>
  );
};

const PlacementRow = ({
  row,
  rowIndex,
  board,
  selectedDraggingCell,
  setSelectedDraggingCell,
  isRotating,
}: {
  row: Cell[];
  rowIndex: number;
  board: Board;
  selectedDraggingCell: Cell | null;
  setSelectedDraggingCell: React.Dispatch<React.SetStateAction<Cell | null>>;
  isRotating: boolean;
}) => {
  const [playDuckSound] = useSound(rubberDuckSound, {
    sprite: duckSoundSpriteMap,
  });

  return (
    <div
      key={rowIndex}
      className=" flex w-full gap-[1px] min-[200px]:gap-0.5 min-[250px]:gap-1"
    >
      {row.map(
        (cell, y) =>
          cell !== undefined && (
            <PlacementCell
              key={`${rowIndex}-${y}`}
              x={rowIndex}
              y={y}
              playSound={playDuckSound}
              board={board}
              selectedDraggingCell={selectedDraggingCell}
              setSelectedDraggingCell={setSelectedDraggingCell}
              isRotating={isRotating}
              cell={cell}
              isValidRotate={(ship: Ship, currentPosition: Position) => {
                return isValidRotation(board, ship, currentPosition);
              }}
              isValidPosition={(ship: Ship, newPosition: Position) => {
                return isValidPosition(board, ship, newPosition);
              }}
              getCell={(x: number, y: number) => {
                return board[x][y];
              }}
            />
          ),
      )}
    </div>
  );
};

export default PlacementGameBoard;
