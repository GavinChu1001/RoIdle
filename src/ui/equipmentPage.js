let equipCtx = {};

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function esc(v) { return equipCtx.escapeHtml ? equipCtx.escapeHtml(v) : String(v); }
function essa(v) { return equipCtx.escapeAttr ? equipCtx.escapeAttr(v) : String(v); }
function fmtn(v) { return equipCtx.formatNumber ? equipCtx.formatNumber(v) : String(v || 0); }
function fsv(stat, v) { return equipCtx.formatStatValue ? equipCtx.formatStatValue(stat, v) : String(v); }

export function configureEquipmentRenderContext(ctx = {}) { equipCtx = ctx || {}; }

export function renderRefineBadge(item, ctx = equipCtx) {
  const lv = F(item?.enhanceLevel);
  if (lv <= 0) return '';
  return `<span class="equipment-badge enhance-level-badge refine-badge">+${lv}${lv >= 10 ? ' \u2605' : ''}</span>`;
}

export function renderItemName(item, extraText, ctx = equipCtx) {
  if (!item) return '<span>\u672a\u77e5\u88c5\u5907</span>';
  const prefix = F(item?.enhanceLevel) > 0 ? `+${item.enhanceLevel} ` : '';
  const name = item.name || '???';
  const abyssPrefix = equipCtx.isAbyssEquipment?.(item) ? (name.startsWith('\u6df1\u6e0a ') ? '' : '\u6df1\u6e0a ') : '';
  return `<span class="item-name">${esc(prefix + abyssPrefix + name)}${extraText ? ' ' + esc(extraText) : ''}</span>`;
}

export function renderSetName(setName, ctx = equipCtx) {
  if (!setName) return '';
  return `<span class="equipment-badge set-badge">${esc(setName)}</span>`;
}

export function renderEquipmentSummaryStats(item, limit, ctx = equipCtx) {
  const entries = equipCtx.getEquipmentSummaryEntries?.(item, limit || 4) || [];
  if (!entries.length) return '<div class="equipment-card-empty">\u65e0\u6838\u5fc3\u5c5e\u6027</div>';
  return `<div class="equipment-summary-grid">${entries.map((e) => `<span class="equipment-summary-chip"><span>${esc(e.label)}</span><strong>${fsv(e.stat, e.value)}</strong></span>`).join('')}</div>`;
}

export function renderEquipmentCardScore(item, ctx = equipCtx) {
  const job = equipCtx.currentJob?.() || {};
  const scores = equipCtx.calculateEquipmentScores?.(item, job) || {};
  return `<div class="equipment-card-score"><span>\u7efc\u5408\u8bc4\u5206</span><strong>${fmtn(scores.comprehensive)}</strong></div>`;
}

export function renderEquipmentStateBadges(item, equipped, nextStar, ctx = equipCtx) {
  const badges = [];
  if (equipped) badges.push('\u5df2\u88c5\u5907');
  if (item.locked) badges.push('\u5df2\u9501\u5b9a');
  if (nextStar <= 15) badges.push('\u53ef\u661f\u70bc');
  if (equipCtx.isAbyssEquipment?.(item)) badges.push('\u6df1\u6e0a');
  const slotCount = equipCtx.getEquipmentCardSlotCount?.(item) || 0;
  const maxSlots = equipCtx.getMaxEquipmentCardSlots?.(item) || 0;
  if (maxSlots > 0) badges.push(`\u5361\u69fd ${slotCount}/${maxSlots}`);
  return badges.length ? `<div class="equipment-badge-row equipment-state-tags">${badges.map((t) => `<span class="equipment-badge">${t}</span>`).join('')}</div>` : '';
}

export function renderEquipmentBadges(item, ctx = equipCtx) {
  const job = equipCtx.currentJob?.() || {};
  const parts = [];
  if (item?.refine) parts.push(`\u2605${item.refine}`);
  if (item?.empower) parts.push(`\u2795${item.empower}`);
  return parts.length ? `<div class="equipment-badge-row">${parts.map((p) => `<span class="equipment-badge">${esc(p)}</span>`).join('')}</div>` : '';
}

export function renderEquipmentUsageTags(item, ctx = equipCtx) {
  const tags = equipCtx.getEquipmentUsageTags?.(item) || [];
  return tags.length ? `<div class="equipment-usage-tags">${tags.map((t) => `<span class="equipment-tag">${esc(t)}</span>`).join('')}</div>` : '';
}

export function renderEquipmentScores(item, ctx = equipCtx) {
  const scores = equipCtx.calculateEquipmentScores?.(item, equipCtx.currentJob?.() || {}) || {};
  return '<div class="equip-section equipment-score-section"><strong class="equipment-section-title">\u8bc4\u5206</strong>' +
    `<div class="equipment-stat-grid">` +
    `<span class="equipment-stat-chip"><span class="equipment-stat-name">\u8f93\u51fa</span><span class="equipment-stat-value">${fmtn(scores.output)}</span></span>` +
    `<span class="equipment-stat-chip"><span class="equipment-stat-name">\u751f\u5b58</span><span class="equipment-stat-value">${fmtn(scores.survival)}</span></span>` +
    `<span class="equipment-stat-chip"><span class="equipment-stat-name">Boss</span><span class="equipment-stat-value">${fmtn(scores.boss)}</span></span>` +
    `<span class="equipment-stat-chip"><span class="equipment-stat-name">\u6df1\u6e0a</span><span class="equipment-stat-value">${fmtn(scores.abyss)}</span></span>` +
    `</div></div>`;
}

export function renderEquipmentScoreComparison(item, ctx = equipCtx) {
  const comp = equipCtx.compareEquipmentScores?.(item) || {};
  if (!comp.score || !comp.currentJob) return '';
  return `<div class="equip-section"><strong class="equipment-section-title">\u5bf9\u6bd4\u5f53\u524d</strong>${equipCtx.formatScoreDelta?.(comp) || ''}</div>`;
}

export function renderEquipmentStatSections(item, ctx = equipCtx) {
  const statGroups = equipCtx.groupEquipmentStats?.(item) || [];
  const specialStats = (equipCtx.getSpecialStatKeys?.() || [])
    .map((stat) => equipCtx.equipmentStatEntry?.(equipCtx.getEffectiveItemStats?.(item, false) || {}, stat))
    .filter(Boolean);
  const abyssStats = Object.entries(item.abyssBonus || {}).map(([s, v]) => ({ stat: s, label: equipCtx.statLabelName?.(s) || s, value: v })).filter((e) => e.value);
  const abyssAffixStats = (item.abyssAffixes || []).flatMap((a) => Object.entries(a.effects || {}).map(([s, v]) => ({ stat: s, label: a.name || equipCtx.statLabelName?.(s) || s, value: v, desc: a.desc || '' })));
  const mechanicStats = [...(item.affixes || []), ...(item.mechanicAffixes || []).map((id) => `\u3010${(equipCtx.getMechanicAffixes?.()?.[id]?.label) || id}\u3011`)].filter(Boolean);
  const refineStats = item.refine ? (equipCtx.statObjectText || (() => ''))(equipCtx.star15Bonus?.(item) || {}) : '';
  const setText = item.setId ? renderEquipmentSetProgress(item, ctx) : '';

  return `${renderEquipmentScores(item, ctx)}
    ${renderEquipmentScoreComparison(item, ctx)}
    ${statGroups.map((g) => `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">${esc(g.title)}</strong>${renderStatChipGrid(g.entries, '', ctx)}</div>`).join('')}
    ${equipCtx.randomStatsHtml?.(item) || ''}
    ${(mechanicStats.length || specialStats.length) ? `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">\u7279\u6b8a\u8bcd\u6761</strong>${renderStatChipGrid(specialStats, 'equipment-special-chip', ctx)}${mechanicStats.length ? `<div class="equipment-mechanic-tags">${mechanicStats.map((t) => `<span>${esc(t)}</span>`).join('')}</div>` : ''}</div>` : ''}
    ${(abyssStats.length || abyssAffixStats.length) ? `<div class="equip-section equipment-stat-section equipment-abyss-section"><strong class="equipment-section-title">\u6df1\u6e0a\u52a0\u6210</strong>${renderStatChipGrid(abyssStats, 'equipment-special-chip', ctx)}${renderStatChipGrid(abyssAffixStats, 'equipment-special-chip abyss-affix-chip', ctx)}</div>` : ''}
    ${renderEmpowerSection(item, ctx)}
    ${renderRefineSection(item, refineStats, ctx)}
    ${setText}`;
}

export function renderSalvagePreviewSection(item, ctx = equipCtx) {
  const rewards = equipCtx.getSalvageRewardsPreview?.(item) || {};
  const entries = Object.entries(rewards).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 0);
  if (!entries.length) return '';
  const names = equipCtx.getMaterialNames?.() || {};
  return `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">\u5206\u89e3\u9884\u89c8</strong><div class="equipment-stat-grid">${entries.map(([id, v]) => `<span class="equipment-stat-chip"><span class="equipment-stat-name">${esc(names[id] || id)}</span><span class="equipment-stat-value">${v}</span></span>`).join('')}</div></div>`;
}

export function renderCardSocketOptions(selected, ctx = equipCtx) {
  const cards = equipCtx.getCardPool?.() || [];
  return cards.filter((c) => !selected || c.id !== selected).slice(0, 10).map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
}

export function renderCardSocketSection(item, ctx = equipCtx) {
  const slots = item.cardSlots || [];
  const maxSlots = equipCtx.getMaxEquipmentCardSlots?.(item) || 0;
  if (maxSlots <= 0) return '';
  const getCard = equipCtx.getSocketCard || ((id) => null);
  return `<div class="equip-section equipment-stat-section"><strong class="equipment-section-title">\u5361\u7247\u63d2\u69fd\uff08${slots.length}/${maxSlots}\uff09</strong><div class="equipment-stat-grid">${slots.map((s, i) => {
    const card = getCard(s.cardId);
    return `<span class="equipment-stat-chip"><span class="equipment-stat-name">\u69fd${i + 1}</span><span class="equipment-stat-value">${card ? esc(card.name) : '\u7a7a'}</span></span>`;
  }).join('')}</div>${slots.length < maxSlots ? `<button type="button" data-socket-item="${item.id}">\u5f00\u542f\u65b0\u5361\u69fd</button>` : ''}</div>`;
}

export function renderRefineSection(item, refineStats, ctx = equipCtx) {
  const chance = equipCtx.getRefineChance?.((item?.refine || 0) + 1, item) || 0;
  const pity = `${Math.round(F(item?.refineFailCount) * 1.5 * 10) / 10}%`;
  const ms = item?.refine >= 15 ? '\u6ee1\u661f\u5956\u52b1\u5df2\u6fc0\u6d3b' : item?.refine >= 10 ? '+10 \u5df2\u8fbe\u6210\uff0c+15 \u672a\u8fbe\u6210' : item?.refine >= 7 ? '+7 \u5df2\u8fbe\u6210\uff0c+10 \u672a\u8fbe\u6210' : '+7 \u672a\u8fbe\u6210';
  const growthStats = equipCtx.getRefineGrowthStats?.(item) || {};
  const growthText = equipCtx.renderRefineStatDelta?.(growthStats) || '';
  return `<div class="equip-section equipment-refine-section"><strong class="equipment-section-title">\u2605\u661f\u70bc</strong><div class="equipment-stat-grid">
    <span class="equipment-stat-chip"><span class="equipment-stat-name">\u5f53\u524d\u7b49\u7ea7</span><span class="equipment-stat-value">+${F(item?.refine)}</span></span>
    <span class="equipment-stat-chip"><span class="equipment-stat-name">\u4e0b\u7ea7\u6210\u529f\u7387</span><span class="equipment-stat-value">${chance}</span></span>
    <span class="equipment-stat-chip"><span class="equipment-stat-name">\u4fdd\u5e95\u52a0\u6210</span><span class="equipment-stat-value">+${pity}</span></span>
  </div><small class="slot-meta">\u661f\u70bc\u6210\u957f\uff1a${growthText || '\u8be5\u88c5\u5907\u6682\u65e0\u53ef\u661f\u70bc\u6210\u957f\u5c5e\u6027\u3002'}</small><small class="slot-meta">\u91cc\u7a0b\u7891\uff1a${ms}${refineStats ? ` \xb7 15\u661f\u5956\u52b1\uff1a${refineStats}` : ' \xb7 \u6ee1\u661f\u5956\u52b1\uff1a\u672a\u6fc0\u6d3b'}</small></div>`;
}

export function renderEmpowerSection(item, ctx = equipCtx) {
  const level = F(item?.empower);
  if (!level) return '';
  return `<div class="equip-section"><strong class="equipment-section-title">\u8d4b\u80fd</strong><span>+${level}</span></div>`;
}

export function renderStatChipGrid(entries, extraClass, ctx = equipCtx) {
  if (!Array.isArray(entries) || !entries.length) return '';
  return `<div class="equipment-stat-grid">${entries.map((e) => e ? `<span class="equipment-stat-chip ${extraClass || ''}">${e.label ? `<span class="equipment-stat-name">${esc(e.label)}</span>` : ''}${e.desc ? `<small class="equipment-stat-value">${esc(e.desc)}</small>` : ''}${(!e.label && !e.desc && e.stat) ? `<span class="equipment-stat-name">${esc(e.stat)}</span><span class="equipment-stat-value">${fsv(e.stat, e.value)}</span>` : ''}</span>` : '').filter(Boolean).join('')}</div>`;
}

export function renderEquipmentSetProgress(item, ctx = equipCtx) {
  const setId = item?.setId;
  if (!setId) return '';
  const state = equipCtx.getState?.() || {};
  const count = equipCtx.countEquippedSetPieces?.(setId) || 0;
  const set = equipCtx.getEquipmentSet?.(setId) || {};
  const total = (set.items || []).length;
  return `<div class="equip-section"><strong class="equipment-section-title">\u5957\u88c5\u8fdb\u5ea6</strong><span>${esc(set.name || setId)} ${count}/${total}</span></div>`;
}

export function renderRandomStatsPanel(item, ctx = equipCtx) {
  const text = equipCtx.randomStatsHtml?.(item) || '';
  return text ? `<div class="equip-section"><strong class="equipment-section-title">\u968f\u673a\u8bcd\u6761</strong>${text}</div>` : '';
}

export function renderEquipmentFilterBar(count, ctx = equipCtx) {
  return `<div class="equipment-bar">
    <span>${fmtn(count)} \u4ef6\u88c5\u5907</span>
    <button type="button" data-equip-best>\u4e00\u952e\u88c5\u5907</button>
    <button type="button" data-salvage-all-unequipped>\u6279\u91cf\u5206\u89e3</button>
  </div>`;
}

export function renderEquipmentBatchPanel(ctx = equipCtx) {
  return '<div class="slot-card"></div>';
}

export function renderEquipment(ctx = equipCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.equippedSlots || !els.equipmentGrid) return;

  ctx.pruneEquipmentDetailExpandedState?.();

  els.equippedSlots.innerHTML = ['weapon', 'armor', 'headgear', 'shoes', 'trinket'].map((slot) => {
    const item = (state.inventory || []).find((e) => e.id === state.equipped?.[slot]);
    return `<div class="slot-card"><span class="slot-name">${ctx.slotName?.(slot) || slot}</span><div class="slot-meta">${ctx.equippedSlotMeta?.(item) || ''}</div></div>`;
  }).join('');

  els.materialList.innerHTML = `
    ${ctx.renderMaterialGroups?.() || ''}
    ${renderEquipmentBatchPanel(ctx)}
    ${ctx.renderZodiacCollectionPanel?.() || ''}
    ${ctx.renderCostumePanel?.() || ''}
    <div class="slot-card auto-salvage-card">
      <span class="slot-name">\u81ea\u52a8\u5206\u89e3</span>
      <p class="slot-meta">\u4ec5\u5bf9\u65b0\u83b7\u5f97\u88c5\u5907\u751f\u6548\uff0c\u4e0d\u4f1a\u9ed8\u8ba4\u5206\u89e3\u4f20\u8bf4/\u6697\u91d1/\u795e\u8bdd/\u5957\u88c5\u3002</p>
      <label class="setting-line"><input type="checkbox" data-auto-salvage-enabled ${state.autoSalvage?.enabled ? 'checked' : ''}> \u5f00\u542f\u81ea\u52a8\u5206\u89e3</label>
      <select data-auto-salvage-rarity>${['normal', 'fine', 'rare', 'epic'].map((r) => `<option value="${r}" ${state.autoSalvage?.maxRarity === r ? 'selected' : ''}>${ctx.rarityName?.(r) || r}\u53ca\u4ee5\u4e0b</option>`).join('')}</select>
      <label class="setting-line"><input type="checkbox" data-auto-dismantle-abyss ${state.autoSalvage?.autoDismantleAbyss ? 'checked' : ''}> \u5141\u8bb8\u81ea\u52a8\u5206\u89e3\u6df1\u6e0a\u88c5\u5907</label>
      <small class="slot-meta">\u5957\u88c5\u3001\u6697\u91d1\u3001\u795e\u8bdd\u3001\u9501\u5b9a\u88c5\u5907\u4ecd\u4f1a\u88ab\u4fdd\u62a4\u3002</small>
    </div>`;

  const filtered = ctx.sortEquipmentList?.((ctx.filterEquipmentList || ((l) => l))([...(state.inventory || [])])) || [];
  const visible = ctx.getEquipmentShowAll?.() ? filtered : filtered.slice(0, 18);
  els.equipmentFilterBar.innerHTML = renderEquipmentFilterBar(filtered.length, ctx);

  const emptyMsg = '<article class="slot-card equipment-empty-state"><span class="slot-name">\u6ca1\u6709\u7b26\u5408\u6761\u4ef6\u7684\u88c5\u5907</span><p class="slot-meta">\u53ef\u4ee5\u5207\u6362\u7b5b\u9009\u6216\u7ee7\u7eed\u6302\u673a\u83b7\u53d6\u88c5\u5907\u3002</p></article>';

  if (!visible.length) {
    els.equipmentGrid.innerHTML = emptyMsg;
    return;
  }

  els.equipmentGrid.innerHTML = visible.map((item) => {
    const equipped = state.equipped?.[ctx.equipmentSlot?.(item) || 'weapon'] === item.id;
    const refineCost = ctx.getRefineCost?.(item) || {};
    const empowerCost = ctx.getEmpowerCost?.(item) || {};
    const nextStar = F(item?.refine) + 1;
    const nextEmpower = F(item?.empower) + 1;
    const detailKey = ctx.equipmentDetailKey?.(item) || item.id;
    const detailExpanded = Boolean(ctx.getEquipmentDetailExpanded?.()?.[detailKey]);
    const refineTextFn = ctx.refineText || (() => '');
    const empowerTextFn = ctx.empowerText || (() => '');
    const hasMats = ctx.hasMaterials || (() => false);
    const isZodiac = ctx.isZodiacItem || (() => false);

    return `<article class="equip-item equipment-detail-card ${ctx.equipmentVisualClass?.(item) || ''} ${equipped ? 'equipped' : ''} ${F(item?.enhanceLevel) >= 10 ? 'enhance-glow' : ''}" data-tooltip="${essa(ctx.itemRangeTooltip?.(item) || '')}" title="${essa(ctx.itemRangeTooltip?.(item) || '')}">
      <div class="equip-head equipment-detail-header">
        <span class="item-icon" style="background-image:${ctx.imageBackgroundList?.(ctx.itemImageCandidates?.(item) || []) || ''}"></span>
        <div class="equipment-name-main">
          <span class="equip-name equipment-name-row">${renderItemName(item, `Lv.${item.level} ${refineTextFn(item)} ${empowerTextFn(item)}`, ctx)}</span>
          ${renderEquipmentBadges(item, ctx)}
          ${renderEquipmentUsageTags(item, ctx)}
          ${renderEquipmentStateBadges(item, equipped, nextStar, ctx)}
        </div>
      </div>
      <span class="equip-meta">${ctx.slotName?.(item.slot) || item.slot} \xb7 ${ctx.rarityName?.(item.rarity) || item.rarity}</span>
      ${ctx.isAbyssEquipment?.(item) ? '<span class="equip-meta">\u6765\u6e90\uff1a\u6df1\u6e0a\u96be\u5ea6</span>' : ''}
      ${item.setName ? `<span class="equip-meta">${renderSetName(item.setName, ctx)}</span>` : ''}
      ${renderEquipmentCardScore(item, ctx)}
      ${renderEquipmentSummaryStats(item, 4, ctx)}
      <details class="equipment-detail-toggle" data-equipment-detail-key="${essa(detailKey)}" ${detailExpanded ? 'open' : ''}>
        <summary data-equipment-detail-toggle="${essa(detailKey)}">${detailExpanded ? '\u6536\u8d77\u5b8c\u6574\u5c5e\u6027' : '\u67e5\u770b\u5b8c\u6574\u5c5e\u6027'}</summary>
        ${renderCardSocketSection(item, ctx)}
        ${renderEquipmentStatSections(item, ctx)}
        ${renderSalvagePreviewSection(item, ctx)}
        <span class="equip-meta">\u661f\u70bc ${Math.round(ctx.getRefineChance?.(nextStar, item) * 100 || 0)}% \xb7 \u4fdd\u5e95 +${Math.round(F(item?.refineFailCount) * 1.5 * 10) / 10}% \xb7 ${nextStar <= 15 ? ctx.materialText?.(refineCost) || '' : '\u5df2\u6ee1\u661f'}</span>
        <span class="equip-meta">\u8d4b\u80fd ${nextEmpower <= 10 ? ctx.materialText?.(empowerCost) || '' : '\u5df2\u6ee1\u9636'}</span>
      </details>
      <div class="equip-actions equipment-action-row">
        <button type="button" data-equip-item="${item.id}">${equipped ? '\u5df2\u88c5\u5907' : '\u88c5\u5907'}</button>
        <button type="button" data-refine-item="${item.id}" ${nextStar > 15 || !hasMats(refineCost) ? 'disabled' : ''}>\u661f\u70bc</button>
        <button type="button" data-empower-item="${item.id}" ${nextEmpower > 10 || !hasMats(empowerCost) ? 'disabled' : ''}>\u8d4b\u80fd</button>
        <button class="ghost" type="button" data-lock-item="${item.id}">${item.locked ? '\u89e3\u9501' : '\u9501\u5b9a'}</button>
        ${isZodiac(item) ? `<button class="ghost" type="button" data-collect-zodiac="${item.id}">\u6536\u85cf</button><button class="ghost" type="button" data-zodiac-salvage="${item.id}" ${equipped || item.locked ? 'disabled' : ''}>\u661f\u5ea7\u5206\u89e3</button>` : ''}
        <button class="ghost" type="button" data-salvage-item="${item.id}" ${equipped || item.locked || isZodiac(item) ? 'disabled' : ''}>\u5206\u89e3</button>
      </div>
    </article>`;
  }).join('');
}
