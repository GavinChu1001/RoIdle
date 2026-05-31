# Adventure DPS And Dungeon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the adventure page clearer by showing only Boss progress, add a right-side rolling skill DPS panel, and add a dedicated dungeon page with Daily Material Dungeon and Boss Trial entries.

**Architecture:** Keep the legacy `game.js` runtime authoritative, but put new focused logic in `src/` modules and bridge it through the existing `window.RuneFrontier*Runtime` pattern. Skill DPS is a lightweight in-memory rolling tracker; dungeon state is persisted through `state.dungeons` and rendered by a dedicated UI module.

**Tech Stack:** Vanilla JS modules, legacy `game.js` bridge runtime, static `index.html`, `styles.css`, `scripts/test.mjs`, `npm test`, `npm run check`.

---

## File Structure

- Create: `src/systems/combat/skillDps.js`
  - Owns a 30-second rolling skill damage tracker.
  - Exposes pure helpers plus an installed runtime surface.
- Modify: `src/systems/combat/index.js`
  - Installs the skill DPS tracker into `window.RuneFrontierCombatRuntime`.
- Modify: `src/systems/combat/skillMechanics.js`
  - Records V3 skill damage from the shared `applyDamage` path and direct-damage exceptions.
- Modify: `game.js`
  - Records legacy/V2 skill casts into the DPS tracker.
  - Adds dungeon default state, normalization, page render switch, event binding, and legacy dungeon context.
- Modify: `src/ui/onboardingGuide.js`
  - Removes “当前首领” from the adventure current-target area and leaves only Boss progress plus onboarding hints.
- Create: `src/ui/adventurePage.js`
  - Owns adventure right-side extra panels: skill DPS and dungeon entry.
- Create: `src/systems/dungeons.js`
  - Owns dungeon definitions, daily reset, state normalization, entry validation, and reward settlement.
- Create: `src/ui/dungeonPage.js`
  - Renders the dedicated dungeon page cards and handles display-only state.
- Modify: `src/main.js`
  - Installs dungeon system and adventure/dungeon render runtimes.
- Modify: `index.html`
  - Adds `副本` navigation and a dedicated `data-view="dungeons"` page.
- Modify: `styles.css`
  - Adds compact RO-style styles for skill DPS and dungeon cards.
- Modify: `scripts/test.mjs`
  - Adds regression assertions for Boss-progress-only target UI, DPS tracker, dungeon state, page registration, and runtime wiring.

---

### Task 1: Boss Progress Only In Adventure Target

**Files:**
- Modify: `src/ui/onboardingGuide.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for removing the current-boss row**

Add these assertions near the existing onboarding guide assertions in `scripts/test.mjs`:

```javascript
assert.doesNotMatch(onboardingGuideSource, /<span class="quest-name">当前首领<\/span>/, 'Adventure current target should no longer show the current boss row.');
assert.match(onboardingGuideSource, /<span class="quest-name">首领进度<\/span>/, 'Adventure current target should keep Boss progress visible.');
assert.match(onboardingGuideSource, /renderCurrentGoal\(currentGoal\)/, 'Onboarding current goal hints should remain available.');
```

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `npm test`

Expected before implementation: FAIL with `Adventure current target should no longer show the current boss row.`

- [ ] **Step 3: Remove the current-boss row from `renderQuestList`**

In `src/ui/onboardingGuide.js`, replace the current `renderQuestList()` body with:

```javascript
export function renderQuestList() {
  const els = guideCtx.getEls?.() || window.els || {};
  if (!els.questList) return;
  const state = guideCtx.getState?.() || window.state || {};
  const runtime = window.RuneFrontierOnboardingRuntime || {};
  const currentGoal = runtime.getCurrentOnboardingGoal?.(state);
  const tutorialStep = runtime.getActiveTutorialStep?.(state);
  const progressText = guideCtx.progressText?.() || '';
  const tutorialHtml = tutorialStep ? renderTutorialHint(tutorialStep) : '';
  const currentGoalHtml = currentGoal ? renderCurrentGoal(currentGoal) : '';
  els.questList.innerHTML = `
    ${tutorialHtml}
    ${currentGoalHtml}
    <div class="quest-item">
      <span class="quest-name">首领进度</span>
      <p class="quest-meta">${esc(state.enemyBoss ? progressText : `${progressText} 后可挑战本地图首领`)}</p>
    </div>
  `;
}
```

- [ ] **Step 4: Run tests**

Run: `npm test`

Expected: PASS for the new Boss-progress-only assertions.

- [ ] **Step 5: Commit**

```bash
git add src/ui/onboardingGuide.js scripts/test.mjs
git commit -m "fix(adventure): simplify boss progress target"
```

---

### Task 2: Skill DPS Rolling Tracker And Damage Recording

**Files:**
- Create: `src/systems/combat/skillDps.js`
- Modify: `src/systems/combat/index.js`
- Modify: `src/systems/combat/skillMechanics.js`
- Modify: `game.js`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for the DPS tracker module and combat wiring**

Add file reads near the other combat source reads in `scripts/test.mjs`:

```javascript
const skillDpsSource = read('src/systems/combat/skillDps.js');
```

Add these assertions near the combat feedback assertions:

```javascript
assert.match(skillDpsSource, /SKILL_DPS_WINDOW_MS\s*=\s*30000/, 'Skill DPS tracker should use a 30 second rolling window.');
assert.match(skillDpsSource, /export function createSkillDpsTracker/, 'Skill DPS tracker should expose a factory for tests and runtime use.');
assert.match(skillDpsSource, /recordSkillDamage/, 'Skill DPS tracker should expose skill damage recording.');
assert.match(skillDpsSource, /getSkillDpsRows/, 'Skill DPS tracker should expose sorted DPS rows.');
assert.match(skillDpsSource, /skillDamage\s*\/\s*30/, 'Skill DPS should use the fixed 30 second display denominator.');
assert.match(combatIndexSource, /getSkillDpsRows/, 'Combat runtime should expose Skill DPS rows.');
assert.match(combatIndexSource, /recordSkillDamage/, 'Combat runtime should expose Skill DPS recording.');
assert.match(skillMechanicsSource, /recordSkillDamage\?\.\(skillName,\s*damage\)/, 'V3 skill damage should feed the DPS tracker from applyDamage.');
assert.match(game, /RuneFrontierCombatRuntime\?\.recordSkillDamage\?\.\(name,\s*damage\)/, 'Legacy skill casts should feed the DPS tracker.');
```

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `npm test`

Expected before implementation: FAIL because `src/systems/combat/skillDps.js` does not exist or the new assertions are missing.

- [ ] **Step 3: Create `src/systems/combat/skillDps.js`**

Create the file with:

```javascript
export const SKILL_DPS_WINDOW_MS = 30000;
const MAX_SKILL_DPS_EVENTS = 400;

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function cleanName(name) {
  return String(name || '').trim() || '未知技能';
}

function pruneEvents(events, now, windowMs) {
  const cutoff = now - windowMs;
  while (events.length && finite(events[0].time) < cutoff) events.shift();
  if (events.length > MAX_SKILL_DPS_EVENTS) events.splice(0, events.length - MAX_SKILL_DPS_EVENTS);
}

export function createSkillDpsTracker(options = {}) {
  const nowFn = typeof options.now === 'function' ? options.now : () => Date.now();
  const windowMs = Math.max(1000, finite(options.windowMs) || SKILL_DPS_WINDOW_MS);
  const events = [];

  function recordSkillDamage(name, damage, time = nowFn()) {
    const amount = Math.max(0, finite(damage));
    if (amount <= 0) return;
    const now = finite(time) || nowFn();
    events.push({ name: cleanName(name), damage: amount, time: now });
    pruneEvents(events, now, windowMs);
  }

  function getSkillDpsRows(limit = 5, time = nowFn()) {
    const now = finite(time) || nowFn();
    pruneEvents(events, now, windowMs);
    const totals = new Map();
    events.forEach((event) => {
      const current = totals.get(event.name) || 0;
      totals.set(event.name, current + event.damage);
    });
    const totalSkillDamage = [...totals.values()].reduce((sum, value) => sum + value, 0);
    return [...totals.entries()]
      .map(([name, skillDamage]) => ({
        name,
        damage: skillDamage,
        dps: skillDamage / 30,
        share: totalSkillDamage > 0 ? skillDamage / totalSkillDamage : 0,
      }))
      .sort((a, b) => b.damage - a.damage)
      .slice(0, Math.max(1, Math.floor(finite(limit) || 5)));
  }

  function clearSkillDpsStats() {
    events.length = 0;
  }

  return { recordSkillDamage, getSkillDpsRows, clearSkillDpsStats };
}
```

- [ ] **Step 4: Install the tracker through combat runtime**

In `src/systems/combat/index.js`, import the tracker:

```javascript
import { createSkillDpsTracker } from './skillDps.js';
```

Inside `installCombatRuntime(context = {})`, create the tracker before `const runtime = Object.freeze({ ... })`:

```javascript
  const skillDpsTracker = createSkillDpsTracker();
```

Add these methods to the frozen runtime object:

```javascript
    recordSkillDamage: skillDpsTracker.recordSkillDamage,
    getSkillDpsRows: skillDpsTracker.getSkillDpsRows,
    clearSkillDpsStats: skillDpsTracker.clearSkillDpsStats,
```

- [ ] **Step 5: Record V3 skill damage from `applyDamage`**

In `src/systems/combat/skillMechanics.js`, update `applyDamage` to:

```javascript
function applyDamage(damage, state, ctx = mechContext, skillOrName = '') {
  const skillName = skillNameForDamage(skillOrName);
  state.enemyHp -= damage;
  ctx.recordSkillDamage?.(skillName, damage);
  ctx.showDamageNumber?.('monster', damage, 'skill', { skillName });
  ctx.showHitFeedback?.('skill');
}
```

For direct-damage paths that bypass `applyDamage`, add the same lightweight record call immediately after the HP subtraction. At minimum, update the status tick and `死神之镰` fallback direct damage:

```javascript
ctx.recordSkillDamage?.(key === 'burn' ? '灼烧' : '中毒', dmg);
```

```javascript
ctx.recordSkillDamage?.('死神之镰', dmg);
```

- [ ] **Step 6: Pass the record hook into skill mechanics context**

In `src/systems/combat/index.js`, change the skill mechanics context install from:

```javascript
  configureSkillMechanicsContext({ ...context, getTargetDamageBonus });
```

to:

```javascript
  configureSkillMechanicsContext({
    ...context,
    getTargetDamageBonus,
    recordSkillDamage: (...args) => skillDpsTracker.recordSkillDamage(...args),
  });
```

- [ ] **Step 7: Record legacy/V2 skill casts without changing the skill log behavior**

In `game.js`, update `noteSkillCast(name, damage)` by adding the first line inside the function:

```javascript
function noteSkillCast(name, damage) {
  window.RuneFrontierCombatRuntime?.recordSkillDamage?.(name, damage);
  const text = `${name} 造成 ${formatNumber(sanitizeDamage(damage))} 伤害`;
  state.skillLog.unshift(text);
  state.skillLog = state.skillLog.slice(0, 6);
  if (Math.random() < 0.35) addLog(text);
  renderQuestList();
  renderPartyList();
  renderLog();
}
```

- [ ] **Step 8: Run tests and syntax check**

Run:

```bash
npm test
npm run check
```

Expected: both PASS.

- [ ] **Step 9: Commit**

```bash
git add src/systems/combat/skillDps.js src/systems/combat/index.js src/systems/combat/skillMechanics.js game.js scripts/test.mjs
git commit -m "feat(combat): track rolling skill dps"
```

---

### Task 3: Adventure Right-Side Skill DPS And Dungeon Entry Panel

**Files:**
- Create: `src/ui/adventurePage.js`
- Modify: `src/main.js`
- Modify: `styles.css`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for adventure sidebar runtime**

Add source read:

```javascript
const adventurePageSource = read('src/ui/adventurePage.js');
```

Add assertions:

```javascript
assert.match(main, /installAdventureRenderRuntime/, 'Main module should install the adventure render runtime.');
assert.match(adventurePageSource, /renderSkillDpsPanel/, 'Adventure page should render a Skill DPS panel.');
assert.match(adventurePageSource, /getSkillDpsRows\?\.\(5\)/, 'Adventure Skill DPS panel should request the top five skills.');
assert.match(adventurePageSource, /data-page="dungeons"/, 'Adventure sidebar should expose a dungeon page entry.');
assert.match(styles, /\.skill-dps-panel/, 'Styles should include the Skill DPS panel.');
assert.match(styles, /\.dungeon-entry-panel/, 'Styles should include the adventure dungeon entry panel.');
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test`

Expected before implementation: FAIL because `src/ui/adventurePage.js` does not exist or runtime is not installed.

- [ ] **Step 3: Create `src/ui/adventurePage.js`**

Create the file:

```javascript
let adventureCtx = {};

function esc(value) { return (adventureCtx.escapeHtml || window.escapeHtml || String)(value); }
function fmtn(value) { return (adventureCtx.formatNumber || window.formatNumber || String)(Math.max(0, Number(value || 0))); }
function percent(value) {
  const number = Number(value || 0);
  return `${Math.round(Math.max(0, Math.min(1, number)) * 100)}%`;
}

export function configureAdventureRenderContext(ctx = {}) {
  adventureCtx = ctx || {};
}

export function renderSkillDpsPanel() {
  const rows = adventureCtx.getSkillDpsRows?.(5) || [];
  if (!rows.length) {
    return `<section class="skill-dps-panel"><div class="panel-heading compact"><div><p class="eyebrow">技能输出</p><h2>最近 30 秒</h2></div></div><p class="quest-meta">暂无技能伤害记录</p></section>`;
  }
  return `<section class="skill-dps-panel"><div class="panel-heading compact"><div><p class="eyebrow">技能输出</p><h2>最近 30 秒</h2></div></div><div class="skill-dps-list">${rows.map((row) => `<div class="skill-dps-row"><div><strong>${esc(row.name)}</strong><small>${fmtn(row.dps)} / 秒</small></div><span>${percent(row.share)}</span><i style="transform:scaleX(${Math.max(0.02, Math.min(1, Number(row.share || 0)))})"></i></div>`).join('')}</div></section>`;
}

function renderDungeonEntryPanel() {
  return `<section class="dungeon-entry-panel"><div class="panel-heading compact"><div><p class="eyebrow">副本</p><h2>每日挑战</h2></div></div><p class="quest-meta">材料副本与 Boss 试炼已开放。</p><button class="ro-light-control" data-page="dungeons" type="button">进入副本</button></section>`;
}

export function renderPartyList() {
  const els = adventureCtx.getEls?.() || window.els || {};
  if (!els.partyList) return;
  const state = adventureCtx.getState?.() || window.state || {};
  const stats = adventureCtx.computeStats?.() || {};
  const advice = adventureCtx.renderAdvicePanel?.(stats) || '';
  const sessionRewards = adventureCtx.renderSessionRewardPanel?.() || '';
  els.partyList.innerHTML = `
    ${advice}
    <div class="party-item">
      <span class="party-name">角色状态</span>
      <p class="party-meta">${esc(adventureCtx.jobSummary?.() || '')}</p>
    </div>
    <div class="party-item">
      <span class="party-name">技能记录</span>
      <p class="party-meta">${(state.skillLog || []).slice(0, 3).map(esc).join(' / ') || '尚未触发主动技能'}</p>
    </div>
    ${renderSkillDpsPanel()}
    ${renderDungeonEntryPanel()}
    ${sessionRewards}
  `;
}

export function installAdventureRenderRuntime(context = {}) {
  configureAdventureRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderPartyList, renderSkillDpsPanel })
    : { renderPartyList, renderSkillDpsPanel };
  return window.RuneFrontierRenderRuntime;
}
```

- [ ] **Step 4: Install the adventure render runtime**

In `src/main.js`, add the import near other UI imports:

```javascript
import { installAdventureRenderRuntime } from './ui/adventurePage.js';
```

After `installOnboardingGuideRuntime(onboardingGuideContext);`, add:

```javascript
installAdventureRenderRuntime({
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
  computeStats: window.computeStats,
  jobSummary: window.jobSummary,
  renderAdvicePanel: window.renderAdvicePanel,
  renderSessionRewardPanel: window.renderSessionRewardPanel,
  getSkillDpsRows(limit) { return window.RuneFrontierCombatRuntime?.getSkillDpsRows?.(limit) || []; },
});
document.documentElement.dataset.runeModuleStatus = 'adventure-render-ready';
```

- [ ] **Step 5: Ensure delegated page buttons work inside the sidebar**

In `game.js`, the existing global page tab listener only binds `.page-tabs button`. Add one delegated listener in `bindEvents()` after the `.page-tabs button` binding:

```javascript
  document.body.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.closest(".page-tabs")) return;
    goToPage(button.dataset.page);
  });
```

- [ ] **Step 6: Add styles**

Append to `styles.css`:

```css
.skill-dps-panel,
.dungeon-entry-panel {
  border: 1px solid rgba(126, 85, 38, 0.28);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255, 248, 222, 0.72);
}

.skill-dps-list {
  display: grid;
  gap: 8px;
}

.skill-dps-row {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  min-height: 34px;
  padding: 6px 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.55);
}

.skill-dps-row > * {
  position: relative;
  z-index: 1;
}

.skill-dps-row strong,
.skill-dps-row small {
  display: block;
}

.skill-dps-row small {
  color: #75542f;
}

.skill-dps-row i {
  position: absolute;
  inset: auto 0 0 0;
  height: 3px;
  transform-origin: left center;
  background: linear-gradient(90deg, #b86a2e, #e0b15f);
}

.dungeon-entry-panel button {
  width: 100%;
}
```

- [ ] **Step 7: Run verification**

Run:

```bash
npm test
npm run check
```

Expected: both PASS.

- [ ] **Step 8: Commit**

```bash
git add src/ui/adventurePage.js src/main.js game.js styles.css scripts/test.mjs
git commit -m "feat(adventure): show skill dps sidebar"
```

---

### Task 4: Dungeon State, Definitions, And Dedicated Page

**Files:**
- Create: `src/systems/dungeons.js`
- Create: `src/ui/dungeonPage.js`
- Modify: `src/main.js`
- Modify: `game.js`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `scripts/test.mjs`

- [ ] **Step 1: Add failing tests for dungeon page and runtime**

Add source reads:

```javascript
const dungeonSystemSource = read('src/systems/dungeons.js');
const dungeonPageSource = read('src/ui/dungeonPage.js');
```

Add assertions:

```javascript
assert.match(html, /data-page="dungeons"[^>]*>副本<\/button>/, 'Navigation should include the dungeon page.');
assert.match(html, /data-view="dungeons"/, 'HTML should include a dedicated dungeon page view.');
assert.match(html, /id="dungeonPage"/, 'Dungeon page should expose a render target.');
assert.match(game, /defaultDungeonState/, 'game.js should provide default dungeon state.');
assert.match(game, /normalizeDungeonState/, 'game.js should normalize dungeon state.');
assert.match(game, /case "dungeons":/, 'renderActivePage should render the dungeon page.');
assert.match(main, /installDungeonRuntime/, 'Main should install the dungeon runtime.');
assert.match(main, /installDungeonRenderRuntime/, 'Main should install the dungeon render runtime.');
assert.match(dungeonSystemSource, /daily_material/, 'Dungeon definitions should include Daily Material Dungeon.');
assert.match(dungeonSystemSource, /boss_trial/, 'Dungeon definitions should include Boss Trial.');
assert.match(dungeonSystemSource, /enterDungeon/, 'Dungeon runtime should expose dungeon entry settlement.');
assert.match(dungeonPageSource, /renderDungeonPage/, 'Dungeon page renderer should exist.');
assert.match(styles, /\.dungeon-page/, 'Styles should include dungeon page layout.');
```

- [ ] **Step 2: Run test and verify failure**

Run: `npm test`

Expected before implementation: FAIL because dungeon files and HTML page do not exist.

- [ ] **Step 3: Create `src/systems/dungeons.js`**

Create the file:

```javascript
let dungeonCtx = {};

const DUNGEON_DEFINITIONS = [
  {
    id: 'daily_material',
    name: '每日材料副本',
    type: 'daily',
    attemptsPerDay: 2,
    recommendedPower: 1200,
    desc: '稳定补充装备成长材料。',
    rewards: { gold: 5000, materials: { ancientHeroShard: 3, heroReformInscription: 1, ore: 20 } },
  },
  {
    id: 'boss_trial',
    name: 'Boss 试炼',
    type: 'trial',
    attemptsPerDay: 1,
    recommendedPower: 3500,
    desc: '检验当前阶段输出与生存。',
    rewards: { gold: 18000, materials: { bossSoul: 1, heroReformInscription: 2, ancientCore: 1 } },
  },
];

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

export function defaultDungeonState(date = todayKey()) {
  return {
    date,
    entries: Object.fromEntries(DUNGEON_DEFINITIONS.map((dungeon) => [dungeon.id, { used: 0, bestClearPower: 0 }])),
  };
}

export function normalizeDungeonState(input = {}, date = todayKey()) {
  const base = defaultDungeonState(date);
  if (!input || typeof input !== 'object' || input.date !== date) return base;
  const savedEntries = input.entries && typeof input.entries === 'object' ? input.entries : {};
  base.entries = Object.fromEntries(DUNGEON_DEFINITIONS.map((dungeon) => {
    const saved = savedEntries[dungeon.id] || {};
    return [dungeon.id, {
      used: Math.max(0, Math.min(dungeon.attemptsPerDay, Math.floor(finite(saved.used)))),
      bestClearPower: Math.max(0, Math.floor(finite(saved.bestClearPower))),
    }];
  }));
  return base;
}

export function getDungeonDefinitions() {
  return DUNGEON_DEFINITIONS.map((dungeon) => ({ ...dungeon, rewards: { ...dungeon.rewards, materials: { ...(dungeon.rewards.materials || {}) } } }));
}

export function getDungeonCards(state = dungeonCtx.getState?.()) {
  const dungeons = normalizeDungeonState(state?.dungeons);
  return getDungeonDefinitions().map((dungeon) => {
    const entry = dungeons.entries[dungeon.id] || { used: 0, bestClearPower: 0 };
    return {
      ...dungeon,
      used: entry.used,
      remaining: Math.max(0, dungeon.attemptsPerDay - entry.used),
      bestClearPower: entry.bestClearPower,
    };
  });
}

export function canEnterDungeon(dungeonId, context = dungeonCtx) {
  const state = context.getState?.() || {};
  const dungeon = DUNGEON_DEFINITIONS.find((entry) => entry.id === dungeonId);
  if (!dungeon) return '副本不存在';
  state.dungeons = normalizeDungeonState(state.dungeons);
  const entry = state.dungeons.entries[dungeon.id];
  if (entry.used >= dungeon.attemptsPerDay) return '今日次数已用完';
  const power = finite(context.computeStats?.().power);
  if (power < dungeon.recommendedPower) return `推荐战力 ${context.formatNumber?.(dungeon.recommendedPower) || dungeon.recommendedPower}`;
  return '';
}

export function enterDungeon(dungeonId, context = dungeonCtx) {
  const state = context.getState?.() || {};
  const reason = canEnterDungeon(dungeonId, context);
  if (reason) {
    context.showToast?.(reason);
    return false;
  }
  const dungeon = DUNGEON_DEFINITIONS.find((entry) => entry.id === dungeonId);
  state.dungeons = normalizeDungeonState(state.dungeons);
  const entry = state.dungeons.entries[dungeon.id];
  entry.used += 1;
  entry.bestClearPower = Math.max(finite(entry.bestClearPower), finite(context.computeStats?.().power));
  context.grantGenericReward?.(dungeon.rewards);
  context.addLog?.(`完成副本：${dungeon.name}。`);
  context.showToast?.(`完成：${dungeon.name}`);
  context.save?.();
  context.renderAll?.();
  return true;
}

export function configureDungeonContext(context = {}) {
  dungeonCtx = context || {};
}

export function installDungeonRuntime(context = {}) {
  configureDungeonContext(context);
  const runtime = Object.freeze({
    defaultDungeonState,
    normalizeDungeonState,
    getDungeonDefinitions,
    getDungeonCards,
    canEnterDungeon,
    enterDungeon,
  });
  window.RuneFrontierDungeonRuntime = runtime;
  return runtime;
}
```

- [ ] **Step 4: Add dungeon state bridge in `game.js`**

Add these helpers near `defaultDailyGoals()` and `normalizeDailyGoals()`:

```javascript
function defaultDungeonState() {
  const runtime = window.RuneFrontierDungeonRuntime;
  if (runtime && typeof runtime.defaultDungeonState === "function") return runtime.defaultDungeonState();
  return { date: todayKey(), entries: {} };
}

function normalizeDungeonState(dungeons = {}) {
  const runtime = window.RuneFrontierDungeonRuntime;
  if (runtime && typeof runtime.normalizeDungeonState === "function") return runtime.normalizeDungeonState(dungeons);
  if (!dungeons || typeof dungeons !== "object" || dungeons.date !== todayKey()) return defaultDungeonState();
  return { date: dungeons.date, entries: dungeons.entries || {} };
}
```

In `createDefaultState()`, add:

```javascript
    dungeons: defaultDungeonState(),
```

In `mergeState(base, saved)`, add:

```javascript
    dungeons: normalizeDungeonState(saved.dungeons || base.dungeons),
```

In `sanitizeProgression()`, add:

```javascript
  state.dungeons = normalizeDungeonState(state.dungeons);
```

- [ ] **Step 5: Add dungeon legacy context and event handling**

Add `dungeonPage` to the `cacheElements()` id list in `game.js`.

In `renderActivePage()`, add:

```javascript
    case "dungeons":
      renderDungeons();
      break;
```

Add this wrapper near other render wrappers:

```javascript
function renderDungeons() {
  const runtime = window.RuneFrontierRenderRuntime;
  if (runtime && typeof runtime.renderDungeonPage === "function") return runtime.renderDungeonPage();
}
```

In `bindEvents()`, add:

```javascript
  if (els.dungeonPage) els.dungeonPage.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-enter-dungeon]");
    if (!button) return;
    window.RuneFrontierDungeonRuntime?.enterDungeon?.(button.dataset.enterDungeon);
  });
```

Add the legacy context near other `RuneFrontierLegacy*Context` exports:

```javascript
window.RuneFrontierLegacyDungeonContext = () => Object.freeze({
  getState() { return state; },
  computeStats,
  grantGenericReward,
  addLog,
  showToast,
  renderAll,
  save,
  formatNumber,
  getMaterialName(materialId) { return materialNames[materialId] || materialId; },
});
```

Expose the wrappers through `Object.assign(window, { ... })`:

```javascript
  defaultDungeonState,
  normalizeDungeonState,
  renderDungeons,
```

- [ ] **Step 6: Create `src/ui/dungeonPage.js`**

Create the file:

```javascript
let dungeonRenderCtx = {};

function esc(value) { return (dungeonRenderCtx.escapeHtml || window.escapeHtml || String)(value); }
function fmtn(value) { return (dungeonRenderCtx.formatNumber || window.formatNumber || String)(Number(value || 0)); }

function rewardText(reward = {}) {
  const parts = [];
  if (reward.gold) parts.push(`金币 ${fmtn(reward.gold)}`);
  Object.entries(reward.materials || {}).forEach(([id, amount]) => {
    parts.push(`${esc(dungeonRenderCtx.getMaterialName?.(id) || id)} ×${fmtn(amount)}`);
  });
  return parts.join(' · ') || '无奖励';
}

export function configureDungeonRenderContext(ctx = {}) {
  dungeonRenderCtx = ctx || {};
}

export function renderDungeonPage() {
  const els = dungeonRenderCtx.getEls?.() || window.els || {};
  if (!els.dungeonPage) return;
  const cards = dungeonRenderCtx.getDungeonCards?.() || [];
  els.dungeonPage.innerHTML = `<div class="dungeon-page">${cards.map((dungeon) => {
    const locked = dungeon.remaining <= 0;
    return `<article class="dungeon-card ${locked ? 'locked' : ''}">
      <div class="dungeon-card-head">
        <div>
          <p class="eyebrow">${dungeon.type === 'trial' ? '战力试炼' : '每日资源'}</p>
          <h3>${esc(dungeon.name)}</h3>
        </div>
        <strong>${fmtn(dungeon.remaining)} / ${fmtn(dungeon.attemptsPerDay)}</strong>
      </div>
      <p class="quest-desc">${esc(dungeon.desc)}</p>
      <div class="dungeon-meta-grid">
        <span>推荐战力 <strong>${fmtn(dungeon.recommendedPower)}</strong></span>
        <span>最佳通关 <strong>${fmtn(dungeon.bestClearPower || 0)}</strong></span>
      </div>
      <p class="quest-rewards">${rewardText(dungeon.rewards)}</p>
      <button type="button" data-enter-dungeon="${esc(dungeon.id)}" ${locked ? 'disabled' : ''}>${locked ? '今日已完成' : '进入副本'}</button>
    </article>`;
  }).join('')}</div>`;
}

export function installDungeonRenderRuntime(context = {}) {
  configureDungeonRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderDungeonPage })
    : { renderDungeonPage };
  return window.RuneFrontierRenderRuntime;
}
```

- [ ] **Step 7: Install dungeon runtime and renderer in `src/main.js`**

Add imports:

```javascript
import { installDungeonRuntime } from './systems/dungeons.js';
import { installDungeonRenderRuntime } from './ui/dungeonPage.js';
```

After shop/onboarding system installs, add:

```javascript
const dungeonContext = typeof window.RuneFrontierLegacyDungeonContext === 'function'
  ? window.RuneFrontierLegacyDungeonContext()
  : {};
installDungeonRuntime(dungeonContext);
document.documentElement.dataset.runeModuleStatus = 'dungeon-system-ready';
```

After adventure render install, add:

```javascript
installDungeonRenderRuntime({
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
  getMaterialName: (id) => (window.materialNames || {})[id] || id,
  getDungeonCards() { return window.RuneFrontierDungeonRuntime?.getDungeonCards?.(window.state || {}) || []; },
});
document.documentElement.dataset.runeModuleStatus = 'dungeon-render-ready';
```

- [ ] **Step 8: Add dungeon navigation and page markup**

In `index.html`, add desktop navigation under the “成长” or “扩展” group:

```html
<button data-page="dungeons" type="button">副本</button>
```

Add the same button inside the mobile more grid:

```html
<button data-page="dungeons" type="button">副本</button>
```

Add a page section near the maps/tasks sections:

```html
<section class="page-view" data-view="dungeons">
  <div class="panel-heading">
    <div>
      <p class="eyebrow">每日挑战</p>
      <h2>副本</h2>
    </div>
  </div>
  <div id="dungeonPage"></div>
</section>
```

- [ ] **Step 9: Add dungeon styles**

Append to `styles.css`:

```css
.dungeon-page {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.dungeon-card {
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(126, 85, 38, 0.28);
  border-radius: 8px;
  background: rgba(255, 248, 222, 0.78);
}

.dungeon-card.locked {
  opacity: 0.72;
}

.dungeon-card-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.dungeon-card-head h3 {
  margin: 0;
}

.dungeon-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.dungeon-meta-grid span {
  display: grid;
  gap: 2px;
  padding: 8px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.52);
  color: #75542f;
}

.dungeon-meta-grid strong {
  color: #3b2615;
}
```

- [ ] **Step 10: Run verification**

Run:

```bash
npm test
npm run check
```

Expected: both PASS.

- [ ] **Step 11: Commit**

```bash
git add src/systems/dungeons.js src/ui/dungeonPage.js src/main.js game.js index.html styles.css scripts/test.mjs
git commit -m "feat(dungeons): add daily dungeon page"
```

---

### Task 5: Browser Smoke Test And Final Polish

**Files:**
- Modify only files touched by Tasks 1-4 if visual or behavior defects are found.

- [ ] **Step 1: Start the local server**

Run: `npm start`

Expected: local server starts and prints a localhost URL.

- [ ] **Step 2: Verify adventure page in browser**

Open the local URL in the in-app browser and verify:

- The current target area shows “首领进度”.
- It does not show “当前首领”.
- The right sidebar shows “技能输出 / 最近 30 秒”.
- Before skills trigger, the panel shows “暂无技能伤害记录”.
- The sidebar shows a “副本 / 每日挑战” entry.

- [ ] **Step 3: Verify Skill DPS after combat**

Let combat run until at least one active skill triggers.

Expected:

- The Skill DPS panel lists the skill name.
- DPS is a positive number.
- The row has a visible percentage and progress line.
- The page remains responsive while skills trigger frequently.

- [ ] **Step 4: Verify dungeon page**

Click the adventure sidebar “进入副本” button.

Expected:

- The app switches to the `副本` page.
- The page shows “每日材料副本” and “Boss 试炼”.
- Each card shows remaining attempts, recommended power, reward preview, and an enter button.

- [ ] **Step 5: Verify dungeon entry behavior**

Click “进入副本” for a dungeon when power is sufficient.

Expected:

- Attempts decrease by 1.
- Materials/gold are added according to the card reward.
- A toast confirms completion.
- Refreshing the page keeps the updated attempt count for the same day.

- [ ] **Step 6: Run full verification**

Run:

```bash
npm test
npm run check
node --check game.js
node --check server.js
```

Expected: all commands PASS.

- [ ] **Step 7: Commit polish fixes**

If Task 5 required changes:

```bash
git add src/systems/combat/skillDps.js src/systems/combat/index.js src/systems/combat/skillMechanics.js src/systems/dungeons.js src/ui/adventurePage.js src/ui/dungeonPage.js src/ui/onboardingGuide.js src/main.js game.js index.html styles.css scripts/test.mjs
git commit -m "fix(adventure): polish dps and dungeon entry"
```

If Task 5 required no changes, do not create an empty commit.

---

## Self-Review Checklist

- Spec coverage:
  - Boss-progress-only adventure target is covered by Task 1.
  - Right-side recent-30-second Skill DPS is covered by Tasks 2 and 3.
  - Dedicated dungeon page and two first-version dungeon cards are covered by Task 4.
  - Performance protection through lightweight event recording and 30-second pruning is covered by Task 2.
  - Browser smoke testing is covered by Task 5.

- Placeholder scan:
  - The plan contains concrete files, code snippets, commands, and expected outcomes for each task.

- Type and naming consistency:
  - DPS methods use `recordSkillDamage`, `getSkillDpsRows`, and `clearSkillDpsStats`.
  - Dungeon methods use `defaultDungeonState`, `normalizeDungeonState`, `getDungeonCards`, and `enterDungeon`.
  - HTML uses `data-page="dungeons"` and `id="dungeonPage"`.
