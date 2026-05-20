/** 坐标位置 */
export interface Position {
  readonly x: number;
  readonly y: number;
}

/** 移动方向 */
export enum Direction {
  UP = 'UP',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

/** 游戏状态 */
export enum GameStatus {
  /** 等待开始 */
  IDLE = 'IDLE',
  /** 游戏进行中 */
  PLAYING = 'PLAYING',
  /** 游戏结束 */
  GAME_OVER = 'GAME_OVER',
}

/** 游戏状态快照 */
export interface GameState {
  /** 蛇身坐标数组（头部为第 0 项） */
  readonly snake: readonly Position[];
  /** 食物坐标 */
  readonly food: Position;
  /** 当前移动方向 */
  readonly direction: Direction;
  /** 得分 */
  readonly score: number;
  /** 游戏状态 */
  readonly status: GameStatus;
}
