let codexCtx = {};

function esc(v) { return codexCtx.escapeHtml ? codexCtx.escapeHtml(v) : String(v); }
function fmtn(v) { return codexCtx.formatNumber ? codexCtx.formatNumber(v) : String(v || 0); }
function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureCodexRenderContext(ctx = {}) { codexCtx = ctx || {}; }

export function renderCodex(ctx = codexCtx) {
  const els = ctx.getEls?.() || {};
  if (!els.codexContent) return;
  const state = ctx.getState?.() || {};
  const tab = ctx.getCodexActiveTab?.() || 'monster';
  els.codexContent.innerHTML = tab === 'monster'
    ? renderCodexBonusesSummary(ctx) + renderMonsterCodex(ctx)
    : renderCodexBonusesSummary(ctx) + renderCardCodex(ctx);
  const btns = typeof document !== 'undefined' ? document.querySelectorAll('.codex-tab-btn') : [];
  btns.forEach((btn) => { btn.classList.toggle('active', btn.dataset.codexTab === tab); });
}

export function renderCodexBonusesSummary(ctx = codexCtx) {
  const state = ctx.getState?.() || {};
  const getBonuses = ctx.getCodexBonuses || (() => ({}));
  const getTotal = ctx.getTotalCodexLevel || (() => 0);
  const getMonsterMastery = ctx.getMonsterMasteryLevel || (() => 0);
  const getCardResearch = ctx.getCardResearchLevel || (() => 0);

  const b = getBonuses();
  const tl = getTotal();
  const monsterSum = Object.values(state.monsterCodex || {}).reduce((s, d) => s + getMonsterMastery(d.killCount || 0), 0);
  const cardSum = Object.values(state.cardCodex || {}).reduce((s, d) => s + getCardResearch(d.obtainCount || 0), 0);
  const lines = [`\u5168\u5c5e\u6027 +${(b.allStats * 100).toFixed(1)}%`, `\u6389\u843d +${(b.dropBonus * 100).toFixed(2)}%`, `Boss\u4f24\u5bb3 +${(b.bossDamage * 100).toFixed(1)}%`];
  if (F(b.abyssDamage) > 0) lines.push(`\u6df1\u6e0a\u4f24\u5bb3 +${(b.abyssDamage * 100).toFixed(1)}%`);
  if (F(b.hpBonus) > 0) lines.push(`\u751f\u547d +${(b.hpBonus * 100).toFixed(1)}%`);
  return `<div class="codex-collection-banner">
    <strong>\u603b\u56fe\u9274\u7b49\u7ea7 Lv.${tl}</strong><small>\u7ecf\u9a8c ${monsterSum + cardSum}\uff08\u602a\u7269\u719f\u7ec3 ${monsterSum} + \u5361\u7247\u7814\u7a76 ${cardSum}\uff09</small>
    <p class="codex-desc">\u5f53\u524d\u52a0\u6210\uff1a${lines.join(' \xb7 ')}</p>
  </div>`;
}

export function renderMonsterCodex(ctx = codexCtx) {
  const state = ctx.getState?.() || {};
  const nameMap = ctx.buildMonsterNameMap ? ctx.buildMonsterNameMap() : {};
  const sourceMap = ctx.buildMonsterSourceMap ? ctx.buildMonsterSourceMap() : {};
  const cardDropMap = ctx.buildMonsterCardDropMap ? ctx.buildMonsterCardDropMap() : {};
  const config = ctx.getMapMonsterConfig?.() || {};
  const cardPool = ctx.getCardPool?.() || [];
  const matNames = ctx.getMaterialNames?.() || {};
  const labelFn = ctx.getMonsterTypeLabel || ((id) => '\u666e\u901a');
  const masteryFn = ctx.getMonsterMasteryLevel || (() => 0);
  const codexTypeFn = ctx.getMonsterTypeForCodex || ((id) => 'normal');
  const milestones = ctx.getCodexKillMilestones?.() || [];
  const rewardsMap = ctx.getCodexKillRewards?.() || {};
  const milestoneLabels = ctx.getCodexMilestoneLabels?.() || [];
  const achievementTextFn = ctx.achievementRewardText || ((items) => '');
  const statLabelFn = ctx.statLabelName || ((k) => k);
  const thresholds = ctx.getCodexMasteryThresholds?.() || [];

  const allMonsterIds = new Set();
  Object.values(config).forEach((cfg) => {
    (cfg.monsters || []).forEach((m) => { if (m?.id) allMonsterIds.add(m.id); });
    if (cfg.bossTemplate?.id) allMonsterIds.add(cfg.bossTemplate.id);
  });
  cardPool.forEach((c) => { if (c.monsterId) allMonsterIds.add(c.monsterId); });

  const entries = [...allMonsterIds].map((id) => {
    const data = state.monsterCodex[id] || { killCount: 0, firstKilled: false, rewardsClaimed: {} };
    const name = nameMap[id] || matNames[id] || id.replace(/_/g, ' ');
    const sources = sourceMap[id] || [];
    const typeLabel = labelFn(id);
    const cards = cardDropMap[id] || [];
    return { id, name, sources, typeLabel, cards, ...data };
  }).sort((a, b) => F(b.killCount) - F(a.killCount));

  return `<div class="codex-grid">${entries.map((entry) => {
    const kc = F(entry.killCount);
    const unlocked = kc > 0;
    const masteryLv = masteryFn(kc);
    const nextThreshold = thresholds[Math.min(5, masteryLv + 1)] || '\u2014';
    return `<article class="codex-card ${unlocked ? 'unlocked' : 'locked'}">
      <div class="codex-head"><strong>${unlocked ? esc(entry.name) : '\uff1f\uff1f\uff1f'}</strong><small>\u51fb\u6740 ${fmtn(kc)}</small></div>
      <p class="codex-desc">${esc(entry.typeLabel)} \xb7 \u719f\u7ec3\u5ea6 Lv.${masteryLv} \xb7 \u4e0b\u9636 ${kc}/${nextThreshold}</p>
      ${unlocked ? `<p class="codex-desc">${esc(entry.typeLabel)}${entry.sources.length ? ' \xb7 \u51fa\u73b0\uff1a' + entry.sources.map((s) => esc(s)).join(' / ') : ''}</p>` : ''}
      ${entry.cards.length ? `<p class="codex-desc">\u53ef\u80fd\u6389\u843d\uff1a${entry.cards.map((s) => esc(s)).join(' / ')}</p>` : ''}
      <div class="codex-milestones">${milestones.map((ms, i) => {
        const done = kc >= ms;
        const claimed = entry.rewardsClaimed?.[ms] || false;
        const mType = codexTypeFn(entry.id);
        const rewardList = rewardsMap[mType] || rewardsMap.normal || {};
        const reward = rewardList[i] || {};
        const label = milestoneLabels[i] || (ms >= 10000 ? fmtn(ms / 10000) + '\u4e07' : ms >= 1000 ? fmtn(ms / 1000) + '\u5343' : fmtn(ms));
        const btnText = claimed ? '\u5df2\u9886\u53d6' : done ? '\u53ef\u9886\u53d6' : '\u672a\u8fbe\u6210';
        const disabled = !done || claimed ? 'disabled' : '';
        const itemsText = reward.items ? achievementTextFn(reward.items) : '';
        const statsText = reward.stats && Object.keys(reward.stats).length ? '\u6c38\u4e45\u5c5e\u6027\uff1a' + Object.entries(reward.stats).map(([k, v]) => `${statLabelFn(k) || k} +${(v * 100).toFixed(2)}%`).join(' \xb7 ') : '';
        const rewardHtml = [itemsText ? `<span class="codex-reward-items">\u7269\u54c1\uff1a${esc(itemsText)}</span>` : '', statsText ? `<span class="codex-reward-stats">${esc(statsText)}</span>` : ''].filter(Boolean).join('<br>') || '\u5956\u52b1';
        return `<span class="codex-milestone"><small>${esc(label)}</small><span>${rewardHtml}</span><button type="button" data-claim-codex="monster" data-monster-id="${entry.id}" data-milestone="${ms}" ${disabled}>${btnText}</button></span>`;
      }).join('')}</div>
    </article>`;
  }).join('')}</div>`;
}

export function renderCardCodex(ctx = codexCtx) {
  const state = ctx.getState?.() || {};
  const cardPool = ctx.getCardPool?.() || [];
  const milestoneArr = ctx.getCodexCardMilestones?.() || [];
  const rewardsArr = ctx.getCodexCardRewards?.() || {};
  const achievementTextFn = ctx.achievementRewardText || ((items) => '');
  const cardEffectFn = ctx.cardEffectText || (() => '');
  const researchFn = ctx.getCardResearchLevel || (() => 0);

  const allCards = cardPool.map((c) => {
    const data = state.cardCodex[c.id] || { obtained: false, obtainCount: 0, rewardsClaimed: {} };
    return { id: c.id, name: c.name, rarity: c.rarity || 'rare', ...data };
  }).sort((a, b) => F(b.obtainCount) - F(a.obtainCount));
  const totalObtained = allCards.filter((c) => c.obtained).length;

  return `<div class="codex-collection-banner">
    <strong>\u5361\u7247\u6536\u96c6\u8fdb\u5ea6</strong>
    <span>\u5df2\u83b7\u5f97\u4e0d\u540c\u5361\u7247\uff1a${totalObtained} \u5f20</span>
    <div class="codex-milestones" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px">${milestoneArr.map((ms, i) => {
      const done = totalObtained >= ms;
      const claimed = state.codexRewardsClaimed?.card?.[ms] || false;
      const reward = rewardsArr[i] || {};
      const btnText = claimed ? '\u5df2\u9886\u53d6' : done ? '\u53ef\u9886\u53d6' : '\u672a\u8fbe\u6210';
      const disabled = !done || claimed ? 'disabled' : '';
      return `<span class="codex-milestone"><small>${ms}\u5f20</small><span>${achievementTextFn(reward) || '\u5956\u52b1'}</span><button type="button" data-claim-codex="card" data-milestone="${ms}" ${disabled}>${btnText}</button></span>`;
    }).join('')}</div>
  </div>
  <div class="codex-grid">${allCards.map((entry) => {
    const card = cardPool.find((c) => c.id === entry.id) || {};
    return `<article class="codex-card ${entry.obtained ? 'unlocked' : 'locked'}">
      <div class="codex-head">
        <span class="card-item-name">${entry.obtained ? esc(entry.name) : '\uff1f\uff1f\uff1f'}</span>
        <small>${entry.obtained ? `\u83b7\u5f97 ${entry.obtainCount} \u5f20 \xb7 \u7814\u7a76 Lv.${researchFn(entry.obtainCount)}` : '\u672a\u83b7\u5f97'}</small>
      </div>
      ${entry.obtained ? `<p class="codex-desc">${esc(cardEffectFn(card))}</p>` : ''}
    </article>`;
  }).join('')}</div>`;
}

export function installCodexRenderRuntime(context = {}) {
  configureCodexRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object'
    ? Object.assign(existing, { renderCodex, renderMonsterCodex, renderCardCodex, renderCodexBonusesSummary })
    : { renderCodex, renderMonsterCodex, renderCardCodex, renderCodexBonusesSummary };
  return window.RuneFrontierRenderRuntime;
}
