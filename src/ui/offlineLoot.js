let lootCtx = {};

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function arr(v) { return Array.isArray(v) ? v : []; }

function fmtd(sec, ctx = lootCtx) { return ctx.formatDuration ? ctx.formatDuration(sec) : Math.max(0, sec) + '秒'; }
function fmtn(v, ctx = lootCtx) { return ctx.formatNumber ? ctx.formatNumber(v) : String(v || 0); }
function esc(v, ctx = lootCtx) { return ctx.escapeHtml ? ctx.escapeHtml(v) : String(v); }
function rn(r, ctx = lootCtx) { return ctx.rarityName ? ctx.rarityName(r) : r || 'normal'; }
function rnItem(item, extra, ctx = lootCtx) { return ctx.renderItemName ? ctx.renderItemName(item, extra) : esc(item?.name || '???', ctx); }
function renderSet(name, ctx = lootCtx) {
  if (!name) return '';
  return `<small>${window.renderSetName ? window.renderSetName(name) : esc(name, ctx)}</small>`;
}
function offlineObjTotal(obj) { return Object.values(obj || {}).reduce((s, v) => s + F(v), 0); }
function offlineListTotal(list) { return arr(list).reduce((s, e) => s + F(e?.qty), 0); }

/* ── Leaf renderers ───────────────────────────────────────────────── */

/** Material chip — matches legacy game.js DOM for CSS compatibility */
function offlineMaterialChip(mat, extra = '', ctx = lootCtx) {
  const rarity = mat?.rarity || (ctx.getMaterialRarity ? ctx.getMaterialRarity(mat?.materialId) : 'normal') || 'normal';
  const name = mat?.name || (ctx.getMaterialName ? ctx.getMaterialName(mat?.materialId) : mat?.materialId) || '???';
  return `<div class="offline-loot-item offline-material-chip ${esc(extra, ctx)}">
    <span class="offline-loot-icon">材</span>
    <div>
      ${rnItem({ name, rarity }, '', ctx)}
      <small>数量 <span class="offline-number">+${fmtn(mat?.qty, ctx)}</span></small>
      <span class="offline-progress-bar"><span class="offline-progress-fill"></span></span>
    </div>
  </div>`;
}

/** Equipment item — keeps rarity icon (informative in loot context), adds set/refine */
function offlineEquipItem(item, ctx = lootCtx) {
  const hl = ctx.offlineHighlightClass ? ctx.offlineHighlightClass(item) : '';
  return `<div class="offline-loot-item ${hl}">
    <span class="offline-loot-icon">${rn(item?.rarity, ctx)[0] || '装'}</span>
    <div>
      ${rnItem(item, '', ctx)}
      <small>${rn(item?.rarity, ctx)}${item?.refine ? ` · +${fmtn(item.refine, ctx)}` : ''}</small>
      ${renderSet(item?.setName, ctx)}
    </div>
  </div>`;
}

function offlineEmpty(title, text, ctx = lootCtx) {
  return `<section class="offline-reward-section offline-empty-section"><div class="offline-reward-section-title">${esc(title, ctx)}</div><p>${esc(text, ctx)}</p></section>`;
}

/* ── Loot modal (弹窗模式) ─────────────────────────────────────────── */

export function configureLootContext(ctx = {}) { lootCtx = ctx || {}; }

export function renderOfflineRewardSummary(rewards, ctx = lootCtx) { return renderLootSummaryCard(rewards, ctx); }

export function renderLootSummaryCard(rewards, ctx = lootCtx) {
  const r = rewards || {};
  const matList = arr(r.materials);
  const cardList = arr(r.cards);
  const eqpList = arr(r.equipment);
  const pendingList = arr(r.pendingEquipment);
  const hasAny = r.seconds > 0 || r.gold > 0 || r.baseExp > 0 || r.jobExp > 0 || r.mvpInscriptionExp > 0 ||
    matList.length || cardList.length || eqpList.length || pendingList.length ||
    offlineObjTotal(r.salvagedMaterials) > 0;
  if (!hasAny) {
    return `<article class="loot-modal"><div class="loot-empty"><h3>暂无战利品</h3><p>如果你刚上线，请等待离线收益结算完成。</p></div></article>`;
  }
  return `<article class="loot-modal">
    <header class="offline-reward-header">
      <span class="offline-chest-icon" aria-hidden="true">◇</span>
      <div><strong>${r.seconds > 0 ? '离线战利品' : '最近战利品'}</strong><p>稳定清点模式，所有收益以真实结算为准</p></div>
      <div class="offline-time-pill">${r.seconds > 0 ? `离线 ${fmtd(r.seconds, ctx)}` : '最新获得'}</div>
    </header>
    ${r.noRewardsReason ? `<p class="offline-reason">${esc(r.noRewardsReason, ctx)}</p>` : ''}
    <div class="loot-summary-grid">
      ${renderLootSummaryMini('击杀', r.kills, ctx)}
      ${renderLootSummaryMini('金币', r.gold, ctx)}
      ${renderLootSummaryMini('BASE经验', r.baseExp, ctx)}
      ${renderLootSummaryMini('JOB经验', r.jobExp, ctx)}
      ${renderLootSummaryMini('铭刻经验', r.mvpInscriptionExp, ctx)}
      ${renderLootSummaryMini('材料', offlineListTotal(matList), ctx)}
      ${renderLootSummaryMini('装备', eqpList.length, ctx)}
      ${renderLootSummaryMini('待领取装备', pendingList.length, ctx)}
    </div>
    ${renderLootMaterialSection(matList, ctx)}
    ${renderLootEquipmentSection(eqpList, '获得装备', ctx)}
    ${renderLootCardSection(cardList, ctx)}
    ${renderLootSalvageSection(r.salvagedMaterials || {}, ctx)}
    ${renderLootPendingSection(pendingList, ctx)}
  </article>`;
}

export function renderLootFallback(error, ctx = lootCtx) {
  return `<article class="loot-modal"><div class="loot-fallback"><h3>战利品显示异常</h3><p>收益数据已经结算，但显示时发生异常。</p><p>请刷新页面或稍后再试。</p>${error ? `<small>${esc(error?.message || String(error), ctx)}</small>` : ''}</div></article>`;
}

export function renderLootSummaryMini(label, value, ctx = lootCtx) {
  return `<div class="loot-summary-card"><span>${esc(label, ctx)}</span><strong>${fmtn(value, ctx)}</strong></div>`;
}

export function renderLootMaterialSection(materials, ctx = lootCtx) {
  if (!arr(materials).length) return '';
  return `<section class="loot-section"><h3 class="loot-section-title">材料</h3><div class="loot-item-grid">${arr(materials).map((m) => offlineMaterialChip(m, '', ctx)).join('')}</div></section>`;
}

export function renderLootSalvageSection(materials, ctx = lootCtx) {
  const list = (ctx.offlineMaterialObjectToList || ((obj) => Object.entries(obj || {}).map(([id, q]) => ({ materialId: id, qty: q, name: ctx.getMaterialName?.(id) || id, rarity: ctx.getMaterialRarity?.(id) || 'normal' }))))(materials);
  if (!list.length) return '';
  return `<section class="loot-section"><h3 class="loot-section-title">自动分解</h3><div class="loot-item-grid">${list.map((i) => offlineMaterialChip(i, 'loot-material-chip', ctx)).join('')}</div></section>`;
}

export function renderLootCardSection(cards, ctx = lootCtx) {
  if (!arr(cards).length) return '';
  return `<section class="loot-section"><h3 class="loot-section-title">卡片</h3><div class="loot-item-grid">${arr(cards).map((c) => `<div class="loot-equipment-row">${rnItem({ name: c.name || c.cardId || '未知卡片', rarity: c.rarity || 'rare' }, '', ctx)}<small>×${fmtn(c.qty, ctx)}</small></div>`).join('')}</div></section>`;
}

export function renderLootEquipmentSection(equipment, title = '装备', ctx = lootCtx) {
  const list = arr(equipment);
  if (!list.length) return '';
  const sortFn = ctx.sortOfflineEquipment || ((a, b) => 0);
  const sorted = sortFn(list).slice(0, 6);
  return `<section class="loot-section"><h3 class="loot-section-title">${esc(title, ctx)}</h3><div class="loot-item-grid">${sorted.map((i) => offlineEquipItem(i, ctx)).join('')}</div>${list.length > sorted.length ? `<p class="loot-empty">还有 ${fmtn(list.length - sorted.length, ctx)} 件装备</p>` : ''}</section>`;
}

export function renderLootPendingSection(equipment, ctx = lootCtx) {
  const list = arr(equipment);
  if (!list.length) return '';
  return `<section class="loot-section loot-pending-warning"><h3 class="loot-section-title">待领取装备（${fmtn(list.length, ctx)}）</h3><p>背包已满，以下装备已暂存，收益没有丢失。清理背包后可继续领取。</p><div class="loot-item-grid">${list.slice(0, 8).map((i) => offlineEquipItem(i, ctx)).join('')}</div>${list.length > 8 ? `<p class="loot-empty">还有 ${fmtn(list.length - 8, ctx)} 件待领取装备</p>` : ''}</section>`;
}

/* ── Offline overview (概览模式) ───────────────────────────────────── */

export function renderOfflineOverview(rewards, claimedEquipment, pendingEquipment, ctx = lootCtx) {
  const materialTotal = offlineListTotal(rewards?.materials);
  const cardTotal = offlineListTotal(rewards?.cards);
  const salvageTotal = offlineObjTotal(rewards?.autoSalvagedMaterials || {});
  return `<div class="offline-overview-grid">
    ${renderOfflineOverviewCard('金币', rewards?.gold, 'gold', ctx)}
    ${renderOfflineOverviewCard('BASE经验', rewards?.baseExp, 'base', ctx)}
    ${renderOfflineOverviewCard('JOB经验', rewards?.jobExp, 'job', ctx)}
    ${renderOfflineOverviewCard('铭刻经验', rewards?.mvpInscriptionExp, 'mvp-inscription', ctx)}
    ${renderOfflineOverviewCard('材料', materialTotal, 'material', ctx)}
    ${renderOfflineOverviewCard('卡片', cardTotal, 'card', ctx)}
    ${renderOfflineOverviewCard('装备', arr(claimedEquipment).length, 'equipment', ctx)}
    ${renderOfflineOverviewCard('自动分解', salvageTotal, 'salvage', ctx)}
    ${arr(pendingEquipment).length ? renderOfflineOverviewCard('待领取', arr(pendingEquipment).length, 'pending', ctx) : ''}
  </div>`;
}

export function renderOfflineOverviewCard(label, value, type, ctx = lootCtx) {
  return `<div class="offline-overview-card offline-overview-${esc(type || '', ctx)}"><span>${esc(label, ctx)}</span><strong class="offline-number">+${fmtn(value, ctx)}</strong></div>`;
}

export function renderOfflineGoldExpSection(rewards, ctx = lootCtx) {
  const r = rewards || {};
  const offEff = ctx.getOfflineEfficiency ? ctx.getOfflineEfficiency() : 0.65;
  const maxSec = ctx.getMaxOfflineSeconds ? ctx.getMaxOfflineSeconds() : 43200;
  return `<section class="offline-reward-section offline-gold-exp-section">
    <div class="offline-reward-section-title">金币与经验</div>
    <div class="offline-gain-strip">
      <div class="offline-gain offline-gain-gold"><span>金币</span><strong class="offline-number">+${fmtn(r.gold, ctx)}</strong></div>
      <div class="offline-gain offline-gain-base"><span>BASE EXP</span><strong class="offline-number">+${fmtn(r.baseExp, ctx)}</strong></div>
      <div class="offline-gain offline-gain-job"><span>JOB EXP</span><strong class="offline-number">+${fmtn(r.jobExp, ctx)}</strong></div>
      <div class="offline-gain offline-gain-mvp-inscription"><span>铭刻经验</span><strong class="offline-number">+${fmtn(r.mvpInscriptionExp, ctx)}</strong></div>
    </div>
    <p class="offline-source-note">离线效率 ${Math.round(offEff * 100)}% · 最大离线时间 ${fmtd(maxSec, ctx)} · VIP 与套装收益已计入本次真实结算</p>
  </section>`;
}

export function renderOfflineMaterialSection(rewards, ctx = lootCtx) {
  const mats = arr(rewards?.materials);
  if (!mats.length) return offlineEmpty('材料', '无材料掉落', ctx);
  return `<section class="offline-reward-section"><div class="offline-reward-section-title">材料</div><div class="offline-loot-grid">${mats.map((m) => offlineMaterialChip(m, '', ctx)).join('')}</div></section>`;
}

export function renderOfflineSalvageSection(rewards, ctx = lootCtx) {
  const convertFn = ctx.offlineMaterialObjectToList || ((obj) => Object.entries(obj || {}).map(([id, q]) => ({ materialId: id, qty: q, name: ctx.getMaterialName?.(id) || id, rarity: ctx.getMaterialRarity?.(id) || 'normal' })));
  const materials = convertFn(rewards?.autoSalvagedMaterials || {});
  if (!materials.length) return '';
  return `<section class="offline-reward-section offline-salvage-section"><div class="offline-reward-section-title">自动分解回收</div><p class="offline-source-note">离线期间自动分解了部分装备，回收出以下材料：</p><div class="offline-loot-grid">${materials.map((m) => offlineMaterialChip(m, 'offline-salvage-item', ctx)).join('')}</div></section>`;
}

export function renderOfflineCardSection(rewards, ctx = lootCtx) {
  const cards = arr(rewards?.cards);
  if (!cards.length) return offlineEmpty('卡片', '无卡片掉落', ctx);
  const hlFn = ctx.offlineHighlightClass || (() => '');
  return `<section class="offline-reward-section"><div class="offline-reward-section-title">卡片</div><div class="offline-loot-grid">${cards.map((c) => `<div class="offline-loot-item ${hlFn(c)}"><span class="offline-loot-icon">卡</span><div>${rnItem({ name: c.name, rarity: c.rarity || 'rare' }, '', ctx)}<small>${rn(c.rarity, ctx)} · 数量 ${fmtn(c.qty, ctx)}</small></div></div>`).join('')}</div></section>`;
}

export function renderOfflineEquipmentSection(equipment, title, ctx = lootCtx) {
  const list = arr(equipment);
  if (!list.length) return offlineEmpty(title || '装备', '无装备掉落', ctx);
  const sortFn = ctx.sortOfflineEquipment || ((a, b) => 0);
  const sorted = sortFn(list).slice(0, 6);
  const hidden = list.length - sorted.length;
  return `<section class="offline-reward-section"><div class="offline-reward-section-title">${esc(title || '装备', ctx)}</div><div class="offline-loot-grid">${sorted.map((i) => offlineEquipItem(i, ctx)).join('')}</div>${hidden > 0 ? `<p class="offline-more">还有 ${fmtn(hidden, ctx)} 件装备已入袋</p>` : ''}</section>`;
}

export function renderOfflinePendingEquipmentSection(equipment, ctx = lootCtx) {
  const list = arr(equipment);
  if (!list.length) return '';
  const sortFn = ctx.sortOfflineEquipment || ((a, b) => 0);
  const sorted = sortFn(list);
  return `<section class="offline-reward-section offline-pending-list"><div class="offline-reward-section-title">待领取装备</div><p class="offline-source-note">由于背包空间不足，以下装备已暂存，请清理背包后领取。</p><div class="offline-loot-grid">${sorted.slice(0, 8).map((i) => offlineEquipItem(i, ctx)).join('')}</div>${sorted.length > 8 ? `<p class="offline-more">还有 ${fmtn(sorted.length - 8, ctx)} 件待领取装备</p>` : ''}</section>`;
}

export function renderOfflineEquipmentItem(item, ctx = lootCtx) { return offlineEquipItem(item, ctx); }
export function renderOfflineMaterialChip(material, extraClass, ctx = lootCtx) { return offlineMaterialChip(material, extraClass, ctx); }
export function renderOfflineEmptySection(title, text, ctx = lootCtx) { return offlineEmpty(title, text, ctx); }

/* ── Runtime install ───────────────────────────────────────────────── */

export function installLootRenderRuntime(context = {}) {
  configureLootContext(context);
  const runtime = {
    renderOfflineRewardSummary,
    renderLootSummaryCard,
    renderLootFallback,
    renderLootSummaryMini,
    renderLootMaterialSection,
    renderLootSalvageSection,
    renderLootCardSection,
    renderLootEquipmentSection,
    renderLootPendingSection,
    renderOfflineOverview,
    renderOfflineOverviewCard,
    renderOfflineGoldExpSection,
    renderOfflineMaterialSection,
    renderOfflineSalvageSection,
    renderOfflineCardSection,
    renderOfflineEquipmentSection,
    renderOfflinePendingEquipmentSection,
    renderOfflineEquipmentItem,
    renderOfflineMaterialChip,
    renderOfflineEmptySection,
  };
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, runtime) : runtime;
  return window.RuneFrontierRenderRuntime;
}
