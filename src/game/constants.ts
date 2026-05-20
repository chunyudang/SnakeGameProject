import { Direction } from './types.js';

/** 网格列数 */
export const GRID_COLS = 20;

/** 网格行数 */
export const GRID_ROWS = 20;

/** 每格像素大小 */
export const CELL_SIZE = 24;

/** 游戏帧间隔（毫秒） */
export const TICK_INTERVAL_MS = 150;

/** 初始蛇身长度 */
export const INITIAL_SNAKE_LENGTH = 3;

/** 方向向量映射 */
export const DIRECTION_VECTORS: Record<Direction, { readonly dx: number; readonly dy: number }> = {
  [Direction.UP]: { dx: 0, dy: -1 },
  [Direction.DOWN]: { dx: 0, dy: 1 },
  [Direction.LEFT]: { dx: -1, dy: 0 },
  [Direction.RIGHT]: { dx: 1, dy: 0 },
};

/** 禁止反向映射 */
export const OPPOSITE_DIRECTIONS: Record<Direction, Direction> = {
  [Direction.UP]: Direction.DOWN,
  [Direction.DOWN]: Direction.UP,
  [Direction.LEFT]: Direction.RIGHT,
  [Direction.RIGHT]: Direction.LEFT,
};
