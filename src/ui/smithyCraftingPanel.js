let installedContext = {};

function globalWindow() {
  return typeof window !== 'undefined' ? window : null;
}

function resolveContext(context = {}) {
  const win = globalWindow();
  return {
    getState: () => win?.state || {},
    escapeHtml: (value) => String(value ?? ''),
    escapeAttr: (value) => String(value ?? '').replace(/"/g, '&quot;'),
    formatNumber: (value) => String(value ?? 0),
    materialText: (cost = {}) => Object.entries(cost).map(([id, amount]) => `${id} x${amount}`).join(' / '),
    hasMaterials: () => false,
    getMaterialName: (id) => id,
    productionRuntime: win?.RuneFrontierProductionRuntime,
    equipmentRuntime: win?.RuneFrontierEquipmentRuntime,
    ...installedContext,
    ...context,
  };
}

function percentProgress(current, required) {
  if (!Number.isFinite(required) || required <= 0) return 0;
  return Math.max(0, Math.min(100, Math.round((Number(current || 0) / required) * 100)));
}

function formatSeconds(ms) {
  const seconds = Math.max(0, Math.ceil(Number(ms || 0) / 1000));
  if (seconds <= 0) return '可领取';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`;
}

function optionHtml(options = [], selectedValue = '', ctx = {}) {
  return options.map((option) => {
    const id = String(option.id || '');
    const selected = id === selectedValue ? 'selected' : '';
    return `<option value="${ctx.escapeAttr(id)}" ${selected}>${ctx.escapeHtml(option.label || id)}</option>`;
  }).join('');
}

function uniqueTierOptions(series = {}) {
  const tiers = [series.defaultTier || 'T2', ...(series.stages || []).map((stage) => stage.growthTier || series.defaultTier || 'T2')];
  return [...new Set(tiers.filter(Boolean))].map((id) => ({ id, label: id }));
}

function selectedCraftingRequest(state = {}, seriesList = [], equipmentRuntime = {}) {
  const saved = state.smithyCraftSelection && typeof state.smithyCraftSelection === 'object' ? state.smithyCraftSelection : {};
  const series = seriesList.some((entry) => entry.id === saved.series) ? saved.series : seriesList[0]?.id || 'ancientHero';
  const seriesConfig = seriesList.find((entry) => entry.id === series) || seriesList[0] || {};
  const tierOptions = uniqueTierOptions(seriesConfig);
  const slotOptions = equipmentRuntime.PROGRESSION_EQUIPMENT_SLOTS || [
    { id: 'weapon', label: '武器' },
    { id: 'armor', label: '防具' },
    { id: 'headgear', label: '头饰' },
    { id: 'shoes', label: '鞋子' },
    { id: 'trinket', label: '饰品' },
  ];
  const archetypeOptions = [
    { id: 'physical', label: '物理' },
    { id: 'magical', label: '魔法' },
    { id: 'hybrid', label: '兼修' },
  ];
  const rarityOptions = [
    { id: 'rare', label: 'rare' },
    { id: 'epic', label: 'epic' },
    { id: 'legend', label: 'legend' },
    { id: 'darkGold', label: 'darkGold' },
    { id: 'mythic', label: 'mythic' },
  ];
  const growthTier = tierOptions.some((entry) => entry.id === saved.growthTier) ? saved.growthTier : tierOptions[0]?.id || seriesConfig.defaultTier || 'T2';
  const slot = slotOptions.some((entry) => entry.id === saved.slot) ? saved.slot : 'weapon';
  const archetype = archetypeOptions.some((entry) => entry.id === saved.archetype) ? saved.archetype : 'physical';
  const rarity = rarityOptions.some((entry) => entry.id === saved.rarity) ? saved.rarity : 'rare';
  return { request: { series, growthTier, slot, archetype, rarity }, seriesConfig, tierOptions, slotOptions, archetypeOptions, rarityOptions };
}

export function renderProductionSmithyPanel(context = {}) {
  const ctx = resolveContext(context);
  const state = ctx.getState?.() || {};
  const production = state.production || {};
  const runtime = ctx.productionRuntime || {};
  const mining = production.mining || { level: 1, exp: 0, nodes: {} };
  const artisan = production.artisan || { level: 1, exp: 0, activeJob: null };
  const miningNodes = runtime.MINING_NODES || {};
  const artisanJobs = runtime.ARTISAN_JOBS || {};
  const activeJob = artisan.activeJob;
  const activeJobDef = activeJob ? artisanJobs[activeJob.id] : null;
  const now = Date.now();
  const miningReq = 80 + Math.max(1, Number(mining.level || 1)) * 40;

  const nodeHtml = Object.values(miningNodes).map((node) => {
    const nodeState = (mining.nodes || {})[node.id] || {};
    const unlocked = nodeState.unlocked || Number(mining.level || 1) >= Number(node.unlockLevel || 1);
    return `<article class="smithy-item">
      <div>
        <strong>${ctx.escapeHtml(node.label || node.id)}</strong>
        <p class="academy-meta">Lv.${node.unlockLevel || 1} · ${node.intervalSec || 60}s · ${ctx.materialText(node.yields || {})}</p>
      </div>
      <span class="academy-meta">${unlocked ? '运转中' : '未解锁'}</span>
    </article>`;
  }).join('');

  const jobHtml = Object.values(artisanJobs).map((job) => {
    const disabled = Boolean(activeJob) || !ctx.hasMaterials?.(job.cost || {});
    return `<article class="smithy-item">
      <div>
        <strong>${ctx.escapeHtml(job.label || job.id)}</strong>
        <p class="academy-meta">${Math.ceil(Number(job.seconds || 0) / 60)}m · ${ctx.materialText(job.cost || {})}</p>
        <p class="academy-meta">产出：${ctx.materialText(job.output || {})}</p>
      </div>
      <button type="button" data-start-artisan-job="${ctx.escapeAttr(job.id)}" ${disabled ? 'disabled' : ''}>开始</button>
    </article>`;
  }).join('');

  const activeHtml = activeJob ? `<article class="smithy-item">
    <div>
      <strong>${ctx.escapeHtml(activeJobDef?.label || activeJob.id)}</strong>
      <p class="academy-meta">剩余 ${formatSeconds(Number(activeJob.finishAt || 0) - now)}</p>
    </div>
    <button type="button" data-claim-artisan-job ${now < Number(activeJob.finishAt || 0) ? 'disabled' : ''}>领取</button>
  </article>` : `<p class="academy-meta">当前没有工匠任务。</p>`;

  return `<div class="smithy-production-grid">
    <section class="smithy-category">
      <h3>采矿生产</h3>
      <p class="academy-meta">采矿 Lv.${mining.level || 1} · ${mining.exp || 0}/${miningReq} (${percentProgress(mining.exp, miningReq)}%)</p>
      <button type="button" data-claim-mining-production>收取矿产</button>
      <div class="smithy-items">${nodeHtml || '<p class="academy-meta">暂无矿点。</p>'}</div>
    </section>
    <section class="smithy-category">
      <h3>工匠任务</h3>
      <p class="academy-meta">工匠 Lv.${artisan.level || 1} · 已完成 ${ctx.formatNumber(artisan.jobsCompleted || 0)}</p>
      ${activeHtml}
      <div class="smithy-items">${jobHtml || '<p class="academy-meta">暂无任务。</p>'}</div>
    </section>
  </div>`;
}

export function renderEquipmentCraftingSmithyPanel(context = {}) {
  const ctx = resolveContext(context);
  const state = ctx.getState?.() || {};
  const production = state.production || {};
  const crafting = production.crafting || { level: 1, exp: 0, totalCrafts: 0, masterCrafts: 0 };
  const productionRuntime = ctx.productionRuntime || {};
  const equipmentRuntime = ctx.equipmentRuntime || {};
  const band = productionRuntime.getCraftingMasteryBand?.(crafting.level || 1) || { label: 'Lv1 / rare' };
  const expReq = productionRuntime.craftingExpForLevel?.(crafting.level || 1) || (80 + Math.max(1, Number(crafting.level || 1)) * 40);
  const seriesList = Object.values(equipmentRuntime.EQUIPMENT_SERIES || {}).filter((series) => series?.id && series.id !== 'oldWorld');
  const selection = selectedCraftingRequest(state, seriesList, equipmentRuntime);
  const request = selection.request;
  const token = `${request.series}:${request.growthTier}:${request.slot}:${request.archetype}:${request.rarity}`;
  const craftable = equipmentRuntime.canCraftEquipment?.(request);
  const recipe = craftable?.recipe || equipmentRuntime.getEquipmentCraftingRecipe?.(request) || {};
  const disabled = craftable ? !craftable.ok : false;
  const seriesOptions = seriesList.map((series) => ({ id: series.id, label: series.label || series.id }));

  const selectorHtml = `<div class="smithy-craft-selectors">
    <label>装备线<select data-smithy-craft-select="series">${optionHtml(seriesOptions, request.series, ctx)}</select></label>
    <label>阶级<select data-smithy-craft-select="growthTier">${optionHtml(selection.tierOptions, request.growthTier, ctx)}</select></label>
    <label>部位<select data-smithy-craft-select="slot">${optionHtml(selection.slotOptions, request.slot, ctx)}</select></label>
    <label>定位<select data-smithy-craft-select="archetype">${optionHtml(selection.archetypeOptions, request.archetype, ctx)}</select></label>
    <label>稀有度<select data-smithy-craft-select="rarity">${optionHtml(selection.rarityOptions, request.rarity, ctx)}</select></label>
  </div>`;
  const lineHtml = `<article class="smithy-item">
    <div>
      <strong>${ctx.escapeHtml(selection.seriesConfig?.label || request.series)}</strong>
      <p class="academy-meta">${ctx.escapeHtml(request.growthTier)} · ${ctx.escapeHtml(request.rarity)} ${ctx.escapeHtml(request.slot)} · ${ctx.escapeHtml(request.archetype)}</p>
      <p class="academy-meta">打造：金币 ${ctx.formatNumber(recipe.gold || 0)} · ${ctx.materialText(recipe.materials || {})}</p>
    </div>
    <button type="button" data-craft-equipment="${ctx.escapeAttr(token)}" ${disabled ? 'disabled' : ''}>打造</button>
  </article>`;

  return `<div class="smithy-crafting-grid">
    <section class="crafting-mastery-card">
      <h3>打造熟练度</h3>
      <p class="academy-meta">Lv.${crafting.level || 1} · ${ctx.escapeHtml(band.label || band.rarity || 'rare')}</p>
      <p class="academy-meta">经验 ${ctx.formatNumber(crafting.exp || 0)} / ${Number.isFinite(expReq) ? ctx.formatNumber(expReq) : 'MAX'}</p>
      <p class="academy-meta">总打造 ${ctx.formatNumber(crafting.totalCrafts || 0)} · 大师打造 ${ctx.formatNumber(crafting.masterCrafts || 0)}</p>
    </section>
    <section class="smithy-category">
      <h3>装备线打造</h3>
      ${selectorHtml}
      <div class="smithy-items">${seriesList.length ? lineHtml : '<p class="academy-meta">暂无可打造装备线。</p>'}</div>
    </section>
  </div>`;
}

export function installSmithyCraftingRenderRuntime(context = {}) {
  installedContext = { ...context };
  const win = globalWindow();
  if (!win) {
    return {
      renderProductionSmithyPanel: () => renderProductionSmithyPanel(context),
      renderEquipmentCraftingSmithyPanel: () => renderEquipmentCraftingSmithyPanel(context),
    };
  }
  const existing = win.RuneFrontierRenderRuntime || {};
  const bridge = {
    renderProductionSmithyPanel: () => renderProductionSmithyPanel(context),
    renderEquipmentCraftingSmithyPanel: () => renderEquipmentCraftingSmithyPanel(context),
  };
  win.RuneFrontierRenderRuntime = Object.assign(existing, bridge);
  return win.RuneFrontierRenderRuntime;
}
