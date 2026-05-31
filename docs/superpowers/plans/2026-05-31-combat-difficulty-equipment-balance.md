# Combat Difficulty Equipment Balance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebalance late-game combat by disabling zodiac equipment drops, lowering zodiac/V3 burst power, raising late-map challenge, and making equipment tiers feel worth farming.

**Architecture:** Keep the current vanilla JS modular bridge. Make surgical data/runtime changes in the existing drop, combat, and equipment modules, with `scripts/test.mjs` locking each behavior before implementation. Do not restructure `game.js` during this pass.

**Tech Stack:** Vanilla JavaScript, Node.js test scripts, current `src/systems/*` browser modules.

---

## File Structure

- Modify: `scripts/test.mjs`
  - Add failing assertions for disabled zodiac drops, V3 cooldown/scaling, tier power, and late-map difficulty.
- Modify: `src/systems/drops/bossDrops.js`
  - Keep the exported `rollZodiacSetDrops` function, but make active combat return `0`.
- Modify: `src/systems/offline.js`
  - Keep the exported `rollOfflineZodiacSetDrops` function, but make offline reward generation return `0`.
- Modify: `data.js`
  - Adjust V3 default scaling.
  - Lower Taurus base effects and stats.
  - Raise late hard/abyss map curve values.
- Modify: `game.js`
  - Lower generated zodiac set stats/effects for the other zodiac sets.
  - Keep collection, salvage, zodiac card, and UI lookup logic intact.
- Modify: `src/systems/combat/skillMechanics.js`
  - Raise minimum active skill cooldown and reduce extra-cast burst amplification.
- Modify: `src/systems/equipment/itemProgression.js`
  - Increase T3-T10 tier power spread.

---

### Task 1: Lock The New Balance Contract With Tests

**Files:**
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Replace online zodiac drop expectations**

Find the existing online zodiac test block around `acceptedSpecial`. Replace the old positive-drop assertions with this contract:

```js
assert.equal(bossDrops.rollZodiacSetDrops({}, {}, {}, specialContext), 0, 'Zodiac-set drops should be disabled for online normal kills.');
assert.equal(typeof bossDrops.rollTransitionSetDrops, 'undefined', 'Transition-set drop export should be removed.');
assert.equal(acceptedSpecial.length, 0, 'Disabled zodiac-set drops must not add special equipment.');
```

- [ ] **Step 2: Replace hard zodiac drop expectations**

In the same test area, keep `hardSpecialContext`, then replace the old hard-drop assertions with:

```js
assert.equal(bossDrops.rollZodiacSetDrops({ level: 10 }, {}, {}, hardSpecialContext), 0, 'Zodiac-set drops should be disabled for online hard kills.');
assert.deepEqual(acceptedHardSpecial.map((item) => item.level), [], 'Disabled hard zodiac-set drops must not create equipment.');
```

- [ ] **Step 3: Replace offline zodiac expectations**

Find the `offline.rollOfflineZodiacSetDrops` assertions and replace them with:

```js
offline.rollOfflineZodiacSetDrops(offlineCategoryRewards, {}, { id: 'grass' }, 1, 0, offlineCategoryContext);
assert.equal(offlineCategoryRewards.cards[0].cardId, 'offline-card', 'Offline card reward routing changed.');
assert.equal(offlineCategoryRewards.materials[0].materialId, 'ore', 'Offline material reward routing changed.');
assert.deepEqual(offlineCategoryRewards.equipments.map((item) => item.id), [], 'Offline zodiac-set drops should be disabled.');
```

Replace the hard offline assertion with:

```js
offline.rollOfflineZodiacSetDrops(offlineHardRewards, {}, { id: 'grass' }, 1, 0, offlineHardContext);
assert.deepEqual(offlineHardRewards.equipments.map((item) => item.level), [], 'Offline hard zodiac-set drops should be disabled.');
```

- [ ] **Step 4: Add source assertions for skill and tier targets**

Near the existing V3 skill assertions, add:

```js
assert.match(data, /cooldownPerLevel:\s*0\.97/, 'V3 active cooldown scaling should be slower after balance pass.');
assert.match(data, /multiplierPerLevel:\s*1\.06/, 'V3 active damage scaling should avoid exponential late-game burst.');
assert.match(skillMechanicsSource, /MIN_ACTIVE_SKILL_COOLDOWN\s*=\s*3\.6/, 'V3 active skills should have a higher minimum cooldown.');
```

Near the progression quality assertions, add:

```js
assert.match(itemProgressionSource, /T3:\s*3\.15/, 'T3 equipment tier power should clearly exceed T2.');
assert.match(itemProgressionSource, /T10:\s*19\.8/, 'T10 equipment tier power should provide a visible endgame chase.');
```

- [ ] **Step 5: Add source assertions for zodiac and late-map balance**

Add these checks after the zodiac drop source assertions:

```js
assert.match(bossDropsSource, /return\s+0;\s*\/\/ Zodiac equipment drops are disabled/, 'Online zodiac drop function should stay exported but produce no drops.');
assert.match(offlineSource, /return\s+0;\s*\/\/ Offline zodiac equipment drops are disabled/, 'Offline zodiac drop function should stay exported but produce no drops.');
assert.match(game, /ZODIAC_ITEM_STAT_MULTIPLIER\s*=\s*0\.38/, 'Generated zodiac item stats should be toned down.');
assert.match(game, /ZODIAC_EFFECT_MULTIPLIER\s*=\s*0\.35/, 'Generated zodiac set effects should be toned down.');
assert.match(data, /monsterGoldPct:\s*0\.35/, 'Taurus full-set gold bonus should no longer be a progression breaker.');
assert.match(data, /sky:\s*\{\s*hp:\s*18/, 'Abyss sky HP curve should be raised for endgame checks.');
```

- [ ] **Step 6: Run the test to verify it fails**

Run:

```bash
npm test
```

Expected: FAIL with assertions for disabled zodiac drops, new V3 scaling, or new tier/map values.

- [ ] **Step 7: Commit the failing tests**

```bash
git add scripts/test.mjs
git commit -m "test: lock combat balance targets"
```

---

### Task 2: Disable Zodiac Equipment Drops Without Removing Collection Systems

**Files:**
- Modify: `src/systems/drops/bossDrops.js`
- Modify: `src/systems/offline.js`

- [ ] **Step 1: Disable online zodiac drops**

Replace the body of `rollZodiacSetDrops` in `src/systems/drops/bossDrops.js` with:

```js
export function rollZodiacSetDrops(monster, stats = {}, options = {}, context = runtimeContext) {
  return 0; // Zodiac equipment drops are disabled; collection/crafting systems remain available.
}
```

- [ ] **Step 2: Disable offline zodiac drops**

Replace the body of `rollOfflineZodiacSetDrops` in `src/systems/offline.js` with:

```js
export function rollOfflineZodiacSetDrops(rewards, stats, map, killCount, mutationKills = 0, context = runtimeContext) {
  return 0; // Offline zodiac equipment drops are disabled; collection/crafting systems remain available.
}
```

- [ ] **Step 3: Run focused tests**

Run:

```bash
npm test
```

Expected: Zodiac disabled assertions pass; remaining balance assertions may still fail.

- [ ] **Step 4: Commit**

```bash
git add src/systems/drops/bossDrops.js src/systems/offline.js
git commit -m "fix: disable zodiac equipment drops"
```

---

### Task 3: Tone Down Zodiac Set Stats And Effects

**Files:**
- Modify: `data.js`
- Modify: `game.js`

- [ ] **Step 1: Lower Taurus in `data.js`**

Change the Taurus full effect to:

```js
full: { monsterGoldPct: 0.35, baseExpPct: 0.12, jobExpPct: 0.12, materialQuantityPct: 0.1 },
```

Scale Taurus item stats to roughly 40% of the previous values. Use these exact replacement values:

```js
{ id: "taurus_aldbaran_helmet", name: "金牛座-阿鲁迪巴之盔", slot: "headgear", rarity: "legend", level: 30, requiredLevel: 30, atk: 6, matk: 2, def: 19, hp: 90, str: 2, vit: 3, gold: 0.03, materials: { ancientCore: 2, starShard: 1 }, goldCost: 1800, description: "金牛座-阿鲁迪巴套装部件。"},
{ id: "taurus_aldbaran_armor", name: "金牛座-阿鲁迪巴之铠", slot: "armor", rarity: "legend", level: 30, requiredLevel: 30, atk: 5, matk: 0, def: 33, hp: 210, str: 2, vit: 5, gold: 0.05, materials: { ancientCore: 3, rune: 6 }, goldCost: 2400, description: "金牛座-阿鲁迪巴套装部件。"},
{ id: "taurus_aldbaran_boots", name: "金牛座-阿鲁迪巴之靴", slot: "shoes", rarity: "epic", level: 30, requiredLevel: 30, atk: 4, matk: 0, def: 14, hp: 72, agi: 2, vit: 2, gold: 0.02, materials: { crystal: 8, rune: 4 }, goldCost: 1500, description: "金牛座-阿鲁迪巴套装部件。"},
{ id: "taurus_aldbaran_ring", name: "金牛座-阿鲁迪巴之戒", slot: "trinket", rarity: "legend", level: 30, requiredLevel: 30, atk: 11, matk: 5, def: 5, hp: 48, str: 3, luk: 2, gold: 0.06, materials: { ancientCore: 2, starShard: 1 }, goldCost: 2000, description: "金牛座-阿鲁迪巴套装部件。"},
{ id: "taurus_aldbaran_weapon", name: "金牛座-阿鲁迪巴之斧", slot: "weapon", rarity: "legend", level: 30, requiredLevel: 30, weaponType: "axe", equipType: "axe", atk: 104, matk: 0, def: 6, hp: 64, str: 6, vit: 3, crit: 0.015, gold: 0.07, materials: { ancientCore: 4, starShard: 2 }, goldCost: 3200, description: "金牛座-阿鲁迪巴套装部件。"},
```

- [ ] **Step 2: Add generated zodiac balance constants in `game.js`**

Place these constants immediately above `const zodiacSetPlans = [`:

```js
const ZODIAC_ITEM_STAT_MULTIPLIER = 0.38;
const ZODIAC_EFFECT_MULTIPLIER = 0.35;
```

- [ ] **Step 3: Scale generated zodiac effects in `createZodiacSet`**

Change:

```js
effects: { full: plan.effects, pieces: {} },
```

to:

```js
effects: { full: scaleSetEffects(plan.effects, ZODIAC_EFFECT_MULTIPLIER), pieces: {} },
```

- [ ] **Step 4: Scale generated zodiac item stats in `createZodiacSet`**

In each generated item stat line, multiply by `ZODIAC_ITEM_STAT_MULTIPLIER`. The pattern should be:

```js
atk: Math.round((plan.stats.atk || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
matk: Math.round((plan.stats.matk || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
def: Math.round((plan.stats.def || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
hp: Math.round((plan.stats.hp || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
str: Math.round((plan.stats.str || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
agi: Math.round((plan.stats.agi || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
vit: Math.round((plan.stats.vit || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
int: Math.round((plan.stats.int || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
dex: Math.round((plan.stats.dex || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
luk: Math.round((plan.stats.luk || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER),
aspd: Number(((plan.stats.aspd || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER).toFixed(3)),
crit: Number(((plan.stats.crit || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER).toFixed(3)),
drop: Number(((plan.stats.drop || 0) * weight * ZODIAC_ITEM_STAT_MULTIPLIER).toFixed(3)),
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm test
```

Expected: Zodiac stat/effect assertions pass; remaining skill/tier/map assertions may still fail.

- [ ] **Step 6: Commit**

```bash
git add data.js game.js scripts/test.mjs
git commit -m "balance: tone down zodiac sets"
```

---

### Task 4: Reduce V3 Skill Burst Growth

**Files:**
- Modify: `data.js`
- Modify: `src/systems/combat/skillMechanics.js`

- [ ] **Step 1: Lower active skill level scaling**

In `data.js`, change the active branch of `v3Skill` to:

```js
if (kind === '主动') {
  skill.levelScaling = { cooldownPerLevel: 0.97, multiplierPerLevel: 1.06 };
} else if (kind === '被动') {
  skill.levelScaling = { cooldownPerLevel: 0.96, multiplierPerLevel: 1.50 };
}
```

- [ ] **Step 2: Lower extreme skill definitions**

Update these V3 skill definitions in `data.js`:

```js
v3Skill("符文爆发", "主动", 20, mech("finisher", { hpThreshold: 0.25, multiplier: 4.0, finisherMultiplier: 5.4, killRefundPct: 0.35 }), "HP<25% 5.4x 物理伤害，击杀返还 35% 冷却。"),
v3Skill("元素风暴", "主动", 18, mech("statusExploitAll", { multiplier: 3.4, perStatus: 0.75, maxMultiplier: 5.2 }), "对所有异常敌人 3.4x + 每种状态 +0.75x（上限 5.2x）魔法伤害。"),
v3Skill("天罚", "主动", 14, mech("finisher", { hpThreshold: 0.2, multiplier: 4.2, instantKill: true, bossMultiplier: 3.8, stat: "matk" }), "HP<20% 即死（精英 7.0x，Boss 3.8x）魔法伤害。"),
v3Skill("自爆装置", "主动", 16, mech("delayedBurst", { delay: 6, multiplier: 4.2, aoe: true, killRefundPct: 0.35 }), "6s 后爆炸 4.2x 全敌伤害，击杀返还 35% 冷却。"),
```

- [ ] **Step 3: Raise the active cooldown floor**

In `src/systems/combat/skillMechanics.js`, change:

```js
const MIN_ACTIVE_SKILL_COOLDOWN = 2.2;
```

to:

```js
const MIN_ACTIVE_SKILL_COOLDOWN = 3.6;
```

- [ ] **Step 4: Reduce extra-cast burst amplification**

In `tickSkillSystem`, change the extra cast and circuit extra-hit ratios:

```js
const extraMech = scaleV3MechanismDamage(activeMech, 0.30);
```

and:

```js
const extraMech = scaleV3MechanismDamage(activeMech, finite(effect.multiplier) || 0.28);
```

Then cap circuit cooldown refund at `0.45`:

```js
circuitCooldownRefund = Math.max(circuitCooldownRefund, Math.min(0.45, finite(effect.ratio)));
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm test
```

Expected: V3 scaling/cooldown assertions pass; tier/map assertions may still fail.

- [ ] **Step 6: Commit**

```bash
git add data.js src/systems/combat/skillMechanics.js scripts/test.mjs
git commit -m "balance: reduce v3 skill burst"
```

---

### Task 5: Raise Late-Game Monster Curve And Equipment Tier Value

**Files:**
- Modify: `data.js`
- Modify: `src/systems/equipment/itemProgression.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Raise hard late-map scale values**

In `data.js`, change the final three `HARD_MAP_TIER_SCALE` entries to:

```js
glast_heim: { hp: 8.5, attack: 4.8, defense: 5.0, exp: 2.15, gold: 2.15, recommendedPower: 22000 },
abyss_lake: { hp: 13, attack: 6.2, defense: 7.0, exp: 2.45, gold: 2.45, recommendedPower: 42000 },
sky: { hp: 19, attack: 7.8, defense: 9.0, exp: 2.85, gold: 2.85, recommendedPower: 70000 },
```

- [ ] **Step 2: Raise abyss baseline and map scale values**

In `data.js`, change `ABYSS_BASELINE` to:

```js
var ABYSS_BASELINE = {
  minLevel: 40,
  hp: 52000,
  attack: 190,
  defense: 150,
  baseExp: 560,
  jobExp: 500,
  gold: 360,
};
```

Change `ABYSS_MAP_TIER_SCALE` to:

```js
var ABYSS_MAP_TIER_SCALE = {
  grass: { hp: 1.15, attack: 1, defense: 1.1, exp: 1, gold: 1, recommendedPower: 2800 },
  forest: { hp: 1.45, attack: 1.2, defense: 1.32, exp: 1.1, gold: 1.1, recommendedPower: 4200 },
  sewer: { hp: 1.9, attack: 1.5, defense: 1.68, exp: 1.24, gold: 1.24, recommendedPower: 6800 },
  desert: { hp: 2.6, attack: 1.9, defense: 2.15, exp: 1.42, gold: 1.42, recommendedPower: 10500 },
  orc_village: { hp: 3.6, attack: 2.4, defense: 2.8, exp: 1.64, gold: 1.64, recommendedPower: 15500 },
  mine: { hp: 4.8, attack: 3.1, defense: 3.6, exp: 1.9, gold: 1.9, recommendedPower: 23000 },
  clock: { hp: 6.8, attack: 4.1, defense: 4.7, exp: 2.22, gold: 2.22, recommendedPower: 42000 },
  glast_heim: { hp: 9.5, attack: 5.5, defense: 6.2, exp: 2.6, gold: 2.6, recommendedPower: 70000 },
  abyss_lake: { hp: 13, attack: 7.2, defense: 8.0, exp: 3.05, gold: 3.05, recommendedPower: 115000 },
  sky: { hp: 18, attack: 9.8, defense: 10.8, exp: 3.6, gold: 3.6, recommendedPower: 180000 },
};
```

- [ ] **Step 3: Increase equipment tier spread**

In `src/systems/equipment/itemProgression.js`, change `tierPower` to:

```js
function tierPower(tier) {
  return ({
    T1: 1.00,
    T2: 1.80,
    T3: 3.15,
    T4: 4.65,
    T5: 6.40,
    T6: 8.40,
    T7: 10.70,
    T8: 13.30,
    T9: 16.30,
    T10: 19.80,
  }[normalizeGrowthTier(tier)] || 1);
}
```

- [ ] **Step 4: Run tests and syntax check**

Run:

```bash
npm test
npm run check
```

Expected:

```text
Migration batch 7 tests passed
Syntax check passed
```

- [ ] **Step 5: Commit**

```bash
git add data.js src/systems/equipment/itemProgression.js scripts/test.mjs
git commit -m "balance: raise late-game progression curve"
```

---

### Task 6: Browser Smoke Test And Final Review

**Files:**
- No required code file changes.

- [ ] **Step 1: Start or reuse the local server**

Run:

```bash
npm start
```

Expected: local app serves on the configured port. If `5178` is occupied, use the existing browser URL shown in Codex.

- [ ] **Step 2: Browser smoke test**

Use the in-app browser at `http://127.0.0.1:5179/` or the active local URL and verify:

```text
1. New/loaded save opens without a console-breaking crash.
2. Map page still renders normal equipment/material drops.
3. Equipment page still renders zodiac collection state if present.
4. Character skill panel still shows V3 skills and levels.
5. Combat still kills early monsters at a reasonable pace.
```

- [ ] **Step 3: Inspect final diff**

Run:

```bash
git diff --stat HEAD~5..HEAD
git status --short --branch
```

Expected: only balance/test files are changed by this plan; unrelated local docs and previews remain untracked.

- [ ] **Step 4: Final verification**

Run:

```bash
npm test
npm run check
```

Expected: both commands pass.

- [ ] **Step 5: Prepare upload only after user approval**

Do not upload automatically at the end of this plan. Ask the user to confirm whether to push/deploy this balance patch after local verification.
