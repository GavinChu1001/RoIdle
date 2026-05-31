# Equipment Stat V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current bloated equipment stat surface with Equipment Stat V2: clear stat roles, no dead anti-crit stat, real block combat behavior, full old-equipment reroll migration, and reforge-ticket compensation.

**Architecture:** Keep `game.js` as the runtime authority while updating the extracted equipment/combat modules that tests import directly. Add pure helpers in `src/systems/equipment/itemFactory.js` for V2 reroll behavior, mirror the runtime path in `game.js`, and keep UI changes limited to equipment details/actions.

**Tech Stack:** Vanilla JavaScript, Node.js test runner in `scripts/test.mjs`, classic runtime bridge through `src/main.js`.

---

### Task 1: Add Failing V2 Contract Tests

**Files:**
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add tests for antiCrit removal, block scoring, V2 reroll, LUK/drop coefficient, and block damage**

Add assertions near existing equipment and combat tests:

```js
assert.equal(itemStats.getEffectiveItemStats({ antiCrit: 0.5 }).antiCrit || 0, 0, 'Equipment V2 must not preserve antiCrit as an effective stat.');
assert.ok(itemStats.getEffectiveItemStats({ blockRate: 0.12 }).blockRate > 0, 'Equipment V2 must preserve blockRate as an effective stat.');

const antiCritOnlyScore = itemScore.calculateEquipmentScores({ antiCrit: 0.5 });
const emptyScore = itemScore.calculateEquipmentScores({});
assert.equal(antiCritOnlyScore.survival, emptyScore.survival, 'Equipment V2 scoring must not reward antiCrit.');
assert.ok(itemScore.calculateEquipmentScores({ blockRate: 0.12 }).survival > emptyScore.survival, 'Equipment V2 scoring must reward real blockRate.');

const rerolledV2 = itemFactory.resetItemForStatV2({
  id: 'legacy-gear',
  templateId: 'blade',
  slot: 'weapon',
  rarity: 'legend',
  level: 42,
  refine: 12,
  empower: 4,
  locked: true,
  antiCrit: 0.5,
  cardSlots: [{ cardId: 'card-a' }],
}, {
  ...factoryContext,
  getEquipmentTemplate: () => ({ id: 'blade', name: 'Blade', slot: 'weapon', atk: 10, source: 'monster_drop' }),
  createItemId: () => 'new-id',
  randomFloat: (min) => min,
});
assert.equal(rerolledV2.id, 'legacy-gear', 'V2 reroll must preserve technical item id so equipped slots stay valid.');
assert.equal(rerolledV2.rarity, 'legend', 'V2 reroll must preserve rarity.');
assert.equal(rerolledV2.level, 42, 'V2 reroll must preserve level.');
assert.equal(rerolledV2.refine, 0, 'V2 reroll must reset star refine.');
assert.equal(rerolledV2.empower, 0, 'V2 reroll must reset empower.');
assert.deepEqual(rerolledV2.cardSlots, [], 'V2 reroll must clear socketed cards.');
assert.equal(rerolledV2.locked, false, 'V2 reroll must clear lock state.');
assert.equal(rerolledV2.antiCrit || 0, 0, 'V2 reroll must remove antiCrit.');
```

Add damage assertions after existing `normalMonsterHit`:

```js
const blockedMonsterHit = damage.calculateMonsterHit({ stats: { defense: 20, blockRate: 0.2 }, monster: { attack: 100 }, hpRatio: 1, livingCount: 1, isCrit: false, isBlocked: true });
assert.ok(blockedMonsterHit.damage < normalMonsterHit.damage, 'Blocked monster hits must deal less damage.');
assert.equal(blockedMonsterHit.isBlocked, true, 'Blocked monster hit metadata must be returned.');
```

Add static assertions near other `game` checks:

```js
assert.match(game, /const EQUIPMENT_STAT_VERSION\s*=\s*2/, 'Equipment V2 must define a stat-version gate.');
assert.match(game, /equipmentStatVersion:\s*EQUIPMENT_STAT_VERSION/, 'Default state must mark fresh saves as Equipment V2.');
assert.match(game, /equipmentReforgeTicket/, 'Equipment V2 migration must grant reforge tickets.');
assert.doesNotMatch(game, /antiCrit:\s*"抗暴"/, 'Equipment V2 UI labels must not expose antiCrit.');
assert.match(game, /reforgeEquipmentV2/, 'Equipment V2 must expose a reforge-ticket action.');
```

- [ ] **Step 2: Run tests to verify RED**

Run: `npm test`

Expected: FAIL with missing `resetItemForStatV2`, `antiCrit` still effective/scored, and blocked monster hits not reducing damage.

### Task 2: Implement V2 Equipment Reroll Helpers

**Files:**
- Modify: `src/systems/equipment/itemFactory.js`
- Modify: `src/systems/equipment/index.js`
- Modify: `src/systems/equipment/itemStats.js`

- [ ] **Step 1: Add deprecated stat cleanup and `resetItemForStatV2`**

In `itemFactory.js`, add a helper that creates a new V2 item from the old item identity, then preserves only the technical id plus slot/level/rarity/template:

```js
const DEPRECATED_EQUIPMENT_STATS = ['antiCrit'];

function clearDeprecatedEquipmentStats(item) {
  DEPRECATED_EQUIPMENT_STATS.forEach((stat) => { delete item[stat]; });
  return item;
}

export function resetItemForStatV2(item = {}, runtime = runtimeContext) {
  item = item && typeof item === 'object' ? item : {};
  const level = Math.max(1, Math.round(number(item.dropLevel || item.level || 1, 1)));
  const rarity = item.rarity || item.tier || 'normal';
  const template =
    runtime.getEquipmentTemplate?.(item.templateId || '') ||
    runtime.getEquipmentTemplate?.(item.id || '') ||
    runtime.getEquipmentTemplate?.(item.name || '') ||
    {
      id: item.templateId || '',
      name: item.name || '旧式装备',
      slot: item.slot || item.equipSlot || 'trinket',
      equipSlot: item.equipSlot || item.slot || 'trinket',
      weaponType: item.weaponType || '',
      armorType: item.armorType || '',
      subType: item.subType || '',
      source: item.source || 'monster_drop',
      rarity,
      atk: item.atk || 0,
      matk: item.matk || 0,
      def: item.def || 0,
      hp: item.hp || 0,
    };
  const rerolled = createItem(template, level, rarity, {
    dropMapId: item.dropMapId || '',
    dropLevel: level,
    difficulty: item.abyssForged || item.sourceDifficulty === 'abyss' ? 'abyss' : item.sourceDifficulty || '',
    itemTier: item.itemTier || undefined,
  }, runtime);
  rerolled.id = item.id || rerolled.id;
  rerolled.instanceId = rerolled.id;
  rerolled.level = level;
  rerolled.dropLevel = level;
  rerolled.rarity = rarity;
  rerolled.tier = rarity;
  rerolled.refine = 0;
  rerolled.refineFailCount = 0;
  rerolled.empower = 0;
  rerolled.locked = false;
  rerolled.cardSlots = [];
  return clearDeprecatedEquipmentStats(normalizeItem(rerolled, runtime));
}
```

- [ ] **Step 2: Remove `antiCrit` from effective item stats**

In `itemStats.js`, remove `antiCrit` from `PERCENT_STATS` and from the returned `stats` object. Keep `blockRate` as a percent stat.

- [ ] **Step 3: Export helper through equipment runtime**

In `src/systems/equipment/index.js`, import and expose `resetItemForStatV2`.

- [ ] **Step 4: Run tests to verify helper GREEN where possible**

Run: `npm test`

Expected: Failures remain for `game.js` static assertions and damage block, but module reroll and antiCrit effective-stat assertions pass.

### Task 3: Update Equipment V2 Runtime Data and Migration

**Files:**
- Modify: `game.js`

- [ ] **Step 1: Add V2 constants and ticket material**

Add constants near equipment stat configuration:

```js
const EQUIPMENT_STAT_VERSION = 2;
const EQUIPMENT_V2_REFORGE_TICKET_ID = 'equipmentReforgeTicket';
const EQUIPMENT_V2_REFORGE_TICKET_GRANT = 5;
```

Add `equipmentReforgeTicket: "装备重铸券"` to `materialNames`.

- [ ] **Step 2: Mark fresh saves as V2**

In `createDefaultState()`, add:

```js
equipmentStatVersion: EQUIPMENT_STAT_VERSION,
```

- [ ] **Step 3: Reroll old equipment in mergeState**

Before the `return` in `mergeState`, compute:

```js
const needsEquipmentV2Migration = saved.equipmentStatVersion !== EQUIPMENT_STAT_VERSION;
const normalizedInventory = needsEquipmentV2Migration ? inventory.map(migrateEquipmentItemToV2) : inventory.map(normalizeItem);
const mergedMaterials = { ...base.materials, ...(saved.materials || {}) };
if (needsEquipmentV2Migration) {
  mergedMaterials[EQUIPMENT_V2_REFORGE_TICKET_ID] = (mergedMaterials[EQUIPMENT_V2_REFORGE_TICKET_ID] || 0) + EQUIPMENT_V2_REFORGE_TICKET_GRANT;
}
```

Return `equipmentStatVersion: EQUIPMENT_STAT_VERSION`, `materials: mergedMaterials`, and `inventory: normalizedInventory`.

- [ ] **Step 4: Add `migrateEquipmentItemToV2` and `reforgeEquipmentV2`**

Implement a runtime version of the module helper. `reforgeEquipmentV2(itemId)` consumes one ticket, rerolls the item using V2 rules, preserves the technical id, saves, rerenders, and logs a short message.

- [ ] **Step 5: Wire reforge action in the equipment page**

Add a click handler for `button[data-reforge-v2-item]`. Add a button beside star/empower actions:

```html
<button type="button" data-reforge-v2-item="${item.id}" ${getMaterialQty(EQUIPMENT_V2_REFORGE_TICKET_ID) <= 0 ? "disabled" : ""}>重铸</button>
```

- [ ] **Step 6: Run tests**

Run: `npm test`

Expected: Migration/static assertions pass; combat assertions still fail until Task 4.

### Task 4: Make Block Real and Rebalance Six-Dimensional Roles

**Files:**
- Modify: `game.js`
- Modify: `src/systems/combat/damage.js`
- Modify: `src/systems/combat/normalCombat.js`

- [ ] **Step 1: Add block to monster-hit calculation**

Update `calculateMonsterHit` signature to accept `isBlocked = false`. Apply a block reduction before final normalization:

```js
const blockReduction = isBlocked ? Math.min(0.55, 0.35 + finite(stats.attrs?.str) * 0.0004) : 0;
...
* (1 - blockReduction)
```

Return `isBlocked` and `blockReduction`.

- [ ] **Step 2: Roll block in monster attacks**

In `updateMonsterAttack`, after dodge and before damage:

```js
const isBlocked = !isCrit && context.random?.() < Math.min(0.45, finite(stats.blockRate));
const { damage } = calculateMonsterHit({ stats, monster, hpRatio, livingCount, isCrit, isBlocked });
```

Show block feedback with `showDamageNumber('hero', finalDamage, 'block')` when blocked.

- [ ] **Step 3: Return blockRate and stronger LUK/DEX roles from `computeStats`**

In `battleStatConfig`, update:

```js
critPerDex: 0.001,
critPerLuk: 0.0015,
dropPerLuk: 0.005,
```

In `computeStats()`, return:

```js
blockRate: Math.min(0.45, (equip.blockRate || 0) + attrs.str * 0.0002),
rareDropBonus: (equip.rareDropBonus || 0) + (passive.rareDropBonus || 0) + (vipMs.rareQualityWeightBonus || 0) + attrs.luk * 0.001,
echoChance: Math.min(0.25, (equip.echoChance || 0) + (passive.echoChance || 0) + attrs.dex * 0.00015),
fireBurstChance: Math.min(0.25, (equip.fireBurstChance || 0) + attrs.dex * 0.0001),
```

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: Damage block tests pass.

### Task 5: Simplify V2 Affix Pools, Mechanisms, Scoring, and UI Labels

**Files:**
- Modify: `game.js`
- Modify: `src/systems/equipment/itemScore.js`
- Modify: `src/systems/equipment/itemStats.js`
- Modify: `src/systems/equipment/itemFactory.js`

- [ ] **Step 1: Remove dead/redundant generated stats**

Remove `antiCrit`, `powerPct`, `patrolEfficiency`, `hitRate`, and `higherLevelDamageBonus` from generated equipment affix pools and special-stat display lists. Keep legacy non-equipment references only where needed for sets/cards.

- [ ] **Step 2: Add real V2 affixes**

Add `blockRate` to armor/shoes/trinket defensive pools. Keep one unified `combatPaceBonus` as the “巡猎” stat.

- [ ] **Step 3: Update mechanism descriptions**

Make descriptions match behavior:

```js
echo: "技能命中后概率追加一次较低倍率伤害。"
greed: "击杀获得材料时概率使数量翻倍。"
thorn: "格挡时按 VIT 造成反击伤害。"
```

- [ ] **Step 4: Remove antiCrit from score and UI**

Remove `antiCrit` from `calculateEquipmentScores`, stat labels, percent stat lists, character survival display, equipment stat groups, and special stat keys.

- [ ] **Step 5: Run tests**

Run: `npm test`

Expected: AntiCrit static and scoring tests pass.

### Task 6: Verify, Syntax Check, Browser Smoke, Commit

**Files:**
- No new production files expected beyond modified files above.

- [ ] **Step 1: Run full automated checks**

Run:

```powershell
npm test
npm run check
node --check game.js server.js scripts/check.mjs scripts/test.mjs
```

Expected: all pass.

- [ ] **Step 2: Browser smoke**

Start the local server, open the current app, and verify:

- Old save loads.
- Equipment page shows 重铸 button.
- Reforge button consumes one 装备重铸券 and rerolls the selected item.
- Character page no longer displays 抗暴.
- 格挡 appears and combat can show block feedback.

- [ ] **Step 3: Commit**

Run:

```powershell
git add game.js src/systems/equipment/itemFactory.js src/systems/equipment/index.js src/systems/equipment/itemStats.js src/systems/equipment/itemScore.js src/systems/combat/damage.js src/systems/combat/normalCombat.js scripts/test.mjs docs/superpowers/plans/2026-05-28-equipment-stat-v2.md
git commit -m "feat: overhaul equipment stat v2"
```
