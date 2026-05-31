# 冒险手册 V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Adventure Handbook V1 so homepage/adventure stays combat-focused while goals, gaps, recommended maps/materials/dungeons, equipment targets, daily/weekly goals, and adventure research points live in a dedicated handbook surface.

**Architecture:** Add a pure `src/systems/adventureHandbook.js` module that owns default state, normalization, goal progress, claims, and view-model generation. Add a focused `src/ui/adventureHandbookPage.js` renderer and bridge it through `src/main.js` and the classic `game.js` runtime, following the existing dungeon/task module pattern. Remove adventure-page advice rendering while preserving Boss progress, Skill DPS, dungeon entry, recent loot, and session reward feedback.

**Tech Stack:** Vanilla JS modules, classic `game.js` bridge, static HTML navigation, CSS in `styles.css`, existing `scripts/test.mjs`, `npm test`, `npm run check`, browser smoke via local server.

---

## File Structure

Create:

- `src/systems/adventureHandbook.js`
  - Pure module for Adventure Handbook state, goal definitions, progress tracking, reward claims, and view-model generation.
- `src/ui/adventureHandbookPage.js`
  - Renderer for the dedicated handbook page.

Modify:

- `game.js`
  - Add default/normalize state bridge.
  - Add progress and claim handlers.
  - Add `renderAdventureHandbook`.
  - Add page switch case.
  - Add click handlers.
  - Expose legacy context to modules.
  - Remove advice from classic fallback adventure side panel.
- `src/main.js`
  - Install Adventure Handbook system and render runtime.
  - Stop passing `renderAdvicePanel` to adventure page runtime.
- `src/ui/adventurePage.js`
  - Remove advice block from the adventure right-side party panel.
- `index.html`
  - Add navigation entry and page target for handbook.
  - Refresh cache keys for changed scripts/styles.
- `styles.css`
  - Add handbook layout, goal cards, recommendation rows, and compact gap panels.
- `scripts/test.mjs`
  - Add static assertions and behavior tests for state, model, progress, claims, nav, and removal of homepage advice.

Do not modify:

- Production skill systems, mining/crafting, equipment crafting, map mastery, dungeon affixes, rankings, or social systems.

---

### Task 1: Pure Adventure Handbook System

**Files:**
- Create: `src/systems/adventureHandbook.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for state shape, daily reset, weekly reset, progress, claims, and model output**

Add near the other source reads in `scripts/test.mjs`:

```js
const adventureHandbookSource = read('src/systems/adventureHandbook.js');
```

Add behavior tests near the dungeon system tests:

```js
assert.match(adventureHandbookSource, /export function defaultAdventureHandbookState/, 'Adventure handbook system should expose default state.');
assert.match(adventureHandbookSource, /export function normalizeAdventureHandbookState/, 'Adventure handbook system should normalize saved state.');
assert.match(adventureHandbookSource, /export function buildAdventureHandbookModel/, 'Adventure handbook system should build a UI model.');
assert.match(adventureHandbookSource, /export function recordAdventureHandbookProgress/, 'Adventure handbook system should expose progress tracking.');
assert.match(adventureHandbookSource, /export function claimAdventureHandbookGoal/, 'Adventure handbook system should expose reward claims.');
{
  const handbook = await importSource(adventureHandbookSource);
  const fresh = handbook.defaultAdventureHandbookState('2026-05-31', '2026-W23');
  assert.equal(fresh.date, '2026-05-31', 'Adventure handbook default date should be explicit.');
  assert.equal(fresh.weekKey, '2026-W23', 'Adventure handbook default week key should be explicit.');
  assert.equal(fresh.researchPoints, 0, 'Adventure handbook research points should start at zero.');
  assert.ok(fresh.daily.daily_kills, 'Adventure handbook should include daily kill goal state.');
  assert.ok(fresh.weekly.weekly_dungeons, 'Adventure handbook should include weekly dungeon goal state.');

  const rolledDaily = handbook.normalizeAdventureHandbookState({
    date: '2026-05-30',
    weekKey: '2026-W23',
    researchPoints: 7,
    daily: { daily_kills: { progress: 12, claimed: true } },
    weekly: { weekly_dungeons: { progress: 2, claimed: false } },
  }, '2026-05-31', '2026-W23');
  assert.equal(rolledDaily.researchPoints, 7, 'Daily reset should preserve research points.');
  assert.equal(rolledDaily.daily.daily_kills.progress, 0, 'Daily reset should clear daily progress.');
  assert.equal(rolledDaily.weekly.weekly_dungeons.progress, 2, 'Daily reset should preserve same-week weekly progress.');

  const rolledWeekly = handbook.normalizeAdventureHandbookState({
    date: '2026-05-30',
    weekKey: '2026-W22',
    researchPoints: 9,
    weekly: { weekly_dungeons: { progress: 4, claimed: true } },
  }, '2026-05-31', '2026-W23');
  assert.equal(rolledWeekly.weekly.weekly_dungeons.progress, 0, 'Weekly reset should clear weekly progress.');
  assert.equal(rolledWeekly.weekly.weekly_dungeons.claimed, false, 'Weekly reset should clear weekly claimed flags.');

  const progressState = { adventureHandbook: handbook.defaultAdventureHandbookState('2026-05-31', '2026-W23') };
  handbook.recordAdventureHandbookProgress(progressState, 'daily_kills', 3);
  assert.equal(progressState.adventureHandbook.daily.daily_kills.progress, 3, 'Daily progress should increase.');
  handbook.recordAdventureHandbookProgress(progressState, 'weekly_dungeons', 2);
  assert.equal(progressState.adventureHandbook.weekly.weekly_dungeons.progress, 2, 'Weekly progress should increase.');

  progressState.adventureHandbook.daily.daily_kills.progress = 30;
  let grantedReward = null;
  const claimResult = handbook.claimAdventureHandbookGoal(progressState, 'daily_kills', {
    grantReward: (reward) => { grantedReward = reward; },
  });
  assert.equal(claimResult.ok, true, 'Completed handbook goal should be claimable.');
  assert.equal(progressState.adventureHandbook.daily.daily_kills.claimed, true, 'Claimed handbook goal should set claimed flag.');
  assert.equal(progressState.adventureHandbook.researchPoints, 1, 'Claim should grant adventure research points.');
  assert.equal(grantedReward.gold, 1200, 'Claim should pass configured reward to grantReward.');

  const model = handbook.buildAdventureHandbookModel({
    hero: { baseLevel: 12, jobLevel: 5 },
    materials: { ore: 4 },
    currentMap: 0,
    currentDifficulty: 'normal',
    adventureHandbook: progressState.adventureHandbook,
    dungeons: { entries: { daily_material: { used: 1 } } },
    equipped: {},
    inventory: [],
  }, {
    computeStats: () => ({ power: 800, dps: 12, maxHp: 300, defense: 4 }),
    getMaps: () => [{ id: 'grass', name: '南门青草地' }, { id: 'sewer', name: '地下水道' }],
    getMaterialName: (id) => ({ ore: '精炼矿' })[id] || id,
    getMaterialDropSources: () => [{ mapId: 'grass', mapName: '南门青草地', difficulty: 'normal' }],
    getDungeonCards: () => [{ id: 'daily_material', name: '每日材料副本', remaining: 1, recommendedPower: 1200 }],
    getEquipmentTarget: () => ({ title: '补齐武器', desc: '当前武器位为空。' }),
  });
  assert.equal(model.researchPoints, 1, 'Handbook model should expose research points.');
  assert.ok(model.materials.length > 0, 'Handbook model should include material recommendations.');
  assert.ok(model.dungeons.length > 0, 'Handbook model should include dungeon recommendations.');
  assert.equal(model.equipmentTarget.title, '补齐武器', 'Handbook model should expose equipment target.');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL with missing `src/systems/adventureHandbook.js` or missing exports.

- [ ] **Step 3: Create the pure system module**

Create `src/systems/adventureHandbook.js`:

```js
let handbookCtx = {};

const DAILY_GOALS = [
  { id: 'daily_kills', title: '今日清扫', desc: '击败 30 只魔物。', target: 30, reward: { gold: 1200, researchPoints: 1, materials: { ore: 5 } } },
  { id: 'daily_boss', title: '首领热身', desc: '击败 1 次 Boss。', target: 1, reward: { gold: 2500, researchPoints: 1, materials: { bossSoul: 1 } } },
  { id: 'daily_dungeon', title: '每日副本', desc: '完成 1 次副本。', target: 1, reward: { gold: 1800, researchPoints: 1, materials: { heroReformInscription: 1 } } },
  { id: 'daily_salvage', title: '整理背包', desc: '分解 3 件未穿戴装备。', target: 3, reward: { gold: 900, researchPoints: 1, materials: { dust: 15 } } },
];

const WEEKLY_GOALS = [
  { id: 'weekly_bosses', title: '周常首领讨伐', desc: '本周击败 10 次 Boss。', target: 10, reward: { gold: 15000, researchPoints: 5, materials: { bossSoul: 3 } } },
  { id: 'weekly_dungeons', title: '周常副本训练', desc: '本周完成 8 次副本。', target: 8, reward: { gold: 12000, researchPoints: 5, materials: { ancientCore: 2 } } },
  { id: 'weekly_equipment', title: '周常装备整理', desc: '本周获得或分解 20 件装备。', target: 20, reward: { gold: 10000, researchPoints: 4, materials: { ancientHeroShard: 8 } } },
];

const MATERIAL_TARGETS = [
  { id: 'heroReformInscription', target: 6, reason: '装备进阶和改良常用。' },
  { id: 'ancientHeroShard', target: 20, reason: '古代英雄装备线升级材料。' },
  { id: 'ore', target: 80, reason: '精炼和基础装备成长材料。' },
  { id: 'bossSoul', target: 5, reason: 'Boss 相关强化和后续研究材料。' },
  { id: 'ancientCore', target: 3, reason: '进阶装备线的关键材料。' },
];

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function localDateKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function weekKey(date = new Date()) {
  const value = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  value.setHours(0, 0, 0, 0);
  const day = value.getDay() || 7;
  value.setDate(value.getDate() + 4 - day);
  const yearStart = new Date(value.getFullYear(), 0, 1);
  const week = Math.ceil((((value - yearStart) / 86400000) + 1) / 7);
  return `${value.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

function buildGoalState(definitions, saved = {}) {
  return Object.fromEntries(definitions.map((goal) => {
    const entry = saved[goal.id] || {};
    return [goal.id, {
      progress: Math.max(0, Math.min(goal.target, Math.floor(finite(entry.progress)))),
      claimed: Boolean(entry.claimed),
    }];
  }));
}

function goalRows(definitions, stateRows = {}) {
  return definitions.map((goal) => {
    const entry = stateRows[goal.id] || { progress: 0, claimed: false };
    return {
      ...goal,
      progress: Math.max(0, Math.min(goal.target, finite(entry.progress))),
      claimed: Boolean(entry.claimed),
      completed: finite(entry.progress) >= goal.target,
    };
  });
}

export function defaultAdventureHandbookState(date = localDateKey(), currentWeekKey = weekKey()) {
  return {
    version: 1,
    date,
    weekKey: currentWeekKey,
    researchPoints: 0,
    daily: buildGoalState(DAILY_GOALS),
    weekly: buildGoalState(WEEKLY_GOALS),
  };
}

export function normalizeAdventureHandbookState(input = {}, date = localDateKey(), currentWeekKey = weekKey()) {
  const base = defaultAdventureHandbookState(date, currentWeekKey);
  if (!input || typeof input !== 'object') return base;
  const sameDate = input.date === date;
  const sameWeek = input.weekKey === currentWeekKey;
  return {
    version: 1,
    date,
    weekKey: currentWeekKey,
    researchPoints: Math.max(0, Math.floor(finite(input.researchPoints))),
    daily: sameDate ? buildGoalState(DAILY_GOALS, input.daily) : base.daily,
    weekly: sameWeek ? buildGoalState(WEEKLY_GOALS, input.weekly) : base.weekly,
  };
}

export function recordAdventureHandbookProgress(state, goalId, amount = 1) {
  if (!state) return false;
  state.adventureHandbook = normalizeAdventureHandbookState(state.adventureHandbook);
  const delta = Math.max(0, Math.floor(finite(amount)));
  if (!goalId || delta <= 0) return false;
  let changed = false;
  for (const [bucket, definitions] of [['daily', DAILY_GOALS], ['weekly', WEEKLY_GOALS]]) {
    const goal = definitions.find((entry) => entry.id === goalId);
    if (!goal) continue;
    const entry = state.adventureHandbook[bucket][goalId];
    if (!entry || entry.claimed) continue;
    entry.progress = Math.min(goal.target, finite(entry.progress) + delta);
    changed = true;
  }
  return changed;
}

export function claimAdventureHandbookGoal(state, goalId, context = handbookCtx) {
  if (!state) return { ok: false, reason: 'state_missing' };
  state.adventureHandbook = normalizeAdventureHandbookState(state.adventureHandbook);
  for (const [bucket, definitions] of [['daily', DAILY_GOALS], ['weekly', WEEKLY_GOALS]]) {
    const goal = definitions.find((entry) => entry.id === goalId);
    if (!goal) continue;
    const entry = state.adventureHandbook[bucket][goalId];
    if (!entry) return { ok: false, reason: 'goal_missing' };
    if (entry.claimed) return { ok: false, reason: 'claimed' };
    if (finite(entry.progress) < goal.target) return { ok: false, reason: 'incomplete' };
    entry.claimed = true;
    const reward = goal.reward || {};
    state.adventureHandbook.researchPoints += Math.max(0, Math.floor(finite(reward.researchPoints)));
    context.grantReward?.({ gold: reward.gold || 0, materials: reward.materials || {} });
    context.addLog?.(`冒险手册完成：${goal.title}。`);
    context.save?.();
    context.renderAll?.();
    return { ok: true, goal, bucket };
  }
  return { ok: false, reason: 'goal_missing' };
}

function materialRecommendations(state = {}, context = handbookCtx) {
  return MATERIAL_TARGETS
    .map((entry) => {
      const owned = finite(state.materials?.[entry.id]);
      const sources = context.getMaterialDropSources?.(entry.id) || [];
      return {
        ...entry,
        name: context.getMaterialName?.(entry.id) || entry.id,
        owned,
        missing: Math.max(0, entry.target - owned),
        sources,
      };
    })
    .filter((entry) => entry.missing > 0)
    .slice(0, 4);
}

function defaultMapRecommendation(state = {}, context = handbookCtx) {
  const maps = context.getMaps?.() || [];
  const current = maps[Math.max(0, Math.min(maps.length - 1, Math.floor(finite(state.currentMap))))] || maps[0] || null;
  return {
    mapId: current?.id || '',
    name: current?.name || '当前地图',
    reason: context.isBossChallengeReady?.() ? 'Boss 进度已满，优先挑战首领。' : '继续推进当前地图 Boss 进度和材料积累。',
    difficulty: state.currentDifficulty || 'normal',
  };
}

function defaultEquipmentTarget(state = {}, context = handbookCtx) {
  const equippedIds = Object.values(state.equipped || {}).filter(Boolean);
  if (!equippedIds.length) return { title: '补齐装备', desc: '优先装备武器、防具、鞋子和饰品。' };
  const inventory = state.inventory || [];
  const equippedItems = equippedIds.map((id) => inventory.find((item) => item.id === id)).filter(Boolean);
  const upgrade = equippedItems.map((item) => context.getNextEquipmentUpgrade?.(item)).find(Boolean);
  if (upgrade) return { title: '推进装备阶级', desc: '已有装备可以继续进阶，优先提升主武器或最低阶部位。' };
  return { title: '提升装备质量', desc: '寻找更高阶或更适合当前职业的装备词条。' };
}

export function buildAdventureHandbookModel(state = handbookCtx.getState?.() || {}, context = handbookCtx) {
  const normalized = normalizeAdventureHandbookState(state.adventureHandbook);
  state.adventureHandbook = normalized;
  const stats = context.computeStats?.() || {};
  return {
    researchPoints: normalized.researchPoints,
    power: finite(stats.power),
    dailyGoals: goalRows(DAILY_GOALS, normalized.daily),
    weeklyGoals: goalRows(WEEKLY_GOALS, normalized.weekly),
    mapRecommendation: context.getMapRecommendation?.(state, stats) || defaultMapRecommendation(state, context),
    materials: materialRecommendations(state, context),
    dungeons: (context.getDungeonCards?.(state) || []).filter((entry) => finite(entry.remaining) > 0).slice(0, 3),
    equipmentTarget: context.getEquipmentTarget?.(state, stats) || defaultEquipmentTarget(state, context),
  };
}

export function configureAdventureHandbookContext(context = {}) {
  handbookCtx = context || {};
}

export function installAdventureHandbookRuntime(context = {}) {
  configureAdventureHandbookContext(context);
  const runtime = Object.freeze({
    defaultAdventureHandbookState,
    normalizeAdventureHandbookState,
    recordAdventureHandbookProgress,
    claimAdventureHandbookGoal,
    buildAdventureHandbookModel,
  });
  window.RuneFrontierAdventureHandbookRuntime = runtime;
  return runtime;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: PASS for the new Adventure Handbook behavior tests.

- [ ] **Step 5: Commit**

```bash
git add src/systems/adventureHandbook.js scripts/test.mjs
git commit -m "feat(handbook): add adventure handbook model"
```

---

### Task 2: Classic State, Progress Hooks, and Reward Claims

**Files:**
- Modify: `game.js`
- Modify: `src/main.js`
- Modify: `src/systems/combat/settlement.js`
- Modify: `src/systems/dungeons.js`
- Modify: `src/systems/equipment/dismantle.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing static assertions for runtime wiring and event hooks**

Add to `scripts/test.mjs`:

```js
assert.match(game, /adventureHandbook:\s*defaultAdventureHandbookState\(\)/, 'Default state should include adventure handbook.');
assert.match(game, /adventureHandbook:\s*normalizeAdventureHandbookState\(saved\.adventureHandbook\s*\|\|\s*base\.adventureHandbook\)/, 'Saved state merge should normalize adventure handbook.');
assert.match(game, /state\.adventureHandbook\s*=\s*normalizeAdventureHandbookState\(state\.adventureHandbook\)/, 'Sanitize should keep adventure handbook normalized.');
assert.match(game, /function\s+recordAdventureHandbookProgress\s*\(/, 'Classic runtime should expose handbook progress helper.');
assert.match(game, /function\s+claimAdventureHandbookGoal\s*\(/, 'Classic runtime should expose handbook claim helper.');
assert.match(settlementSource, /recordAdventureHandbookProgress\?\.\('daily_kills'/, 'Combat settlement should feed handbook kill progress.');
assert.match(settlementSource, /recordAdventureHandbookProgress\?\.\('weekly_bosses'/, 'Combat settlement should feed handbook weekly boss progress.');
assert.match(dungeonSystemSource, /recordAdventureHandbookProgress\?\.\('daily_dungeon'/, 'Dungeon completion should feed handbook daily dungeon progress.');
assert.match(dungeonSystemSource, /recordAdventureHandbookProgress\?\.\('weekly_dungeons'/, 'Dungeon completion should feed handbook weekly dungeon progress.');
assert.match(dismantleSource, /recordAdventureHandbookProgress\?\.\('daily_salvage'/, 'Manual salvage should feed handbook salvage progress.');
assert.match(dismantleSource, /recordAdventureHandbookProgress\?\.\('weekly_equipment'/, 'Salvage should feed handbook weekly equipment progress.');
assert.match(main, /installAdventureHandbookRuntime/, 'Main should install Adventure Handbook runtime.');
assert.match(game, /RuneFrontierLegacyAdventureHandbookContext/, 'Classic runtime should expose Adventure Handbook legacy context.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL on missing Adventure Handbook state and hooks.

- [ ] **Step 3: Wire state defaults, merge, sanitize, helper functions, and legacy context in `game.js`**

Add near the dungeon default helpers:

```js
function defaultAdventureHandbookState() {
  const runtime = window.RuneFrontierAdventureHandbookRuntime;
  if (runtime && typeof runtime.defaultAdventureHandbookState === "function") return runtime.defaultAdventureHandbookState();
  return { version: 1, date: todayKey(), weekKey: adventureWeekKey(), researchPoints: 0, daily: {}, weekly: {} };
}

function adventureWeekKey(date = new Date()) {
  const value = new Date(date.getTime ? date.getTime() : date);
  value.setHours(0, 0, 0, 0);
  const day = value.getDay() || 7;
  value.setDate(value.getDate() + 4 - day);
  const yearStart = new Date(value.getFullYear(), 0, 1);
  const week = Math.ceil((((value - yearStart) / 86400000) + 1) / 7);
  return `${value.getFullYear()}-W${String(week).padStart(2, "0")}`;
}

function normalizeAdventureHandbookState(handbook = {}) {
  const runtime = window.RuneFrontierAdventureHandbookRuntime;
  if (runtime && typeof runtime.normalizeAdventureHandbookState === "function") return runtime.normalizeAdventureHandbookState(handbook);
  return {
    ...defaultAdventureHandbookState(),
    ...(handbook && typeof handbook === "object" ? handbook : {}),
    researchPoints: Math.max(0, Math.floor(Number(handbook?.researchPoints || 0))),
  };
}

function recordAdventureHandbookProgress(goalId, amount = 1) {
  const runtime = window.RuneFrontierAdventureHandbookRuntime;
  if (runtime && typeof runtime.recordAdventureHandbookProgress === "function") {
    runtime.recordAdventureHandbookProgress(state, goalId, amount);
  }
}

function claimAdventureHandbookGoal(goalId) {
  const runtime = window.RuneFrontierAdventureHandbookRuntime;
  if (!runtime || typeof runtime.claimAdventureHandbookGoal !== "function") return showToast("冒险手册尚未就绪");
  const result = runtime.claimAdventureHandbookGoal(state, goalId, {
    grantReward: grantGenericReward,
    addLog,
    save,
    renderAll,
  });
  if (!result.ok) showToast(result.reason === "incomplete" ? "目标尚未完成" : result.reason === "claimed" ? "该奖励已领取" : "目标数据异常");
}
```

In `createDefaultState()`, add:

```js
adventureHandbook: defaultAdventureHandbookState(),
```

In `mergeState(base, saved)`, add:

```js
adventureHandbook: normalizeAdventureHandbookState(saved.adventureHandbook || base.adventureHandbook),
```

In `sanitizeProgression()`, add:

```js
state.adventureHandbook = normalizeAdventureHandbookState(state.adventureHandbook);
```

Add the legacy context near other runtime contexts:

```js
window.RuneFrontierLegacyAdventureHandbookContext = () => Object.freeze({
  getState() { return state; },
  computeStats,
  getMaps() { return maps; },
  currentMap,
  isBossChallengeReady,
  getMaterialName(materialId) { return materialNames[materialId] || materialId; },
  getMaterialDropSources(materialId) {
    return Object.entries(materialDropTables || {}).flatMap(([mapId, rows]) => {
      const map = maps.find((entry) => entry.id === mapId);
      return (rows || [])
        .filter((row) => row.materialId === materialId)
        .map(() => ({ mapId, mapName: map?.name || mapId, difficulty: "normal" }));
    }).slice(0, 3);
  },
  getDungeonCards(stateArg = state) { return window.RuneFrontierDungeonRuntime?.getDungeonCards?.(stateArg) || []; },
  getNextEquipmentUpgrade,
  grantReward: grantGenericReward,
  addLog,
  save,
  renderAll,
});
```

Add exports in `Object.assign(window, { ... })`:

```js
defaultAdventureHandbookState,
normalizeAdventureHandbookState,
recordAdventureHandbookProgress,
claimAdventureHandbookGoal,
```

- [ ] **Step 4: Install system runtime in `src/main.js`**

Import:

```js
import { installAdventureHandbookRuntime } from './systems/adventureHandbook.js';
```

Install after dungeon runtime:

```js
const adventureHandbookContext = typeof window.RuneFrontierLegacyAdventureHandbookContext === 'function'
  ? window.RuneFrontierLegacyAdventureHandbookContext()
  : {};
installAdventureHandbookRuntime(adventureHandbookContext);
document.documentElement.dataset.runeModuleStatus = 'adventure-handbook-system-ready';
```

- [ ] **Step 5: Feed handbook progress from combat, dungeons, and salvage**

In `src/systems/combat/settlement.js`, after existing daily progress:

```js
context.recordAdventureHandbookProgress?.('daily_kills', 1);
if (isBoss) {
  context.recordAdventureHandbookProgress?.('daily_boss', 1);
  context.recordAdventureHandbookProgress?.('weekly_bosses', 1);
}
```

In `src/systems/dungeons.js`, after `entry.bestClearPower` update:

```js
context.recordAdventureHandbookProgress?.('daily_dungeon', 1);
context.recordAdventureHandbookProgress?.('weekly_dungeons', 1);
```

In `src/systems/equipment/dismantle.js`, after successful manual salvage:

```js
ctx.recordAdventureHandbookProgress?.('daily_salvage', 1);
ctx.recordAdventureHandbookProgress?.('weekly_equipment', 1);
```

In `salvageAllUnequipped`, after totals are applied:

```js
ctx.recordAdventureHandbookProgress?.('daily_salvage', targets.length);
ctx.recordAdventureHandbookProgress?.('weekly_equipment', targets.length);
```

In the classic drops context in `game.js`, add:

```js
recordAdventureHandbookProgress,
```

In the classic equipment runtime context in `game.js`, add:

```js
recordAdventureHandbookProgress,
```

- [ ] **Step 6: Wire claim click handler**

In `bindEvents()` task page or global click area, add:

```js
document.addEventListener("click", (event) => {
  const claimButton = event.target.closest("[data-claim-handbook-goal]");
  if (!claimButton) return;
  claimAdventureHandbookGoal(claimButton.dataset.claimHandbookGoal);
});
```

If there is already a broad document click handler near other delegated buttons, add this case there instead of adding a second listener.

- [ ] **Step 7: Run tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add game.js src/main.js src/systems/combat/settlement.js src/systems/dungeons.js src/systems/equipment/dismantle.js scripts/test.mjs
git commit -m "feat(handbook): wire state and progress"
```

---

### Task 3: Handbook Page Renderer and Adventure Page Cleanup

**Files:**
- Create: `src/ui/adventureHandbookPage.js`
- Modify: `src/ui/adventurePage.js`
- Modify: `game.js`
- Modify: `src/main.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for renderer, removed advice, and classic fallback**

Add near source reads:

```js
const adventureHandbookPageSource = read('src/ui/adventureHandbookPage.js');
```

Add assertions:

```js
assert.match(adventureHandbookPageSource, /export function renderAdventureHandbookPage/, 'Adventure handbook page renderer should exist.');
assert.match(adventureHandbookPageSource, /data-claim-handbook-goal/, 'Adventure handbook goals should expose claim buttons.');
assert.match(adventureHandbookPageSource, /handbook-section/, 'Adventure handbook renderer should use handbook sections.');
assert.doesNotMatch(adventurePageSource, /renderAdvicePanel/, 'Adventure page should no longer render current advice.');
assert.doesNotMatch(game, /renderAdvicePanel\(stats\)[\s\S]{0,120}<div class="party-item">/, 'Classic adventure fallback should no longer render advice before party status.');
assert.match(game, /function\s+renderAdventureHandbook\s*\(/, 'Classic runtime should expose adventure handbook render function.');
assert.match(main, /installAdventureHandbookRenderRuntime/, 'Main should install Adventure Handbook render runtime.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL on missing page renderer and remaining advice.

- [ ] **Step 3: Create handbook page renderer**

Create `src/ui/adventureHandbookPage.js`:

```js
let handbookRenderCtx = {};

function esc(value) {
  return (handbookRenderCtx.escapeHtml || window.escapeHtml || String)(value);
}

function fmtn(value) {
  return (handbookRenderCtx.formatNumber || window.formatNumber || String)(Math.max(0, Number(value || 0)));
}

function progressPct(goal) {
  const target = Math.max(1, Number(goal.target || 1));
  return Math.min(100, (Number(goal.progress || 0) / target) * 100);
}

function rewardText(reward = {}) {
  const parts = [];
  if (reward.gold) parts.push(`金币 ${fmtn(reward.gold)}`);
  if (reward.researchPoints) parts.push(`冒险研究点 ${fmtn(reward.researchPoints)}`);
  Object.entries(reward.materials || {}).forEach(([id, amount]) => {
    parts.push(`${esc(handbookRenderCtx.getMaterialName?.(id) || id)} ×${fmtn(amount)}`);
  });
  return parts.join(' · ') || '无';
}

function renderGoalCard(goal) {
  const done = goal.completed || Number(goal.progress || 0) >= Number(goal.target || 1);
  return `<article class="handbook-goal-card ${done ? 'is-complete' : ''} ${goal.claimed ? 'is-claimed' : ''}">
    <div>
      <strong>${esc(goal.title)}</strong>
      <p>${esc(goal.desc || '')}</p>
      <div class="quest-progress handbook-progress"><span style="width:${progressPct(goal)}%"></span></div>
      <small>${fmtn(Math.min(Number(goal.progress || 0), Number(goal.target || 1)))} / ${fmtn(goal.target)}</small>
      <small>${rewardText(goal.reward)}</small>
    </div>
    <button class="quest-claim-btn" data-claim-handbook-goal="${esc(goal.id)}" type="button" ${!done || goal.claimed ? 'disabled' : ''}>${goal.claimed ? '已领取' : done ? '领取' : '进行中'}</button>
  </article>`;
}

function renderMaterialRow(row) {
  const source = (row.sources || [])[0];
  const sourceText = source ? `${source.mapName || source.mapId} · ${source.difficulty || 'normal'}` : '来源待发现';
  return `<div class="handbook-rec-row">
    <div><strong>${esc(row.name)}</strong><small>${esc(row.reason || '')}</small></div>
    <span>缺 ${fmtn(row.missing)} · ${esc(sourceText)}</span>
  </div>`;
}

function renderDungeonRow(row) {
  return `<div class="handbook-rec-row">
    <div><strong>${esc(row.name)}</strong><small>推荐战力 ${fmtn(row.recommendedPower)}</small></div>
    <span>剩余 ${fmtn(row.remaining)}</span>
  </div>`;
}

export function configureAdventureHandbookRenderContext(ctx = {}) {
  handbookRenderCtx = ctx || {};
}

export function renderAdventureHandbookPage() {
  const els = handbookRenderCtx.getEls?.() || window.els || {};
  if (!els.adventureHandbookPage) return;
  const state = handbookRenderCtx.getState?.() || window.state || {};
  const model = handbookRenderCtx.getAdventureHandbookModel?.(state) || {};
  const map = model.mapRecommendation || {};
  const equipment = model.equipmentTarget || {};
  els.adventureHandbookPage.innerHTML = `<section class="handbook-page">
    <div class="panel-heading">
      <div><p class="eyebrow">冒险手册</p><h2>今日路线</h2></div>
      <strong class="handbook-points">研究点 ${fmtn(model.researchPoints)}</strong>
    </div>
    <section class="handbook-section handbook-focus">
      <article><span>推荐地图</span><strong>${esc(map.name || '当前地图')}</strong><p>${esc(map.reason || '继续积累当前阶段资源。')}</p></article>
      <article><span>装备目标</span><strong>${esc(equipment.title || '提升装备')}</strong><p>${esc(equipment.desc || '寻找更适合当前阶段的装备。')}</p></article>
    </section>
    <section class="handbook-section"><h3>推荐材料</h3><div class="handbook-rec-list">${(model.materials || []).map(renderMaterialRow).join('') || '<p class="quest-desc">当前没有明显材料缺口。</p>'}</div></section>
    <section class="handbook-section"><h3>推荐副本</h3><div class="handbook-rec-list">${(model.dungeons || []).map(renderDungeonRow).join('') || '<p class="quest-desc">今日副本次数已用完。</p>'}</div></section>
    <section class="handbook-section"><h3>今日目标</h3><div class="handbook-goal-grid">${(model.dailyGoals || []).map(renderGoalCard).join('')}</div></section>
    <section class="handbook-section"><h3>周常目标</h3><div class="handbook-goal-grid">${(model.weeklyGoals || []).map(renderGoalCard).join('')}</div></section>
  </section>`;
}

export function installAdventureHandbookRenderRuntime(context = {}) {
  configureAdventureHandbookRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderAdventureHandbookPage })
    : { renderAdventureHandbookPage };
  return window.RuneFrontierRenderRuntime;
}
```

- [ ] **Step 4: Remove advice from modular adventure page**

In `src/ui/adventurePage.js`, remove:

```js
const advice = adventureCtx.renderAdvicePanel?.(stats) || '';
```

Remove `${advice}` from `els.partyList.innerHTML`.

- [ ] **Step 5: Remove advice from classic fallback adventure page**

In `game.js`, remove `${renderAdvicePanel(stats)}` from `renderPartyList()`:

```js
els.partyList.innerHTML = `
  <div class="party-item">
    <span class="party-name">主角 · ${currentJob().name}</span>
```

Keep `renderAdvicePanel`, `getCurrentGoal`, `getPlayerWeakness`, and `getRecommendedActions` functions for the handbook model and tests. Do not delete them in this task.

- [ ] **Step 6: Add classic render bridge**

In `game.js` near `renderDungeons()`:

```js
function renderAdventureHandbook() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderAdventureHandbookPage === "function") return runtime.renderAdventureHandbookPage();
}
```

In `renderActivePage()`:

```js
case "handbook":
  renderAdventureHandbook();
  break;
```

Add `renderAdventureHandbook` to `Object.assign(window, { ... })`.

- [ ] **Step 7: Install renderer in `src/main.js`**

Import:

```js
import { installAdventureHandbookRenderRuntime } from './ui/adventureHandbookPage.js';
```

Remove `renderAdvicePanel: window.renderAdvicePanel,` from the `installAdventureRenderRuntime` context.

Install after dungeon render runtime:

```js
installAdventureHandbookRenderRuntime({
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
  getMaterialName: (id) => (window.materialNames || {})[id] || id,
  getAdventureHandbookModel(state) {
    return window.RuneFrontierAdventureHandbookRuntime?.buildAdventureHandbookModel?.(state, window.RuneFrontierLegacyAdventureHandbookContext?.()) || {};
  },
});
document.documentElement.dataset.runeModuleStatus = 'adventure-handbook-render-ready';
```

- [ ] **Step 8: Run tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add src/ui/adventureHandbookPage.js src/ui/adventurePage.js game.js src/main.js scripts/test.mjs
git commit -m "feat(handbook): render adventure handbook page"
```

---

### Task 4: Navigation, DOM Target, Styles, and Cache Keys

**Files:**
- Modify: `index.html`
- Modify: `game.js`
- Modify: `styles.css`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for nav, DOM target, element cache, styles, and cache keys**

Add to `scripts/test.mjs`:

```js
assert.match(html, /data-page="handbook"[^>]*>冒险手册<\/button>/, 'Navigation should include Adventure Handbook.');
assert.match(html, /data-view="handbook"/, 'HTML should include Adventure Handbook page view.');
assert.match(html, /id="adventureHandbookPage"/, 'Adventure Handbook page should expose a render target.');
assert.match(game, /"adventureHandbookPage"/, 'Classic element cache should include Adventure Handbook page target.');
assert.match(game, /case "handbook":/, 'renderActivePage should handle Adventure Handbook page.');
assert.match(styles, /\.handbook-page/, 'Styles should include Adventure Handbook page layout.');
assert.match(styles, /\.handbook-goal-card/, 'Styles should include Adventure Handbook goal cards.');
assert.match(html, /styles\.css\?v=20260531-handbook-v1/, 'Handbook CSS should use a fresh cache-busting version.');
assert.match(html, /game\.js\?v=20260531-handbook-v1/, 'Handbook classic runtime should use a fresh cache-busting version.');
assert.match(html, /src="\.\/src\/main\.js\?v=20260531-handbook-v1"/, 'Handbook module runtime should use a fresh cache-busting version.');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL on missing handbook nav/page/styles/cache keys.

- [ ] **Step 3: Add navigation and page target in `index.html`**

Add desktop growth nav button before tasks:

```html
<button data-page="handbook" type="button">冒险手册</button>
```

Add mobile more-grid button near maps/dungeons:

```html
<button data-page="handbook" type="button">冒险手册</button>
```

Add page view near tasks or dungeons:

```html
<section class="page-view" data-view="handbook">
  <div id="adventureHandbookPage"></div>
</section>
```

Refresh cache keys at the bottom/head:

```html
<link rel="stylesheet" href="styles.css?v=20260531-handbook-v1" />
<script src="game.js?v=20260531-handbook-v1"></script>
<script type="module" src="./src/main.js?v=20260531-handbook-v1" onerror="document.documentElement.dataset.runeModuleStatus='failed'"></script>
```

- [ ] **Step 4: Cache element id in `game.js`**

In `cacheElements()` id list, add:

```js
"adventureHandbookPage",
```

- [ ] **Step 5: Add handbook styles**

Append to `styles.css`:

```css
.handbook-page {
  display: grid;
  gap: 14px;
}

.handbook-points {
  white-space: nowrap;
  color: var(--accent-strong);
}

.handbook-section {
  background: rgba(255, 248, 226, 0.72);
  border: 1px solid rgba(129, 92, 41, 0.22);
  border-radius: 8px;
  padding: 12px;
}

.handbook-section h3 {
  margin: 0 0 10px;
  font-size: 16px;
}

.handbook-focus {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 10px;
}

.handbook-focus article {
  border: 1px solid rgba(129, 92, 41, 0.18);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.42);
}

.handbook-focus span,
.handbook-rec-row small,
.handbook-goal-card small {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}

.handbook-focus strong {
  display: block;
  margin: 3px 0;
}

.handbook-rec-list,
.handbook-goal-grid {
  display: grid;
  gap: 8px;
}

.handbook-rec-row,
.handbook-goal-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(129, 92, 41, 0.16);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.48);
}

.handbook-rec-row > div,
.handbook-goal-card > div {
  min-width: 0;
}

.handbook-rec-row strong,
.handbook-goal-card strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.handbook-goal-card.is-complete {
  border-color: rgba(80, 128, 62, 0.36);
}

.handbook-goal-card.is-claimed {
  opacity: 0.72;
}

.handbook-progress {
  margin: 7px 0 4px;
}

@media (max-width: 640px) {
  .handbook-rec-row,
  .handbook-goal-card {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 6: Run tests and syntax check**

Run:

```bash
npm test
npm run check
node --check game.js
node --check src/main.js
```

Expected:

- `npm test`: PASS
- `npm run check`: PASS
- both `node --check` commands exit 0

- [ ] **Step 7: Commit**

```bash
git add index.html game.js styles.css scripts/test.mjs
git commit -m "feat(handbook): add page shell and styles"
```

---

### Task 5: Browser Smoke, Cleanup, and Final Review

**Files:**
- No planned source changes unless verification finds a bug.

- [ ] **Step 1: Start or reuse local server**

Run:

```bash
npm start
```

Expected: local app available on the configured localhost port.

- [ ] **Step 2: Browser smoke test Adventure page**

Open the local app in the in-app browser.

Verify:

- Adventure page does not show “当前建议”.
- Adventure page does not show “推荐评分”.
- Adventure page does not show “当前短板”.
- Adventure page does not show “推荐提升”.
- Adventure page still shows Boss progress.
- Adventure page still shows Skill DPS panel.
- Adventure page still shows dungeon entry.

- [ ] **Step 3: Browser smoke test Handbook page**

Click `冒险手册`.

Verify visible sections:

- `今日路线`
- `推荐地图`
- `装备目标`
- `推荐材料`
- `推荐副本`
- `今日目标`
- `周常目标`
- `研究点`

- [ ] **Step 4: Browser smoke test claim behavior**

Use the console only if a normal play path would take too long. If using console, set one goal progress to its target through the installed runtime/state, then render.

Expected:

- Completed handbook goal claim button becomes enabled.
- Clicking claim increases research points.
- Claimed goal becomes disabled.
- Page does not navigate away or throw console errors.

- [ ] **Step 5: Run final verification**

Run:

```bash
npm test
npm run check
node --check game.js
node --check server.js
node --check src/main.js
node --check src/systems/adventureHandbook.js
node --check src/ui/adventureHandbookPage.js
```

Expected: all commands pass. The existing Node module-type warning is acceptable if tests exit 0.

- [ ] **Step 6: Request final code review**

Dispatch one reviewer with:

```text
Review Adventure Handbook V1 from the commit before Task 1 through HEAD.

Requirements:
- Adventure/home page no longer displays current advice, recommended score, weakness, or recommended upgrades.
- Adventure/home page still keeps combat, Boss progress, Skill DPS, dungeon entry, and reward feedback.
- Dedicated Adventure Handbook page shows today route, growth gaps/recommendations, material/dungeon/equipment targets, daily goals, weekly goals, and research points.
- Daily and weekly handbook state normalizes across day/week changes.
- Handbook progress is fed by kills, Boss kills, dungeon completion, and equipment salvage.
- Claiming a handbook goal grants configured rewards and research points without direct power bonuses.
- Tests and browser smoke pass.

Report Critical / Important / Minor, then ready-to-merge status.
```

- [ ] **Step 7: Fix review findings**

If the reviewer reports Critical or Important findings, fix them before final completion. Add or adjust tests for every fix.

- [ ] **Step 8: Commit final fixes if any**

If fixes were needed:

```bash
git add <changed files>
git commit -m "fix(handbook): address review findings"
```

- [ ] **Step 9: Completion handoff**

Report:

- Files changed.
- Verification commands run.
- Browser smoke result.
- Review result.
- Whether the branch is ready for merge/push/deploy.

---

## Acceptance Criteria

- Adventure page no longer renders current advice, recommendation score, current weakness, or recommended upgrade text.
- Adventure page still renders combat, Boss progress, Skill DPS, dungeon entry, and recent reward feedback.
- Adventure Handbook page is reachable from navigation.
- Adventure Handbook page shows today goals, weekly goals, map recommendation, material recommendations, dungeon recommendations, equipment target, and research points.
- Adventure research points are stored and awarded only through handbook claims.
- Research points do not directly affect combat stats.
- Daily handbook progress resets on date change.
- Weekly handbook progress resets on week change.
- Kills, Boss kills, dungeon completion, and salvage feed handbook progress.
- `npm test`, `npm run check`, and `node --check` pass.

## Self-Review Notes

- Spec coverage: P0 only. Mining, crafting, equipment crafting, map mastery, dungeon affixes, Build links, rankings, and social are intentionally excluded.
- File boundaries: system logic in `src/systems/adventureHandbook.js`; rendering in `src/ui/adventureHandbookPage.js`; `game.js` only bridges state/events/page routing.
- No homepage advice remains in modular or classic adventure rendering.
- Research points are stored and displayed, but no stat or combat code consumes them.
