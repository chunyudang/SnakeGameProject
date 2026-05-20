import { useCallback, useEffect, useRef, useState } from 'react';
import { GRID_COLS, GRID_ROWS, INITIAL_SNAKE_LENGTH, OPPOSITE_DIRECTIONS, TICK_INTERVAL_MS, DIRECTION_VECTORS } from '@/game/constants.js';
import { type Position, Direction, GameStatus, type GameState } from '@/game/types.js';

function generateRandomPosition(snake: readonly Position[]): Position {
  const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
  const candidates: Position[] = [];

  for (let x = 0; x < GRID_COLS; x++) {
    for (let y = 0; y < GRID_ROWS; y++) {
      if (!occupied.has(`${x},${y}`)) {
        candidates.push({ x, y });
      }
    }
  }

  if (candidates.length === 0) {
    return { x: 0, y: 0 };
  }

  return candidates[Math.floor(Math.random() * candidates.length)] ?? { x: 0, y: 0 };
}

function createInitialState(): GameState {
  const startX = Math.floor(GRID_COLS / 2);
  const startY = Math.floor(GRID_ROWS / 2);

  const snake: Position[] = [];
  for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
    snake.push({ x: startX - i, y: startY });
  }

  return {
    snake,
    food: generateRandomPosition(snake),
    direction: Direction.RIGHT,
    score: 0,
    status: GameStatus.IDLE,
  };
}

function moveSnake(snake: readonly Position[], direction: Direction, ate: boolean): Position[] {
  const head = snake[0];
  if (!head) {
    return [...snake];
  }

  const vector = DIRECTION_VECTORS[direction];
  const newHead: Position = {
    x: head.x + vector.dx,
    y: head.y + vector.dy,
  };

  const newSnake = [newHead, ...snake];

  if (!ate) {
    newSnake.pop();
  }

  return newSnake;
}

function checkWallCollision(head: Position): boolean {
  return head.x < 0 || head.x >= GRID_COLS || head.y < 0 || head.y >= GRID_ROWS;
}

function checkSelfCollision(snake: readonly Position[]): boolean {
  const [head, ...body] = snake;
  if (!head) {
    return false;
  }
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function useGameLogic() {
  const [state, setState] = useState<GameState>(createInitialState);
  const directionRef = useRef<Direction>(Direction.RIGHT);
  const nextDirectionRef = useRef<Direction>(Direction.RIGHT);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // -- 清理定时器
  const clearTick = useCallback(() => {
    if (tickRef.current !== null) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  // -- 开始游戏
  const startGame = useCallback(() => {
    clearTick();
    const initial = createInitialState();
    setState(initial);
    directionRef.current = Direction.RIGHT;
    nextDirectionRef.current = Direction.RIGHT;
    setState((prev: GameState) => ({ ...prev, status: GameStatus.PLAYING }));
  }, [clearTick]);

  // -- 游戏帧更新
  const tick = useCallback(() => {
    setState((prev: GameState) => {
      if (prev.status !== GameStatus.PLAYING) {
        return prev;
      }

      directionRef.current = nextDirectionRef.current;
      const ate = prev.snake[0]!.x === prev.food.x && prev.snake[0]!.y === prev.food.y;

      const newSnake = moveSnake(prev.snake, directionRef.current, ate);
      const newHead = newSnake[0]!;

      if (checkWallCollision(newHead) || checkSelfCollision(newSnake)) {
        return { ...prev, status: GameStatus.GAME_OVER };
      }

      const newFood = ate ? generateRandomPosition(newSnake) : prev.food;

      return {
        ...prev,
        snake: newSnake,
        food: newFood,
        direction: directionRef.current,
        score: ate ? prev.score + 1 : prev.score,
      };
    });
  }, []);

  // -- 启动/停止 tick
  useEffect(() => {
    if (state.status === GameStatus.PLAYING) {
      tickRef.current = setInterval(tick, TICK_INTERVAL_MS);
    } else {
      clearTick();
    }

    return clearTick;
  }, [state.status, tick, clearTick]);

  // -- 键盘事件
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const keyDirectionMap: Record<string, Direction> = {
      ArrowUp: Direction.UP,
      ArrowDown: Direction.DOWN,
      ArrowLeft: Direction.LEFT,
      ArrowRight: Direction.RIGHT,
      w: Direction.UP,
      W: Direction.UP,
      s: Direction.DOWN,
      S: Direction.DOWN,
      a: Direction.LEFT,
      A: Direction.LEFT,
      d: Direction.RIGHT,
      D: Direction.RIGHT,
    };

    const newDirection = keyDirectionMap[e.key];
    if (!newDirection) {
      return;
    }

    e.preventDefault();
    const opposite = OPPOSITE_DIRECTIONS[newDirection];

    // 不允许 180° 掉头
    if (opposite !== directionRef.current) {
      nextDirectionRef.current = newDirection;
    }
  }, []);

  // -- 注册/注销键盘事件
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return { state, startGame };
}
