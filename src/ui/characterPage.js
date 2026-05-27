let charCtx = {};

function F(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function esc(v) { return charCtx.escapeHtml ? charCtx.escapeHtml(v) : String(v); }
function fmtn(v) { return charCtx.formatNumber ? charCtx.formatNumber(v) : String(v || 0); }
function pct(v) { return charCtx.percent ? charCtx.percent(v) : String(Math.round((v || 0) * 100)) + '%'; }
function fsv(stat, v) { return charCtx.formatStatValue ? charCtx.formatStatValue(stat, v) : String(v); }

export function configureCharacterRenderContext(ctx = {}) { charCtx = ctx || {}; }

export function renderHeroes(ctx = charCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  if (!els.heroList) return;
  const stats = ctx.computeStats?.() || {};
  const job = ctx.currentJob?.() || {};
  const nextSkill = ctx.getNextJobSkill?.() || null;
  const jobExpCost = ctx.jobExpCost?.() || 1;
  const maxLevel = ctx.maxBaseLevel?.() || 1;
  const attrs = stats.attrs || {};
  const atBaseCap = state.hero?.baseLevel >= maxLevel;
  const prestige = ctx.normalizeRebirthPrestige?.(state.rebirthPrestige, state.hero?.rebirths || 0) || {};
  const prestigeBonus = ctx.getRebirthPrestigeBonuses?.() || {};
  const ratingScores = ctx.calculatePlayerRatingScores?.(stats) || {};
  const critSummary = ctx.formatCritRateSummary?.(stats) || '';

  els.heroList.innerHTML = `<article class="hero-card">
    <div class="hero-portrait" style="background-image:${ctx.imageBackgroundList?.(ctx.classImageCandidates?.(job.id)) || ''}">
      <div class="avatar ${job.id}" aria-hidden="true"></div>
    </div>
    <div class="hero-info">
      <div class="hero-title">
        <strong>${esc(state.hero?.name || '')} \xb7 ${esc(job.name || '')} ${!state.hero?.renameUsed ? '<button class="rename-icon" type="button" data-rename-hero title="\u4fee\u6539\u540d\u5b57">&#9998;</button>' : ''}</strong>
        <span>BASE ${fmtn(state.hero?.baseLevel || 0)}/${fmtn(maxLevel)} / JOB ${fmtn(state.hero?.jobLevel || 0)} / \u8f6c\u751f ${fmtn(state.hero?.rebirths || 0)}</span>
      </div>
      <div class="hero-stats">
        <span>\u6218\u529b ${fmtn(stats.power)}</span><span>\u8f93\u51fa ${fmtn(stats.dps)}</span>
        <span>\u751f\u547d ${fmtn(state.hero?.currentHp || 0)}/${fmtn(stats.maxHp)}</span><span>\u9632\u5fa1 ${fmtn(stats.defense)}</span>
      </div>
      <div class="stat-grid">
        <span>\u653b\u901f ${F(stats.aspd).toFixed(2)}</span><span>\u7269\u653b ${fmtn(stats.atkPower)}</span>
        <span>\u9b54\u653b ${fmtn(stats.matkPower)}</span><span>\u751f\u547d\u6062\u590d \u6bcf ${ctx.getHpRegenInterval?.() || 5} \u79d2 +${fmtn(stats.hpRegen)}</span>
        <span>\u95ea\u907f ${pct(stats.dodgeRate)}</span><span>${critSummary}</span>
        <span>\u66b4\u51fb\u4f24\u5bb3 ${pct(stats.critDamage || (1.85 + F(stats.critDamageBonus)))}</span>
        <span>${nextSkill ? `\u4e0b\u4e2a Job ${nextSkill.level}` : '\u6280\u80fd\u5b8c\u6210'}</span>
      </div>
      <div class="hero-stat-section"><strong>\u6838\u5fc3\u8bc4\u5206</strong><div class="stat-grid">
        <span>\u7efc\u5408 ${fmtn(stats.power)}</span><span>\u8f93\u51fa ${fmtn(ratingScores.output)}</span>
        <span>\u751f\u5b58 ${fmtn(ratingScores.survival)}</span><span>Boss ${fmtn(ratingScores.boss)}</span>
        <span>\u6df1\u6e0a ${fmtn(ratingScores.abyss)}</span><span>\u6253\u5b9d ${fmtn(ratingScores.treasure || 0)}</span>
      </div></div>
      <div class="attribute-grid">${(ctx.getAttributeKeys?.() || []).map((stat) => `<span>${stat.toUpperCase()} ${attrs[stat]} (${stats.baseAttrs?.[stat] || 0} +${F(attrs[stat]) - F(stats.baseAttrs?.[stat])})<small>\u8bad\u7ec3 ${fsv(stat+'Pct', stats.trainingPct?.[stat] || 0)}</small></span>`).join('')}</div>
      <div class="hero-actions-inline">
        <button type="button" data-upgrade="base" ${atBaseCap ? 'disabled' : ''}>\u8bad\u7ec3 ${fmtn(ctx.heroTrainCost?.() || 0)}</button>
        <button type="button" data-batch-upgrade="base" ${atBaseCap ? 'disabled' : ''}>\u6279\u91cf\u8bad\u7ec3</button>
        <button class="ghost" type="button" data-rebirth ${atBaseCap ? '' : 'disabled'}>\u8f6c\u751f</button>
      </div>
      ${F(state.hero?.rebirths) > 0 ? `
      <div class="rebirth-mode-section">
        <label class="rebirth-toggle">
          <input type="checkbox" data-rebirth-mode ${state.rebirthMode ? 'checked' : ''} />
          <span>\u8f6e\u56de\u6a21\u5f0f</span>
        </label>
        <span class="rebirth-seal-count">\u26a1 \u8f6e\u56de\u5370\u8bb0\uff1a${fmtn(state.rebirthSeals || 0)}</span>
      </div>` : ''}
      <details class="hero-details" ${state.heroDetailsOpen !== false ? 'open' : ''}>
        <summary>\u5c5e\u6027\u6765\u6e90 \xb7 \u5957\u88c5 \xb7 \u79f0\u53f7 \xb7 \u6280\u80fd</summary>
        ${ctx.renderCharacterStatSections?.(stats) || ''}
        ${ctx.renderCharacterStatBreakdown?.(stats) || ''}
        <div class="set-talent">${ctx.renderSetTalentStatus?.() || ''}</div>
        ${ctx.renderTitlePanel?.() || ''}
        ${ctx.renderPowerSourcePanel?.(stats) || ''}
        <section class="title-panel">
          <strong>\u8f6c\u751f\u58f0\u671b Lv.${prestige.level}</strong>
          <small>\u7d2f\u8ba1\u8f6c\u751f ${prestige.totalRebirths} \u6b21 \xb7 \u5f71\u54cd\u88c5\u5907\u54c1\u8d28\u6743\u91cd\uff0c\u4e0d\u589e\u52a0\u88c5\u5907\u6389\u843d\u6570\u91cf</small>
          <small>\u7a00\u6709+ +${pct(prestigeBonus.rarePlusWeightBonus)} \xb7 \u53f2\u8bd7+ +${pct(prestigeBonus.epicPlusWeightBonus)} \xb7 \u4f20\u8bf4+ +${pct(prestigeBonus.legendPlusWeightBonus)} \xb7 \u6697\u91d1+ +${pct(prestigeBonus.darkGoldPlusWeightBonus)} \xb7 \u795e\u8bdd +${pct(prestigeBonus.mythicWeightBonus)}</small>
        </section>
        ${renderRebirthResearchPanel(state, fmtn)}
        <p class="job-growth">${ctx.describeJobGrowth?.() || ''}</p>
        <section class="skill-panel">${ctx.renderSkillPanel?.() || ''}</section>
      </details>
      <div class="meter"><div style="width:${Math.min(1, F(state.hero?.jobExp) / jobExpCost) * 100}%"></div></div>
    </div>
  </article>`;
}

function renderRebirthResearchPanel(state, fmtn) {
  if (F(state.hero?.rebirths) <= 0) return '';
  const tree = window.REBIRTH_RESEARCH_TREE || [];
  const affixes = window.REBIRTH_FORGE_AFFIXES || [];
  const runtime = window.RuneFrontierRebirthRuntime;
  const seals = F(state.rebirthSeals);
  const research = state.rebirthResearch || {};
  const forging = state.rebirthForging || {};

  const researchNodes = tree.map((node) => {
    const unlocked = research[node.id]?.unlocked;
    const canUnlock = runtime?.canUnlockNode?.(node.id) ?? false;
    const requiresMet = (node.requires || []).every((req) => research[req]?.unlocked);
    let status = '';
    if (unlocked) status = `<span class="rebirth-node-unlocked">\u2713 \u5df2\u89e3\u9501</span>`;
    else if (canUnlock) status = `<button type="button" class="rebirth-node-btn" data-rebirth-research="${esc(node.id)}">\u89e3\u9501 ${esc(node.desc)}\uff08\u6d88\u8017 ${fmtn(node.cost)} \u5370\u8bb0\uff09</button>`;
    else status = `<span class="rebirth-node-locked">\u9501 ${esc(node.desc)}\uff08${requiresMet ? `\u5370\u8bb0\u4e0d\u8db3\uff08\u9700 ${fmtn(node.cost)}` : '\u524d\u7f6e\u672a\u89e3\u9501'}）</span>`;
    return `<div class="rebirth-node"><strong>${esc(node.name)}</strong>${status}</div>`;
  }).join('');

  const forgeNodes = affixes.map((affix) => {
    const currentLevel = F(forging[affix.id]);
    const maxLevel = affix.maxLevel || 5;
    const canUpgrade = runtime?.canUpgradeAffix?.(affix.id) ?? false;
    const cost = runtime?.getAffixUpgradeCost?.(affix.id) ?? Infinity;
    let action = '';
    if (currentLevel >= maxLevel) action = `<span class="rebirth-node-unlocked">\u2713 \u5df2\u6ee1\u7ea7 Lv.${fmtn(currentLevel)}/${fmtn(maxLevel)}</span>`;
    else if (canUpgrade) action = `<button type="button" class="rebirth-node-btn" data-rebirth-forge="${esc(affix.id)}">\u5347\u7ea7\u81f3 Lv.${fmtn(currentLevel + 1)}\uff08\u6d88\u8017 ${fmtn(cost)} \u5370\u8bb0\uff09</button>`;
    else action = `<span class="rebirth-node-locked">\u5370\u8bb0\u4e0d\u8db3\uff08\u9700 ${fmtn(cost)}）</span>`;
    return `<div class="rebirth-node"><strong>${esc(affix.name)} Lv.${fmtn(currentLevel)}/${fmtn(maxLevel)}</strong><small>${esc(affix.desc)}</small>${action}</div>`;
  }).join('');

  return `
    <section class="rebirth-panel">
      <strong>\u8f6c\u751f\u7814\u7a76</strong>
      <small>\u5f53\u524d\u5370\u8bb0\uff1a${fmtn(seals)}</small>
      ${researchNodes}
      ${forgeNodes ? '<hr /><strong>\u8f6e\u56de\u953b\u9020</strong>' + forgeNodes : ''}
      ${renderAwakeningSection(state, fmtn)}
    </section>`;
}

function renderAwakeningSection(state, fmtn) {
  const runtime = window.RuneFrontierRebirthRuntime;
  const config = runtime?.getAwakenableSkill?.();
  if (!config) return '';
  const jobId = (window.currentJob?.() || {}).id;
  const awakened = runtime?.isSkillAwakened?.(jobId);
  if (awakened) return '<hr /><strong>\u89c9\u9192</strong><span class="rebirth-node-unlocked">\u2713 \u5df2\u89c9\u9192\uff1a' + esc(config.skill) + '\u2014\u2014' + esc(config.desc) + '</span>';
  const hasAwakeningMarks = Object.prototype.hasOwnProperty.call(state || {}, 'awakeningMarks');
  const marks = Math.max(0, Number(state?.awakeningMarks) || 0);
  const canDo = hasAwakeningMarks && marks >= Number(config.cost || 0);
  if (canDo) return '<hr /><strong>\u89c9\u9192</strong><button type="button" class="rebirth-node-btn" data-rebirth-awaken>' + esc(config.skill) + '\uff1a' + esc(config.desc) + '\uff08\u6d88\u8017 ' + fmtn(config.cost) + ' \u89c9\u9192\u5370\u8bb0\uff09</button>';
  if (!hasAwakeningMarks) return '<hr /><strong>\u89c9\u9192</strong><span class="rebirth-node-locked">\u89c9\u9192\u5370\u8bb0\u83b7\u53d6\u6682\u672a\u5f00\u653e\uff1a' + esc(config.desc) + '\uff08\u9700 ' + fmtn(config.cost) + ' \u89c9\u9192\u5370\u8bb0\uff09</span>';
  return '<hr /><strong>\u89c9\u9192</strong><span class="rebirth-node-locked">\u89c9\u9192\u5370\u8bb0\u4e0d\u8db3\uff08\u9700 ' + fmtn(config.cost) + '\uff09\uff1a' + esc(config.desc) + '</span>';
}

export function renderPowerSourcePanel(stats, ctx = charCtx) {
  const equip = ctx.computeEquipmentFullStats?.() || {};
  const setBonuses = stats.setBonuses || {};
  const cardStats = ctx.getCardStats?.() || {};
  const titleEffects = ctx.getTitleEffects?.() || {};
  const vipBonuses = stats.vipBonuses || ctx.getVipBonuses?.() || {};
  const exploration = stats.explorationBonuses || ctx.getMapExplorationBonuses?.(ctx.currentMap?.()?.id) || {};
  const state = ctx.getState?.() || {};
  const attrKeys = ctx.getAttributeKeys?.() || [];
  const baseValue = attrKeys.reduce((sum, stat) => sum + F(stats.baseAttrs?.[stat]) * 12, 0) + F(state.hero?.baseLevel) * 18 + F(state.hero?.jobLevel) * 10;
  const equipmentValue = F(equip.atk) * 1.6 + F(equip.matk) * 1.6 + F(equip.def) * 1.3 + F(equip.hp) * 0.12 + attrKeys.reduce((sum, stat) => sum + F(equip[stat]) * 10, 0);
  const refineValue = Object.values(state.equipped || {}).reduce((sum, id) => {
    const item = (state.inventory || []).find((e) => e.id === id);
    return sum + F(item?.refine) * 42;
  }, 0);
  const cardValue = Object.values(cardStats || {}).reduce((sum, v) => sum + F(v) * 65, 0);
  const titleValue = Object.values(titleEffects || {}).reduce((sum, v) => sum + F(v) * 70, 0);
  const vipValue = Object.values(vipBonuses || {}).reduce((sum, v) => sum + F(v) * 80, 0);
  const explorationValue = Object.values(exploration || {}).reduce((sum, v) => sum + F(v) * 40, 0);
  const setValue = Object.values(setBonuses || {}).reduce((sum, v) => sum + F(v) * 55, 0);
  const total = baseValue + equipmentValue + refineValue + cardValue + titleValue + vipValue + explorationValue + setValue;
  const pctFn = (v) => total > 0 ? Math.round((F(v) / total) * 100) : 0;
  return `<section class="hero-stat-section"><strong>\u6218\u529b\u6765\u6e90</strong>
    <div class="stat-grid">
      <span>\u57fa\u7840 ${pctFn(baseValue)}%</span><span>\u88c5\u5907 ${pctFn(equipmentValue)}%</span>
      <span>\u7cbe\u70bc ${pctFn(refineValue)}%</span><span>\u5361\u7247 ${pctFn(cardValue)}%</span>
      <span>\u79f0\u53f7 ${pctFn(titleValue)}%</span><span>VIP ${pctFn(vipValue)}%</span>
      <span>\u63a2\u7d22 ${pctFn(explorationValue)}%</span><span>\u5957\u88c5 ${pctFn(setValue)}%</span>
    </div>
  </section>`;
}

export function renderTown(ctx = charCtx) {
  const state = ctx.getState?.() || {};
  const els = ctx.getEls?.() || {};
  const canFirst = state.hero?.jobId === 'novice' && F(state.hero?.jobLevel) >= 10;
  const nextJobId = ctx.getNextJobId?.() || null;
  const canAdvance = Boolean(nextJobId) && F(state.hero?.jobLevel) >= 50;
  const job = ctx.currentJob?.() || {};
  const maxLevel = ctx.maxBaseLevel?.() || 1;

  if (els.townIdentity) {
    els.townIdentity.innerHTML = `<div class="town-identity-card">
      <strong>${esc(job.name)}</strong>
      <span>BASE ${fmtn(state.hero?.baseLevel || 0)}/${fmtn(maxLevel)} \xb7 JOB ${fmtn(state.hero?.jobLevel || 0)} \xb7 \u8f6c\u751f ${fmtn(state.hero?.rebirths || 0)}</span>
      <span class="academy-meta">${(state.hero?.jobHistory || []).map((id) => ctx.getJobTemplate?.()?.[id]?.name || id).join(' \u2192 ')}</span>
    </div>`;
  }
  if (els.academyStatus) {
    els.academyStatus.textContent = state.hero?.jobId === 'novice'
      ? canFirst ? '\u5df2\u6ee1\u8db3 JOB 10\uff0c\u53ef\u9009\u62e9\u4e00\u8f6c\u804c\u4e1a' : `\u521d\u5b66\u8005 JOB ${fmtn(state.hero?.jobLevel)}/10\uff0c\u7ee7\u7eed\u6253\u602a\u83b7\u53d6 JOB \u7ecf\u9a8c`
      : nextJobId ? canAdvance ? `\u5df2\u6ee1\u8db3 JOB 50\uff0c\u53ef\u8f6c\u804c\u4e3a ${ctx.getJobTemplate?.()?.[nextJobId]?.name || '\u672a\u77e5'}` : `${job.name} JOB ${fmtn(state.hero?.jobLevel)}/50\uff0c\u7ee7\u7eed\u4fee\u70bc\u4e0b\u4e00\u9636\u6bb5` : `\u5df2\u5b8c\u6210\u5f53\u524d\u804c\u4e1a\u6811\uff1a${job.name}`;
  }
  if (els.academyGrid) {
    const academyJobs = state.hero?.jobId === 'novice' ? (ctx.getFirstJobs?.() || []) : nextJobId ? [nextJobId] : [];
    const jobTemplates = ctx.getJobTemplates?.() || {};
    const summaryFn = ctx.jobSummary || (() => '');
    els.academyGrid.innerHTML = academyJobs.map((id) => {
      const jt = jobTemplates[id];
      const disabled = state.hero?.jobId === 'novice' ? !canFirst : !canAdvance;
      const roleLabel = jt.role === 'front' ? '\u89d2\u82721' : jt.role === 'mid' ? '\u89d2\u82722' : '\u89d2\u82723';
      return `<article class="academy-card"><span class="academy-name">${esc(jt.name)}</span><p class="academy-meta">${roleLabel} \xb7 ${(jt.skills || []).map((e) => e.name).slice(0, 3).join(' / ')}</p><p class="academy-meta">${summaryFn(jt)}</p><button type="button" data-change-job="${id}" ${disabled ? 'disabled' : ''}>\u8f6c\u804c</button></article>`;
    }).join('') || `<article class="academy-card"><span class="academy-name">\u5b66\u9662\u8bb0\u5f55</span><p class="academy-meta">\u5f53\u524d\u5df2\u5b8c\u6210\u4e09\u8f6c\u804c\u4e1a\u6811\uff0c\u7ee7\u7eed\u8f6c\u751f\u7a81\u7834 BASE \u4e0a\u9650\u3002</p></article>`;
  }
  if (els.jobTree) {
    const path = (state.hero?.jobHistory || ['novice']).concat(nextJobId ? [nextJobId] : []);
    const jobTemplates = ctx.getJobTemplates?.() || {};
    els.jobTree.innerHTML = `<div class="job-tree-line">${path.map((id, i) => `<span class="job-tree-node ${i < path.length - 1 ? 'active' : 'next'}">${jobTemplates[id]?.name || id}</span>${i < path.length - 1 ? '<span class="job-tree-arrow">\u2192</span>' : ''}`).join('')}</div>`;
  }
}

export function renderCharacterStatSections(stats, ctx = charCtx) {
  const statLineFn = ctx.statLine || (() => '');
  const statGroupFn = ctx.renderStatGroup || ((title, rows) => rows.filter(Boolean).join('') ? `<section class="hero-stat-section"><strong>${esc(title)}</strong><div class="stat-grid">${rows.filter(Boolean).join('')}</div></section>` : '');
  return (ctx.renderStatGroup || ((t, r) => `<section class="hero-stat-section"><strong>${esc(t)}</strong><div class="stat-grid">${r.filter(Boolean).join('')}</div></section>`))('\u57fa\u7840\u5c5e\u6027', [
    statLineFn('\u529b\u91cf', stats.attrs?.str || 0, 'str'),
    statLineFn('\u654f\u6377', stats.attrs?.agi || 0, 'agi'),
    statLineFn('\u4f53\u8d28', stats.attrs?.vit || 0, 'vit'),
    statLineFn('\u667a\u529b', stats.attrs?.int || 0, 'int'),
    statLineFn('\u7075\u5de7', stats.attrs?.dex || 0, 'dex'),
    statLineFn('\u8fd0\u6c14', stats.attrs?.luk || 0, 'luk'),
    statLineFn('\u6218\u529b', stats.power || 0, 'power'),
  ]) +
  statGroupFn('\u6218\u6597\u5c5e\u6027', [
    statLineFn('\u8f93\u51fa', stats.dps || 0, 'dps'),
    statLineFn('\u751f\u547d\u503c', stats.maxHp || 0, 'maxHp'),
    statLineFn('\u9632\u5fa1', stats.defense || 0, 'def'),
    statLineFn('\u653b\u51fb\u901f\u5ea6', stats.aspd || 0, 'aspd'),
    statLineFn('\u751f\u547d\u6062\u590d', stats.hpRegen || 0, 'hpRegen'),
    statLineFn('\u95ea\u907f\u7387', stats.dodgeRate || 0, 'dodgeRate', { note: '\u6700\u9ad8 80%' }),
    statLineFn('\u66b4\u51fb\u7387', stats.crit || 0, 'crit', { note: '\u6700\u9ad8 100%' }),
    statLineFn('\u66b4\u51fb\u4f24\u5bb3', stats.critDamage || (1.85 + F(stats.critDamageBonus)), 'critDamage'),
    statLineFn('\u5438\u8840', stats.lifeSteal || 0, 'lifeSteal'),
    statLineFn('\u65e0\u89c6\u9632\u5fa1', stats.ignoreDefensePct || 0, 'ignoreDefense'),
    statLineFn('\u4f24\u5bb3\u51cf\u514d', stats.damageReductionPct || 0, 'damageReduction'),
    statLineFn('\u7269\u7406\u653b\u51fb\u529b', stats.physicalAttack || stats.atkPower || 0, 'physicalAttack'),
    statLineFn('\u9b54\u6cd5\u653b\u51fb\u529b', stats.magicAttack || stats.matkPower || 0, 'magicAttack'),
  ]) +
  statGroupFn('Boss / \u6df1\u6e0a\u5c5e\u6027', [
    statLineFn('Boss\u4f24\u5bb3', stats.bossDamageBonus || 0, 'bossDamageBonus'),
    statLineFn('Boss\u51cf\u4f24', stats.bossDamageReduction || 0, 'bossDamageReduction'),
    statLineFn('\u7cbe\u82f1/\u9996\u9886\u4f24\u5bb3', stats.eliteDamageBonus || 0, 'eliteDamageBonus'),
    statLineFn('\u6df1\u6e0a\u4f24\u5bb3', stats.abyssDamageBonus || 0, 'abyssDamageBonus'),
    statLineFn('\u6df1\u6e0a\u51cf\u4f24', stats.abyssDamageReduction || 0, 'abyssDamageReduction', { note: '\u6df1\u6e0a\u76f8\u5173\u6218\u6597\u751f\u6548' }),
    statLineFn('\u6df1\u6e0a\u6750\u6599\u6389\u7387', stats.abyssMaterialDropBonus || 0, 'abyssMaterialDropBonus'),
    statLineFn('\u795e\u8bdd\u54c1\u8d28\u6743\u91cd', stats.mythicWeightBonus || 0, 'mythicWeightBonus', { note: '\u6743\u91cd\uff0c\u4e0d\u662f\u76f4\u63a5\u6389\u7387' }),
  ]) +
  statGroupFn('\u6536\u76ca\u5c5e\u6027', [
    statLineFn('\u91d1\u5e01\u6536\u76ca', (stats.goldMultiplier || 1) - 1, 'goldBonus'),
    statLineFn('\u7269\u54c1\u6389\u843d\u7387', stats.dropBonus || 0, 'dropBonus', { note: '\u5305\u542b\u6750\u6599\u548c\u666e\u901a\u6389\u843d\u7387' }),
    statLineFn('\u5361\u7247\u6389\u843d\u7387', stats.cardDropBonus || 0, 'cardDropBonus'),
    statLineFn('\u88c5\u5907\u6389\u843d\u7387', stats.equipmentDropBonus || 0, 'equipmentDropBonus', { note: '\u4e0d\u5305\u542b Boss/\u6df1\u6e0a\u72ec\u7acb\u6389\u843d\u89e6\u53d1' }),
    statLineFn('BASE\u7ecf\u9a8c', (stats.baseExpMultiplier || 1) - 1, 'baseExpBonus'),
    statLineFn('JOB\u7ecf\u9a8c', (stats.jobExpMultiplier || 1) - 1, 'jobExpBonus'),
  ]);
}

export function renderCharacterStatBreakdown(stats, ctx = charCtx) {
  const state = ctx.getState?.() || {};
  const vipInfo = ctx.getVipProgressInfo?.(state.vip) || {};
  return `<section class="hero-stat-section"><strong>\u5f53\u524d\u7edf\u8ba1</strong>
    <div class="stat-grid">
      <span>VIP Lv.${vipInfo.level || 0}</span>
      <span>\u8f6c\u751f ${fmtn(state.hero?.rebirths || 0)}</span>
      <span>\u603b\u51fb\u6740 ${fmtn(state.totalKills || 0)}</span>
      <span>\u88c5\u5907\u6389\u843d\u7387 +${pct(stats.equipmentDropBonus || 0)}</span>
    </div>
  </section>`;
}

export function renderSkillPanel(ctx = charCtx) {
  return `<div class="skill-panel-content">
    ${ctx.renderSkillSummaryCard?.() || ''}
    ${ctx.renderJobSkills?.() || ''}
  </div>`;
}

export function renderTitlePanel(ctx = charCtx) {
  const state = ctx.getState?.() || {};
  const titles = ctx.normalizeTitles?.(state.titles) || {};
  const equipped = ctx.getTitleDb?.()?.[titles.equipped] || {};
  return `<section class="title-panel"><strong>\u79f0\u53f7</strong>
    <p class="codex-desc">\u5f53\u524d\uff1a${titles.equipped ? esc(equipped.name || titles.equipped) : '\u672a\u88c5\u5907'}</p>
    ${titles.equipped ? `<p class="codex-desc">${ctx.titleEffectText?.(equipped.effects || {}) || ''}</p>` : ''}
  </section>`;
}

export function renderSkillSummaryCard(ctx = charCtx) {
  const state = ctx.getState?.() || {};
  const stats = ctx.computeStats?.() || {};
  // V3 被动机制效果
  const passiveEffects = window.RuneFrontierCombatRuntime?.getPassiveMechanismEffects?.(state, stats) || {};
  const v3Entries = [];
  if (passiveEffects.damagePct) v3Entries.push(`伤害 +${pct(passiveEffects.damagePct)}`);
  if (passiveEffects.damageReductionPct) v3Entries.push(`减伤 +${pct(passiveEffects.damageReductionPct)}`);
  if (passiveEffects.ignoreDefRatio) v3Entries.push(`忽视防御 ${pct(passiveEffects.ignoreDefRatio)}`);
  if (passiveEffects.critDamageBonus) v3Entries.push(`暴击伤害 +${pct(passiveEffects.critDamageBonus)}`);
  if (passiveEffects.markedVulnerablePct) v3Entries.push(`标记增伤 +${pct(passiveEffects.markedVulnerablePct)}`);
  // 兜底：显示旧被动
  const passiveTotal = ctx.getPassiveSkillTotals?.() || {};
  const oldEntries = Object.entries(passiveTotal).filter(([k, v]) => v && k !== 'atkPct' && k !== 'matkPct')
    .map(([k, v]) => `<span>${ctx.statLabelName?.(k) || k} +${fmtn(v)}</span>`);
  const allEntries = [...v3Entries.map((e) => `<span>${e}</span>`), ...oldEntries];
  return `<section class="skill-summary"><strong>被动机制</strong>
    <div class="stat-grid">${allEntries.join('') || '<span>暂未解锁被动技能</span>'}</div>
  </section>`;
}

export function renderJobSkills(ctx = charCtx) {
  const state = ctx.getState?.() || {};
  const job = ctx.currentJob?.() || {};
  const skills = ctx.getUnlockedSkills?.() || [];
  const growthFn = ctx.getSkillGrowthEntry || (() => ({}));
  const milestoneFn = ctx.getSkillMilestoneBonuses || (() => ({}));
  const descFn = ctx.describeSkillMilestone || (() => '');

  // V3 技能数据优先
  const v3Skills = ctx.getV3CombatSkills?.(job.id) || window.v3JobSkills?.[job.id] || [];
  const cds = state.skillCooldowns || {};

  // 渲染 V3 技能（如果有）
  if (v3Skills.length) {
    return `<section class="job-skills-section skill-v3-section"><strong>技能机制</strong>
      <p class="codex-desc">技能伤害 = ATK/MATK × 总倍率 × 暴击期望修正 × 怪物减伤修正</p>
      <div class="stat-grid">${v3Skills.map((entry) => renderV3SkillEntry(entry, job, cds)).join('')}</div>
    </section>`;
  }

  // 兜底：旧技能渲染
  return `<section class="job-skills-section"><strong>\u4e3b\u52a8\u6280\u80fd</strong>
    <div class="stat-grid">${(job.skills || []).map((entry, i) => {
      const unlocked = skills.find((s) => s.name === entry.name);
      const growth = growthFn(entry);
      const lvl = growth?.level || 0;
      const spec = growth?.specialization || '';
      return `<div class="skill-entry"><strong>${esc(entry.name)} Lv.${lvl}</strong>
        ${unlocked ? `<p class="codex-desc">${ctx.skillTooltip?.(entry) || ''}</p>
        ${entry.active ? `<p class="codex-desc">${ctx.formatSkillMultiplier?.(entry.active.multiplier || 0) || ''}</p>` : ''}
        ${renderSkillMilestonePanel(entry, !!unlocked, ctx)}
        ${renderSkillSpecialization(entry, !!unlocked, growth, ctx)}
        <p class="codex-desc">${descFn(milestoneFn(entry))}</p>` : '<p class="codex-desc">\u672a\u89e3\u9501</p>'}
      </div>`;
    }).join('')}</div>
  </section>`;
}

function renderV3SkillEntry(entry, job, cooldowns) {
  const isPassive = entry.kind === '被动';
  const cooldown = Math.max(0, F(entry.cooldown));
  const remaining = Math.max(0, F(cooldowns?.[entry.id]));
  const progress = cooldown > 0 ? Math.max(0, Math.min(100, (1 - remaining / cooldown) * 100)) : 100;
  const typeText = isPassive ? '被动机制' : `主动 · ${formatV3Seconds(cooldown)}s`;
  const statusClass = isPassive ? 'skill-status-passive' : remaining > 0 ? 'skill-status-cd' : 'skill-status-ready';
  const statusText = isPassive ? '持续生效' : remaining > 0 ? `冷却中 ${formatV3Seconds(remaining)}s` : '⚡可释放';
  const mechanismText = v3MechanismText(entry.mechanism);
  const attackTypeText = isPassive ? '持续生效' : entry.mechanism?.stat === 'matk' ? '魔法攻击' : '物理攻击';
  const awakening = window.v3SkillAwakenings?.[job.id];
  const awakeningText = awakening?.skill === entry.name
    ? `<p class="skill-awakening-hint">觉醒：${esc(awakening.desc)} · 消耗 ${fmtn(awakening.cost)} 觉醒印记</p>`
    : '';

  return `<article class="skill-entry skill-v3-entry ${isPassive ? 'is-passive' : 'is-active'}">
    <div class="skill-title-row">
      <strong>${esc(entry.name)}</strong>
      <small class="skill-kind">${typeText}</small>
    </div>
    <p class="codex-desc">${esc(entry.description || '暂无技能说明')}</p>
    <div class="skill-effect-summary">
      <span>机制：${esc(mechanismText)} · ${attackTypeText}</span>
      <span class="skill-status ${statusClass}">${statusText}</span>
    </div>
    ${!isPassive && cooldown > 0 ? `<div class="skill-cd-bar" aria-label="冷却状态"><div style="width:${progress}%"></div></div>` : ''}
    ${awakeningText}
  </article>`;
}

function formatV3Seconds(value) {
  const rounded = Math.round(F(value) * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function v3MechanismText(mechanism = {}) {
  const labels = {
    multihit: '多段连击',
    selfDamage: '自伤爆发',
    deathDefy: '濒死守护',
    hpThreshold: '生命阈值增益',
    zone: '区域持续效果',
    finisher: '终结技',
    enhanceSkill: '技能强化',
    singleHit: '元素标记攻击',
    elementalResonance: '元素联动',
    cooldownReduce: '冷却联动',
    statusExploitAll: '状态爆发',
    markDuration: '标记强化',
    ignoreDefIfMarked: '标记破防',
    statusExploit: '状态追击',
    markedVulnerable: '标记易伤',
    heal: '治疗',
    lifestealDamage: '伤害转治疗',
    shield: '护盾防护',
    revive: '复活',
    goldCost: '金币爆发',
    goldBonus: '金币收益',
    selfBuff: '自我强化',
    stackTrigger: '叠层触发',
    delayedBurst: '延迟爆发',
    goldGenerate: '攻击产金币',
    stealth: '隐匿爆发',
    spreadMark: '状态扩散',
    markedCritBonus: '状态暴击强化',
  };
  return labels[mechanism?.type] || '特殊机制';
}

export function renderSkillMilestonePanel(entry, unlocked, ctx = charCtx) {
  if (!unlocked) return '';
  const milestones = (ctx.getSkillMilestoneEntries?.(entry) || [])
    .filter((ms) => Number.isFinite(Number(ms?.level)));
  if (!milestones.length) return '';
  return `<div class="skill-milestones">${milestones.map((ms) => `<span class="skill-milestone"><small>Lv.${fmtn(ms.level)}</small><strong>${esc(ms.label || '')}</strong></span>`).join('')}</div>`;
}

export function renderSkillSpecialization(entry, unlocked, growth, ctx = charCtx) {
  if (!unlocked) return '';
  const opts = ctx.getSkillSpecializationOptions?.(entry) || [];
  if (!opts.length) return '';
  return `<div class="skill-spec"><strong>\u4e13\u7cbe</strong>
    ${opts.map((opt) => `<button type="button" data-skill-id="${entry.id}" data-skill-spec="${opt.id}" class="${growth?.specialization === opt.id ? 'active' : ''}">${esc(opt.name || opt.id)}</button>`).join('')}
  </div>`;
}

export function installCharacterRenderRuntime(context = {}) {
  configureCharacterRenderContext(context);
  const existing = window.RuneFrontierRenderRuntime || {};
  window.RuneFrontierRenderRuntime = typeof existing === 'object' ? Object.assign(existing, {
    renderHeroes, renderTown, renderCharacterStatSections, renderCharacterStatBreakdown,
    renderPowerSourcePanel, renderSkillPanel, renderTitlePanel, renderSkillSummaryCard,
    renderJobSkills, renderSkillMilestonePanel, renderSkillSpecialization,
  }) : { renderHeroes, renderTown, renderCharacterStatSections, renderCharacterStatBreakdown, renderPowerSourcePanel, renderSkillPanel, renderTitlePanel, renderSkillSummaryCard, renderJobSkills, renderSkillMilestonePanel, renderSkillSpecialization };
  return window.RuneFrontierRenderRuntime;
}
