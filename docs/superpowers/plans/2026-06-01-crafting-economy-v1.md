# 装备打造经济 V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the P1/P2/P3/P5/P7 equipment economy loop: mining and artisan production feed deterministic equipment crafting, crafting mastery unlocks dark-gold/mythic master crafting, drops/salvage/crafting/upgrade feed research and collection, and the UI explains what to craft and why.

**Architecture:** Keep new gameplay logic out of `game.js` where possible. Add focused pure modules under `src/systems/production/`, `src/systems/equipment/`, and `src/systems/collections/`; install them through `src/main.js` using the existing runtime bridge pattern. `game.js` only owns legacy state merge, event delegation, and thin wrapper calls until the monolith is further reduced.

**Tech Stack:** Vanilla JavaScript modules, classic `game.js` bridge, existing `scripts/test.mjs` static and behavior tests, CSS in `styles.css`, browser smoke through the local app.

---

## Scope Check

This plan intentionally includes P1, P2, P3, P5, and P7.

Do not implement:

- P4 Dungeon V2 daily affixes or reward rebuild.
- P6 weekly challenge systems.
- P8 social, ranking, guild, friends, or PvP.
- A full skill-system rewrite.
- Cross-line Build mixtures.

This is large, so execute in batches. Each task below should end with tests and a commit before moving on.

## File Structure

Create:

- `src/systems/production/catalog.js`
  - Production material ids, mining nodes, artisan jobs, crafting mastery level table, blueprint rules, and recipe metadata.
- `src/systems/production/state.js`
  - Default and normalization helpers for mining, artisan, crafting mastery, and known blueprints.
- `src/systems/production/mining.js`
  - Mining claim math and offline/online production settlement.
- `src/systems/production/artisan.js`
  - Artisan processing jobs for equipment embryos, inscriptions, and crafting components.
- `src/systems/production/index.js`
  - Production runtime installer.
- `src/systems/equipment/crafting.js`
  - Equipment crafting and master crafting rules.
- `src/systems/equipment/equipmentResearch.js`
  - Equipment-line research XP, levels, costs, and economic bonuses.
- `src/systems/collections/equipmentCollection.js`
  - Equipment, card, Boss, and map collection records and rewards.
- `src/systems/collections/index.js`
  - Collection runtime installer.
- `src/ui/smithyCraftingPanel.js`
  - Smithy panels for mining, artisan jobs, crafting mastery, normal crafting, and master crafting.
- `src/ui/collectionPage.js`
  - Collection overview for equipment/card/Boss/map progress.

Modify:

- `game.js`
  - Default/merge/sanitize state fields.
  - Thin wrappers for production, crafting, research, collection.
  - Smithy event delegation.
  - Render bridge calls.
  - Progress hooks for drops, salvage, crafting, progression upgrades, Boss kills, and map activity.
- `src/main.js`
  - Install production and collection runtimes.
  - Install smithy crafting and collection render runtimes.
- `src/systems/equipment/index.js`
  - Export and install crafting and research helpers.
- `src/systems/equipment/dismantle.js`
  - Feed salvage into equipment research and collection.
- `src/systems/equipment/progressionUpgrade.js`
  - Feed upgrade into equipment research and collection.
- `src/systems/equipment/itemSynergy.js`
  - Tighten Build V1 around equipment line + refine/enhance threshold + route skill enhancements.
- `src/systems/adventureHandbook.js`
  - Add craftable targets, production suggestions, research/collection hints.
- `src/ui/adventureHandbookPage.js`
  - Render crafting/production recommendations.
- `src/ui/codexPage.js` or `src/ui/collectionPage.js`
  - Use `collectionPage.js` if adding a new page; otherwise mount the collection panel in codex.
- `index.html`
  - Add collection page target if using a new page.
- `styles.css`
  - Production, crafting, mastery, and collection layouts.
- `scripts/test.mjs`
  - Add tests for all new modules and bridges.

---

### Task 1: Production Catalog and State

**Files:**
- Create: `src/systems/production/catalog.js`
- Create: `src/systems/production/state.js`
- Create: `src/systems/production/index.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests for production catalog and state**

Add source reads near other reads:

```js
const productionCatalogSource = read('src/systems/production/catalog.js');
const productionStateSource = read('src/systems/production/state.js');
const productionIndexSource = read('src/systems/production/index.js');
```

Add tests near equipment progression tests:

```js
assert.match(productionCatalogSource, /export const PRODUCTION_MATERIALS/, 'Production catalog should expose production material ids.');
assert.match(productionCatalogSource, /export const CRAFTING_MASTERY_LEVELS/, 'Production catalog should expose crafting mastery levels.');
assert.match(productionCatalogSource, /darkGold/, 'Crafting mastery should include dark-gold unlocks.');
assert.match(productionCatalogSource, /mythic/, 'Crafting mastery should include mythic unlocks.');
assert.match(productionStateSource, /export function defaultProductionState/, 'Production state should expose a default state helper.');
assert.match(productionStateSource, /export function normalizeProductionState/, 'Production state should normalize saves.');
assert.match(productionStateSource, /export function addCraftingExperience/, 'Production state should expose crafting experience gains.');
assert.match(productionIndexSource, /installProductionRuntime/, 'Production runtime should be installable.');
{
  const productionState = await importSource(productionStateSource);
  const fresh = productionState.defaultProductionState();
  assert.equal(fresh.crafting.level, 1, 'Crafting mastery should start at level 1.');
  assert.equal(fresh.crafting.exp, 0, 'Crafting mastery should start with zero exp.');
  assert.ok(fresh.mining.nodes.grass, 'Mining state should include the first mining node.');
  const normalized = productionState.normalizeProductionState({
    crafting: { level: 999, exp: -5, totalCrafts: 3 },
    blueprints: { known: ['hero_weapon_darkGold', '', null] },
  });
  assert.equal(normalized.crafting.level, 100, 'Crafting mastery should clamp to level cap.');
  assert.equal(normalized.crafting.exp, 0, 'Crafting exp should not be negative.');
  assert.deepEqual(normalized.blueprints.known, ['hero_weapon_darkGold'], 'Blueprint ids should normalize to non-empty strings.');
  const leveled = productionState.defaultProductionState();
  productionState.addCraftingExperience(leveled, 5000);
  assert.ok(leveled.crafting.level > 1, 'Crafting exp should raise crafting mastery level.');
}
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`

Expected: FAIL because the production modules do not exist.

- [ ] **Step 3: Create `src/systems/production/catalog.js`**

Add the module with these exports and concrete starting data:

```js
export const CRAFTING_MASTERY_MAX_LEVEL = 100;

export const PRODUCTION_MATERIALS = Object.freeze({
  tierOre: Object.freeze({ id: 'tierOre', name: '阶级矿', rarity: 'rare' }),
  refinedOre: Object.freeze({ id: 'refinedOre', name: '精炼矿', rarity: 'rare' }),
  rareOre: Object.freeze({ id: 'rareOre', name: '稀有矿', rarity: 'epic' }),
  weaponEmbryo: Object.freeze({ id: 'weaponEmbryo', name: '武器胚子', rarity: 'rare' }),
  armorEmbryo: Object.freeze({ id: 'armorEmbryo', name: '防具胚子', rarity: 'rare' }),
  accessoryEmbryo: Object.freeze({ id: 'accessoryEmbryo', name: '饰品胚子', rarity: 'rare' }),
  craftingComponent: Object.freeze({ id: 'craftingComponent', name: '打造组件', rarity: 'epic' }),
  masterCraftVoucher: Object.freeze({ id: 'masterCraftVoucher', name: '大师打造凭证', rarity: 'legend' }),
});

export const MINING_NODES = Object.freeze({
  grass: Object.freeze({ id: 'grass', label: '南门矿点', unlockLevel: 1, intervalSec: 60, yields: Object.freeze({ tierOre: [1, 2], refinedOre: [1, 1] }) }),
  forest: Object.freeze({ id: 'forest', label: '森林矿脉', unlockLevel: 8, intervalSec: 90, yields: Object.freeze({ tierOre: [2, 3], refinedOre: [1, 2] }) }),
  abyss: Object.freeze({ id: 'abyss', label: '深渊矿脉', unlockLevel: 40, intervalSec: 180, yields: Object.freeze({ rareOre: [1, 1], tierOre: [3, 5] }) }),
});

export const ARTISAN_JOBS = Object.freeze({
  weaponEmbryo: Object.freeze({ id: 'weaponEmbryo', label: '武器胚子', seconds: 120, cost: Object.freeze({ tierOre: 6, refinedOre: 2 }), output: Object.freeze({ weaponEmbryo: 1 }) }),
  armorEmbryo: Object.freeze({ id: 'armorEmbryo', label: '防具胚子', seconds: 120, cost: Object.freeze({ tierOre: 5, refinedOre: 2 }), output: Object.freeze({ armorEmbryo: 1 }) }),
  accessoryEmbryo: Object.freeze({ id: 'accessoryEmbryo', label: '饰品胚子', seconds: 150, cost: Object.freeze({ tierOre: 5, refinedOre: 3 }), output: Object.freeze({ accessoryEmbryo: 1 }) }),
  craftingComponent: Object.freeze({ id: 'craftingComponent', label: '打造组件', seconds: 240, cost: Object.freeze({ refinedOre: 6, rareOre: 1 }), output: Object.freeze({ craftingComponent: 1 }) }),
});

export const CRAFTING_MASTERY_LEVELS = Object.freeze([
  Object.freeze({ minLevel: 1, maxTier: 'T3', rarity: 'rare', label: '基础打造' }),
  Object.freeze({ minLevel: 21, maxTier: 'T5', rarity: 'epic', label: '高阶打造' }),
  Object.freeze({ minLevel: 41, maxTier: 'T7', rarity: 'legend', label: '精密打造' }),
  Object.freeze({ minLevel: 61, maxTier: 'T9', rarity: 'darkGold', label: '暗金大师打造' }),
  Object.freeze({ minLevel: 81, maxTier: 'T10', rarity: 'mythic', label: '神话大师打造' }),
]);

export function getCraftingMasteryBand(level = 1) {
  const safe = Math.max(1, Math.min(CRAFTING_MASTERY_MAX_LEVEL, Math.floor(Number(level || 1))));
  return [...CRAFTING_MASTERY_LEVELS].reverse().find((band) => safe >= band.minLevel) || CRAFTING_MASTERY_LEVELS[0];
}
```

- [ ] **Step 4: Create `src/systems/production/state.js`**

Add:

```js
import { CRAFTING_MASTERY_MAX_LEVEL, MINING_NODES } from './catalog.js';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clampLevel(level) {
  return Math.max(1, Math.min(CRAFTING_MASTERY_MAX_LEVEL, Math.floor(finite(level, 1))));
}

export function craftingExpForLevel(level) {
  const safe = clampLevel(level);
  return Math.round(120 * Math.pow(1.16, safe - 1));
}

export function defaultProductionState() {
  return {
    version: 1,
    mining: {
      exp: 0,
      level: 1,
      lastClaimedAt: Date.now(),
      nodes: Object.fromEntries(Object.keys(MINING_NODES).map((id) => [id, { unlocked: id === 'grass' }])),
    },
    artisan: {
      exp: 0,
      level: 1,
      jobsCompleted: 0,
      activeJob: null,
    },
    crafting: {
      exp: 0,
      level: 1,
      totalCrafts: 0,
      masterCrafts: 0,
    },
    blueprints: {
      known: [],
      fragments: {},
    },
  };
}

export function normalizeProductionState(input = {}) {
  const base = defaultProductionState();
  const known = Array.isArray(input.blueprints?.known)
    ? [...new Set(input.blueprints.known.filter((id) => typeof id === 'string' && id))]
    : [];
  const fragments = Object.fromEntries(Object.entries(input.blueprints?.fragments || {})
    .map(([id, amount]) => [id, Math.max(0, Math.floor(finite(amount)))])
    .filter(([, amount]) => amount > 0));
  return {
    version: 1,
    mining: {
      ...base.mining,
      ...(input.mining && typeof input.mining === 'object' ? input.mining : {}),
      exp: Math.max(0, Math.floor(finite(input.mining?.exp))),
      level: clampLevel(input.mining?.level),
      nodes: { ...base.mining.nodes, ...(input.mining?.nodes || {}) },
    },
    artisan: {
      ...base.artisan,
      ...(input.artisan && typeof input.artisan === 'object' ? input.artisan : {}),
      exp: Math.max(0, Math.floor(finite(input.artisan?.exp))),
      level: clampLevel(input.artisan?.level),
      jobsCompleted: Math.max(0, Math.floor(finite(input.artisan?.jobsCompleted))),
    },
    crafting: {
      ...base.crafting,
      ...(input.crafting && typeof input.crafting === 'object' ? input.crafting : {}),
      exp: Math.max(0, Math.floor(finite(input.crafting?.exp))),
      level: clampLevel(input.crafting?.level),
      totalCrafts: Math.max(0, Math.floor(finite(input.crafting?.totalCrafts))),
      masterCrafts: Math.max(0, Math.floor(finite(input.crafting?.masterCrafts))),
    },
    blueprints: { known, fragments },
  };
}

export function addCraftingExperience(production, amount = 0) {
  const state = normalizeProductionState(production);
  state.crafting.exp += Math.max(0, Math.floor(finite(amount)));
  while (state.crafting.level < CRAFTING_MASTERY_MAX_LEVEL && state.crafting.exp >= craftingExpForLevel(state.crafting.level + 1)) {
    state.crafting.level += 1;
  }
  Object.assign(production, state);
  return production.crafting;
}
```

- [ ] **Step 5: Create `src/systems/production/index.js`**

Add:

```js
import { defaultProductionState, normalizeProductionState, addCraftingExperience, craftingExpForLevel } from './state.js';
import { PRODUCTION_MATERIALS, MINING_NODES, ARTISAN_JOBS, CRAFTING_MASTERY_LEVELS, getCraftingMasteryBand } from './catalog.js';

export * from './catalog.js';
export * from './state.js';

export function installProductionRuntime(context = {}) {
  const runtime = Object.freeze({
    PRODUCTION_MATERIALS,
    MINING_NODES,
    ARTISAN_JOBS,
    CRAFTING_MASTERY_LEVELS,
    defaultProductionState,
    normalizeProductionState,
    addCraftingExperience,
    craftingExpForLevel,
    getCraftingMasteryBand,
    getState: context.getState || (() => ({})),
  });
  window.RuneFrontierProductionRuntime = runtime;
  return runtime;
}
```

- [ ] **Step 6: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/systems/production/catalog.js
node --check src/systems/production/state.js
node --check src/systems/production/index.js
```

Expected: all pass.

Commit:

```bash
git add src/systems/production/catalog.js src/systems/production/state.js src/systems/production/index.js scripts/test.mjs
git commit -m "feat(production): add crafting economy state"
```

---

### Task 2: Mining and Artisan Production

**Files:**
- Create: `src/systems/production/mining.js`
- Create: `src/systems/production/artisan.js`
- Modify: `src/systems/production/index.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests for mining and artisan jobs**

Add reads:

```js
const productionMiningSource = read('src/systems/production/mining.js');
const productionArtisanSource = read('src/systems/production/artisan.js');
```

Add tests:

```js
assert.match(productionMiningSource, /export function claimMiningProduction/, 'Mining module should expose claimMiningProduction.');
assert.match(productionArtisanSource, /export function startArtisanJob/, 'Artisan module should expose startArtisanJob.');
assert.match(productionArtisanSource, /export function claimArtisanJob/, 'Artisan module should expose claimArtisanJob.');
{
  const stateModule = await importSource(productionStateSource);
  const mining = await importSource(productionMiningSource, {
    './catalog.js': await importSource(productionCatalogSource),
    './state.js': stateModule,
  });
  const state = { production: stateModule.defaultProductionState(), materials: {} };
  state.production.mining.lastClaimedAt = 0;
  const result = mining.claimMiningProduction(state, { now: () => 120000, randomInt: (min) => min });
  assert.equal(result.ok, true, 'Mining production should be claimable.');
  assert.ok(state.materials.tierOre > 0, 'Mining should grant tier ore.');
  assert.ok(state.production.mining.exp > 0, 'Mining should grant mining exp.');
}
{
  const catalog = await importSource(productionCatalogSource);
  const stateModule = await importSource(productionStateSource);
  const artisan = await importSource(productionArtisanSource, {
    './catalog.js': catalog,
    './state.js': stateModule,
  });
  const state = { production: stateModule.defaultProductionState(), materials: { tierOre: 20, refinedOre: 20 } };
  assert.equal(artisan.startArtisanJob(state, 'weaponEmbryo', { now: () => 1000 }).ok, true, 'Artisan job should start when materials are available.');
  assert.equal(state.materials.tierOre < 20, true, 'Starting artisan job should consume materials.');
  assert.equal(artisan.claimArtisanJob(state, { now: () => 1000 }).reason, 'in_progress', 'Unfinished artisan job should not claim early.');
  assert.equal(artisan.claimArtisanJob(state, { now: () => 1000 + catalog.ARTISAN_JOBS.weaponEmbryo.seconds * 1000 }).ok, true, 'Finished artisan job should claim.');
  assert.equal(state.materials.weaponEmbryo, 1, 'Finished artisan job should grant output.');
}
```

- [ ] **Step 2: Implement mining**

Create `src/systems/production/mining.js`:

```js
import { MINING_NODES } from './catalog.js';
import { normalizeProductionState } from './state.js';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function addMaterial(state, id, amount) {
  state.materials = state.materials || {};
  state.materials[id] = Math.max(0, finite(state.materials[id]) + Math.max(0, Math.floor(finite(amount))));
}

export function claimMiningProduction(state = {}, context = {}) {
  state.production = normalizeProductionState(state.production);
  const now = Number(context.now?.() || Date.now());
  const last = Number(state.production.mining.lastClaimedAt || now);
  const elapsedSec = Math.max(0, Math.floor((now - last) / 1000));
  if (elapsedSec <= 0) return { ok: false, reason: 'no_elapsed_time' };
  const rewards = {};
  Object.values(MINING_NODES).forEach((node) => {
    if (state.production.mining.level < node.unlockLevel) return;
    const cycles = Math.floor(elapsedSec / node.intervalSec);
    if (cycles <= 0) return;
    Object.entries(node.yields).forEach(([id, range]) => {
      const amount = cycles * (context.randomInt?.(range[0], range[1]) ?? range[0]);
      rewards[id] = Math.max(0, Math.floor(finite(rewards[id]) + amount));
    });
  });
  Object.entries(rewards).forEach(([id, amount]) => addMaterial(state, id, amount));
  const exp = Object.values(rewards).reduce((sum, value) => sum + finite(value), 0);
  state.production.mining.exp += exp;
  state.production.mining.level = Math.min(100, Math.max(state.production.mining.level, 1 + Math.floor(state.production.mining.exp / 300)));
  state.production.mining.lastClaimedAt = now;
  return { ok: Object.keys(rewards).length > 0, rewards, exp };
}
```

- [ ] **Step 3: Implement artisan jobs**

Create `src/systems/production/artisan.js`:

```js
import { ARTISAN_JOBS } from './catalog.js';
import { normalizeProductionState } from './state.js';

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function hasMaterials(state = {}, cost = {}) {
  return Object.entries(cost).every(([id, amount]) => finite(state.materials?.[id]) >= finite(amount));
}

function consumeMaterials(state = {}, cost = {}) {
  state.materials = state.materials || {};
  Object.entries(cost).forEach(([id, amount]) => {
    state.materials[id] = Math.max(0, finite(state.materials[id]) - finite(amount));
  });
}

function addMaterials(state = {}, output = {}) {
  state.materials = state.materials || {};
  Object.entries(output).forEach(([id, amount]) => {
    state.materials[id] = Math.max(0, finite(state.materials[id]) + finite(amount));
  });
}

export function startArtisanJob(state = {}, jobId = '', context = {}) {
  state.production = normalizeProductionState(state.production);
  const job = ARTISAN_JOBS[jobId];
  if (!job) return { ok: false, reason: 'job_missing' };
  if (state.production.artisan.activeJob) return { ok: false, reason: 'busy' };
  if (!hasMaterials(state, job.cost)) return { ok: false, reason: 'not_affordable', cost: job.cost };
  consumeMaterials(state, job.cost);
  const now = Number(context.now?.() || Date.now());
  state.production.artisan.activeJob = { id: job.id, startedAt: now, finishAt: now + job.seconds * 1000 };
  return { ok: true, job };
}

export function claimArtisanJob(state = {}, context = {}) {
  state.production = normalizeProductionState(state.production);
  const active = state.production.artisan.activeJob;
  if (!active) return { ok: false, reason: 'no_job' };
  const job = ARTISAN_JOBS[active.id];
  if (!job) {
    state.production.artisan.activeJob = null;
    return { ok: false, reason: 'job_missing' };
  }
  const now = Number(context.now?.() || Date.now());
  if (now < Number(active.finishAt || 0)) return { ok: false, reason: 'in_progress', finishAt: active.finishAt };
  addMaterials(state, job.output);
  state.production.artisan.activeJob = null;
  state.production.artisan.jobsCompleted += 1;
  state.production.artisan.exp += 50 + job.seconds;
  state.production.artisan.level = Math.min(100, 1 + Math.floor(state.production.artisan.exp / 500));
  return { ok: true, job, output: job.output };
}
```

- [ ] **Step 4: Export through production runtime**

In `src/systems/production/index.js`, import and expose:

```js
import { claimMiningProduction } from './mining.js';
import { startArtisanJob, claimArtisanJob } from './artisan.js';

export * from './mining.js';
export * from './artisan.js';
```

Add to runtime:

```js
claimMiningProduction: () => claimMiningProduction(context.getState?.() || {}, context),
startArtisanJob: (jobId) => startArtisanJob(context.getState?.() || {}, jobId, context),
claimArtisanJob: () => claimArtisanJob(context.getState?.() || {}, context),
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/systems/production/mining.js
node --check src/systems/production/artisan.js
```

Commit:

```bash
git add src/systems/production/mining.js src/systems/production/artisan.js src/systems/production/index.js scripts/test.mjs
git commit -m "feat(production): add mining and artisan jobs"
```

---

### Task 3: Equipment Crafting and Master Crafting

**Files:**
- Create: `src/systems/equipment/crafting.js`
- Modify: `src/systems/equipment/index.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests for normal and master crafting**

Add read:

```js
const equipmentCraftingSource = read('src/systems/equipment/crafting.js');
```

Add tests:

```js
assert.match(equipmentCraftingSource, /export function getEquipmentCraftingRecipe/, 'Equipment crafting should expose recipe lookup.');
assert.match(equipmentCraftingSource, /export function canCraftEquipment/, 'Equipment crafting should expose affordability checks.');
assert.match(equipmentCraftingSource, /export function craftEquipment/, 'Equipment crafting should expose craft execution.');
assert.match(equipmentIndexSource, /craftEquipment/, 'Equipment runtime should export craftEquipment.');
{
  const crafting = await importSource(equipmentCraftingSource, {
    './itemProgression.js': itemProgression,
  });
  const state = {
    gold: 999999,
    materials: { tierOre: 999, refinedOre: 999, weaponEmbryo: 10, ancientHeroShard: 99, craftingComponent: 10, masterCraftVoucher: 3, mythicHeroCore: 5 },
    production: { crafting: { level: 81, exp: 0, totalCrafts: 0, masterCrafts: 0 }, blueprints: { known: ['ancientHero_weapon_mythic'], fragments: {} } },
    inventory: [],
  };
  let createdContext = null;
  const result = crafting.craftEquipment({
    series: 'ancientHero',
    growthTier: 'T2',
    slot: 'weapon',
    archetype: 'physical',
    rarity: 'mythic',
  }, {
    getState: () => state,
    createItem: (_template, _level, rarity, context) => {
      createdContext = context;
      return { id: 'crafted', rarity, series: context.series, growthTier: context.growthTier, slot: 'weapon' };
    },
    addCraftingExperience: (_production, amount) => { state.production.crafting.exp += amount; },
    getProgressionEquipmentTemplate: (id) => ({ id, name: 'Hero Blade', slot: 'weapon', rarity: 'rare', source: 'progression_drop', series: 'ancientHero', growthTier: 'T2', upgradeStage: 0, grade: 'base', atk: 10 }),
    showToast: () => {},
    save: () => {},
    renderAll: () => {},
  });
  assert.equal(result.ok, true, 'Master crafting should succeed when level, blueprint, and materials are available.');
  assert.equal(result.item.rarity, 'mythic', 'Master crafting should create requested rarity.');
  assert.equal(createdContext.series, 'ancientHero', 'Crafting should pass series into createItem.');
  assert.ok(state.production.crafting.exp > 0, 'Crafting should grant crafting experience.');
}
```

- [ ] **Step 2: Implement `src/systems/equipment/crafting.js`**

Add a minimal deterministic crafting module:

```js
import { PROGRESSION_EQUIPMENT_SLOTS, getEquipmentLineMaterials, normalizeEquipmentSeries, normalizeGrowthTier } from './itemProgression.js';

const RARITY_REQUIREMENTS = Object.freeze({
  rare: Object.freeze({ level: 1, voucher: 0, extraCore: 0 }),
  epic: Object.freeze({ level: 21, voucher: 0, extraCore: 0 }),
  legend: Object.freeze({ level: 41, voucher: 0, extraCore: 1 }),
  darkGold: Object.freeze({ level: 61, voucher: 1, extraCore: 2 }),
  mythic: Object.freeze({ level: 81, voucher: 3, extraCore: 4 }),
});

const SLOT_EMBRYO = Object.freeze({
  weapon: 'weaponEmbryo',
  armor: 'armorEmbryo',
  headgear: 'armorEmbryo',
  shoes: 'armorEmbryo',
  trinket: 'accessoryEmbryo',
});

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function materialCostFor(request = {}) {
  const rarityReq = RARITY_REQUIREMENTS[request.rarity || 'rare'] || RARITY_REQUIREMENTS.rare;
  const lineMaterials = getEquipmentLineMaterials(request.series);
  const slot = PROGRESSION_EQUIPMENT_SLOTS.find((entry) => entry.id === request.slot)?.id || 'weapon';
  const cost = {
    [SLOT_EMBRYO[slot] || 'weaponEmbryo']: 1,
    tierOre: 8,
    refinedOre: 4,
    craftingComponent: request.rarity === 'rare' ? 0 : 1,
  };
  if (lineMaterials.basic?.id) cost[lineMaterials.basic.id] = 8;
  if (lineMaterials.advanced?.id && rarityReq.level >= 21) cost[lineMaterials.advanced.id] = 3;
  if (lineMaterials.core?.id && rarityReq.level >= 41) cost[lineMaterials.core.id] = rarityReq.extraCore;
  if (rarityReq.voucher) cost.masterCraftVoucher = rarityReq.voucher;
  return Object.fromEntries(Object.entries(cost).filter(([, amount]) => amount > 0));
}

function hasCost(state = {}, cost = {}, gold = 0) {
  if (finite(state.gold) < finite(gold)) return false;
  return Object.entries(cost).every(([id, amount]) => finite(state.materials?.[id]) >= finite(amount));
}

function consumeCost(state = {}, cost = {}, gold = 0) {
  state.gold = Math.max(0, finite(state.gold) - finite(gold));
  state.materials = state.materials || {};
  Object.entries(cost).forEach(([id, amount]) => {
    state.materials[id] = Math.max(0, finite(state.materials[id]) - finite(amount));
  });
}

function blueprintId(request = {}) {
  return `${normalizeEquipmentSeries(request.series, 'ancientHero')}_${request.slot || 'weapon'}_${request.rarity || 'rare'}`;
}

function hasBlueprint(state = {}, request = {}) {
  const rarityReq = RARITY_REQUIREMENTS[request.rarity || 'rare'] || RARITY_REQUIREMENTS.rare;
  if (rarityReq.level < 61) return true;
  return (state.production?.blueprints?.known || []).includes(blueprintId(request));
}

function masteryLevel(state = {}) {
  return Math.max(1, Math.floor(finite(state.production?.crafting?.level, 1)));
}

export function getEquipmentCraftingRecipe(request = {}) {
  const rarity = request.rarity || 'rare';
  const rarityReq = RARITY_REQUIREMENTS[rarity] || RARITY_REQUIREMENTS.rare;
  return {
    ...request,
    series: normalizeEquipmentSeries(request.series, 'ancientHero'),
    growthTier: normalizeGrowthTier(request.growthTier, 'T2'),
    slot: request.slot || 'weapon',
    archetype: request.archetype || 'general',
    rarity,
    requiredCraftingLevel: rarityReq.level,
    blueprintId: blueprintId({ ...request, rarity }),
    materials: materialCostFor({ ...request, rarity }),
    gold: Math.round(3000 * Math.max(1, rarityReq.level / 10)),
    exp: 80 + rarityReq.level * 12,
  };
}

export function canCraftEquipment(request = {}, context = {}) {
  const state = context.getState?.() || {};
  const recipe = getEquipmentCraftingRecipe(request);
  if (masteryLevel(state) < recipe.requiredCraftingLevel) return { ok: false, reason: 'crafting_level', recipe };
  if (!hasBlueprint(state, recipe)) return { ok: false, reason: 'blueprint', recipe };
  if (!hasCost(state, recipe.materials, recipe.gold)) return { ok: false, reason: 'not_affordable', recipe };
  return { ok: true, recipe };
}

export function craftEquipment(request = {}, context = {}) {
  const state = context.getState?.() || {};
  const check = canCraftEquipment(request, context);
  if (!check.ok) return check;
  const recipe = check.recipe;
  const templateId = `prog_${recipe.series}_base_${recipe.archetype}_${recipe.slot}`;
  const template = context.getProgressionEquipmentTemplate?.(templateId)
    || context.getProgressionEquipmentTemplate?.(`prog_${recipe.series}_base_general_${recipe.slot}`);
  if (!template) return { ok: false, reason: 'template_missing', recipe };
  consumeCost(state, recipe.materials, recipe.gold);
  const item = context.createItem?.(template, template.requiredLevel || 1, recipe.rarity, {
    source: 'crafted',
    dropMapId: 'crafting',
    dropLevel: template.requiredLevel || 1,
    series: recipe.series,
    growthTier: recipe.growthTier,
    archetype: recipe.archetype,
    allowMythic: recipe.rarity === 'mythic',
  });
  if (!item) return { ok: false, reason: 'creation_failed', recipe };
  item.crafted = true;
  item.craftedBy = 'artisan';
  item.craftingRecipeId = recipe.blueprintId;
  state.inventory = Array.isArray(state.inventory) ? state.inventory : [];
  state.inventory.unshift(item);
  state.production.crafting.totalCrafts += 1;
  if (recipe.rarity === 'darkGold' || recipe.rarity === 'mythic') state.production.crafting.masterCrafts += 1;
  context.addCraftingExperience?.(state.production, recipe.exp);
  context.recordEquipmentResearch?.(recipe.series, recipe.rarity === 'mythic' ? 80 : recipe.rarity === 'darkGold' ? 50 : 15);
  context.recordEquipmentCollection?.(item, { source: 'crafting' });
  context.showToast?.(`打造完成：${item.name || template.name}`);
  context.renderAll?.();
  context.save?.();
  return { ok: true, item, recipe };
}
```

- [ ] **Step 3: Export through equipment runtime**

In `src/systems/equipment/index.js`:

```js
import { getEquipmentCraftingRecipe, canCraftEquipment, craftEquipment } from './crafting.js';
export * from './crafting.js';
```

Add to runtime:

```js
getEquipmentCraftingRecipe,
canCraftEquipment: (request) => canCraftEquipment(request, context),
craftEquipment: (request) => craftEquipment(request, context),
```

- [ ] **Step 4: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/systems/equipment/crafting.js
```

Commit:

```bash
git add src/systems/equipment/crafting.js src/systems/equipment/index.js scripts/test.mjs
git commit -m "feat(equipment): add deterministic crafting"
```

---

### Task 4: Runtime State Wiring and Smithy UI

**Files:**
- Create: `src/ui/smithyCraftingPanel.js`
- Modify: `game.js`
- Modify: `src/main.js`
- Modify: `src/ui/smithyPage.js`
- Modify: `styles.css`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests for runtime wiring**

Add:

```js
assert.match(main, /installProductionRuntime/, 'Main should install production runtime.');
assert.match(main, /installSmithyCraftingRenderRuntime/, 'Main should install smithy crafting renderer.');
assert.match(game, /production:\s*defaultProductionState\(\)/, 'Default state should include production state.');
assert.match(game, /normalizeProductionState\(saved\.production/, 'Saved state should normalize production.');
assert.match(game, /data-claim-mining-production/, 'Smithy events should claim mining production.');
assert.match(game, /data-start-artisan-job/, 'Smithy events should start artisan jobs.');
assert.match(game, /data-craft-equipment/, 'Smithy events should craft equipment.');
assert.match(smithyPageSource, /renderProductionSmithyPanel/, 'Smithy runtime should expose production panel bridge.');
```

- [ ] **Step 2: Add production state bridge in `game.js`**

Add wrappers near other default helpers:

```js
function defaultProductionState() {
  return window.RuneFrontierProductionRuntime?.defaultProductionState?.() || {
    version: 1,
    mining: { exp: 0, level: 1, lastClaimedAt: Date.now(), nodes: {} },
    artisan: { exp: 0, level: 1, jobsCompleted: 0, activeJob: null },
    crafting: { exp: 0, level: 1, totalCrafts: 0, masterCrafts: 0 },
    blueprints: { known: [], fragments: {} },
  };
}

function normalizeProductionState(value = {}) {
  return window.RuneFrontierProductionRuntime?.normalizeProductionState?.(value) || defaultProductionState();
}
```

In `createDefaultState()` add:

```js
production: defaultProductionState(),
```

In `mergeState()` add:

```js
production: normalizeProductionState(saved.production || base.production),
```

In `sanitizeState()` add:

```js
state.production = normalizeProductionState(state.production);
```

- [ ] **Step 3: Install runtime in `src/main.js`**

Import:

```js
import { installProductionRuntime } from './systems/production/index.js';
import { installSmithyCraftingRenderRuntime } from './ui/smithyCraftingPanel.js';
```

Install after equipment runtime:

```js
installProductionRuntime({
  getState() { return window.state || {}; },
  now: () => Date.now(),
  randomInt: window.randomInt,
  showToast: window.showToast,
  addLog: window.addLog,
  renderAll: window.renderAll,
  save: window.save,
});
```

Install renderer near smithy render runtime:

```js
installSmithyCraftingRenderRuntime({
  getState() { return window.state || {}; },
  escapeHtml: window.escapeHtml,
  escapeAttr: window.escapeAttr,
  formatNumber: window.formatNumber,
  materialText: window.materialText,
  hasMaterials: window.hasMaterials,
  getMaterialName: (id) => (window.materialNames || {})[id] || id,
  productionRuntime: () => window.RuneFrontierProductionRuntime,
  equipmentRuntime: () => window.RuneFrontierEquipmentRuntime,
});
```

- [ ] **Step 4: Add smithy render bridge**

Create `src/ui/smithyCraftingPanel.js`:

```js
let craftingCtx = {};

function esc(value) { return (craftingCtx.escapeHtml || String)(value == null ? '' : value); }
function attr(value) { return (craftingCtx.escapeAttr || craftingCtx.escapeHtml || String)(value == null ? '' : value); }
function fmtn(value) { return (craftingCtx.formatNumber || String)(Math.max(0, Number(value || 0))); }

export function renderProductionSmithyPanel() {
  const state = craftingCtx.getState?.() || {};
  const runtime = craftingCtx.productionRuntime?.();
  const nodes = runtime?.MINING_NODES || {};
  const jobs = runtime?.ARTISAN_JOBS || {};
  const activeJob = state.production?.artisan?.activeJob;
  return `<div class="smithy-production-grid">
    <article class="smithy-item"><div><strong>采矿</strong><p class="academy-meta">采矿 Lv.${fmtn(state.production?.mining?.level || 1)} · 持续产出阶级矿和精炼矿。</p></div><button type="button" data-claim-mining-production>收取</button></article>
    ${Object.values(nodes).map((node) => `<article class="smithy-item"><div><strong>${esc(node.label)}</strong><p class="academy-meta">解锁 Lv.${fmtn(node.unlockLevel)} · ${craftingCtx.materialText?.(Object.fromEntries(Object.entries(node.yields).map(([id, range]) => [id, `${range[0]}-${range[1]}`]))) || ''}</p></div></article>`).join('')}
    ${Object.values(jobs).map((job) => `<article class="smithy-item"><div><strong>${esc(job.label)}</strong><p class="academy-meta">消耗：${craftingCtx.materialText?.(job.cost) || ''}</p><p class="academy-meta">产出：${craftingCtx.materialText?.(job.output) || ''}</p></div><button type="button" data-start-artisan-job="${attr(job.id)}" ${activeJob ? 'disabled' : ''}>加工</button></article>`).join('')}
    ${activeJob ? `<article class="smithy-item"><div><strong>正在加工</strong><p class="academy-meta">${esc(activeJob.id)}</p></div><button type="button" data-claim-artisan-job>领取</button></article>` : ''}
  </div>`;
}

export function renderEquipmentCraftingSmithyPanel() {
  const state = craftingCtx.getState?.() || {};
  const equipmentRuntime = craftingCtx.equipmentRuntime?.();
  const seriesRows = Object.values(equipmentRuntime?.EQUIPMENT_SERIES || {}).filter((row) => row.id && row.id !== 'oldWorld').slice(0, 6);
  return `<div class="crafting-mastery-card"><strong>打造熟练度 Lv.${fmtn(state.production?.crafting?.level || 1)}</strong><p class="academy-meta">打造次数 ${fmtn(state.production?.crafting?.totalCrafts || 0)} · 大师打造 ${fmtn(state.production?.crafting?.masterCrafts || 0)}</p></div>
  <div class="smithy-items">${seriesRows.map((series) => `<article class="smithy-item"><div><strong>${esc(series.label)}武器</strong><p class="academy-meta">定向打造物理武器，作为可靠底胚。</p></div><button type="button" data-craft-equipment="${attr(`${series.id}:T2:weapon:physical:rare`)}">打造</button></article>`).join('')}</div>`;
}

export function installSmithyCraftingRenderRuntime(context = {}) {
  craftingCtx = context || {};
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = Object.assign(existing, {
    renderProductionSmithyPanel,
    renderEquipmentCraftingSmithyPanel,
  });
  return window.RuneFrontierRenderRuntime;
}
```

- [ ] **Step 5: Add smithy tabs in `game.js`**

In `renderSmithyContent()`, add tabs:

```js
["production", "生产"],
["crafting", "装备打造"],
```

Add panes:

```js
production: `<section class="smithy-category"><h3>采矿与工匠</h3>${window.RuneFrontierRenderRuntime?.renderProductionSmithyPanel?.() || ""}</section>`,
crafting: `<section class="smithy-category"><h3>装备打造</h3>${window.RuneFrontierRenderRuntime?.renderEquipmentCraftingSmithyPanel?.() || ""}</section>`,
```

Add wrappers:

```js
function claimMiningProduction() {
  const result = window.RuneFrontierProductionRuntime?.claimMiningProduction?.();
  if (!result?.ok) showToast(result?.reason === "no_elapsed_time" ? "暂无可收取矿产" : "采矿系统尚未就绪");
}

function startArtisanJob(jobId) {
  const result = window.RuneFrontierProductionRuntime?.startArtisanJob?.(jobId);
  if (!result?.ok) showToast(result?.reason === "not_affordable" ? "加工材料不足" : "工匠无法开始加工");
}

function claimArtisanJob() {
  const result = window.RuneFrontierProductionRuntime?.claimArtisanJob?.();
  if (!result?.ok) showToast(result?.reason === "in_progress" ? "加工尚未完成" : "暂无可领取加工");
}

function craftEquipmentFromToken(token = "") {
  const [series, growthTier, slot, archetype, rarity] = String(token).split(":");
  const result = window.RuneFrontierEquipmentRuntime?.craftEquipment?.({ series, growthTier, slot, archetype, rarity });
  if (!result?.ok) showToast(result?.reason === "not_affordable" ? "打造材料不足" : result?.reason === "crafting_level" ? "打造熟练度不足" : "无法打造该装备");
}
```

In smithy click handlers add:

```js
const miningButton = event.target.closest("button[data-claim-mining-production]");
if (miningButton) return claimMiningProduction();
const artisanStart = event.target.closest("button[data-start-artisan-job]");
if (artisanStart) return startArtisanJob(artisanStart.dataset.startArtisanJob);
const artisanClaim = event.target.closest("button[data-claim-artisan-job]");
if (artisanClaim) return claimArtisanJob();
const craftEquipmentButton = event.target.closest("button[data-craft-equipment]");
if (craftEquipmentButton) return craftEquipmentFromToken(craftEquipmentButton.dataset.craftEquipment);
```

- [ ] **Step 6: Update `src/ui/smithyPage.js` bridge**

Add bridge function names:

```js
'renderProductionSmithyPanel',
'renderEquipmentCraftingSmithyPanel',
```

- [ ] **Step 7: Add minimal CSS**

Append:

```css
.smithy-production-grid {
  display: grid;
  gap: 10px;
}

.crafting-mastery-card {
  border: 1px solid rgba(129, 92, 41, 0.22);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 248, 226, 0.72);
  margin-bottom: 10px;
}
```

- [ ] **Step 8: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check game.js
node --check src/main.js
node --check src/ui/smithyCraftingPanel.js
```

Commit:

```bash
git add game.js src/main.js src/ui/smithyPage.js src/ui/smithyCraftingPanel.js styles.css scripts/test.mjs
git commit -m "feat(smithy): add production and crafting panels"
```

---

### Task 5: Equipment Research and Collection Hooks

**Files:**
- Create: `src/systems/equipment/equipmentResearch.js`
- Create: `src/systems/collections/equipmentCollection.js`
- Create: `src/systems/collections/index.js`
- Modify: `src/systems/equipment/index.js`
- Modify: `src/systems/equipment/dismantle.js`
- Modify: `src/systems/equipment/progressionUpgrade.js`
- Modify: `src/systems/equipment/crafting.js`
- Modify: `game.js`
- Modify: `src/main.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests**

Add reads and assertions:

```js
const equipmentResearchSource = read('src/systems/equipment/equipmentResearch.js');
const equipmentCollectionSource = read('src/systems/collections/equipmentCollection.js');
const collectionIndexSource = read('src/systems/collections/index.js');
assert.match(equipmentResearchSource, /export function recordEquipmentResearch/, 'Equipment research should record line XP.');
assert.match(equipmentResearchSource, /export function getEquipmentResearchBonus/, 'Equipment research should expose economic bonuses.');
assert.match(equipmentCollectionSource, /export function recordEquipmentCollection/, 'Collection should record equipment discoveries.');
assert.match(collectionIndexSource, /installCollectionRuntime/, 'Collection runtime should install.');
assert.match(dismantleSource, /recordEquipmentResearch\?/, 'Salvage should feed equipment research.');
assert.match(progressionUpgradeSource, /recordEquipmentResearch\?/, 'Progression upgrades should feed equipment research.');
assert.match(equipmentCraftingSource, /recordEquipmentResearch\?/, 'Crafting should feed equipment research.');
```

- [ ] **Step 2: Implement research module**

Create `src/systems/equipment/equipmentResearch.js`:

```js
import { normalizeEquipmentSeries, getEquipmentSeriesConfig } from './itemProgression.js';

function finite(value) { const number = Number(value || 0); return Number.isFinite(number) ? number : 0; }

export function normalizeEquipmentResearchState(input = {}) {
  return Object.fromEntries(Object.entries(input || {}).map(([series, entry]) => {
    const id = normalizeEquipmentSeries(series, '');
    if (!id || id === 'oldWorld') return null;
    const exp = Math.max(0, Math.floor(finite(entry?.exp ?? entry)));
    const level = Math.min(50, Math.floor(Math.sqrt(exp / 80)));
    return [id, { exp, level }];
  }).filter(Boolean));
}

export function recordEquipmentResearch(state = {}, series = '', amount = 0) {
  const id = normalizeEquipmentSeries(series, '');
  if (!id || id === 'oldWorld') return null;
  state.equipmentResearch = normalizeEquipmentResearchState(state.equipmentResearch);
  const entry = state.equipmentResearch[id] || { exp: 0, level: 0 };
  entry.exp += Math.max(0, Math.floor(finite(amount)));
  entry.level = Math.min(50, Math.floor(Math.sqrt(entry.exp / 80)));
  state.equipmentResearch[id] = entry;
  return entry;
}

export function getEquipmentResearchBonus(state = {}, series = '') {
  const id = normalizeEquipmentSeries(series, '');
  const level = normalizeEquipmentResearchState(state.equipmentResearch)[id]?.level || 0;
  return {
    series: id,
    label: id ? getEquipmentSeriesConfig(id).label : '',
    level,
    materialDropBonus: Math.min(0.25, level * 0.003),
    craftingDiscount: Math.min(0.15, level * 0.002),
    salvageReturnBonus: Math.min(0.2, level * 0.003),
  };
}
```

- [ ] **Step 3: Implement collection module**

Create `src/systems/collections/equipmentCollection.js`:

```js
function key(value) { return String(value || '').trim(); }

export function defaultCollectionState() {
  return { version: 1, equipment: {}, cards: {}, bosses: {}, maps: {}, rewardsClaimed: {} };
}

export function normalizeCollectionState(input = {}) {
  const base = defaultCollectionState();
  return {
    version: 1,
    equipment: input.equipment && typeof input.equipment === 'object' ? input.equipment : base.equipment,
    cards: input.cards && typeof input.cards === 'object' ? input.cards : base.cards,
    bosses: input.bosses && typeof input.bosses === 'object' ? input.bosses : base.bosses,
    maps: input.maps && typeof input.maps === 'object' ? input.maps : base.maps,
    rewardsClaimed: input.rewardsClaimed && typeof input.rewardsClaimed === 'object' ? input.rewardsClaimed : base.rewardsClaimed,
  };
}

export function recordEquipmentCollection(state = {}, item = {}, meta = {}) {
  state.collections = normalizeCollectionState(state.collections);
  const series = key(item.series || item.upgradePathId || 'oldWorld');
  const tier = key(item.growthTier || 'T1');
  const slot = key(item.slot || item.equipSlot || 'unknown');
  const rarity = key(item.rarity || 'normal');
  const id = `${series}:${tier}:${slot}:${rarity}`;
  const entry = state.collections.equipment[id] || { id, series, tier, slot, rarity, count: 0, firstSource: meta.source || '' };
  entry.count += 1;
  state.collections.equipment[id] = entry;
  return entry;
}

export function recordBossCollection(state = {}, bossId = '', meta = {}) {
  state.collections = normalizeCollectionState(state.collections);
  const id = key(bossId);
  if (!id) return null;
  const entry = state.collections.bosses[id] || { id, kills: 0, firstKilledAt: meta.time || Date.now(), fastestMs: 0 };
  entry.kills += 1;
  if (meta.durationMs && (!entry.fastestMs || meta.durationMs < entry.fastestMs)) entry.fastestMs = meta.durationMs;
  state.collections.bosses[id] = entry;
  return entry;
}

export function buildCollectionSummary(state = {}) {
  state.collections = normalizeCollectionState(state.collections);
  return {
    equipmentCount: Object.keys(state.collections.equipment).length,
    cardCount: Object.keys(state.collections.cards).length,
    bossCount: Object.keys(state.collections.bosses).length,
    mapCount: Object.keys(state.collections.maps).length,
  };
}
```

Create `src/systems/collections/index.js`:

```js
import { defaultCollectionState, normalizeCollectionState, recordEquipmentCollection, recordBossCollection, buildCollectionSummary } from './equipmentCollection.js';

export * from './equipmentCollection.js';

export function installCollectionRuntime(context = {}) {
  const runtime = Object.freeze({
    defaultCollectionState,
    normalizeCollectionState,
    recordEquipmentCollection: (item, meta) => recordEquipmentCollection(context.getState?.() || {}, item, meta),
    recordBossCollection: (bossId, meta) => recordBossCollection(context.getState?.() || {}, bossId, meta),
    buildCollectionSummary: (state) => buildCollectionSummary(state || context.getState?.() || {}),
  });
  window.RuneFrontierCollectionRuntime = runtime;
  return runtime;
}
```

- [ ] **Step 4: Wire into state and hooks**

In `game.js`, add default/normalize wrappers for `equipmentResearch` and `collections`. Add them to default state, merge, and sanitize.

In `dismantle.js` after rewards:

```js
ctx.recordEquipmentResearch?.(item.series || item.upgradePathId, item.rarity === 'mythic' ? 120 : item.rarity === 'darkGold' ? 80 : 12);
ctx.recordEquipmentCollection?.(item, { source: 'salvage' });
```

In `progressionUpgrade.js` after successful upgrade:

```js
context.recordEquipmentResearch?.(next.series, 45 + next.upgradeStage * 20);
context.recordEquipmentCollection?.(item, { source: 'upgrade' });
```

In `src/main.js`, install collection runtime and pass `recordEquipmentResearch` / `recordEquipmentCollection` into equipment context.

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/systems/equipment/equipmentResearch.js
node --check src/systems/collections/equipmentCollection.js
node --check src/systems/collections/index.js
```

Commit:

```bash
git add src/systems/equipment/equipmentResearch.js src/systems/collections/equipmentCollection.js src/systems/collections/index.js src/systems/equipment/index.js src/systems/equipment/dismantle.js src/systems/equipment/progressionUpgrade.js src/systems/equipment/crafting.js game.js src/main.js scripts/test.mjs
git commit -m "feat(equipment): add research and collection progress"
```

---

### Task 6: Map Mastery and Handbook Recommendations

**Files:**
- Modify: `game.js`
- Modify: `src/systems/adventureHandbook.js`
- Modify: `src/ui/adventureHandbookPage.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests**

Add:

```js
assert.match(game, /recordMapMasteryMaterial/, 'Game should record material-based map mastery.');
assert.match(game, /recordMapMasteryEquipment/, 'Game should record equipment-based map mastery.');
assert.match(adventureHandbookSource, /craftingTargets/, 'Adventure handbook model should include craftable targets.');
assert.match(adventureHandbookSource, /productionSuggestions/, 'Adventure handbook model should include production suggestions.');
assert.match(adventureHandbookPageSource, /craftingTargets/, 'Adventure handbook page should render crafting targets.');
assert.match(adventureHandbookPageSource, /productionSuggestions/, 'Adventure handbook page should render production suggestions.');
```

- [ ] **Step 2: Reuse existing map exploration as map mastery**

In `game.js`, add:

```js
function recordMapMasteryMaterial(mapId, amount = 1) {
  gainMapExploration(mapId || currentMap().id, Math.max(1, Math.floor(Number(amount || 1) * 0.5)));
}

function recordMapMasteryEquipment(item = {}) {
  const mapId = item.dropMapId || currentMap().id;
  gainMapExploration(mapId, item.rarity === "mythic" ? 8 : item.rarity === "darkGold" ? 5 : 2);
}
```

Call `recordMapMasteryEquipment(normalized)` in `addEquipmentToInventory` through context, and call `recordMapMasteryMaterial` from material drop settlement where map materials are awarded.

- [ ] **Step 3: Extend handbook model**

In `src/systems/adventureHandbook.js`, add model keys:

```js
function productionSuggestions(state = {}, context = handbookCtx) {
  const production = state.production || {};
  return [
    { id: 'mining', title: '收取采矿', desc: `采矿 Lv.${production.mining?.level || 1}，补充阶级矿和精炼矿。` },
    { id: 'artisan', title: '加工胚子', desc: production.artisan?.activeJob ? '工匠有加工任务可查看。' : '使用矿石加工装备胚子和打造组件。' },
  ];
}

function craftingTargets(state = {}, context = handbookCtx) {
  const runtime = context.getEquipmentRuntime?.();
  const series = Object.keys(runtime?.EQUIPMENT_SERIES || {}).filter((id) => id !== 'oldWorld')[0] || 'ancientHero';
  return [{ id: `${series}:weapon`, title: '打造目标武器', desc: '优先补齐当前装备线武器底胚。' }];
}
```

Add to returned model:

```js
productionSuggestions: productionSuggestions(safeState, ctx),
craftingTargets: craftingTargets(safeState, ctx),
```

- [ ] **Step 4: Render in handbook page**

In `src/ui/adventureHandbookPage.js`, add sections:

```js
<section class="handbook-section"><h3>生产建议</h3><div class="handbook-rec-list">${(model.productionSuggestions || []).map(renderSimpleRecRow).join("")}</div></section>
<section class="handbook-section"><h3>可打造目标</h3><div class="handbook-rec-list">${(model.craftingTargets || []).map(renderSimpleRecRow).join("")}</div></section>
```

Add helper:

```js
function renderSimpleRecRow(row) {
  return `<div class="handbook-rec-row"><div><strong>${esc(row.title || row.id)}</strong><small>${esc(row.desc || "")}</small></div></div>`;
}
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check game.js
node --check src/systems/adventureHandbook.js
node --check src/ui/adventureHandbookPage.js
```

Commit:

```bash
git add game.js src/systems/adventureHandbook.js src/ui/adventureHandbookPage.js scripts/test.mjs
git commit -m "feat(handbook): add crafting and production targets"
```

---

### Task 7: Build Linkage V1 Balance Pass

**Files:**
- Modify: `src/systems/equipment/itemSynergy.js`
- Modify: `src/systems/combat/skillMechanics.js` only if a runtime effect needs a hook that does not exist.
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests for line-based Build rules**

Add:

```js
assert.match(itemSynergySource, /refine10/, 'Build synergy should keep first refine threshold.');
assert.match(itemSynergySource, /refine20/, 'Build synergy should keep second refine threshold.');
assert.match(itemSynergySource, /refine30/, 'Build synergy should keep third refine threshold.');
assert.doesNotMatch(itemSynergySource, /lineMastery/i, 'Build synergy should not require line mastery.');
assert.doesNotMatch(itemSynergySource, /abyssTemperingLevel/, 'Build synergy should not require star/refine-like side systems.');
assert.match(itemSynergySource, /ancientHero[\s\S]*heroBurst/, 'Ancient Hero should keep a physical/skill burst identity.');
assert.match(itemSynergySource, /os[\s\S]*osOverclock/, 'OS should keep a skill/cooldown identity.');
```

- [ ] **Step 2: Tune synergy effects**

Keep each line at one core mechanism plus one upgrade mechanism. Keep numeric effects small enough that a single set is not a universal win.

Use this target scale in `EQUIPMENT_SYNERGY_LINES`:

```js
ancientHero: line('ancientHero', '古代英雄共鸣', 'Hero Resonance', [
  mechanism('heroBurst', 4, '英雄爆发', '物理与一转技能形成稳定爆发。', { skillDamageBonus: 0.025, bossDamageBonus: 0.02 }, { burstDamage: 0.08 }),
  mechanism('heroBurstUpgrade', 5, '英雄爆发+', '精炼门槛达成后提高短窗口推进能力。', { combatPaceBonus: 0.025 }, { burstDamage: 0.04 }),
]),
os: line('os', 'OS 超频', 'OS Overclock', [
  mechanism('osOverclock', 4, '自动超频', '魔法与主动技能获得轻量冷却收益。', { skillDamageBonus: 0.03, attackSpeedPct: 0.02 }, { cooldownHaste: 0.025 }),
  mechanism('osOverclockUpgrade', 5, '自动超频+', '技能循环稳定后提高少量装备收益。', { equipmentDrop: 0.025, rareDropBonus: 0.01 }, { killDropWindow: 0.04 }),
]),
```

Apply similar restrained values to higher lines. Do not exceed `finalDamageBonus: 0.05` or `skillDamageBonus: 0.06` from a single line in this task.

- [ ] **Step 3: Verify skill enhancement route**

Keep thresholds based on `enhanceTotal` because the current smithy “装备精炼” uses `enhance`/`enhanceLevel`. Do not use `item.refine`, which is star refine in this codebase.

If the UI labels are confusing, add text-only clarification in synergy display later:

```js
label: '精炼 +10 一转技能联动'
```

- [ ] **Step 4: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/systems/equipment/itemSynergy.js
```

Commit:

```bash
git add src/systems/equipment/itemSynergy.js scripts/test.mjs
git commit -m "balance(equipment): tune build synergy v1"
```

---

### Task 8: Collection UI V1

**Files:**
- Create: `src/ui/collectionPage.js`
- Modify: `src/main.js`
- Modify: `index.html`
- Modify: `game.js`
- Modify: `styles.css`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests**

Add read:

```js
const collectionPageSource = read('src/ui/collectionPage.js');
```

Add:

```js
assert.match(collectionPageSource, /renderCollectionPage/, 'Collection page should render collection progress.');
assert.match(collectionPageSource, /equipmentCount/, 'Collection page should show equipment count.');
assert.match(main, /installCollectionRenderRuntime/, 'Main should install collection renderer.');
assert.match(html, /data-page="collection"/, 'Navigation should include collection page.');
assert.match(html, /id="collectionPage"/, 'HTML should include collection page target.');
assert.match(game, /case "collection":/, 'Classic page switch should render collection page.');
```

- [ ] **Step 2: Create renderer**

Create `src/ui/collectionPage.js`:

```js
let collectionCtx = {};

function esc(value) { return (collectionCtx.escapeHtml || String)(value == null ? '' : value); }
function fmtn(value) { return (collectionCtx.formatNumber || String)(Math.max(0, Number(value || 0))); }

export function renderCollectionPage() {
  const els = collectionCtx.getEls?.() || window.els || {};
  if (!els.collectionPage) return;
  const state = collectionCtx.getState?.() || {};
  const summary = collectionCtx.buildCollectionSummary?.(state) || {};
  els.collectionPage.innerHTML = `<section class="collection-page">
    <div class="panel-heading"><div><p class="eyebrow">长期收藏</p><h2>图鉴进度</h2></div></div>
    <div class="collection-grid">
      <article><span>装备图鉴</span><strong>${fmtn(summary.equipmentCount)}</strong></article>
      <article><span>卡片图鉴</span><strong>${fmtn(summary.cardCount)}</strong></article>
      <article><span>Boss记录</span><strong>${fmtn(summary.bossCount)}</strong></article>
      <article><span>地图完成度</span><strong>${fmtn(summary.mapCount)}</strong></article>
    </div>
    <p class="academy-meta">收藏奖励保持克制，主要提供来源提示、少量材料和长期完成度。</p>
  </section>`;
}

export function installCollectionRenderRuntime(context = {}) {
  collectionCtx = context || {};
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = Object.assign(existing, { renderCollectionPage });
  return window.RuneFrontierRenderRuntime;
}
```

- [ ] **Step 3: Wire page**

Add nav button in `index.html`:

```html
<button data-page="collection" type="button">收藏</button>
```

Add view:

```html
<section class="page-view" data-view="collection">
  <div id="collectionPage"></div>
</section>
```

Add `"collectionPage"` to `cacheElements()`.

Add:

```js
function renderCollectionPage() {
  return window.RuneFrontierRenderRuntime?.renderCollectionPage?.();
}
```

Add page switch:

```js
case "collection":
  renderCollectionPage();
  break;
```

Install in `src/main.js`.

- [ ] **Step 4: Add CSS**

```css
.collection-page {
  display: grid;
  gap: 12px;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.collection-grid article {
  border: 1px solid rgba(129, 92, 41, 0.22);
  border-radius: 8px;
  padding: 12px;
  background: rgba(255, 248, 226, 0.72);
}

.collection-grid span {
  display: block;
  color: var(--text-muted);
  font-size: 12px;
}
```

- [ ] **Step 5: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/ui/collectionPage.js
node --check src/main.js
node --check game.js
```

Commit:

```bash
git add src/ui/collectionPage.js src/main.js index.html game.js styles.css scripts/test.mjs
git commit -m "feat(collection): add collection progress page"
```

---

### Task 9: Material Data and Source Hints

**Files:**
- Modify: `src/data/materials.js`
- Modify: `game.js`
- Modify: `src/systems/adventureHandbook.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Write failing tests**

Add:

```js
assert.match(materialsDataSource, /tierOre/, 'Material data should include tier ore.');
assert.match(materialsDataSource, /weaponEmbryo/, 'Material data should include weapon embryo.');
assert.match(materialsDataSource, /masterCraftVoucher/, 'Material data should include master crafting voucher.');
assert.match(game, /getCraftingMaterialSources/, 'Game should expose crafting material source hints.');
assert.match(adventureHandbookSource, /getCraftingMaterialSources/, 'Handbook should use crafting material source hints.');
```

- [ ] **Step 2: Add material names and DB entries**

In `src/data/materials.js`, add to `materialNames`:

```js
tierOre: "阶级矿",
refinedOre: "精炼矿",
rareOre: "稀有矿",
weaponEmbryo: "武器胚子",
armorEmbryo: "防具胚子",
accessoryEmbryo: "饰品胚子",
craftingComponent: "打造组件",
masterCraftVoucher: "大师打造凭证",
```

Update rarity logic:

```js
["ancientCore", "starShard", "abyssCore", "mythicEssence", "masterCraftVoucher"].includes(id) ? "legend" :
["crystal", "rune", "abyssShard", "rareOre", "craftingComponent"].includes(id) ? "epic" :
["ore", "tierOre", "refinedOre", "weaponEmbryo", "armorEmbryo", "accessoryEmbryo"].includes(id) ? "rare" :
"normal"
```

- [ ] **Step 3: Add source helper**

In `game.js`:

```js
function getCraftingMaterialSources(materialId) {
  const sources = {
    tierOre: [{ mapName: "采矿", difficulty: "生产", note: "采矿长期产出" }],
    refinedOre: [{ mapName: "采矿", difficulty: "生产", note: "采矿长期产出" }],
    rareOre: [{ mapName: "深渊矿脉", difficulty: "生产", note: "高等级采矿产出" }],
    weaponEmbryo: [{ mapName: "工匠", difficulty: "加工", note: "消耗矿石加工" }],
    armorEmbryo: [{ mapName: "工匠", difficulty: "加工", note: "消耗矿石加工" }],
    accessoryEmbryo: [{ mapName: "工匠", difficulty: "加工", note: "消耗矿石加工" }],
    craftingComponent: [{ mapName: "工匠", difficulty: "加工", note: "消耗稀有矿加工" }],
    masterCraftVoucher: [{ mapName: "大师打造", difficulty: "高阶", note: "分解暗金/神话或图鉴奖励" }],
  };
  return sources[materialId] || getMaterialDropSources(materialId);
}
```

Pass it into adventure handbook context and use as fallback in material recommendations.

- [ ] **Step 4: Run tests and commit**

Run:

```bash
npm test
npm run check
node --check src/data/materials.js
node --check game.js
```

Commit:

```bash
git add src/data/materials.js game.js src/systems/adventureHandbook.js scripts/test.mjs
git commit -m "feat(materials): add crafting source hints"
```

---

### Task 10: Browser Smoke and Final Verification

**Files:**
- No planned source changes unless smoke finds a bug.

- [ ] **Step 1: Run full automated verification**

Run:

```bash
npm test
npm run check
node --check game.js
node --check server.js
node --check src/main.js
node --check src/systems/production/catalog.js
node --check src/systems/production/state.js
node --check src/systems/production/mining.js
node --check src/systems/production/artisan.js
node --check src/systems/equipment/crafting.js
node --check src/systems/equipment/equipmentResearch.js
node --check src/systems/collections/equipmentCollection.js
node --check src/ui/smithyCraftingPanel.js
node --check src/ui/collectionPage.js
```

Expected: all pass. Existing Node module-type warning is acceptable only if exit code is 0.

- [ ] **Step 2: Start local app**

Run:

```bash
npm start
```

Expected: app loads locally.

- [ ] **Step 3: Browser smoke Smithy**

In the app browser:

- Open `铁匠铺`.
- Verify tabs include `生产` and `装备打造`.
- Click `收取` in mining. If no elapsed time, a friendly toast is shown.
- Start an artisan job when enough materials exist.
- Attempt a normal craft. If materials are missing, the button or toast explains the missing state.
- No console render errors.

- [ ] **Step 4: Browser smoke Handbook and Collection**

Verify:

- `冒险手册` shows production suggestions and craftable targets.
- Material rows do not show all unknown materials by default.
- `收藏` page opens and shows equipment/card/Boss/map counters.
- Existing Adventure page still shows Boss progress and Skill DPS.

- [ ] **Step 5: Final review checklist**

Check the implementation against the spec:

- P1 mining exists and grants tier/refined/rare ore.
- P1 artisan exists and produces embryos/components.
- P2 normal crafting can target line/tier/slot/archetype.
- P2 crafting mastery gains exp per craft.
- P2 darkGold/mythic master crafting is level-gated, blueprint-gated, and expensive.
- P3 equipment research records drops/salvage/crafting/upgrades.
- P3 map mastery reuses or extends map exploration.
- P5 Build linkage remains restrained and line-based.
- P7 collection records equipment, Boss, map, and card progress at least at summary level.
- P4/P6/P8 are not implemented.

- [ ] **Step 6: Commit final smoke fixes if needed**

If any smoke fixes were required:

```bash
git add game.js src/main.js src/systems/production src/systems/equipment src/systems/collections src/ui styles.css index.html scripts/test.mjs
git commit -m "fix(crafting): address smoke findings"
```

---

## Acceptance Criteria

- Mining and artisan production exist in the smithy and are backed by normalized state.
- Equipment crafting can create deterministic progression equipment by line, tier, slot, archetype, and allowed rarity.
- Every successful craft grants crafting experience.
- Crafting level gates higher tier crafting and dark-gold/mythic master crafting.
- Dark-gold/mythic master crafting requires blueprint ownership and expensive materials.
- Dropped, salvaged, crafted, and upgraded equipment feed equipment research.
- Equipment research gives small economic bonuses only, not large direct combat power.
- Map mastery is represented through map exploration gains and source hints.
- Build linkage remains line-based and restrained.
- Collection progress records equipment, Boss, map, and card progress at least in summary.
- Adventure Handbook explains production and crafting targets.
- Material source hints include crafting materials.
- `npm test`, `npm run check`, and `node --check` pass.

## Self-Review Notes

- Spec coverage: P1, P2, P3, P5, and P7 are covered by Tasks 1-9.
- Exclusions: P4, P6, P8 remain explicitly out of scope.
- File boundaries: production logic is in `src/systems/production`, crafting/research in `src/systems/equipment`, collection in `src/systems/collections`, rendering in `src/ui`.
- State bridge: `game.js` only adds default/normalize wrappers, event delegation, and thin runtime calls.
- TDD: every behavior task starts with a failing `scripts/test.mjs` addition before implementation.
