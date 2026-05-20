# 测试规范

## 测试框架

- **单元测试**: Vitest（优先，与 Vite 生态兼容）
- **集成测试**: Supertest（HTTP） + Vitest
- **端到端测试**: Playwright
- **测试覆盖率**: 核心业务逻辑 >= 80%

## 文件命名与目录

...
tests/
├── unit/
│ ├── user.service.test.ts
│ └── helpers/
│ └── pagination.test.ts
├── integration/
│ ├── user.api.test.ts
│ └── order.flow.test.ts
└── e2e/
└── checkout.spec.ts
...

- 单元测试紧邻源码：`user.service.ts` → `user.service.test.ts`
- 集成测试放在 `tests/integration/` 目录

## 测试结构（AAA 模式）

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from './user.service';

describe('UserService', () => {
  let userService: UserService;
  let mockRepository: MockUserRepository;

  // Arrange - 准备测试环境
  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      create: vi.fn(),
    };
    userService = new UserService(mockRepository);
  });

  describe('getUserById', () => {
    it('should return user when found', async () => {
      // Arrange
      const mockUser = { id: '1', name: 'Alice' };
      mockRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getUserById('1');

      // Assert
      expect(result).toEqual(mockUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError when user not found', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getUserById('999')).rejects.toThrow('User not found');
    });
  });
});
```

## 编写规范

- **单一断言原则**: 每个 `it()` 只测试一个行为
- **不要测试实现细节**: 测试外部行为而非内部实现
- **Mock 外部依赖**: 数据库、HTTP 调用、消息队列等
- **使用工厂函数** 创建测试数据，避免重复样板代码

```typescript
// 测试数据工厂
export function createUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    role: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
```

## 集成测试要点

- 使用**测试数据库**（`testcontainers` 或内存数据库）
- 每个测试文件**独立的事务回滚**，互不污染
- 测试 API 端点时验证：状态码、响应体、响应头
- 包含边界条件和错误场景

## 覆盖率目标

| 类型       | 目标   | 强制范围           |
| ---------- | ------ | ------------------ |
| 行覆盖率   | >= 80% | service, validator |
| 分支覆盖率 | >= 70% | 条件判断逻辑       |
| 函数覆盖率 | >= 90% | 核心业务函数       |

## 禁止项

- ❌ `test.skip` / `test.only` 提交到主分支
- ❌ 测试中依赖真实外部服务（使用 mock/fake）
- ❌ 测试间共享可变状态
- ❌ 测试中包含网络请求（除非是集成测试专门标记）
