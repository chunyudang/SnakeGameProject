# 🐍 贪吃蛇游戏 (Snake Game)

基于 **React + TypeScript + Vite** 构建的经典贪吃蛇网页游戏。

## 功能特性

- ⌨️ **键盘控制** — 方向键 / WASD 控制蛇的移动
- 🍎 **食物系统** — 蛇吃到食物后变长并增加分数
- 💥 **碰撞检测** — 撞墙或撞到自己时游戏结束
- 🔄 **重新开始** — 游戏结束后一键重新开始
- 🎨 **深色主题** — 精美暗色 UI 风格

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

启动后在浏览器打开 `http://localhost:5173` 即可开始游戏。

### 构建生产版本

```bash
npm run build
npm run preview
```

## 技术栈

| 技术       | 用途     |
| ---------- | -------- |
| React 19   | UI 框架  |
| TypeScript | 类型安全 |
| Vite       | 构建工具 |
| SVG        | 游戏渲染 |
| CSS        | 样式     |

## 项目结构

```
snake-game-project/
├── index.html              # 入口 HTML
├── src/
│   ├── main.tsx            # React 入口
│   ├── App.tsx             # 主游戏组件
│   ├── App.css             # 样式
│   ├── game/
│   │   ├── types.ts        # 类型定义
│   │   └── constants.ts    # 游戏常量
│   └── hooks/
│       └── useGameLogic.ts # 游戏核心逻辑
├── vite.config.ts
├── tsconfig*.json
└── package.json
```

## 游戏控制

| 按键  | 操作     |
| ----- | -------- |
| ↑ / W | 向上移动 |
| ↓ / S | 向下移动 |
| ← / A | 向左移动 |
| → / D | 向右移动 |

## 游戏运行原理

### 核心概念

游戏本质上是一个 **定时器驱动的状态机**。每一帧（每 150ms）执行一次 `tick`，更新蛇的坐标数据，然后 React 重新渲染 SVG 画面。

三个 `useRef` 各司其职：

| Ref                | 职责                              |
| ------------------ | --------------------------------- |
| `directionRef`     | 蛇**当前**真正移动的方向          |
| `nextDirectionRef` | 缓存用户最新按键，在下一帧生效    |
| `tickRef`          | 持有 `setInterval` 句柄，用于启停 |

这种"双方向 ref"设计保证了用户在 150ms 间隔内多次按键不会丢失输入，同时防止了 180° 掉头。

### 完整运行流程

```
浏览器加载页面
       │
       ▼
  createInitialState()
  蛇身=[(10,10),(9,10),(8,10)]  食物=随机  状态=IDLE
       │
       ▼
  显示"开始游戏"按钮
       │
       ▼
  用户点击按钮
       │
       ▼
  startGame()
  ├─ clearTick()         清掉旧定时器
  ├─ createInitialState() 重置所有数据
  ├─ setState()           更新状态
  └─ 状态 → PLAYING
       │
       ▼
  useEffect 检测到 PLAYING
       │
       ▼
  setInterval(tick, 150ms)  ←── 游戏引擎启动
       │
       ┌─────────────────────┐
       │     每 150ms...      │
       │         │            │
       │         ▼            │
       │  tick() 执行         │
       │    │                 │
       │    ├─ ① 方向确认     │
       │    │   nextDirectionRef → directionRef
       │    │                 │
       │    ├─ ② 检测吃到食物 │
       │    │   蛇头坐标 == 食物坐标?
       │    │                 │
       │    ├─ ③ moveSnake() │
       │    │   新头插入最前  │
       │    │   没吃到→删尾巴 │
       │    │   吃到了→保留   │
       │    │                 │
       │    ├─ ④ 碰撞检测     │
       │    │   撞墙? 撞自己? │
       │    │                 │
       │    ├─ ⑤ 生成新食物   │
       │    │   随机选空位     │
       │    │                 │
       │    └─ ⑥ setState()   │
       │       返回新 GameState│
       │                 │    │
       └─────────────────┼────┘
                         │
           ┌─────────────┴─────────────┐
           │                           │
           ▼                           ▼
     React 重渲染 SVG          碰撞成立
     蛇/食物绘制更新            状态 → GAME_OVER
     继续下一帧                clearInterval(停循环)
                              显示"游戏结束"遮罩
                                    │
                                    ▼
                              用户点击"重新开始"
                                    │
                                    ▼
                              回到 startGame()
```

### 蛇的移动原理 (`moveSnake`)

蛇身是一个坐标数组 `Position[]`，第 0 项是蛇头。每一步：

1. 根据方向向量计算新蛇头坐标（如向右走：`x+1, y`）
2. 新头插入数组最前面
3. 没吃到食物 → 弹出末尾（蛇整体平移一格）
4. 吃到了 → 保留末尾（蛇变长一节）

```
没吃食物： [A→B→C]  →  [D→A→B]
吃到了：   [A→B→C]  →  [D→A→B→C]  （变长）
```

### 键盘处理

- 方向键 (`↑↓←→`) 和 `WASD` 都支持
- 按键时**不直接移动蛇**，只更新 `nextDirectionRef`
- 在下一帧 `tick` 中才将 `nextDirectionRef` 赋给 `directionRef`
- 使用 `OPPOSITE_DIRECTIONS` 映射防止 180° 掉头（正在右走时按左键被忽略）

### 渲染方式

游戏使用 **SVG** 渲染而非 Canvas：

- `App.tsx` 中的 `<svg>` 元素包含 20×20 网格线、食物矩形和蛇身矩形
- 每次状态更新，React 通过 `diff` 算法只更新变化的 DOM 节点
- 这种方式天然声明式，与 React 的数据驱动理念一致

### 文件职责映射

| 文件              | 职责                                                |
| ----------------- | --------------------------------------------------- |
| `types.ts`        | Position、Direction、GameStatus、GameState 类型定义 |
| `constants.ts`    | 网格大小、帧间隔、方向向量、反向映射等常量          |
| `useGameLogic.ts` | 全部游戏逻辑：初始化、移动、碰撞、键盘、定时器      |
| `App.tsx`         | UI 层：SVG 绘制、分数展示、状态遮罩                 |
| `App.css`         | 深色主题、按钮、布局样式                            |

### 简单总结

> **定时器驱动 `tick` → `tick` 更新蛇坐标 → React 重新渲染 SVG → 你看到了动画。**
> 三个 ref 各司其职：`directionRef` 管当前方向、`nextDirectionRef` 缓存用户输入、`tickRef` 管定时器生命周期。状态通过 `useState` 驱动 UI 更新，碰撞时停止定时器并显示结束界面。

## 许可

[MIT](LICENSE)
