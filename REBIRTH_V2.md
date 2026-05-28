# 转生系统 V2 版本规划

> 版本日期：2026-05-26
> 版本号：v2.2
> 状态：已完成 + 技能 V3 联动觉醒上线
> 上一版本：转生声望 + 品质权重（已废弃）

---

## 设计方向

**核心思路**：转生从一个"被动数值系统"变为"主动风险/回报开关"。
开关叠到现有地图上（而非新建难度层），开则难度上浮 + 专属敌人 + 专属掉落。

**两个消耗闭环**：
1. 解锁型节点树 — 一次性消费印记，永久解锁质变能力
2. 消耗型锻造 — 持续消费印记，升级转生专属词缀（有等级上限）

---

## 架构总览

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────┐
│ Rebirth Mode│────▶│ Rebirth Enemies  │────▶│ Rebirth Seal Drop│
│   Toggle    │     │ Boss / Squad    │     │   印记掉落        │
└─────────────┘     └─────────────────┘     └────────┬─────────┘
                                                      │
                                          ┌───────────┴───────────┐
                                          ▼                       ▼
                                   ┌──────────────┐      ┌──────────────┐
                                   │ Research Tree│      │  Forging      │
                                   │  一次性解锁   │      │  持续升级     │
                                   └──────────────┘      └──────────────┘
```

---

## Step 1 — 状态层

### 新增状态字段

```js
state.rebirthMode = false;  // 转生模式开关
state.rebirthSeals = 0;     // 轮回印记数量
state.rebirthResearch = {}; // { nodeId: { unlocked: boolean, level: number } }
state.rebirthForging = {};  // { affixId: level }
```

### 文件
- `game.js` — `createDefaultState()` 新增初始值
- `src/state/defaultState.js` — 若需迁移逻辑
- 存档迁移：`state/index.js` 或 `game.js` `normalizeState` 中处理旧档兼容

---

## Step 2 — 战斗层

### 转生模式敌人

当 `state.rebirthMode === true` 时，`spawnEnemy()` 中叠加：

| 遭遇类型 | 概率 | 规模 | 特征 |
|---------|------|------|------|
| 转生小队 | 15% | 3~5只 | 每只有「轮回」前缀，掉落几率出印记 |
| 转生Boss | 5% | 单体 | 轮回词缀 + 高掉率印记（必掉） |
| 普通（转生强化） | 80% | 正常 | 正常刷怪，但受转生难度数值加成 |

### 转生难度数值

在现有难度（N/H/A）基础上叠加乘法系数：

```
diffMultiplier = 1 + rebirths * 0.08  (上限 2.0)
HP *= diffMultiplier
ATK *= diffMultiplier * 0.85
DEF *= diffMultiplier * 0.7
EXP/Gold *= diffMultiplier * 0.5
```

### 转生敌人标识

- 名称前缀：「⚡轮回」
- `difficultyType` 新增：`rebirthSquad` / `rebirthBoss`
- 日志颜色与普通遭遇区分

### 文件
- `src/systems/combat/encounter.js` — `spawnEnemy()` 增加转生分支
- `src/systems/combat/monster.js` — 新增怪物类型修饰器
- `game.js` — 如有遗留 `legacySpawnEnemy`

---

## Step 3 — 掉落层

### 轮回印记

新增材料 `rebirthSeal`（轮回印记）：
- 显示名：「轮回印记」
- 稀有度：epic
- 描述：「转生模式击败轮回敌人获得，用于转生研究与锻造」

### 掉落规则

| 来源 | 掉落率 | 数量 |
|------|--------|------|
| 转生小队（每只） | 35% | 1 |
| 转生Boss | 100% | 1 + floor(rebirths / 3) |

印记不受普通掉率/稀有品质权重加成。

### 文件
- `game.js` — `materialNames` 和 `MATERIAL_DB` 新增条目
- `src/systems/drops/materialDrops.js` — 或新建 `rebirthDrops.js`，挂入 kill settlement 流程
- `src/systems/combat/settlement.js` — 击杀结算时调用印记掉落逻辑

---

## Step 4 — 研究层

### 4a. 解锁型节点树

共 5 个节点，每个一次性消耗印记永久解锁：

| 编号 | 节点名 | 消耗 | 前置 | 效果 |
|------|--------|------|------|------|
| R1 | 轮回感知 | 3 | 无 | 印记掉落率 +25%（转生小队 35→44%，Boss 保底不变） |
| R2 | 轮回负重 | 5 | 无 | 转生模式下背包上限 +20 |
| R3 | 轮回刻印 | 8 | R1 | 解锁转生专属词条池，装备随机获得 |
| R4 | 轮回共鸣 | 10 | R2 | 转生模式下自动巡逻 |
| R5 | 轮回镇压 | 15 | R3 | 对转生敌人伤害 +15% |

**数据结构**：
```js
REBIRTH_RESEARCH_TREE = [
  { id: 'sealPerception', name: '轮回感知', cost: 3, requires: [], effect: { sealDropBonus: 0.25 }, desc: '印记掉落率+25%' },
  { id: 'sealBurden', name: '轮回负重', cost: 5, requires: [], effect: { inventoryBonus: 20 }, desc: '转生模式背包+20' },
  { id: 'sealEngrave', name: '轮回刻印', cost: 8, requires: ['sealPerception'], effect: { unlockAffixPool: true }, desc: '装备随机获得转生词缀' },
  { id: 'sealResonance', name: '轮回共鸣', cost: 10, requires: ['sealBurden'], effect: { autoPatrol: true }, desc: '转生模式自动巡逻' },
  { id: 'sealSuppression', name: '轮回镇压', cost: 15, requires: ['sealEngrave'], effect: { rebirthDamageBonus: 0.15 }, desc: '对转生敌人伤害+15%' },
];
```

### 4b. 消耗型锻造

3 条可锻造词缀，每条 5 级上限：

| 词缀ID | 名称 | 基础消耗 | 每级效果 | 上限 |
|--------|------|----------|----------|------|
| rebirthPower | 轮回之力 | 2 | 转生模式全属性 +2% | Lv.5 |
| rebirthFortune | 轮回之运 | 3 | 转生模式稀有品质权重 +1% | Lv.5 |
| rebirthResilience | 轮回之韧 | 2 | 转生模式伤害减免 +1.5% | Lv.5 |

**升级公式**：`cost = baseCost * (currentLevel + 1)²`

即轮回之力 Lv.1→Lv.2 消耗 `2 × 4 = 8` 印记。

### 文件
- 新建 `src/systems/rebirth.js` — 研究树逻辑、锻造逻辑、效果查询
- `src/main.js` — 注册 rebirth runtime
- `data.js` 或 `game.js` — `REBIRTH_RESEARCH_TREE`、`REBIRTH_FORGE_AFFIXES` 配置

---

## Step 5 — UI 层

### 5a. 转生开关

位置：角色面板「转生」按钮旁边

```html
<label class="rebirth-toggle">
  <input type="checkbox" data-rebirth-mode />
  <span>轮回模式</span>
</label>
```

仅当 `state.hero.rebirths > 0` 时显示。

### 5b. 研究面板

位置：角色面板 `<details>` 内，声望面板下方

展示内容：
- 当前印记数 + 小图标
- 节点列表（已解锁 ✓ / 可解锁 消耗N印记 / 锁定 🔒）
- 点击可解锁节点 → 确认 → 扣除印记执行解锁

### 5c. 锻造面板

位置：研究面板下方或独立 section

展示可升级词缀：当前等级 / 上限、升级消耗、效果描述

### 5d. 转生模式视觉变化

开关开启后：
- `body` 添加 class `rebirth-mode`
- CSS：主背景色调偏暗红（`filter: sepia(0.3) hue-rotate(-30deg)` 或 border-color 变化）
- 怪物名称前缀：「⚡轮回」
- 战斗日志：轮回击杀使用特殊颜色（如 `#c41e3a` 深红）

### 文件
- `game.js` — `renderHeroPanel()` 中加开关 + 面板渲染
- `index.html` — 如有 dom 结构调整
- `styles.css` — `.rebirth-mode` 相关样式

---

## 涉及文件清单

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| `game.js` | 修改 | 状态初始化、materialNames、renderHeroPanel、legacy 兼容 |
| `data.js` | 修改 | 新增配置常量 |
| `src/systems/combat/encounter.js` | 修改 | spawnEnemy 转生分支 |
| `src/systems/combat/monster.js` | 修改 | 转生敌人数值修饰器 |
| `src/systems/combat/settlement.js` | 修改 | 击杀结算调用印记掉落 |
| `src/systems/drops/` | 修改/新增 | 印记掉落逻辑 |
| `src/systems/rebirth.js` | **新建** | 研究树 + 锻造核心逻辑 |
| `src/systems/combat/index.js` | 修改 | 注册 rebirth 相关 export |
| `src/main.js` | 修改 | 注册 rebirth runtime |
| `src/state/` | 可能修改 | 存档迁移兼容旧档 |
| `styles.css` | 修改 | 转生模式视觉变化 |
| `index.html` | 可能修改 | DOM 结构调整 |

---

## 执行顺序

1. 状态层 → 数据层（先有字段和配置，后面才能引用）
2. 战斗层 → 掉落层（先能刷怪，才能掉东西）
3. 研究层（核心逻辑，依赖状态和配置）
4. UI层（最后，依赖所有底层就绪）

---

## 不在此版本范围

- 转生专属剧情 / 叙事碎片
- 转生模式地图视觉（怪物模型、场景背景变化）
- 转生排行榜
- 转生限定时装 / 外观系统

---

## 第二阶段扩展（2026-05-26）

### Bug 修复

1. **技能详情自动关闭**：`renderAll()` 重建 DOM 导致 `<details>` 丢失 `open` 状态。修复：新增 `state.heroDetailsOpen` 记忆折叠状态，渲染和 toggle 事件同步。
2. **掉落播报新材料**：印记掉落缺少 `recordRecentLoot` 调用，不在最近战利品列表显示。修复：补上 `recordRecentLoot` + 材料分组增加「转生材料」分类。

### 转生模式下死亡/血量变化

- 死亡不再暂停游戏：角色恢复 15% 最大生命，扣除 1 印记（有则扣），自动刷新下一波敌人
- 两处死亡检查（updateCombat / updateMonsterAttack）均已适配
- 无印记时死亡仅记录日志，不扣除

### 转生词缀附加到装备掉落池

- 新增 `REBIRTH_EQUIP_AFFIX_POOL`（5 个词缀：轮回锋锐/坚壁/生机/锐眼/眷顾）
- 词缀仅在转生模式下生效
- 触发条件：轮回刻印研究节点已解锁 + 转生模式开启 + 12% 概率
- 词缀存储在 `item.rebirthAffix` 字段

### 自动巡逻

- 触发条件：轮回共鸣研究节点已解锁 + 转生模式开启 + Boss 击败
- 效果：自动进入下一地图（普通→困难→深渊各自的 Boss 击败后）

### 涉及新增/修改文件

| 文件 | 改动 |
|------|------|
| `src/systems/combat/normalCombat.js` | 转生模式死亡不暂停、回血、扣印记 |
| `src/systems/combat/settlement.js` | 自动巡逻 + recordRecentLoot 补全 |
| `src/systems/drops/equipmentDrops.js` | 转生词缀掉落判定 |
| `src/systems/rebirth.js` | maybeAddRebirthAffix / getAssignedRebirthAffix |
| `data.js` | REBIRTH_EQUIP_AFFIX_POOL / REBIRTH_EQUIP_AFFIX_CHANCE |
| `game.js` | dropsContext 新增 affix 桥接 + heroDetailsOpen + 材料分组 |
| `src/ui/characterPage.js` | heroDetailsOpen 渲染 + rebirthMode 开关 |
