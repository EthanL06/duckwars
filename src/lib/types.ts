/**
 * Represents a position on the game board.
 */
interface Position {
  /**
   * The x-coordinate of the position.
   */
  x: number;
  /**
   * The y-coordinate of the position.
   */
  y: number;
}

/**
 * Represents a cell on the game board with a ship.
 */
interface Cell extends Position {
  /**
   * The ship placed on the cell. If there is no ship, the value is null.
   */
  ship: Ship | null;

  /**
   * The cell's state. Can be "default", "hit", or "miss".
   */
  state: "default" | "hit" | "miss";

  /**
   * The cell's unique identifier.
   */
  id: string;
}

/**
 * Represents the game board with cells and ships.
 */
interface Board {
  /**
   * A 2D array of cells representing the game board.
   */
  cells: Cell[][];
  /**
   * An array of player's ships placed on the game board.
   */
  ships: Ship[];
}

/**
 * Represents a ship with a specific type, count, orientation, and position.
 */
interface Ship {
  /**
   * The type of the ship. Used to determine the appearance of the ship.
   */
  type: "default" | "hat" | "pirate" | "scarf";

  /**
   * The number of cells the ship occupies.
   */
  count: number;

  /**
   * The orientation of the ship. Can be "vertical" or "horizontal".
   */
  orientation: "vertical" | "horizontal";

  /**
   * The position of the ship on the game board. Represents the front of the ship.
   */
  position: { x: number; y: number };
}

export type { Ship, Board, Cell, Position };
