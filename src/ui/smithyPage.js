let smithyCtx = {};

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function esc(v) { return smithyCtx.escapeHtml ? smithyCtx.escapeHtml(v) : String(v); }
function essa(v) { return smithyCtx.escapeAttr ? smithyCtx.escapeAttr(v) : String(v); }
function fmtn(v) { return smithyCtx.formatNumber ? smithyCtx.formatNumber(v) : String(v || 0); }
function pct(v) { return smithyCtx.percent ? smithyCtx.percent(v) : String(Math.round((v || 0) * 100)) + '%'; }

export function configureSmithyRenderContext(ctx = {}) { smithyCtx = ctx || {}; }

export function renderSetTalentStatus(ctx = smithyCtx) {
  const sets = ctx.getCraftableSets?.() || [];
  const state = ctx.getState?.() || {};
  const collected = ctx.getZodiacCollection?.() || {};
  if (!sets.length) return '';
  return `<div class="set-talent-status">${sets.map((set) => {
    const pieces = (collected[set.id]?.collectedPieceIds || []).length;
    const total = (set.items || []).length;
    return `<span class="set-talent-chip ${pieces >= total ? 'complete' : ''}">${esc(set.talentName || set.name)} ${pieces}/${total}</span>`;
  }).join('')}</div>`;
}

export function renderRefineStatDelta(delta, ctx = smithyCtx) {
  if (!delta || !Object.keys(delta).length) return '';
  return Object.entries(delta).map(([stat, value]) => {
    const isPct = ctx.statIsPercent?.(stat) || false;
    const label = ctx.statLabelName?.(stat) || stat;
    return `${label} ${isPct ? pct(value) : fmtn(value)}`;
  }).join(' \xb7 ');
}

export function renderEnhanceEffectText(item, ctx = smithyCtx) {
  if (!item || !item.enhanceLevel) return '';
  const bonus = ctx.getEnhanceEffect?.(item, item.enhanceLevel);
  if (!bonus) return '';
  const ms = ctx.getEnhanceMilestoneBonuses?.(item) || {};
  const parts = [`\u7cbe\u70bc +${item.enhanceLevel}`];
  if (bonus) parts.push(bonus);
  if (Object.keys(ms).length) parts.push('\u91cc\u7a0b\u7891\u5df2\u6fc0\u6d3b');
  if ((item.specialPassives || []).length) {
    const db = ctx.getEnhancePassiveDb?.() || {};
    item.specialPassives.forEach((id) => {
      const p = db[id];
      if (p) parts.push(`\u7279\u6548\uff1a${p.name}\uff08${p.desc}\uff09`);
    });
  }
  return parts.join(' \xb7 ');
}

export function renderSmithyPage(ctx = smithyCtx) {
  const els = ctx.getEls?.() || {};
  if (els.smithyPageContent) els.smithyPageContent.innerHTML = renderSmithyContent(ctx);
  if (els.smithyPageContentDuplicate) els.smithyPageContentDuplicate.innerHTML = renderSmithyContent(ctx);
}

export function renderSmithyContent(ctx = smithyCtx) {
  const smithyTab = ctx.getSmithyActiveTab?.() || 'enhance';
  const tabs = [
    ['enhance', '\u88c5\u5907\u7cbe\u70bc'], ['star', '\u88c5\u5907\u661f\u70bc'], ['socket', '\u88c5\u5907\u6253\u5b54'],
    ['set', '\u5957\u88c5\u6253\u9020'], ['costume', '\u65f6\u88c5\u6253\u9020'], ['materials', '\u6750\u6599\u8bf4\u660e'],
    ['exchange', '\u6697\u91d1\u5151\u6362'],
  ];
  const state = ctx.getState?.() || {};
  const craftableSets = Object.values(ctx.getEquipmentSets?.() || {}).filter((s) => s.items?.some((i) => i.craftable));

  let body = '';
  if (smithyTab === 'enhance') body = renderEnhancePanel(ctx);
  else if (smithyTab === 'star') body = ctx.renderStarRefineSmithyPanel?.() || '';
  else if (smithyTab === 'socket') body = ctx.renderCardSocketSmithyPanel?.() || '';
  else if (smithyTab === 'set') body = `<div class="smithy-set-list">${craftableSets.map((set) => {
    const missing = Math.max(0, (set.items || []).filter((i) => i.craftable).length - ((state.inventory || []).filter((e) => e.setId === set.id).length));
    return `<article class="smithy-set-card"><strong>${esc(set.name)}</strong><p class="academy-meta">${esc(set.talentDescription || '')}</p><button type="button" data-craft-set="${set.id}" ${missing > 0 ? '' : 'disabled'}>${missing > 0 ? `\u6253\u9020 (${missing}\u4ef6)` : '\u5df2\u5b8c\u6210'}</button></article>`;
  }).join('')}</div>`;
  else if (smithyTab === 'costume') body = ctx.renderCostumePanel?.() || '';
  else if (smithyTab === 'materials') body = renderSmithyMaterialGuide(ctx);
  else if (smithyTab === 'exchange') body = renderDarkGoldExchangePanel(ctx);

  return `<div class="smithy-tabs">${tabs.map(([id, label]) => `<button class="smithy-tab ${smithyTab === id ? 'active' : ''}" data-smithy-tab="${id}">${esc(label)}</button>`).join('')}</div><div class="smithy-content">${body}</div>`;
}

export function renderEnhancePanel(ctx = smithyCtx) {
  const state = ctx.getState?.() || {};
  const equipped = Object.entries(state.equipped || {}).map(([slot, id]) => ({ slot, item: (state.inventory || []).find((i) => i.id === id) })).filter((e) => e.item);
  if (!equipped.length) return '<p class="academy-meta">\u8bf7\u5148\u88c5\u5907\u88c5\u5907\u3002</p>';
  const selectedId = state.selectedEnhanceItem;
  const selected = selectedId ? (state.inventory || []).find((i) => i.id === selectedId && Object.values(state.equipped || {}).includes(i.id)) : equipped[0]?.item;
  if (!selected) return '<p class="academy-meta">\u6ca1\u6709\u53ef\u7cbe\u70bc\u7684\u5df2\u88c5\u5907\u88c5\u5907\u3002</p>';
  const nextLevel = F(selected.enhanceLevel) + 1;
  const maxLvl = ctx.getEnhanceMaxLevel?.() || 20;
  const cost = ctx.getEnhanceCost?.(selected) || {};
  const canAfford = (state.gold || 0) >= F(cost.gold) && ctx.hasMaterials?.(cost.materials || {});
  const test = ctx.renderItemName?.(selected, `Lv.${selected.level}`) || esc(selected.name || '\u88c5\u5907');
  const safe = ctx.getEnhanceSafeZoneText?.(nextLevel) || ((nl) => nl <= 4 ? '\u5b89\u5168\u533a' : '\u975e\u5b89\u5168\u533a')(nextLevel);
  const failText = ctx.getEnhanceFailResultText?.(nextLevel) || '';
  const chance = ctx.getEnhanceChance?.(selected) || 0;
  const effectText = renderEnhanceEffectText(selected, ctx);

  return `<div class="enhance-panel">
    <div class="enhance-selector">${equipped.map((e) => `<button type="button" class="enhance-slot-btn ${(e.item.id === selected.id) ? 'active' : ''}" data-select-enhance="${e.item.id}">${esc(ctx.slotName?.(e.slot) || e.slot)} ${ctx.renderItemName?.(e.item, '') || ''}</button>`).join('')}</div>
    <div class="enhance-card">
      <div class="enhance-item-name">${test}</div>
      <div class="stat-grid">
        <span>\u5f53\u524d +${F(selected.enhanceLevel)} / +${maxLvl}</span>
        <span>\u6210\u529f\u7387 ${pct(chance)}</span>
        <span>${safe}</span>
        ${failText ? `<span>\u5931\u8d25\uff1a${failText}</span>` : ''}
        <span>\u6d88\u8017: ${ctx.materialText?.(cost) || ''} + ${fmtn(cost.gold || 0)} \u91d1\u5e01</span>
        ${effectText ? `<span>${esc(effectText)}</span>` : ''}
      </div>
      <button type="button" data-enhance-item="${selected.id}" ${!canAfford || nextLevel > maxLvl ? 'disabled' : ''}>${nextLevel > maxLvl ? '\u5df2\u6ee1\u7ea7' : '\u7cbe\u70bc +' + nextLevel}</button>
    </div>
  </div>`;
}

export function renderSmithyMaterialGuide(ctx = smithyCtx) {
  return `<div class="smithy-material-guide">
    <h3>\u6750\u6599\u8bf4\u660e</h3>
    <p>\u7814\u78e8\u7c89\uff1a\u57fa\u7840\u661f\u70bc\u6750\u6599\u3002</p>
    <p>\u7cbe\u70bc\u77ff\u3001\u84dd\u6676\u788e\u7247\u3001\u9732\u6069\u77f3\uff1a\u4e2d\u7ea7\u661f\u70bc\u6750\u6599\u3002</p>
    <p>\u53e4\u4ee3\u6838\u5fc3\u3001\u661f\u754c\u788e\u7247\uff1a\u9ad8\u7ea7\u661f\u70bc\u53ca\u7cbe\u70bc\u6750\u6599\u3002</p>
    <p>\u795e\u4e4b\u91d1\u5c5e/\u94dd\uff1a\u4e13\u7528\u7cbe\u70bc\u6750\u6599\uff08\u6b66\u5668/\u9632\u5177\uff09\u3002</p>
    <p>\u6253\u5b54\u77f3/\u9ad8\u7ea7\u6253\u5b54\u77f3/\u795e\u8bdd\u6253\u5b54\u77f3\uff1a\u7528\u4e8e\u88c5\u5907\u5f00\u542f\u5361\u69fd\u3002</p>
    <p>\u6697\u91d1\u788e\u7247\uff1aBoss/\u6df1\u6e0a \u6781\u7a00\u6709\u6389\u843d\uff0c\u7528\u4e8e\u6697\u91d1\u88c5\u5907\u5151\u6362\u3002</p>
    <p>\u795e\u8bdd\u7cbe\u7cb9\uff1a\u795e\u8bdd\u88c5\u5907\u5206\u89e3\u83b7\u5f97\u7684\u9ad8\u9636\u6750\u6599\u3002</p>
  </div>`;
}

export function renderDarkGoldExchangePanel(ctx = smithyCtx) {
  const state = ctx.getState?.() || {};
  const fragmentCount = F(state.materials?.darkGoldFragment);
  return `<div class="darkgold-exchange-panel">
    <p>\u5f53\u524d\u6697\u91d1\u788e\u7247\uff1a${fmtn(fragmentCount)}</p>
    <div class="darkgold-exchange-grid">${ctx.renderDarkGoldExchangeCard?.(fragmentCount) || ''}</div>
  </div>`;
}

export function renderDarkGoldExchangeCard(entry, fragmentCount, ctx = smithyCtx) {
  const disabled = F(fragmentCount) < F(entry?.cost);
  return `<div class="smithy-item"><span class="item-icon rarity-darkGold">\u6697</span>
    <div><strong class="rarity-darkGold">${esc(entry?.title || '')}</strong><p class="academy-meta">${esc(entry?.desc || '')}</p><p class="academy-meta">\u6d88\u8017\uff1a${esc(ctx.getMaterialName?.('\u6697\u91d1\u788e\u7247') || '\u6697\u91d1\u788e\u7247')} \xd7${fmtn(entry?.cost)}</p></div>
    <button type="button" data-darkgold-exchange="${entry?.mode || ''}" ${entry?.slot ? `data-slot="${entry.slot}"` : ''} ${disabled ? 'disabled' : ''}>\u5151\u6362</button>
  </div>`;
}

export function renderRefineResultModal(ctx = smithyCtx) {
  const state = ctx.getState?.() || {};
  const result = ctx.getRefineResult?.() || null;
  const els = ctx.getEls?.() || {};
  if (!els.refineResultModal) return;
  const visible = Boolean(result);
  els.refineResultModal.classList.toggle('hidden', !visible);
  els.refineResultModal.setAttribute('aria-hidden', visible ? 'false' : 'true');
  if (!visible) { if (els.refineResultBody) els.refineResultBody.innerHTML = ''; return; }

  if (result.type === 'socket') {
    if (els.refineResultTitle) els.refineResultTitle.textContent = result.success ? '\u6253\u5b54\u6210\u529f\uff01' : '\u6253\u5b54\u5931\u8d25';
    if (els.refineResultConfirm) els.refineResultConfirm.textContent = '\u5173\u95ed';
    if (els.refineResultContinue) {
      els.refineResultContinue.textContent = '\u7ee7\u7eed\u6253\u5b54';
      const item = (state.inventory || []).find((e) => e.id === result.itemId);
      const cost = item ? ctx.getCardSocketCost?.(item) : null;
      els.refineResultContinue.disabled = !item || ctx.getEquipmentCardSlotCount?.(item) >= ctx.getMaxEquipmentCardSlots?.(item) || !cost || !ctx.canAffordSocketCost?.(cost);
    }
    if (els.refineResultBody) els.refineResultBody.innerHTML = `<div class="refine-result-card ${result.success ? 'refine-result-success' : 'refine-result-fail'}"><div class="refine-result-kicker">${result.success ? '\u5b54\u4f4d\u5f00\u542f' : '\u5320\u706b\u672a\u7a33'}</div><strong class="refine-result-item-name">${esc(result.itemName || '')}</strong></div>`;
    return;
  }

  const item = (state.inventory || []).find((e) => e.id === result.itemId);
  const continueEnabled = ctx.canContinueRefine?.(item);
  if (els.refineResultTitle) els.refineResultTitle.textContent = result.success ? '\u661f\u70bc\u6210\u529f\uff01' : '\u661f\u70bc\u5931\u8d25';
  if (els.refineResultConfirm) els.refineResultConfirm.textContent = '\u5173\u95ed';
  if (els.refineResultContinue) {
    els.refineResultContinue.textContent = result.success ? '\u7ee7\u7eed\u661f\u70bc' : '\u518d\u6b21\u5c1d\u8bd5';
    els.refineResultContinue.disabled = !continueEnabled;
    els.refineResultContinue.title = continueEnabled ? '' : '\u6750\u6599\u4e0d\u8db3\u6216\u5df2\u8fbe\u5230 15 \u661f';
  }
}

export function installSmithyRenderRuntime(context = {}) {
  configureSmithyRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, {
    renderSmithyPage, renderSmithyContent, renderEnhancePanel, renderSmithyMaterialGuide,
    renderDarkGoldExchangePanel, renderDarkGoldExchangeCard, renderEnhanceEffectText,
    renderSetTalentStatus, renderRefineStatDelta, renderRefineResultModal,
  }) : {};
  return window.RuneFrontierRenderRuntime;
}
