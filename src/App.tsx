import { useCallback } from 'react';
import { useGameLogic } from '@/hooks/useGameLogic.js';
import { GameStatus } from '@/game/types.js';
import { CELL_SIZE, GRID_COLS, GRID_ROWS } from '@/game/constants.js';
import './App.css';

const BOARD_WIDTH = GRID_COLS * CELL_SIZE;
const BOARD_HEIGHT = GRID_ROWS * CELL_SIZE;

function App() {
  const { state, startGame } = useGameLogic();

  const handleStartClick = useCallback(() => {
    startGame();
  }, [startGame]);

  const isIdle = state.status === GameStatus.IDLE;
  const isGameOver = state.status === GameStatus.GAME_OVER;
  const isPlaying = state.status === GameStatus.PLAYING;

  return (
    <div className="app">
      <h1 className="title">🐍 贪吃蛇</h1>

      <div className="score-board">
        <span>
          得分：<strong>{state.score}</strong>
        </span>
      </div>

      {isIdle && (
        <div className="overlay">
          <div className="overlay-content">
            <p className="overlay-text">按下按钮开始游戏</p>
            <button className="btn" onClick={handleStartClick}>
              开始游戏
            </button>
            <p className="hint">使用 方向键 / WASD 控制移动</p>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="overlay">
          <div className="overlay-content">
            <h2 className="overlay-title">游戏结束</h2>
            <p className="overlay-text">得分：{state.score}</p>
            <button className="btn" onClick={handleStartClick}>
              重新开始
            </button>
          </div>
        </div>
      )}

      <svg className="board" width={BOARD_WIDTH} height={BOARD_HEIGHT} viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`}>
        <rect width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="#1a1a2e" rx="4" />

        {/* 网格线 */}
        {Array.from({ length: GRID_COLS }, (_, i) => (
          <line key={`v${i}`} x1={(i + 1) * CELL_SIZE} y1={0} x2={(i + 1) * CELL_SIZE} y2={BOARD_HEIGHT} stroke="#16213e" strokeWidth="1" />
        ))}
        {Array.from({ length: GRID_ROWS }, (_, i) => (
          <line key={`h${i}`} x1={0} y1={(i + 1) * CELL_SIZE} x2={BOARD_WIDTH} y2={(i + 1) * CELL_SIZE} stroke="#16213e" strokeWidth="1" />
        ))}

        {/* 食物 */}
        {isPlaying && <rect x={state.food.x * CELL_SIZE + 2} y={state.food.y * CELL_SIZE + 2} width={CELL_SIZE - 4} height={CELL_SIZE - 4} rx="4" fill="#e94560" />}

        {/* 蛇身 */}
        {isPlaying &&
          state.snake.map((segment, index) => (
            <rect
              key={`${segment.x}-${segment.y}-${index}`}
              x={segment.x * CELL_SIZE + 1}
              y={segment.y * CELL_SIZE + 1}
              width={CELL_SIZE - 2}
              height={CELL_SIZE - 2}
              rx="3"
              fill={index === 0 ? '#0f3460' : '#16c79a'}
            />
          ))}
      </svg>
    </div>
  );
}

export default App;
