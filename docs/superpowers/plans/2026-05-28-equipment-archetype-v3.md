# Equipment Archetype V3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Equipment V3 first-day loop: physical / magic / general archetypes drive equipment generation, rerolling, scoring, filtering, drop feedback, auto-equip, and auto-salvage protection.

**Architecture:** Add focused pure helpers under `src/systems/equipment/` and expose them through the existing equipment runtime bridge. Keep `game.js` as the current runtime authority for UI/event wiring, but move archetype inference, score, fit tags, and reroll cost rules into modules so they can be tested directly.

**Tech Stack:** Vanilla JavaScript browser runtime, Node.js test script `scripts/test.mjs`, classic `game.js` bridge installed by `src/main.js`.

---

## File Structure

- Create: `src/systems/equipment/itemArchetype.js`
  - Owns archetype constants, labels, route detection, inference, weighted roll, stat pools, fit tags, and reroll cost rules.
- Modify: `src/systems/equipment/itemFactory.js`
  - Adds `archetype` to `createItem()`, `normalizeItem()`, and V2 reset rerolls.
- Modify: `src/systems/equipment/itemScore.js`
  - Adds `physicalScore`, `magicScore`, `generalScore`, and `archetypeFit`.
- Modify: `src/systems/equipment/dismantle.js`
  - Updates auto-equip and auto-salvage to use archetype-aware decisions supplied by context.
- Modify: `src/systems/equipment/index.js`
  - Exports and installs the new archetype helpers.
- Modify: `game.js`
  - Bridges runtime helpers, makes random affixes archetype-biased, wires material/ticket rerolls, adds filters and display, and improves drop feedback.
- Modify: `src/ui/equipmentPage.js`
  - Adds render bridge names if new render helpers are bridged from `game.js`.
- Modify: `scripts/test.mjs`
  - Adds red/green regression tests for all V3 contracts.

---

### Task 1: Add Failing Archetype Contract Tests

**Files:**
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Import the new module source**

Near existing equipment source reads, add:

```js
const itemArchetypeSource = read('src/systems/equipment/itemArchetype.js');
```

- [ ] **Step 2: Add static bridge assertions**

Near the existing Equipment V2 static assertions, add:

```js
assert.match(game, /archetype:\s*rollEquipmentArchetype/, 'New equipment must store an archetype at creation time.');
assert.match(game, /data-equipment-filter="physical"/, 'Equipment page must expose physical archetype filtering.');
assert.match(game, /data-equipment-filter="magic"/, 'Equipment page must expose magic archetype filtering.');
assert.match(game, /data-equipment-filter="general"/, 'Equipment page must expose general archetype filtering.');
assert.match(game, /data-reforge-archetype/, 'Equipment reroll UI must support directed archetype rerolls.');
assert.match(game, /getEquipmentFitTags/, 'Equipment UI must show archetype fit tags.');
```

- [ ] **Step 3: Add pure archetype module tests**

After the `itemScore` tests and before dismantle tests, add:

```js
const itemArchetype = await importSource(itemArchetypeSource);
assert.deepEqual(itemArchetype.EQUIPMENT_ARCHETYPES, ['physical', 'magic', 'general'], 'Equipment V3 archetypes changed.');
assert.equal(itemArchetype.normalizeEquipmentArchetype('physical'), 'physical', 'Valid physical archetype must normalize.');
assert.equal(itemArchetype.normalizeEquipmentArchetype('weird'), 'general', 'Unknown archetypes must fall back to general.');
assert.equal(itemArchetype.getEquipmentArchetypeLabel('magic'), '魔法', 'Magic archetype label changed.');
assert.equal(
  itemArchetype.getJobArchetypeRoute({ id: 'knight' }),
  'physical',
  'Knight should be treated as a physical job route.'
);
assert.equal(
  itemArchetype.getJobArchetypeRoute({ id: 'wizard' }),
  'magic',
  'Wizard should be treated as a magic job route.'
);
assert.equal(
  itemArchetype.inferEquipmentArchetype({ atk: 120, str: 12, critDamageBonus: 0.1 }),
  'physical',
  'Physical-heavy legacy equipment must infer physical.'
);
assert.equal(
  itemArchetype.inferEquipmentArchetype({ matk: 140, int: 18, skillDamageBonus: 0.12 }),
  'magic',
  'Magic-heavy legacy equipment must infer magic.'
);
assert.equal(
  itemArchetype.inferEquipmentArchetype({ hp: 500, def: 80, equipmentDrop: 0.08 }),
  'general',
  'Survival/loot-heavy legacy equipment must infer general.'
);
const physicalPools = itemArchetype.getArchetypeStatPools('physical');
assert.ok(physicalPools.percent.includes('critDamageBonus'), 'Physical pool must include physical output stats.');
assert.ok(!physicalPools.percent.includes('echoChance'), 'Physical priority pool must not include magic-only echo.');
const magicPools = itemArchetype.getArchetypeStatPools('magic');
assert.ok(magicPools.percent.includes('skillDamageBonus'), 'Magic pool must include skill damage.');
assert.ok(magicPools.percent.includes('echoChance'), 'Magic pool must include echo.');
const generalPools = itemArchetype.getArchetypeStatPools('general');
assert.ok(generalPools.percent.includes('equipmentDrop'), 'General pool must include loot stats.');
assert.ok(generalPools.percent.includes('offlineEfficiencyBonus'), 'General pool must include idle stats.');
const physicalRolls = Array.from({ length: 20 }, () => itemArchetype.rollEquipmentArchetype({ slot: 'weapon', atk: 10 }, { job: { id: 'knight' }, random: () => 0.1 }));
assert.ok(physicalRolls.every((value) => value === 'physical'), 'Low roll for physical job weapon should choose physical.');
const magicRolls = Array.from({ length: 20 }, () => itemArchetype.rollEquipmentArchetype({ slot: 'weapon', matk: 10 }, { job: { id: 'wizard' }, random: () => 0.1 }));
assert.ok(magicRolls.every((value) => value === 'magic'), 'Low roll for magic job weapon should choose magic.');
const generalRoll = itemArchetype.rollEquipmentArchetype({ slot: 'armor' }, { job: { id: 'knight' }, random: () => 0.99 });
assert.equal(generalRoll, 'general', 'High roll for armor should be able to choose general.');
assert.equal(
  itemArchetype.getReforgeCost({ rarity: 'legend', level: 60 }, 'magic', { mode: 'directed' }).materials.ancientCore,
  1,
  'Legend directed reroll must require ancientCore.'
);
assert.equal(
  itemArchetype.getReforgeCost({ rarity: 'normal', level: 1 }, 'physical', { mode: 'ticket' }).ticket,
  'equipmentReforgeTicket',
  'Ticket reroll must consume an equipment reforge ticket.'
);
const fitTags = itemArchetype.getEquipmentFitTags(
  { archetype: 'physical', rarity: 'legend', atk: 120, str: 12, critDamageBonus: 0.1 },
  { job: { id: 'knight' } }
);
assert.ok(fitTags.includes('职业适配'), 'Fit tags must identify matching current-job equipment.');
assert.ok(fitTags.includes('可打造胚子'), 'Fit tags must mark high-quality matching bases.');
```

- [ ] **Step 4: Add factory, score, and mutation tests**

Extend existing item factory and score tests:

```js
const generatedPhysical = itemFactory.createItem(
  { name: 'Blade', slot: 'weapon', atk: 10 },
  1,
  'normal',
  { job: { id: 'knight' } },
  {
    ...factoryContext,
    rollEquipmentArchetype: () => 'physical',
  }
);
assert.equal(generatedPhysical.archetype, 'physical', 'Created equipment must store the rolled archetype.');
assert.equal(
  itemFactory.normalizeItem({ atk: 100 }).archetype,
  'physical',
  'Legacy normalize must infer archetype when missing.'
);
const physicalScores = itemScore.calculateEquipmentScores({ archetype: 'physical', atk: 120, str: 15 });
assert.ok(physicalScores.physicalScore > physicalScores.magicScore, 'Physical gear must score higher as physical.');
const magicScores = itemScore.calculateEquipmentScores({ archetype: 'magic', matk: 120, int: 15, skillDamageBonus: 0.1 });
assert.ok(magicScores.magicScore > magicScores.physicalScore, 'Magic gear must score higher as magic.');
const generalScores = itemScore.calculateEquipmentScores({ archetype: 'general', hp: 500, equipmentDrop: 0.08 });
assert.ok(generalScores.generalScore > 0, 'General gear must produce a general score.');
assert.ok(Number.isFinite(generalScores.archetypeFit), 'Equipment score must include finite archetypeFit.');
```

Add a dismantle protection test near auto-salvage tests:

```js
assert.equal(
  dismantle.shouldAutoSalvage(
    { rarity: 'rare', archetype: 'physical', atk: 100 },
    { ...mutationContext, shouldProtectEquipment: () => true }
  ),
  false,
  'Auto-salvage must respect archetype-aware protection.'
);
```

- [ ] **Step 5: Run tests to verify RED**

Run:

```bash
npm test
```

Expected: FAIL with missing `src/systems/equipment/itemArchetype.js` or missing exported archetype helpers.

- [ ] **Step 6: Commit red tests if following strict TDD branch discipline**

Do not commit red tests to the shared branch unless the executor's workflow explicitly allows red commits. If not committing red tests, continue to Task 2 immediately.

---

### Task 2: Implement Pure Archetype Helpers

**Files:**
- Create: `src/systems/equipment/itemArchetype.js`
- Modify: `src/systems/equipment/index.js`

- [ ] **Step 1: Create `itemArchetype.js`**

Add this file:

```js
export const EQUIPMENT_ARCHETYPES = ['physical', 'magic', 'general'];

export const EQUIPMENT_ARCHETYPE_LABELS = Object.freeze({
  physical: '物理',
  magic: '魔法',
  general: '通用',
});

const PHYSICAL_JOBS = new Set([
  'novice', 'swordman', 'knight', 'lordKnight', 'runeKnight',
  'archer', 'hunter', 'sniper', 'ranger',
  'merchant', 'blacksmith', 'whiteSmith', 'mechanic',
  'thief', 'assassin', 'assassinCross', 'guillotineCross',
]);

const MAGIC_JOBS = new Set([
  'mage', 'wizard', 'highWizard', 'warlock',
  'acolyte', 'priest', 'highPriest', 'archbishop',
]);

const RARITY_RANK = Object.freeze({
  normal: 0,
  fine: 1,
  rare: 2,
  epic: 3,
  ancient: 4,
  legend: 5,
  darkGold: 6,
  mythic: 7,
});

const STAT_POOLS = Object.freeze({
  physical: Object.freeze({
    flat: ['atk', 'str', 'dex', 'agi'],
    percent: ['attackSpeedPct', 'critRatePct', 'critDamageBonus', 'lifeSteal', 'bossDamageBonus', 'finalDamageBonus', 'monsterDamageBonus'],
    mechanic: ['splash', 'pursuit', 'breaker'],
  }),
  magic: Object.freeze({
    flat: ['matk', 'int', 'dex', 'vit'],
    percent: ['skillDamageBonus', 'echoChance', 'finalDamageBonus', 'bossDamageBonus', 'baseExpBonus', 'jobExpBonus'],
    mechanic: ['echo', 'starlight', 'recovery'],
  }),
  general: Object.freeze({
    flat: ['hp', 'def', 'vit', 'luk'],
    percent: ['damageReductionPct', 'blockRate', 'dodgeRatePct', 'drop', 'rareDropBonus', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus', 'offlineEfficiencyBonus'],
    mechanic: ['greed', 'thorn', 'starlight', 'recovery'],
  }),
});

function number(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function rankOf(rarity) {
  return RARITY_RANK[rarity] ?? 0;
}

export function normalizeEquipmentArchetype(value) {
  return EQUIPMENT_ARCHETYPES.includes(value) ? value : 'general';
}

export function getEquipmentArchetypeLabel(value) {
  return EQUIPMENT_ARCHETYPE_LABELS[normalizeEquipmentArchetype(value)];
}

export function getJobArchetypeRoute(job = {}) {
  const id = job?.id || job?.from || '';
  if (MAGIC_JOBS.has(id)) return 'magic';
  if (PHYSICAL_JOBS.has(id)) return 'physical';
  return 'general';
}

export function inferEquipmentArchetype(item = {}, context = {}) {
  if (EQUIPMENT_ARCHETYPES.includes(item.archetype)) return item.archetype;
  if (EQUIPMENT_ARCHETYPES.includes(item.templateArchetype)) return item.templateArchetype;
  const physical =
    number(item.atk) * 1.2 +
    number(item.str) * 12 +
    number(item.agi) * 6 +
    number(item.dex) * 5 +
    number(item.attackSpeedPct) * 3200 +
    number(item.critRatePct) * 3200 +
    number(item.critDamageBonus) * 3600 +
    number(item.lifeSteal) * 2400;
  const magic =
    number(item.matk) * 1.2 +
    number(item.int) * 13 +
    number(item.dex) * 5 +
    number(item.skillDamageBonus) * 4200 +
    number(item.echoChance) * 4800 +
    number(item.finalDamageBonus) * 3000;
  const general =
    number(item.hp) * 0.35 +
    number(item.def) * 2.4 +
    number(item.vit) * 10 +
    number(item.damageReductionPct) * 7000 +
    number(item.blockRate) * 2600 +
    number(item.dodgeRatePct) * 2400 +
    number(item.drop) * 3600 +
    number(item.rareDropBonus) * 5200 +
    number(item.equipmentDrop) * 4600 +
    number(item.cardDrop) * 3800 +
    number(item.materialQuantityBonus) * 3200 +
    number(item.offlineEfficiencyBonus) * 3200;
  const best = Math.max(physical, magic, general);
  if (best <= 0) {
    const slot = context.normalizeEquipmentSlot?.(item.equipSlot || item.slot) || item.equipSlot || item.slot;
    if (slot === 'weapon' && number(item.matk) > number(item.atk)) return 'magic';
    if (slot === 'weapon' && number(item.atk) > 0) return 'physical';
    return 'general';
  }
  if (physical >= magic * 1.15 && physical >= general * 0.85) return 'physical';
  if (magic >= physical * 1.15 && magic >= general * 0.85) return 'magic';
  return 'general';
}

export function getArchetypeStatPools(archetype) {
  return STAT_POOLS[normalizeEquipmentArchetype(archetype)];
}

export function rollEquipmentArchetype(template = {}, context = {}) {
  const fixed = normalizeEquipmentArchetype(template.archetype || template.templateArchetype || '');
  if (template.archetype || template.templateArchetype) return fixed;
  const slot = context.normalizeEquipmentSlot?.(template.equipSlot || template.slot) || template.equipSlot || template.slot;
  const weights = { physical: 35, magic: 35, general: 30 };
  if (slot === 'weapon') {
    if (number(template.matk) > number(template.atk)) weights.magic += 20;
    else if (number(template.atk) > number(template.matk)) weights.physical += 20;
  }
  if (['armor', 'headgear', 'shoes', 'trinket'].includes(slot)) {
    weights.general += 10;
    weights.physical -= 5;
    weights.magic -= 5;
  }
  const route = getJobArchetypeRoute(context.job || context.currentJob?.());
  if (route === 'physical') weights.physical += 10;
  if (route === 'magic') weights.magic += 10;
  const mapBias = context.archetypeBias || template.archetypeBias || {};
  EQUIPMENT_ARCHETYPES.forEach((key) => {
    weights[key] += number(mapBias[key]);
    weights[key] = Math.max(1, weights[key]);
  });
  const total = EQUIPMENT_ARCHETYPES.reduce((sum, key) => sum + weights[key], 0);
  let roll = (context.random?.() ?? Math.random()) * total;
  for (const key of EQUIPMENT_ARCHETYPES) {
    roll -= weights[key];
    if (roll <= 0) return key;
  }
  return 'general';
}

export function calculateArchetypeScores(item = {}, effectiveStats = item, job = {}) {
  const stats = effectiveStats || {};
  const physicalScore =
    number(stats.atk) * 1.9 +
    number(stats.str) * 16 +
    number(stats.dex) * 8 +
    number(stats.agi) * 6 +
    number(stats.attackSpeedPct) * 3000 +
    number(stats.critRatePct) * 3600 +
    number(stats.critDamageBonus) * 4300 +
    number(stats.lifeSteal) * 2400 +
    number(stats.bossDamageBonus) * 2400 +
    number(stats.finalDamageBonus) * 4200;
  const magicScore =
    number(stats.matk) * 1.9 +
    number(stats.int) * 17 +
    number(stats.dex) * 8 +
    number(stats.skillDamageBonus) * 5200 +
    number(stats.echoChance) * 5200 +
    number(stats.finalDamageBonus) * 4300 +
    number(stats.bossDamageBonus) * 2200 +
    number(stats.baseExpBonus) * 1400 +
    number(stats.jobExpBonus) * 1400;
  const generalScore =
    number(stats.hp) * 0.42 +
    number(stats.def) * 2.8 +
    number(stats.vit) * 14 +
    number(stats.damageReductionPct) * 7600 +
    number(stats.blockRate) * 3600 +
    number(stats.dodgeRatePct) * 2600 +
    number(stats.drop) * 3400 +
    number(stats.rareDropBonus) * 5200 +
    number(stats.equipmentDrop) * 4600 +
    number(stats.cardDrop) * 3800 +
    number(stats.materialQuantityBonus) * 3200 +
    number(stats.offlineEfficiencyBonus) * 3600;
  const archetype = normalizeEquipmentArchetype(item.archetype || inferEquipmentArchetype(item));
  const route = getJobArchetypeRoute(job);
  const preferred = archetype === 'physical' ? physicalScore : archetype === 'magic' ? magicScore : generalScore;
  const routeScore = route === 'physical' ? physicalScore : route === 'magic' ? magicScore : Math.max(physicalScore, magicScore, generalScore);
  const best = Math.max(1, physicalScore, magicScore, generalScore);
  const archetypeFit = Math.max(0, Math.min(1, preferred / best));
  return {
    physicalScore: Math.max(0, Math.round(physicalScore)),
    magicScore: Math.max(0, Math.round(magicScore)),
    generalScore: Math.max(0, Math.round(generalScore)),
    archetypeFit: Number(archetypeFit.toFixed(3)),
    currentJobScore: Math.max(0, Math.round(routeScore)),
  };
}

export function getEquipmentFitTags(item = {}, context = {}) {
  const job = context.job || context.currentJob?.() || {};
  const archetype = normalizeEquipmentArchetype(item.archetype || inferEquipmentArchetype(item, context));
  const route = getJobArchetypeRoute(job);
  const scores = calculateArchetypeScores(item, item, job);
  const tags = [getEquipmentArchetypeLabel(archetype)];
  if (route === archetype || archetype === 'general') tags.push('职业适配');
  else tags.push('可用');
  if (rankOf(item.rarity) >= rankOf('epic') && scores.archetypeFit >= 0.65) tags.push('可打造胚子');
  return [...new Set(tags)];
}

export function shouldProtectEquipmentByArchetype(item = {}, context = {}) {
  if (item.locked || item.setId || item.rarity === 'mythic' || item.rarity === 'darkGold') return true;
  if (rankOf(item.rarity) >= rankOf('legend')) return true;
  const tags = getEquipmentFitTags(item, context);
  return tags.includes('可打造胚子') || (rankOf(item.rarity) >= rankOf('epic') && tags.includes('职业适配'));
}

export function getReforgeCost(item = {}, targetArchetype = item.archetype, options = {}) {
  const mode = options.mode || 'normal';
  if (mode === 'ticket') return { ticket: 'equipmentReforgeTicket', gold: 0, materials: {} };
  const level = Math.max(1, number(item.level || item.dropLevel || 1));
  const directed = Boolean(targetArchetype && targetArchetype !== item.archetype) || mode === 'directed';
  const rank = rankOf(item.rarity);
  const materials = directed
    ? { rune: 2 + Math.floor(level / 20), crystal: 2 + Math.floor(level / 30) }
    : { rune: 1 + Math.floor(level / 25), ore: 2 + Math.floor(level / 20) };
  if (directed && rank >= rankOf('epic')) materials.starShard = 1;
  if (directed && rank >= rankOf('legend')) materials.ancientCore = 1;
  if (directed && rank >= rankOf('mythic')) materials.mythicEssence = 1;
  return { ticket: '', gold: (directed ? 8000 : 3500) * Math.max(1, level), materials };
}
```

- [ ] **Step 2: Export helpers from `index.js`**

Add:

```js
import {
  calculateArchetypeScores,
  getArchetypeStatPools,
  getEquipmentArchetypeLabel,
  getEquipmentFitTags,
  getJobArchetypeRoute,
  getReforgeCost,
  inferEquipmentArchetype,
  normalizeEquipmentArchetype,
  rollEquipmentArchetype,
  shouldProtectEquipmentByArchetype,
} from './itemArchetype.js';
export * from './itemArchetype.js';
```

Add these fields to the installed runtime object:

```js
calculateArchetypeScores,
getArchetypeStatPools,
getEquipmentArchetypeLabel,
getEquipmentFitTags,
getJobArchetypeRoute,
getReforgeCost,
inferEquipmentArchetype,
normalizeEquipmentArchetype,
rollEquipmentArchetype,
shouldProtectEquipmentByArchetype,
```

- [ ] **Step 3: Run tests**

Run:

```bash
npm test
```

Expected: archetype module tests pass; factory/game/UI assertions continue failing because those integration points are implemented in Tasks 3-6.

- [ ] **Step 4: Commit**

```bash
git add src/systems/equipment/itemArchetype.js src/systems/equipment/index.js scripts/test.mjs
git commit -m "feat: add equipment archetype helpers"
```

---

### Task 3: Attach Archetypes to Equipment Creation and Normalize

**Files:**
- Modify: `src/systems/equipment/itemFactory.js`
- Modify: `game.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Import helpers into `itemFactory.js`**

At the top:

```js
import { inferEquipmentArchetype, normalizeEquipmentArchetype } from './itemArchetype.js';
```

- [ ] **Step 2: Store archetype in `createItem()`**

Before the `item` object, add:

```js
const archetype = normalizeEquipmentArchetype(
  context.archetype || runtime.rollEquipmentArchetype?.(template, { ...context, normalizeEquipmentSlot: runtime.normalizeEquipmentSlot }) || template.archetype,
);
```

Inside the `item` object, after `source`, add:

```js
archetype,
```

- [ ] **Step 3: Store archetype in `normalizeItem()`**

Inside the normalized object, after `source`, add:

```js
archetype: normalizeEquipmentArchetype(item.archetype || runtime.inferEquipmentArchetype?.(item) || inferEquipmentArchetype(item, runtime)),
```

- [ ] **Step 4: Preserve or direct archetype in V2 reset**

In `resetItemForStatV2`, pass target archetype to `createItem()`:

```js
archetype: runtime.normalizeEquipmentArchetype?.(item.targetArchetype || item.archetype) || item.targetArchetype || item.archetype,
```

- [ ] **Step 5: Add bridge functions to `game.js` legacy context**

In `RuneFrontierLegacyEquipmentContext`, add:

```js
inferEquipmentArchetype(item) {
  return window.RuneFrontierEquipmentRuntime?.inferEquipmentArchetype?.(item) || "general";
},
normalizeEquipmentArchetype(value) {
  return window.RuneFrontierEquipmentRuntime?.normalizeEquipmentArchetype?.(value) || "general";
},
rollEquipmentArchetype(template, context = {}) {
  return window.RuneFrontierEquipmentRuntime?.rollEquipmentArchetype?.(template, {
    ...context,
    job: currentJob(),
    currentJob,
    random: Math.random,
    normalizeEquipmentSlot,
  }) || "general";
},
```

- [ ] **Step 6: Update runtime V2 migration in `game.js`**

When `migrateEquipmentItemToV2()` calls `createItem`, include:

```js
archetype: source.targetArchetype || source.archetype,
```

After rerolled rarity/tier assignment, add:

```js
rerolled.archetype = normalizeEquipmentArchetype(source.targetArchetype || source.archetype || rerolled.archetype);
```

- [ ] **Step 7: Expose small global wrappers**

Near other wrapper helpers in `game.js`, add:

```js
function normalizeEquipmentArchetype(value) {
  return window.RuneFrontierEquipmentRuntime?.normalizeEquipmentArchetype?.(value) || "general";
}

function getEquipmentArchetypeLabel(value) {
  return window.RuneFrontierEquipmentRuntime?.getEquipmentArchetypeLabel?.(value) || "通用";
}

function inferEquipmentArchetype(item) {
  return window.RuneFrontierEquipmentRuntime?.inferEquipmentArchetype?.(item) || "general";
}
```

Add these names to `Object.assign(window, { ... })` near other equipment helpers.

- [ ] **Step 8: Run tests**

Run:

```bash
npm test
npm run check
```

Expected: creation and normalize tests pass. Static UI and reroll tests may still fail.

- [ ] **Step 9: Commit**

```bash
git add game.js src/systems/equipment/itemFactory.js scripts/test.mjs
git commit -m "feat: attach archetypes to equipment"
```

---

### Task 4: Bias Random Affixes and Rerolls by Archetype

**Files:**
- Modify: `game.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add tests for archetype-biased random stats**

In `scripts/test.mjs`, add static assertions:

```js
assert.match(game, /getArchetypeStatPools/, 'Random affix rolling must read archetype stat pools.');
assert.match(game, /targetArchetype/, 'Directed reroll must pass targetArchetype into item creation.');
assert.match(game, /getReforgeCost/, 'Rerolling must use archetype-aware reforge costs.');
```

- [ ] **Step 2: Add bridge wrappers in `game.js`**

Near `inferEquipmentArchetype`, add:

```js
function getArchetypeStatPools(archetype) {
  return window.RuneFrontierEquipmentRuntime?.getArchetypeStatPools?.(archetype) || null;
}

function getReforgeCost(item, targetArchetype, options = {}) {
  return window.RuneFrontierEquipmentRuntime?.getReforgeCost?.(item, targetArchetype, options) || { gold: 0, materials: {} };
}
```

- [ ] **Step 3: Bias `rollRandomStats(tierId, archetype)`**

Change the function signature from:

```js
function rollRandomStats(tierId) {
```

to:

```js
function rollRandomStats(tierId, archetype = "general") {
```

Inside the function, before choosing each affix pool, merge archetype pools with existing slot/tier pools:

```js
const archetypePools = getArchetypeStatPools(archetype) || {};
const flatPool = [...new Set([...(archetypePools.flat || []), ...(pool.flat || [])])];
const percentPool = [...new Set([...(archetypePools.percent || []), ...(pool.percent || [])])];
const mechanicPool = [...new Set([...(archetypePools.mechanic || []), ...(pool.mechanic || [])])];
```

Then pick from `flatPool`, `percentPool`, and `mechanicPool` instead of only the old pool arrays. Keep old caps and range handling unchanged.

- [ ] **Step 4: Pass archetype from item creation to random affixes**

Where `createItem()` calls `runtime.rollRandomStats?.(safeTier.id)`, change to:

```js
runtime.rollRandomStats?.(safeTier.id, archetype)
```

Where legacy `createItem()` in `game.js` builds random stats, do the same.

- [ ] **Step 5: Replace `reforgeEquipmentV2()` with archetype-aware reroll**

Change the signature:

```js
function reforgeEquipmentV2(itemId, targetArchetype = "", mode = "ticket") {
```

Use:

```js
const normalizedTarget = targetArchetype ? normalizeEquipmentArchetype(targetArchetype) : item.archetype || inferEquipmentArchetype(item);
const cost = getReforgeCost(item, normalizedTarget, { mode });
if (cost.ticket) {
  const tickets = state.materials[cost.ticket] || 0;
  if (tickets <= 0) return showToast("装备重铸券不足。");
  state.materials[cost.ticket] = Math.max(0, tickets - 1);
} else {
  if (state.gold < Number(cost.gold || 0) || !hasMaterials(cost.materials || {})) return showToast("重铸材料或金币不足。");
  state.gold = Math.max(0, state.gold - Number(cost.gold || 0));
  consumeMaterials(cost.materials || {});
}
const rerolled = migrateEquipmentItemToV2({ ...item, targetArchetype: normalizedTarget });
rerolled.archetype = normalizedTarget;
```

Keep id preservation, equipped slot preservation, save, render, and toast behavior.

- [ ] **Step 6: Wire reroll buttons**

In equipment card actions, replace the single reroll button with:

```html
<button type="button" data-reforge-v2-item="${item.id}" data-reforge-mode="ticket" ${reforgeTickets <= 0 ? "disabled" : ""}>券重铸</button>
<button type="button" data-reforge-v2-item="${item.id}" data-reforge-mode="normal">保留重铸</button>
<button type="button" data-reforge-v2-item="${item.id}" data-reforge-mode="directed" data-reforge-archetype="physical">物理</button>
<button type="button" data-reforge-v2-item="${item.id}" data-reforge-mode="directed" data-reforge-archetype="magic">魔法</button>
<button type="button" data-reforge-v2-item="${item.id}" data-reforge-mode="directed" data-reforge-archetype="general">通用</button>
```

In the click handler, change:

```js
reforgeEquipmentV2(reforgeButton.dataset.reforgeV2Item);
```

to:

```js
reforgeEquipmentV2(reforgeButton.dataset.reforgeV2Item, reforgeButton.dataset.reforgeArchetype || "", reforgeButton.dataset.reforgeMode || "ticket");
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm test
npm run check
```

Expected: affix/reroll static assertions pass; UI filtering and score assertions may still fail if not implemented.

- [ ] **Step 8: Commit**

```bash
git add game.js scripts/test.mjs
git commit -m "feat: add archetype-directed equipment rerolls"
```

---

### Task 5: Add Archetype Scores, Fit Tags, Auto-Equip, and Auto-Salvage Protection

**Files:**
- Modify: `src/systems/equipment/itemScore.js`
- Modify: `src/systems/equipment/dismantle.js`
- Modify: `game.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Import score helper into `itemScore.js`**

Add:

```js
import { calculateArchetypeScores } from './itemArchetype.js';
```

- [ ] **Step 2: Merge archetype scores into `calculateEquipmentScores()`**

After `treasure`, add:

```js
const archetypeScores = calculateArchetypeScores(item || {}, stats, job || {});
```

Update comprehensive:

```js
const routeScore = archetypeScores.currentJobScore || Math.max(archetypeScores.physicalScore, archetypeScores.magicScore, archetypeScores.generalScore);
const comprehensive = output * 0.3 + survival * 0.22 + boss * 0.14 + abyss * 0.12 + treasure * 0.06 + routeScore * 0.16;
```

Return the existing keys plus:

```js
physicalScore: archetypeScores.physicalScore,
magicScore: archetypeScores.magicScore,
generalScore: archetypeScores.generalScore,
archetypeFit: archetypeScores.archetypeFit,
currentJobScore: archetypeScores.currentJobScore,
```

- [ ] **Step 3: Add context-aware auto-equip score**

In `game.js`, add:

```js
function equipmentAutoEquipScore(item, job = currentJob()) {
  const scores = calculateEquipmentScores(item, job);
  const route = window.RuneFrontierEquipmentRuntime?.getJobArchetypeRoute?.(job) || "general";
  if (route === "physical") return scores.physicalScore || scores.output || scores.comprehensive;
  if (route === "magic") return scores.magicScore || scores.output || scores.comprehensive;
  return Math.max(scores.generalScore || 0, scores.comprehensive || 0);
}
```

In `RuneFrontierLegacyEquipmentContext`, change `itemScore` to:

```js
itemScore: equipmentAutoEquipScore,
```

- [ ] **Step 4: Use archetype protection in `dismantle.js`**

In `shouldAutoSalvage`, after abyss protection, add:

```js
if (ctx.shouldProtectEquipment?.(item)) return false;
```

- [ ] **Step 5: Add protection bridge in `game.js`**

Add:

```js
function shouldProtectEquipment(item) {
  return window.RuneFrontierEquipmentRuntime?.shouldProtectEquipmentByArchetype?.(item, { job: currentJob(), currentJob }) || isHighValueEquipment(item);
}
```

In `RuneFrontierLegacyEquipmentContext`, add:

```js
shouldProtectEquipment,
```

In `filterEquipmentList`, replace `!isHighValueEquipment(item)` for `salvageable` with:

```js
!shouldProtectEquipment(item)
```

- [ ] **Step 6: Ensure tests for score keys and protection exist exactly once**

Add these assertions, or keep the copy from Task 1 and do not duplicate them:

```js
assert.ok('physicalScore' in physicalScores, 'Equipment scores must expose physicalScore.');
assert.ok('magicScore' in magicScores, 'Equipment scores must expose magicScore.');
assert.ok('generalScore' in generalScores, 'Equipment scores must expose generalScore.');
assert.match(game, /equipmentAutoEquipScore/, 'Auto-equip must use archetype-aware score.');
assert.match(game, /shouldProtectEquipment/, 'Auto-salvage must use archetype-aware protection.');
```

- [ ] **Step 7: Run tests**

Run:

```bash
npm test
npm run check
```

Expected: score, auto-equip, and auto-salvage tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/systems/equipment/itemScore.js src/systems/equipment/dismantle.js game.js scripts/test.mjs
git commit -m "feat: score equipment archetype fit"
```

---

### Task 6: Show Archetypes, Filters, Fit Tags, and Better Drop Feedback

**Files:**
- Modify: `game.js`
- Modify: `src/ui/equipmentPage.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add UI helper wrappers in `game.js`**

Add:

```js
function getEquipmentFitTags(item) {
  return window.RuneFrontierEquipmentRuntime?.getEquipmentFitTags?.(item, { job: currentJob(), currentJob }) || [getEquipmentArchetypeLabel(item.archetype)];
}

function renderEquipmentArchetypeBadge(item) {
  const archetype = normalizeEquipmentArchetype(item.archetype || inferEquipmentArchetype(item));
  return `<span class="equipment-badge equipment-archetype-badge">${getEquipmentArchetypeLabel(archetype)}</span>`;
}
```

Add both names to `Object.assign(window, { ... })`.

- [ ] **Step 2: Update render bridge list**

In `src/ui/equipmentPage.js`, add the helper name to `fnNames` if it is called through render runtime:

```js
'renderEquipmentArchetypeBadge',
```

- [ ] **Step 3: Show archetype badges and fit tags**

In `renderEquipmentBadges(item)` or immediately after it in the equipment card, add:

```js
${renderEquipmentArchetypeBadge(item)}
```

Update `renderEquipmentUsageTags(item)` to use fit tags first:

```js
const fitTags = getEquipmentFitTags(item);
const tags = [...fitTags, ...getEquipmentUsageTags(item, currentJob())].slice(0, 3);
```

- [ ] **Step 4: Add filters**

In `renderEquipmentFilterBar`, add filters after equipped:

```js
["physical", "物理"],
["magic", "魔法"],
["general", "通用"],
["jobFit", "职业适配"],
["craftBase", "可打造胚子"],
```

In `filterEquipmentList`, add:

```js
const archetype = normalizeEquipmentArchetype(item.archetype || inferEquipmentArchetype(item));
const fitTags = getEquipmentFitTags(item);
if (equipmentFilter === "physical") return archetype === "physical";
if (equipmentFilter === "magic") return archetype === "magic";
if (equipmentFilter === "general") return archetype === "general";
if (equipmentFilter === "jobFit") return fitTags.includes("职业适配");
if (equipmentFilter === "craftBase") return fitTags.includes("可打造胚子");
```

- [ ] **Step 5: Add sort options**

In `renderEquipmentFilterBar`, add:

```js
["physicalScore", "物理评分"],
["magicScore", "魔法评分"],
["generalScore", "通用评分"],
```

In `sortEquipmentList.scoreOf`, add:

```js
if (key === "physicalScore") return scores.physicalScore || 0;
if (key === "magicScore") return scores.magicScore || 0;
if (key === "generalScore") return scores.generalScore || 0;
```

- [ ] **Step 6: Show scores in detail**

In `renderEquipmentScores`, extend entries:

```js
["物理", scores.physicalScore],
["魔法", scores.magicScore],
["通用", scores.generalScore],
```

In `renderEquipmentCardScore`, show primary score:

```js
const archetype = normalizeEquipmentArchetype(item.archetype || inferEquipmentArchetype(item));
const primary = archetype === "physical" ? scores.physicalScore : archetype === "magic" ? scores.magicScore : scores.generalScore;
return `<div class="equipment-card-score"><span>${getEquipmentArchetypeLabel(archetype)}评分</span><strong>${formatNumber(primary || scores.comprehensive)}</strong></div>`;
```

- [ ] **Step 7: Improve drop feedback**

Update `showLootDropFeedback(item)`, `lootFeedbackTitle(item)`, or `addDropLog(item)` to include:

```js
const archetypeLabel = getEquipmentArchetypeLabel(item.archetype || inferEquipmentArchetype(item));
```

Use text like:

```js
`${rarityName(item.rarity)} · ${archetypeLabel}装备`
```

For high-fit equipment, append:

```js
const fitTags = getEquipmentFitTags(item);
const suffix = fitTags.includes("可打造胚子") ? " · 可打造胚子" : fitTags.includes("职业适配") ? " · 职业适配" : "";
```

- [ ] **Step 8: Add static UI tests**

Add:

```js
assert.match(game, /物理评分/, 'Equipment UI must display physical score.');
assert.match(game, /魔法评分/, 'Equipment UI must display magic score.');
assert.match(game, /通用评分/, 'Equipment UI must display general score.');
assert.match(game, /可打造胚子/, 'Equipment UI must expose craft-base fit tags.');
assert.match(game, /职业适配/, 'Equipment UI must expose current-job fit tags.');
```

- [ ] **Step 9: Run tests**

Run:

```bash
npm test
npm run check
```

Expected: all automated checks pass.

- [ ] **Step 10: Commit**

```bash
git add game.js src/ui/equipmentPage.js scripts/test.mjs
git commit -m "feat: show equipment archetypes in inventory"
```

---

### Task 7: Browser Smoke Test and Final Verification

**Files:**
- No source files unless verification finds a bug.

- [ ] **Step 1: Run full automated checks**

Run:

```bash
npm test
npm run check
node --check game.js
node --check server.js
node --check scripts/test.mjs
```

Expected: all commands exit 0.

- [ ] **Step 2: Start local server**

Run:

```powershell
$env:PORT='5195'; Start-Process -FilePath node -ArgumentList 'server.js' -WorkingDirectory 'C:\Users\happy\Documents\Codex\2026-05-18\ro' -WindowStyle Hidden -PassThru
```

Expected: returns a process id. Save it and stop it after the smoke test.

- [ ] **Step 3: Browser smoke**

Open:

```text
http://127.0.0.1:5195/
```

Verify:

- Equipment page loads without console errors.
- Equipment cards show 物理 / 魔法 / 通用.
- Filters for 物理, 魔法, 通用, 职业适配, 可打造胚子 are visible.
- Sorting options include 物理评分, 魔法评分, 通用评分.
- Reroll buttons include 券重铸, 保留重铸, 物理, 魔法, 通用.
- Existing save loads without crashing.

- [ ] **Step 4: Stop local server**

Run:

```powershell
Stop-Process -Id <process-id>
```

Expected: process exits.

- [ ] **Step 5: Check git status**

Run:

```bash
git status --short --branch
```

Expected: only intended files modified; unrelated existing files such as `.gitignore` remain unstaged if they were not part of this work.

- [ ] **Step 6: Final commit if any verification fixes were needed**

If files changed during smoke fixes:

```bash
git add game.js src/systems/equipment src/ui/equipmentPage.js scripts/test.mjs
git commit -m "fix: polish equipment archetype v3"
```

Expected: commit succeeds.
