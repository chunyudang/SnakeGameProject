---
trigger: always_on
alwaysApply: true
---
# TypeScript 编码规范

## 编译配置（tsconfig.json）

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
## 命名规范
| 标识符 | 格式 | 示例 |
|--------|------|------|
| 类 / 接口 / 类型 | PascalCase | `UserService`, `IUserRepository` |
| 函数 / 变量 | camelCase | `getUserById`, `userName` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_PORT` |
| 枚举 | PascalCase（值用 PascalCase） | `enum HttpStatus { Ok, BadRequest }` |
| 文件 | kebab-case | `user-service.ts`, `auth-middleware.ts` |
| 目录 | kebab-case | `user-module`, `order-service` |

## 类型系统使用规范
- **禁止滥用 any**：特殊情况用 `unknown` 配合类型守卫
- **优先 interface 而非 type**（对外暴露的定义用 interface）
- **函数返回值必须显式声明类型**
- **使用 satisfies 关键字**：确保类型满足约束同时保留精确类型
- **泛型参数命名**：单一参数用 `T`，多个用有意义的名称如 `TEntity`, `TRequest`

## 代码风格
- 使用 2 空格缩进
- 行尾加分号
- 单行不超过 120 字符
- 使用 `import type` 导入仅类型引用
- 路径别名使用 `@/` 映射到 `src/`

## 错误处理
- 使用自定义 `AppError` 类继承 `Error`，附加 `statusCode` 和 `code`
- 所有异步操作使用 `async/await`，禁止裸 `.then()/.catch()`
- 全局错误处理中间件捕获未处理异常

## 禁止项
- ❌ `console.log` 留在代码中（使用 logger）
- ❌ `any` 类型（严格模式除外需 `eslint-disable` 注释说明）
- ❌ 未使用的 import 和变量
- ❌ 魔法数字/字符串（应提取为常量或 enum）
- ❌ 空的 catch 块
```
