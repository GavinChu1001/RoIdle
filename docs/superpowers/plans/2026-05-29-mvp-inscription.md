# MVP Inscription Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the MVP铭刻 long-term progression system with foreground, monster-kill, and offline inscription experience.

**Architecture:** Add a focused `src/systems/mvpInscription/` module for all pure progression rules. Wire it into existing state normalization, combat settlement, offline rewards, stat calculation, character UI, and offline loot display through the same context-based runtime pattern already used by combat/offline systems.

**Tech Stack:** Vanilla JavaScript ES modules, existing `game.js` legacy runtime bridge, `scripts/test.mjs`, `npm test`, `npm run check`.

---

## Scope Check

This plan implements one cohesive subsystem: MVP铭刻 progression. It touches several integration points, but they all support one user-visible feature and can ship together.

The plan intentionally does not add:

- 铭刻技能树
- New art assets
- Paid acceleration
- New daily tasks
- A new offline system

## File Structure

Create:

- `src/systems/mvpInscription/mvpInscriptionData.js`  
  Static stage names, curve constants, monster experience constants, and stage bonuses.

- `src/systems/mvpInscription/mvpInscriptionSystem.js`  
  Pure functions: normalize state, calculate requirements, add experience with breakthrough blocking, calculate foreground/monster/offline experience, calculate stat bonuses, and build UI summaries.

Modify:

- `scripts/test.mjs`  
  Add unit and integration-style tests for the pure module, offline rewards, loot normalization, combat kill wiring, and UI/source safety checks.

- `game.js`  
  Add default state field, save normalization, legacy bridge functions, foreground tick call, stat bonus merge, offline reward normalization/merge/rendering, and runtime context methods.

- `src/systems/combat/settlement.js`  
  Call the MVP铭刻 kill reward hook after kill and Boss first-clear status are known.

- `src/systems/offline.js`  
  Add `mvpInscriptionExp` to reward calculation, pending checks, and claim handling.

- `src/systems/drops/lootModel.js`  
  Normalize and merge `mvpInscriptionExp`.

- `src/ui/offlineLoot.js`  
  Show MVP铭刻 experience in offline/recent loot summaries.

- `src/ui/characterPage.js`  
  Show the MVP铭刻 card on the character page.

---

### Task 1: Pure MVP铭刻 Module

**Files:**

- Create: `src/systems/mvpInscription/mvpInscriptionData.js`
- Create: `src/systems/mvpInscription/mvpInscriptionSystem.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests for the pure module**

Add this block to `scripts/test.mjs` after the existing loot model tests and before offline runtime tests:

```javascript
const mvpDataSource = read('src/systems/mvpInscription/mvpInscriptionData.js');
const mvpSystemSource = read('src/systems/mvpInscription/mvpInscriptionSystem.js');
const mvpDataModuleUrl = `data:text/javascript;base64,${Buffer.from(mvpDataSource).toString('base64')}`;
const mvpSystemStandaloneSource = mvpSystemSource.replace(/from\s+['"]\.\/mvpInscriptionData\.js['"]/g, `from '${mvpDataModuleUrl}'`);
const mvp = await importSource(mvpSystemStandaloneSource);

const defaultMark = mvp.defaultMvpInscription(() => 1234);
assert.equal(defaultMark.level, 1, 'New MVP inscription state should start at level 1.');
assert.equal(defaultMark.exp, 0, 'New MVP inscription state should start with no current exp.');
assert.deepEqual(defaultMark.unlockedMarks, ['kingPoring'], 'New MVP inscription state should unlock King Poring first.');
assert.equal(defaultMark.lastOnlineTickAt, 1234, 'New MVP inscription state should keep the provided timestamp.');

const normalizedMark = mvp.normalizeMvpInscription({
  level: 999,
  exp: -5,
  totalExp: -10,
  breakthroughLevel: 999,
  unlockedMarks: [],
  bossFirstExpClaims: null,
}, () => 2000);
assert.equal(normalizedMark.level, 100, 'MVP inscription level must clamp to 100.');
assert.equal(normalizedMark.exp, 0, 'MVP inscription exp must not be negative.');
assert.equal(normalizedMark.totalExp, 0, 'MVP inscription total exp must not be negative.');
assert.equal(normalizedMark.breakthroughLevel, 90, 'MVP breakthrough progress must not exceed the level band.');
assert.deepEqual(normalizedMark.unlockedMarks, ['kingPoring'], 'MVP inscription should repair missing unlocked marks.');

assert.equal(mvp.getMvpInscriptionStage(1).id, 'kingPoring', 'Lv1 should be King Poring inscription.');
assert.equal(mvp.getMvpInscriptionStage(84).id, 'darkLord', 'Lv84 should be Dark Lord inscription.');
assert.equal(mvp.getMvpInscriptionStage(100).id, 'baphomet', 'Lv100 should be Baphomet inscription.');
assert.equal(mvp.getMvpInscriptionLevelRequirement(1), 120, 'Lv1 inscription requirement changed.');

const blockedAtBreakthrough = mvp.normalizeMvpInscription({ level: 10, exp: 0, breakthroughLevel: 0 }, () => 0);
const blockedGain = mvp.addMvpInscriptionExp(blockedAtBreakthrough, 999999);
assert.equal(blockedGain.blocked, true, 'MVP inscription must block at unbroken level 10.');
assert.equal(blockedAtBreakthrough.level, 10, 'Blocked MVP inscription must not cross level 10.');

const breakthroughReady = mvp.normalizeMvpInscription({ level: 10, exp: 0, breakthroughLevel: 10 }, () => 0);
const unblockedGain = mvp.addMvpInscriptionExp(breakthroughReady, 999999);
assert.equal(unblockedGain.blocked, false, 'Completed breakthrough should allow MVP inscription leveling.');
assert.ok(breakthroughReady.level > 10, 'Completed breakthrough should allow crossing level 10.');

assert.equal(
  mvp.calculateMvpInscriptionOnlinePerMinute({ mapIndex: 2, difficulty: 'hard', rebirths: 3 }),
  13.752,
  'Foreground MVP inscription rate should use map, difficulty, and rebirth multipliers.',
);

assert.equal(
  mvp.isMvpInscriptionMonsterEffective({ heroLevel: 80, monsterLevel: 55, currentMapIndex: 4, bestMapIndex: 4, isBoss: false, firstBossClear: false }),
  true,
  'Monster exactly 25 levels lower should still give MVP inscription exp.',
);
assert.equal(
  mvp.isMvpInscriptionMonsterEffective({ heroLevel: 81, monsterLevel: 55, currentMapIndex: 4, bestMapIndex: 4, isBoss: false, firstBossClear: false }),
  false,
  'Monster more than 25 levels lower should not give MVP inscription exp.',
);
assert.equal(
  mvp.isMvpInscriptionMonsterEffective({ heroLevel: 80, monsterLevel: 5, currentMapIndex: 1, bestMapIndex: 4, isBoss: false, firstBossClear: false }),
  false,
  'Normal monsters more than two maps behind best map should not give MVP inscription exp.',
);
assert.equal(
  mvp.isMvpInscriptionMonsterEffective({ heroLevel: 99, monsterLevel: 1, currentMapIndex: 0, bestMapIndex: 9, isBoss: true, firstBossClear: true }),
  true,
  'Boss first clear should always be eligible for one MVP inscription reward.',
);

assert.equal(
  mvp.calculateMvpInscriptionMonsterExp({
    monster: { level: 40, type: 'normal' },
    heroLevel: 50,
    currentMapIndex: 3,
    bestMapIndex: 3,
    difficulty: 'normal',
    isBoss: false,
    isMutated: false,
    firstBossClear: false,
  }),
  0.218,
  'Normal monster MVP inscription exp should include map multiplier.',
);
assert.equal(
  mvp.calculateMvpInscriptionMonsterExp({
    monster: { level: 1, type: 'normal' },
    heroLevel: 60,
    currentMapIndex: 0,
    bestMapIndex: 5,
    difficulty: 'normal',
    isBoss: false,
    isMutated: false,
    firstBossClear: false,
  }),
  0,
  'Invalid low-level monsters should grant no MVP inscription exp.',
);

const darkLordBonuses = mvp.getMvpInscriptionBonuses({ level: 84, breakthroughLevel: 80 });
assert.ok(darkLordBonuses.hpPct > 0, 'MVP inscription should grant per-level HP.');
assert.ok(darkLordBonuses.skillDamageBonus > 0 || darkLordBonuses.matkPct > 0, 'Dark Lord breakthrough should grant offensive magic bonuses.');
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: FAIL with a missing file or import error for `src/systems/mvpInscription/mvpInscriptionData.js`.

- [ ] **Step 3: Create `mvpInscriptionData.js`**

Create `src/systems/mvpInscription/mvpInscriptionData.js`:

```javascript
export const MVP_INSCRIPTION_MAX_LEVEL = 100;
export const MVP_INSCRIPTION_STAGE_SIZE = 10;
export const MVP_INSCRIPTION_BASE_EXP_PER_MINUTE = 10;
export const MVP_INSCRIPTION_LOW_LEVEL_GAP = 25;
export const MVP_INSCRIPTION_LOW_MAP_GAP = 2;

export const MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS = Object.freeze({
  normal: 1,
  hard: 1.2,
  abyss: 1.45,
});

export const MVP_INSCRIPTION_MONSTER_EXP = Object.freeze({
  normal: 0.2,
  mutated: 0.45,
  elite: 0.6,
  boss: 8,
  abyssBoss: 16,
  firstBossClear: 30,
});

export const MVP_INSCRIPTION_STAGES = Object.freeze([
  { id: 'kingPoring', name: '波利王铭刻', minLevel: 1, maxLevel: 10, bonus: { baseExpBonus: 0.02, jobExpBonus: 0.02 } },
  { id: 'goldenThiefBug', name: '黄金盗虫铭刻', minLevel: 11, maxLevel: 20, bonus: { goldBonus: 0.02 } },
  { id: 'moonlightFlower', name: '月夜猫铭刻', minLevel: 21, maxLevel: 30, bonus: { attackSpeedPct: 0.01, combatPaceBonus: 0.01 } },
  { id: 'drake', name: '海盗之王铭刻', minLevel: 31, maxLevel: 40, bonus: { bossDamageBonus: 0.02 } },
  { id: 'phreeoni', name: '皮里恩铭刻', minLevel: 41, maxLevel: 50, bonus: { hitRate: 0.02, critRatePct: 0.01 } },
  { id: 'orcHero', name: '兽人英雄铭刻', minLevel: 51, maxLevel: 60, bonus: { hpPct: 0.02, statusResist: 0.03 } },
  { id: 'turtleGeneral', name: '龟将军铭刻', minLevel: 61, maxLevel: 70, bonus: { physicalFinalDamageBonus: 0.01 } },
  { id: 'doppelganger', name: '多佩雷根铭刻', minLevel: 71, maxLevel: 80, bonus: { normalAttackDamageBonus: 0.02, attackSpeedPct: 0.01 } },
  { id: 'darkLord', name: '黑暗领主铭刻', minLevel: 81, maxLevel: 90, bonus: { skillDamageBonus: 0.02, matkPct: 0.01 } },
  { id: 'baphomet', name: '巴风特铭刻', minLevel: 91, maxLevel: 100, bonus: { finalDamageBonus: 0.015 } },
]);
```

- [ ] **Step 4: Create `mvpInscriptionSystem.js`**

Create `src/systems/mvpInscription/mvpInscriptionSystem.js`:

```javascript
import {
  MVP_INSCRIPTION_BASE_EXP_PER_MINUTE,
  MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS,
  MVP_INSCRIPTION_LOW_LEVEL_GAP,
  MVP_INSCRIPTION_LOW_MAP_GAP,
  MVP_INSCRIPTION_MAX_LEVEL,
  MVP_INSCRIPTION_MONSTER_EXP,
  MVP_INSCRIPTION_STAGE_SIZE,
  MVP_INSCRIPTION_STAGES,
} from './mvpInscriptionData.js';

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.floor(finite(value))));
}

function roundExp(value) {
  return Math.round(finite(value) * 1000) / 1000;
}

export function defaultMvpInscription(now = Date.now) {
  return {
    level: 1,
    exp: 0,
    totalExp: 0,
    breakthroughLevel: 0,
    unlockedMarks: ['kingPoring'],
    bossFirstExpClaims: {},
    lastOnlineTickAt: typeof now === 'function' ? now() : Date.now(),
  };
}

export function getCompletedBreakthroughForLevel(level) {
  const band = Math.floor((clamp(level, 1, MVP_INSCRIPTION_MAX_LEVEL) - 1) / MVP_INSCRIPTION_STAGE_SIZE) * MVP_INSCRIPTION_STAGE_SIZE;
  return Math.max(0, Math.min(90, band));
}

export function normalizeMvpInscription(input = {}, now = Date.now) {
  const base = defaultMvpInscription(now);
  const level = clamp(input.level ?? base.level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  const maxBreakthrough = getCompletedBreakthroughForLevel(level);
  const unlockedMarks = Array.isArray(input.unlockedMarks) && input.unlockedMarks.length
    ? input.unlockedMarks.filter(Boolean)
    : ['kingPoring'];
  return {
    ...base,
    ...input,
    level,
    exp: Math.max(0, finite(input.exp)),
    totalExp: Math.max(0, finite(input.totalExp)),
    breakthroughLevel: Math.max(0, Math.min(maxBreakthrough, Math.floor(finite(input.breakthroughLevel)))),
    unlockedMarks,
    bossFirstExpClaims: input.bossFirstExpClaims && typeof input.bossFirstExpClaims === 'object' ? input.bossFirstExpClaims : {},
    lastOnlineTickAt: Math.max(0, finite(input.lastOnlineTickAt || base.lastOnlineTickAt)),
  };
}

export function getMvpInscriptionStage(level) {
  const safeLevel = clamp(level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  return MVP_INSCRIPTION_STAGES.find((stage) => safeLevel >= stage.minLevel && safeLevel <= stage.maxLevel) || MVP_INSCRIPTION_STAGES[0];
}

export function getMvpInscriptionLevelRequirement(level) {
  const safeLevel = clamp(level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  if (safeLevel >= MVP_INSCRIPTION_MAX_LEVEL) return 0;
  const stageIndex = Math.floor((safeLevel - 1) / MVP_INSCRIPTION_STAGE_SIZE);
  const stageMultiplier = 1 + stageIndex * 0.22;
  return Math.round(120 * Math.pow(safeLevel, 1.45) * stageMultiplier);
}

export function isMvpInscriptionAtBreakthrough(inscription = {}) {
  const level = clamp(inscription.level, 1, MVP_INSCRIPTION_MAX_LEVEL);
  if (level >= MVP_INSCRIPTION_MAX_LEVEL) return false;
  return level % MVP_INSCRIPTION_STAGE_SIZE === 0 && finite(inscription.breakthroughLevel) < level;
}

export function addMvpInscriptionExp(inscription, amount) {
  const state = normalizeMvpInscription(inscription);
  Object.assign(inscription, state);
  const gain = Math.max(0, finite(amount));
  if (!gain || inscription.level >= MVP_INSCRIPTION_MAX_LEVEL) return { gained: 0, levelsGained: 0, blocked: false, reachedMax: inscription.level >= MVP_INSCRIPTION_MAX_LEVEL };
  if (isMvpInscriptionAtBreakthrough(inscription)) return { gained: 0, levelsGained: 0, blocked: true, reachedMax: false };

  inscription.exp += gain;
  inscription.totalExp += gain;
  let levelsGained = 0;
  let blocked = false;

  while (inscription.level < MVP_INSCRIPTION_MAX_LEVEL) {
    const need = getMvpInscriptionLevelRequirement(inscription.level);
    if (!need || inscription.exp < need) break;
    if (isMvpInscriptionAtBreakthrough(inscription)) {
      inscription.exp = Math.min(inscription.exp, need);
      blocked = true;
      break;
    }
    inscription.exp -= need;
    inscription.level += 1;
    levelsGained += 1;
    if (isMvpInscriptionAtBreakthrough(inscription)) {
      inscription.exp = Math.min(inscription.exp, getMvpInscriptionLevelRequirement(inscription.level));
      blocked = true;
      break;
    }
  }

  if (inscription.level >= MVP_INSCRIPTION_MAX_LEVEL) inscription.exp = 0;
  return { gained: gain, levelsGained, blocked, reachedMax: inscription.level >= MVP_INSCRIPTION_MAX_LEVEL };
}

export function getMvpInscriptionMapMultiplier(mapIndex = 0) {
  return 1 + Math.max(0, Math.floor(finite(mapIndex))) * 0.03;
}

export function getMvpInscriptionDifficultyMultiplier(difficulty = 'normal') {
  return MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS[difficulty] || MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS.normal;
}

export function getMvpInscriptionRebirthMultiplier(rebirths = 0) {
  return 1 + Math.min(Math.max(0, finite(rebirths)) * 0.03, 0.30);
}

export function calculateMvpInscriptionOnlinePerMinute({ mapIndex = 0, difficulty = 'normal', rebirths = 0 } = {}) {
  return roundExp(
    MVP_INSCRIPTION_BASE_EXP_PER_MINUTE *
    getMvpInscriptionMapMultiplier(mapIndex) *
    getMvpInscriptionDifficultyMultiplier(difficulty) *
    getMvpInscriptionRebirthMultiplier(rebirths)
  );
}

export function isMvpInscriptionMonsterEffective({
  heroLevel = 1,
  monsterLevel = 1,
  currentMapIndex = 0,
  bestMapIndex = 0,
  isBoss = false,
  firstBossClear = false,
} = {}) {
  if (firstBossClear) return true;
  if (finite(heroLevel) - finite(monsterLevel) > MVP_INSCRIPTION_LOW_LEVEL_GAP) return false;
  if (!isBoss && finite(bestMapIndex) - finite(currentMapIndex) >= MVP_INSCRIPTION_LOW_MAP_GAP) return false;
  return true;
}

export function calculateMvpInscriptionMonsterExp({
  monster = {},
  heroLevel = 1,
  currentMapIndex = 0,
  bestMapIndex = 0,
  difficulty = 'normal',
  isBoss = false,
  isMutated = false,
  firstBossClear = false,
} = {}) {
  const monsterLevel = finite(monster.level || monster.baseLevel || monster.maxLevel);
  if (!isMvpInscriptionMonsterEffective({ heroLevel, monsterLevel, currentMapIndex, bestMapIndex, isBoss, firstBossClear })) return 0;
  let base = MVP_INSCRIPTION_MONSTER_EXP.normal;
  if (firstBossClear) base = MVP_INSCRIPTION_MONSTER_EXP.firstBossClear;
  else if (isBoss && difficulty === 'abyss') base = MVP_INSCRIPTION_MONSTER_EXP.abyssBoss;
  else if (isBoss) base = MVP_INSCRIPTION_MONSTER_EXP.boss;
  else if (isMutated) base = MVP_INSCRIPTION_MONSTER_EXP.mutated;
  else if (monster.type === 'elite') base = MVP_INSCRIPTION_MONSTER_EXP.elite;
  return roundExp(base * getMvpInscriptionMapMultiplier(currentMapIndex) * getMvpInscriptionDifficultyMultiplier(difficulty));
}

export function getMvpInscriptionBonuses(inscription = {}) {
  const normalized = normalizeMvpInscription(inscription);
  const level = normalized.level;
  const bonuses = {
    hpPct: level * 0.0025,
    atkPct: level * 0.0012,
    matkPct: level * 0.0012,
    defPct: level * 0.0008,
  };
  MVP_INSCRIPTION_STAGES.forEach((stage) => {
    if (normalized.breakthroughLevel >= stage.maxLevel) {
      Object.entries(stage.bonus || {}).forEach(([key, value]) => {
        bonuses[key] = (bonuses[key] || 0) + finite(value);
      });
    }
  });
  return bonuses;
}

export function getMvpInscriptionView(inscription = {}, context = {}) {
  const normalized = normalizeMvpInscription(inscription);
  const stage = getMvpInscriptionStage(normalized.level);
  const nextRequirement = getMvpInscriptionLevelRequirement(normalized.level);
  const progress = nextRequirement > 0 ? Math.min(1, normalized.exp / nextRequirement) : 1;
  const nextStage = MVP_INSCRIPTION_STAGES.find((entry) => entry.minLevel > stage.minLevel) || null;
  return {
    ...normalized,
    stage,
    stageName: stage.name,
    nextStage,
    nextRequirement,
    progress,
    onlinePerMinute: calculateMvpInscriptionOnlinePerMinute(context),
    atBreakthrough: isMvpInscriptionAtBreakthrough(normalized),
    bonuses: getMvpInscriptionBonuses(normalized),
  };
}
```

- [ ] **Step 5: Run tests to verify Task 1 passes**

Run:

```bash
npm test
```

Expected: PASS for the new MVP铭刻 pure-module tests. Other pre-existing tests should remain unchanged.

- [ ] **Step 6: Commit Task 1**

```bash
git add scripts/test.mjs src/systems/mvpInscription/mvpInscriptionData.js src/systems/mvpInscription/mvpInscriptionSystem.js
git commit -m "feat: add MVP inscription rules"
```

---

### Task 2: Offline Reward and Loot Plumbing

**Files:**

- Modify: `scripts/test.mjs`
- Modify: `src/systems/offline.js`
- Modify: `src/systems/drops/lootModel.js`
- Modify: `src/ui/offlineLoot.js`
- Modify: `game.js`

- [ ] **Step 1: Write failing tests for offline and loot reward plumbing**

Extend the existing loot model test in `scripts/test.mjs`:

```javascript
const normalizedLootWithInscription = lootModel.normalizeLootRewards({ mvpInscriptionExp: 12.5 }, lootModelContext);
assert.equal(normalizedLootWithInscription.mvpInscriptionExp, 12.5, 'Loot normalization must preserve MVP inscription exp.');
const mergedLootWithInscription = lootModel.mergeLootRewards([
  { mvpInscriptionExp: 2 },
  { mvpInscriptionExp: 3.5 },
], lootModelContext);
assert.equal(mergedLootWithInscription.mvpInscriptionExp, 5.5, 'Merged loot rewards must sum MVP inscription exp.');
```

Extend the existing `backgroundOfflineContext` in `scripts/test.mjs`:

```javascript
  calculateMvpInscriptionOnlinePerMinute: () => 10,
  calculateMvpInscriptionMonsterExp: ({ monster }) => monster.mutation ? 0.45 : 0.2,
```

Then add after `settledBackgroundReward` assertions:

```javascript
assert.equal(settledBackgroundReward.rewards.mvpInscriptionExp, 17, 'Offline rewards should include base and kill MVP inscription exp.');
```

The expected `17` comes from 30 seconds of base offline inscription at 10/minute (`5`) plus 60 offline kills at `0.2` (`12`), after the existing offline killCount formula with `getOfflineEfficiency() === 1`.

Extend `offlineState.offlinePending` in the claim test:

```javascript
    mvpInscriptionExp: 9,
```

Add a grant spy to `claimContext`:

```javascript
let offlineMvpInscriptionGranted = 0;
```

and in `claimContext`:

```javascript
  gainMvpInscriptionExp: (amount) => { offlineMvpInscriptionGranted += amount; },
```

Then assert after the first claim:

```javascript
assert.equal(offlineMvpInscriptionGranted, 9, 'Offline claim should grant MVP inscription exp.');
```

and after the pending equipment retry:

```javascript
assert.equal(offlineMvpInscriptionGranted, 9, 'Pending equipment retries must not duplicate MVP inscription exp.');
```

Add source checks:

```javascript
assert.match(offlineSource, /mvpInscriptionExp/, 'Offline runtime must carry MVP inscription exp.');
assert.match(game, /mvpInscriptionExp/, 'Legacy offline rewards must carry MVP inscription exp.');
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: FAIL because `mvpInscriptionExp` is not normalized, merged, calculated, or claimed yet.

- [ ] **Step 3: Update loot normalization and merging**

In `src/systems/drops/lootModel.js`, add `mvpInscriptionExp` to the object returned by `normalizeLootRewards`:

```javascript
    mvpInscriptionExp: finite(base.mvpInscriptionExp ?? source.mvpInscriptionExp),
```

In `mergeLootRewards`, add:

```javascript
    merged.mvpInscriptionExp += rewards.mvpInscriptionExp;
```

In `game.js`, update `defaultOfflineRewards()`:

```javascript
    mvpInscriptionExp: 0,
```

In `game.js` `normalizeOfflineRewards`, add:

```javascript
    mvpInscriptionExp: Number(source.mvpInscriptionExp || 0),
```

In `game.js` `mergeOfflineRewards`, add:

```javascript
    mvpInscriptionExp: (a.mvpInscriptionExp || 0) + (b.mvpInscriptionExp || 0),
```

- [ ] **Step 4: Update offline reward calculation and claim**

In `src/systems/offline.js`, inside `calculateOfflineRewards`, compute the effective offline efficiency once:

```javascript
  const effectiveOfflineEfficiency = Math.min(1, offlineEfficiency + vipEff + (stats.offlineEfficiencyBonus || 0));
  let killCount = Math.min(offlineMaxKills, Math.floor(onlineKills * effectiveOfflineEfficiency));
```

Then add base MVP inscription exp after `rewards.killCount = killCount` and before `if (killCount <= 0) return rewards;`:

```javascript
  const inscriptionRate = finite(context.calculateMvpInscriptionOnlinePerMinute?.({
    mapIndex,
    difficulty: state.currentDifficulty || 'normal',
    rebirths: state.hero?.rebirths || 0,
  }));
  rewards.mvpInscriptionExp += Math.round((inscriptionRate * (seconds / 60) * effectiveOfflineEfficiency) * 1000) / 1000;
```

Inside the kill loop, add:

```javascript
    rewards.mvpInscriptionExp += finite(context.calculateMvpInscriptionMonsterExp?.({
      monster,
      heroLevel: state.hero?.baseLevel || 1,
      currentMapIndex: mapIndex,
      bestMapIndex: state.bestMap || mapIndex,
      difficulty: state.currentDifficulty || 'normal',
      isBoss: false,
      isMutated: Boolean(monster.mutation),
      firstBossClear: false,
    }));
```

After the kill loop, normalize:

```javascript
  rewards.mvpInscriptionExp = Math.round(finite(rewards.mvpInscriptionExp) * 1000) / 1000;
```

In `hasPendingOfflineRewards`, include:

```javascript
    finite(pending.mvpInscriptionExp) > 0 ||
```

In `claimOfflineRewards`, after `context.gainExp?.(...)`, add:

```javascript
  context.gainMvpInscriptionExp?.(finite(pending.mvpInscriptionExp), { source: 'offline' });
```

- [ ] **Step 5: Update offline loot UI summaries**

In `src/ui/offlineLoot.js`, include `r.mvpInscriptionExp > 0` in `hasAny`:

```javascript
  const hasAny = r.seconds > 0 || r.gold > 0 || r.baseExp > 0 || r.jobExp > 0 || r.mvpInscriptionExp > 0 ||
```

Add a summary card in `renderLootSummaryCard`:

```javascript
      ${renderLootSummaryMini('铭刻经验', r.mvpInscriptionExp, ctx)}
```

Add an overview card in `renderOfflineOverview`:

```javascript
    ${renderOfflineOverviewCard('铭刻经验', rewards?.mvpInscriptionExp, 'inscription', ctx)}
```

Add a strip entry in `renderOfflineGoldExpSection`:

```javascript
      <div class="offline-gain offline-gain-inscription"><span>铭刻经验</span><strong class="offline-number">+${fmtn(r.mvpInscriptionExp, ctx)}</strong></div>
```

In `game.js`, mirror the same visible summaries in the legacy offline render helpers:

```javascript
${renderLootSummaryMini("铭刻经验", rewards.mvpInscriptionExp)}
${renderOfflineOverviewCard("铭刻经验", rewards.mvpInscriptionExp, "inscription")}
<div class="offline-gain offline-gain-inscription"><span>铭刻经验</span><strong class="offline-number">+${formatNumber(rewards.mvpInscriptionExp)}</strong></div>
```

- [ ] **Step 6: Run tests to verify Task 2 passes**

Run:

```bash
npm test
```

Expected: PASS for loot and offline MVP inscription assertions.

- [ ] **Step 7: Commit Task 2**

```bash
git add scripts/test.mjs src/systems/offline.js src/systems/drops/lootModel.js src/ui/offlineLoot.js game.js
git commit -m "feat: include MVP inscription in offline rewards"
```

---

### Task 3: Combat Kill and Foreground Tick Integration

**Files:**

- Modify: `scripts/test.mjs`
- Modify: `src/systems/combat/settlement.js`
- Modify: `game.js`

- [ ] **Step 1: Write failing tests for online kill hook**

In the regular kill test context in `scripts/test.mjs`, add:

```javascript
let killInscriptionPayload = null;
```

In `baseCombatContext`, add:

```javascript
  grantMvpInscriptionKillExp: (payload) => { killInscriptionPayload = payload; },
```

After `regularKill`, assert:

```javascript
assert.equal(killInscriptionPayload.monster.id, 'poring', 'Regular kills should pass the monster to MVP inscription rewards.');
assert.equal(killInscriptionPayload.isBoss, false, 'Regular kills should be marked as non-Boss for MVP inscription rewards.');
assert.equal(killInscriptionPayload.firstBossClear, false, 'Regular kills should not be marked as first Boss clears.');
```

In the Boss test, reset and assert:

```javascript
killInscriptionPayload = null;
```

After `firstBoss`:

```javascript
assert.equal(killInscriptionPayload.isBoss, true, 'Boss kills should be marked for MVP inscription rewards.');
assert.equal(killInscriptionPayload.firstBossClear, true, 'First Boss clear should be passed to MVP inscription rewards.');
```

Add source checks for foreground tick:

```javascript
assert.match(game, /function\s+tickMvpInscription\s*\(/, 'Game runtime must expose a foreground MVP inscription tick.');
assert.match(game, /tickMvpInscription\(elapsedDt\)/, 'Main loop must advance MVP inscription from real foreground elapsed time.');
assert.match(game, /gainMvpInscriptionExp/, 'Game runtime must expose MVP inscription exp gain.');
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: FAIL because settlement does not call `grantMvpInscriptionKillExp` and `game.js` has no tick function.

- [ ] **Step 3: Wire combat settlement**

In `src/systems/combat/settlement.js`, after the Boss/normal branch that sets `bossResult`, add:

```javascript
  context.grantMvpInscriptionKillExp?.({
    monster,
    map,
    difficulty,
    isBoss,
    isMutated: Boolean(monster.mutation),
    isElite: Boolean(monster.type === 'elite' || monster.mutation),
    firstBossClear: Boolean(bossResult.firstBossClear),
  });
```

- [ ] **Step 4: Add MVP inscription state and foreground tick in `game.js`**

Import the runtime functions near other runtime imports or expose them through script loading consistent with the current module pattern:

```javascript
const MvpInscriptionRuntime = window.RuneFrontierMvpInscriptionRuntime;
```

Add this field in `createDefaultState()`:

```javascript
    mvpInscription: defaultMvpInscriptionState(),
```

Add helper functions near other progression helpers:

```javascript
function defaultMvpInscriptionState() {
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  return runtime?.defaultMvpInscription ? runtime.defaultMvpInscription(() => Date.now()) : {
    level: 1,
    exp: 0,
    totalExp: 0,
    breakthroughLevel: 0,
    unlockedMarks: ["kingPoring"],
    bossFirstExpClaims: {},
    lastOnlineTickAt: Date.now(),
  };
}

function normalizeMvpInscriptionState(value) {
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  return runtime?.normalizeMvpInscription ? runtime.normalizeMvpInscription(value, () => Date.now()) : { ...defaultMvpInscriptionState(), ...(value || {}) };
}

function gainMvpInscriptionExp(amount, options = {}) {
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  state.mvpInscription = normalizeMvpInscriptionState(state.mvpInscription);
  const before = state.mvpInscription.level;
  const result = runtime?.addMvpInscriptionExp
    ? runtime.addMvpInscriptionExp(state.mvpInscription, amount)
    : { gained: 0, levelsGained: 0, blocked: false };
  if (result.levelsGained > 0) addLog(`MVP铭刻提升到 ${getMvpInscriptionView().stageName} Lv.${state.mvpInscription.level}。`);
  if (result.blocked && before === state.mvpInscription.level) addLog("MVP铭刻已达到突破节点，请完成突破。");
  return result;
}

function getMvpInscriptionView() {
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  const mapIndex = state.currentMap || 0;
  return runtime?.getMvpInscriptionView
    ? runtime.getMvpInscriptionView(state.mvpInscription, { mapIndex, difficulty: state.currentDifficulty, rebirths: state.hero?.rebirths || 0 })
    : { stageName: "波利王铭刻", level: 1, exp: 0, nextRequirement: 120, progress: 0, bonuses: {} };
}

function tickMvpInscription(elapsedSeconds) {
  if (backgroundStartedAt || document.hidden || state.paused || (state.hero?.currentHp ?? 1) <= 0) return;
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  if (!runtime?.calculateMvpInscriptionOnlinePerMinute) return;
  const cappedSeconds = Math.min(60, Math.max(0, Number(elapsedSeconds) || 0));
  if (cappedSeconds <= 0) return;
  const perMinute = runtime.calculateMvpInscriptionOnlinePerMinute({
    mapIndex: state.currentMap || 0,
    difficulty: state.currentDifficulty || "normal",
    rebirths: state.hero?.rebirths || 0,
  });
  gainMvpInscriptionExp(perMinute * cappedSeconds / 60, { source: "foreground" });
}

function grantMvpInscriptionKillExp(payload = {}) {
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  if (!runtime?.calculateMvpInscriptionMonsterExp) return { gained: 0 };
  const amount = runtime.calculateMvpInscriptionMonsterExp({
    ...payload,
    heroLevel: state.hero?.baseLevel || 1,
    currentMapIndex: state.currentMap || 0,
    bestMapIndex: state.bestMap || state.currentMap || 0,
  });
  return gainMvpInscriptionExp(amount, { source: payload.isBoss ? "boss" : "monster" });
}
```

In `sanitizeProgression()`, normalize:

```javascript
  state.mvpInscription = normalizeMvpInscriptionState(state.mvpInscription);
```

In `loop(now)`, after `updateOnlinePlaytime(dt);`, add:

```javascript
  tickMvpInscription(elapsedDt);
```

In `RuneFrontierLegacyCombatContext`, add:

```javascript
  grantMvpInscriptionKillExp,
```

In `RuneFrontierLegacyOfflineContext`, add:

```javascript
  gainMvpInscriptionExp,
  calculateMvpInscriptionOnlinePerMinute(payload) {
    return window.RuneFrontierMvpInscriptionRuntime?.calculateMvpInscriptionOnlinePerMinute?.(payload) || 0;
  },
  calculateMvpInscriptionMonsterExp(payload) {
    return window.RuneFrontierMvpInscriptionRuntime?.calculateMvpInscriptionMonsterExp?.(payload) || 0;
  },
```

- [ ] **Step 5: Install browser runtime for the new module**

Follow the existing pattern used by other modules. Add a module export installer to `src/systems/mvpInscription/mvpInscriptionSystem.js`:

```javascript
export function installMvpInscriptionRuntime(target = globalThis) {
  target.RuneFrontierMvpInscriptionRuntime = {
    defaultMvpInscription,
    normalizeMvpInscription,
    getMvpInscriptionStage,
    getMvpInscriptionLevelRequirement,
    addMvpInscriptionExp,
    calculateMvpInscriptionOnlinePerMinute,
    calculateMvpInscriptionMonsterExp,
    getMvpInscriptionBonuses,
    getMvpInscriptionView,
  };
  return target.RuneFrontierMvpInscriptionRuntime;
}
```

Then import and call it from `src/main.js`, beside the other system runtime installers:

```javascript
import { installMvpInscriptionRuntime } from './systems/mvpInscription/mvpInscriptionSystem.js';

installMvpInscriptionRuntime(window);
```

- [ ] **Step 6: Run tests to verify Task 3 passes**

Run:

```bash
npm test
```

Expected: PASS for settlement hook and source checks.

- [ ] **Step 7: Commit Task 3**

```bash
git add scripts/test.mjs src/systems/combat/settlement.js src/systems/mvpInscription/mvpInscriptionSystem.js src/main.js game.js
git commit -m "feat: wire MVP inscription progression"
```

---

### Task 4: Stat Bonuses and Character Page UI

**Files:**

- Modify: `scripts/test.mjs`
- Modify: `game.js`
- Modify: `src/ui/characterPage.js`

- [ ] **Step 1: Write failing tests for stats and UI source**

Add source assertions to `scripts/test.mjs`:

```javascript
assert.match(game, /getMvpInscriptionBonuses/, 'Game stats must merge MVP inscription bonuses.');
assert.match(characterPageSource, /MVP铭刻/, 'Character page must render the MVP inscription card.');
assert.match(characterPageSource, /当前地图.*铭刻/, 'Character page should show whether the current map grants inscription exp.');
assert.match(characterPageSource, /下一突破/, 'Character page should show MVP inscription breakthrough guidance.');
```

If `characterPageSource` is not already loaded in the test script, add:

```javascript
const characterPageSource = read('src/ui/characterPage.js');
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: FAIL because stats and UI do not mention MVP铭刻 yet.

- [ ] **Step 3: Merge MVP inscription bonuses into stats**

In `game.js` `computeStats()` or the helper where final stat buckets are assembled, add:

```javascript
  const mvpInscriptionBonuses = window.RuneFrontierMvpInscriptionRuntime?.getMvpInscriptionBonuses?.(state.mvpInscription) || {};
```

Then add these fields to the existing stat aggregation:

```javascript
    hpPct: (existingHpPct || 0) + (mvpInscriptionBonuses.hpPct || 0),
    atkPct: (existingAtkPct || 0) + (mvpInscriptionBonuses.atkPct || 0),
    matkPct: (existingMatkPct || 0) + (mvpInscriptionBonuses.matkPct || 0),
    defPct: (existingDefPct || 0) + (mvpInscriptionBonuses.defPct || 0),
    goldBonus: (existingGoldBonus || 0) + (mvpInscriptionBonuses.goldBonus || 0),
    baseExpBonus: (existingBaseExpBonus || 0) + (mvpInscriptionBonuses.baseExpBonus || 0),
    jobExpBonus: (existingJobExpBonus || 0) + (mvpInscriptionBonuses.jobExpBonus || 0),
    bossDamageBonus: (existingBossDamageBonus || 0) + (mvpInscriptionBonuses.bossDamageBonus || 0),
    finalDamageBonus: (existingFinalDamageBonus || 0) + (mvpInscriptionBonuses.finalDamageBonus || 0),
```

Use the actual local variable names inside `computeStats`. Do not create parallel fields that are ignored by final combat math.

- [ ] **Step 4: Pass MVP inscription view data to character render context**

In the character render context in `game.js`, add:

```javascript
  getMvpInscriptionView,
  canGainMvpInscriptionOnCurrentMap() {
    const runtime = window.RuneFrontierMvpInscriptionRuntime;
    const map = currentMap();
    const range = getMapLevelRange(map);
    return runtime?.isMvpInscriptionMonsterEffective?.({
      heroLevel: state.hero?.baseLevel || 1,
      monsterLevel: range.maxLevel || map.maxLevel || 1,
      currentMapIndex: state.currentMap || 0,
      bestMapIndex: state.bestMap || state.currentMap || 0,
      isBoss: false,
      firstBossClear: false,
    }) ?? true;
  },
```

If `isMvpInscriptionMonsterEffective` is not exported by the runtime in Task 3, add it to `installMvpInscriptionRuntime`.

- [ ] **Step 5: Render the MVP inscription card**

In `src/ui/characterPage.js`, inside `renderHeroes`, compute:

```javascript
  const mvpInscription = ctx.getMvpInscriptionView?.() || {};
  const inscriptionProgress = Math.round(F(mvpInscription.progress) * 1000) / 10;
  const inscriptionMapEffective = ctx.canGainMvpInscriptionOnCurrentMap?.() !== false;
```

Add a compact section near the growth workbench or rebirth prestige section:

```javascript
    <section class="ro-character-growth">
      <div class="ro-character-section-title">
        <strong>MVP铭刻</strong>
        <span>${esc(mvpInscription.stageName || '波利王铭刻')} Lv.${fmtn(mvpInscription.level || 1)}</span>
      </div>
      <div class="ro-character-job-progress">
        <div class="ro-character-job-meta">
          <span>铭刻经验</span>
          <strong>${fmtn(F(mvpInscription.exp))}/${fmtn(F(mvpInscription.nextRequirement))}</strong>
        </div>
        <div class="meter ro-character-job-meter"><div style="width:${Math.max(0, Math.min(100, inscriptionProgress))}%"></div></div>
      </div>
      <p class="ro-character-growth-note">前台修行 ${fmtn(mvpInscription.onlinePerMinute || 0)} / 分钟 · 当前地图${inscriptionMapEffective ? '可获得' : '过低，不获得'}铭刻经验</p>
      ${mvpInscription.atBreakthrough ? `<button class="ro-wood-button" type="button" data-mvp-inscription-breakthrough>突破到 ${esc(mvpInscription.nextStage?.name || '下一铭刻')}</button>` : ''}
    </section>
```

If the duplicated `ro-character-growth` section creates nested or crowded layout, place this as a sibling section after the existing growth workbench.

- [ ] **Step 6: Add click handler for breakthrough button**

In `game.js` event delegation where character buttons are handled, add:

```javascript
    const inscriptionBreakthroughButton = event.target.closest('[data-mvp-inscription-breakthrough]');
    if (inscriptionBreakthroughButton) {
      breakthroughMvpInscription();
      return;
    }
```

Add a V1 implementation that checks the current node and logs when blocked. Task 5 replaces this with the full requirement checks:

```javascript
function breakthroughMvpInscription() {
  state.mvpInscription = normalizeMvpInscriptionState(state.mvpInscription);
  const level = state.mvpInscription.level || 1;
  if (level % 10 !== 0 || level >= 100) {
    showToast("当前 MVP铭刻不在突破节点");
    return false;
  }
  state.mvpInscription.breakthroughLevel = Math.max(state.mvpInscription.breakthroughLevel || 0, level);
  const view = getMvpInscriptionView();
  if (view.stage?.id && !state.mvpInscription.unlockedMarks.includes(view.stage.id)) state.mvpInscription.unlockedMarks.push(view.stage.id);
  addLog(`MVP铭刻突破完成：${view.stageName}。`);
  showToast("MVP铭刻突破完成");
  renderAll();
  save();
  return true;
}
```

This version unlocks the system path so the UI can be exercised before Task 5 adds material and progress requirements.

- [ ] **Step 7: Run tests to verify Task 4 passes**

Run:

```bash
npm test
```

Expected: PASS for source checks and existing character page tests.

- [ ] **Step 8: Commit Task 4**

```bash
git add scripts/test.mjs src/ui/characterPage.js game.js
git commit -m "feat: show MVP inscription progression"
```

---

### Task 5: Breakthrough Conditions and Final Verification

**Files:**

- Modify: `scripts/test.mjs`
- Modify: `src/systems/mvpInscription/mvpInscriptionData.js`
- Modify: `src/systems/mvpInscription/mvpInscriptionSystem.js`
- Modify: `game.js`

- [ ] **Step 1: Write failing tests for breakthrough condition helpers**

Add this to the MVP module test block in `scripts/test.mjs`:

```javascript
assert.equal(
  mvp.getMvpInscriptionBreakthroughRequirement(10).label,
  'BASE Lv20',
  'Lv10 MVP inscription breakthrough requirement label changed.',
);
assert.equal(
  mvp.canBreakthroughMvpInscription({ level: 10, breakthroughLevel: 0 }, { heroLevel: 19 }).ok,
  false,
  'Lv10 MVP inscription breakthrough should require BASE Lv20.',
);
assert.equal(
  mvp.canBreakthroughMvpInscription({ level: 10, breakthroughLevel: 0 }, { heroLevel: 20 }).ok,
  true,
  'Lv10 MVP inscription breakthrough should pass at BASE Lv20.',
);
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
npm test
```

Expected: FAIL because breakthrough helper functions do not exist.

- [ ] **Step 3: Add breakthrough requirement data**

In `src/systems/mvpInscription/mvpInscriptionData.js`, add:

```javascript
export const MVP_INSCRIPTION_BREAKTHROUGH_REQUIREMENTS = Object.freeze({
  10: { label: 'BASE Lv20', heroLevel: 20 },
  20: { label: '击败森林 Boss', bossKey: 'forest_normal' },
  30: { label: 'BASE Lv70', heroLevel: 70 },
  40: { label: '解锁困难难度', difficultyUnlocked: 'hard' },
  50: { label: '击败兽人首领', bossKey: 'orc_village_normal' },
  60: { label: '击败高阶 Boss', anyBossClear: true },
  70: { label: '击败钟塔 Boss', bossKey: 'clock_normal' },
  80: { label: '击败古城 Boss', bossKey: 'glast_heim_normal' },
  90: { label: '击败高阶 Boss', anyHighTierBossClear: true },
});
```

Use the map IDs already present in `data.js`: `forest`, `orc_village`, `clock`, and `glast_heim`.

- [ ] **Step 4: Add breakthrough helper functions**

In `src/systems/mvpInscription/mvpInscriptionSystem.js`, import the requirement table and add:

```javascript
export function getMvpInscriptionBreakthroughRequirement(level) {
  const node = Math.floor(finite(level) / 10) * 10;
  return MVP_INSCRIPTION_BREAKTHROUGH_REQUIREMENTS[node] || null;
}

export function canBreakthroughMvpInscription(inscription = {}, progress = {}) {
  const normalized = normalizeMvpInscription(inscription);
  if (!isMvpInscriptionAtBreakthrough(normalized)) return { ok: false, reason: '当前不在突破节点' };
  const requirement = getMvpInscriptionBreakthroughRequirement(normalized.level);
  if (!requirement) return { ok: false, reason: '没有可用突破条件' };
  if (requirement.heroLevel && finite(progress.heroLevel) < requirement.heroLevel) return { ok: false, reason: requirement.label };
  if (requirement.bossKey && !progress.bossFirstKills?.[requirement.bossKey]) return { ok: false, reason: requirement.label };
  if (requirement.difficultyUnlocked && !progress.unlockedDifficulties?.[requirement.difficultyUnlocked]) return { ok: false, reason: requirement.label };
  if (requirement.anyBossClear && !Object.keys(progress.bossFirstKills || {}).length) return { ok: false, reason: requirement.label };
  return { ok: true, reason: '', requirement };
}
```

Also export these functions from `installMvpInscriptionRuntime`.

- [ ] **Step 5: Replace minimal breakthrough implementation in `game.js`**

Replace `breakthroughMvpInscription()` with:

```javascript
function getMvpInscriptionProgressContext() {
  const unlockedDifficulties = {};
  Object.values(state.mapDifficultyProgress || {}).forEach((entry) => {
    if (entry?.hard?.unlocked) unlockedDifficulties.hard = true;
    if (entry?.abyss?.unlocked) unlockedDifficulties.abyss = true;
  });
  return {
    heroLevel: state.hero?.baseLevel || 1,
    bossFirstKills: state.vip?.bossFirstKills || {},
    unlockedDifficulties,
  };
}

function breakthroughMvpInscription() {
  state.mvpInscription = normalizeMvpInscriptionState(state.mvpInscription);
  const runtime = window.RuneFrontierMvpInscriptionRuntime;
  const result = runtime?.canBreakthroughMvpInscription?.(state.mvpInscription, getMvpInscriptionProgressContext()) || { ok: false, reason: "MVP铭刻突破条件不可用" };
  if (!result.ok) {
    showToast(`突破条件不足：${result.reason}`);
    return false;
  }
  const level = state.mvpInscription.level;
  state.mvpInscription.breakthroughLevel = Math.max(state.mvpInscription.breakthroughLevel || 0, level);
  const nextView = getMvpInscriptionView();
  if (nextView.nextStage?.id && !state.mvpInscription.unlockedMarks.includes(nextView.nextStage.id)) {
    state.mvpInscription.unlockedMarks.push(nextView.nextStage.id);
  }
  addLog(`MVP铭刻突破完成，新的铭刻气息正在苏醒。`);
  showToast("MVP铭刻突破完成");
  renderAll();
  save();
  return true;
}
```

- [ ] **Step 6: Run the full verification suite**

Run:

```bash
npm test
npm run check
```

Expected:

- `npm test`: PASS
- `npm run check`: PASS

- [ ] **Step 7: Manual browser verification**

Start the app:

```bash
npm start
```

Open the local URL shown by the server. Verify:

- New save shows `波利王铭刻 Lv.1`.
- Waiting in the foreground for 1-2 minutes increases铭刻经验.
- Killing an effective monster increases铭刻经验.
- Going to a low-level map when overleveled shows that monsters do not grant铭刻经验.
- Backgrounding the tab long enough to trigger offline settlement shows铭刻经验 in the offline reward modal.
- At level 10, experience stops until breakthrough.

- [ ] **Step 8: Commit Task 5**

```bash
git add scripts/test.mjs src/systems/mvpInscription/mvpInscriptionData.js src/systems/mvpInscription/mvpInscriptionSystem.js game.js
git commit -m "feat: add MVP inscription breakthroughs"
```

---

## Final Verification

Run:

```bash
npm test
npm run check
git status --short
```

Expected:

- `npm test` passes.
- `npm run check` passes.
- `git status --short` shows only intentional files or is clean.

## Spec Coverage Self-Review

- MVP铭刻 name and boss-themed stages: Task 1.
- Foreground online experience: Task 3.
- Online monster experience: Task 1 and Task 3.
- Offline inscription experience: Task 2.
- Low-level map and monster restrictions: Task 1 and Task 5 verification.
- No per-minute cap: Task 1 uses no cap state and Task 2 removes the previous window fields from the design.
- Breakthrough every 10 levels: Task 1 and Task 5.
- Stat bonuses: Task 4.
- Character UI: Task 4.
- Offline reward modal display: Task 2.
- Save compatibility: Task 1 and Task 3.
- Tests and syntax check: Task 5.
