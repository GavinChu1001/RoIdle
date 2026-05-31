let codexContext = {};

function finite(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

export function configureCodexContext(context = {}) {
  codexContext = context || {};
}

export function buildMonsterNameMap(ctx = codexContext) {
  const config = ctx.getMapMonsterConfig?.() || {};
  const map = {};
  Object.values(config).forEach((cfg) => {
    (cfg.monsters || []).forEach((m) => { if (m?.id) map[m.id] = m.name || m.id; });
    if (cfg.bossTemplate?.id) map[cfg.bossTemplate.id] = cfg.bossTemplate.name || cfg.bossTemplate.id;
  });
  return map;
}

export function buildMonsterSourceMap(ctx = codexContext) {
  const config = ctx.getMapMonsterConfig?.() || {};
  const map = {};
  Object.entries(config).forEach(([, cfg]) => {
    const mapName = cfg.name || '';
    (cfg.monsters || []).forEach((m) => {
      if (m?.id) { if (!map[m.id]) map[m.id] = []; if (mapName && !map[m.id].includes(mapName)) map[m.id].push(mapName); }
    });
    if (cfg.bossTemplate?.id && cfg.name) { if (!map[cfg.bossTemplate.id]) map[cfg.bossTemplate.id] = []; if (!map[cfg.bossTemplate.id].includes(cfg.name)) map[cfg.bossTemplate.id].push(cfg.name); }
  });
  return map;
}

export function buildMonsterCardDropMap(ctx = codexContext) {
  const pool = ctx.getCardPool?.() || [];
  const map = {};
  pool.forEach((c) => { if (c.monsterId) { if (!map[c.monsterId]) map[c.monsterId] = []; map[c.monsterId].push(c.name || c.id); } });
  return map;
}

export function getMonsterTypeLabel(id, ctx = codexContext) {
  const config = ctx.getMapMonsterConfig?.() || {};
  let type = null;
  Object.values(config).forEach((cfg) => {
    if (cfg.bossTemplate?.id === id) type = cfg.name && cfg.name.includes('\u6df1\u6e0a') ? '\u6df1\u6e0aBoss' : 'Boss';
    (cfg.monsters || []).forEach((m) => {
      if (m?.id === id && !type) type = m.type === 'elite' ? '\u7cbe\u82f1' : cfg.name && cfg.name.includes('\u6df1\u6e0a') ? '\u6df1\u6e0a\u602a' : '\u666e\u901a';
    });
  });
  return type || '\u666e\u901a';
}

export function getMonsterTypeForCodex(monsterId, ctx = codexContext) {
  const label = getMonsterTypeLabel(monsterId, ctx);
  if (label === 'Boss') return 'boss';
  if (label === '\u6df1\u6e0aBoss') return 'abyssBoss';
  if (label === '\u6df1\u6e0a\u602a') return 'abyss';
  if (label === '\u7cbe\u82f1') return 'elite';
  return 'normal';
}

export function getCardTypeForCodex(cardId, ctx = codexContext) {
  const pool = ctx.getCardPool?.() || [];
  const card = pool.find((c) => c.id === cardId);
  if (!card) return 'normal';
  const type = ctx.getCardType?.(card);
  if (type === 'boss') return 'boss';
  if (type === 'abyss') return 'abyss';
  return 'normal';
}

export function getMonsterMasteryLevel(killCount, ctx = codexContext) {
  const thresholds = ctx.getCodexMasteryThresholds?.() || [];
  const kc = Number(killCount) || 0;
  for (let i = thresholds.length - 1; i > 0; i -= 1) if (kc >= thresholds[i]) return i;
  return 0;
}

export function getCardResearchLevel(obtainCount, ctx = codexContext) {
  const thresholds = ctx.getCodexResearchThresholds?.() || [];
  const oc = Number(obtainCount) || 0;
  for (let i = thresholds.length - 1; i > 0; i -= 1) if (oc >= thresholds[i]) return i;
  return 0;
}

export function getCodexBonusStats(ctx = codexContext) {
  const state = ctx.getState?.() || {};
  const caps = ctx.getCodexStatCaps?.() || {};
  const killRewards = ctx.getCodexKillRewards?.() || {};
  const milestones = ctx.getCodexKillMilestones?.() || [];
  const stats = { goldBonus: 0, expBonus: 0, dropBonus: 0, materialDropBonus: 0, hpBonus: 0, defBonus: 0, critRateBonus: 0, bossDamage: 0, bossDamageReduction: 0, bossEquipDropBonus: 0, bossQualityWeight: 0, abyssDamage: 0, abyssDamageReduction: 0, abyssMaterialDropBonus: 0, mythicQualityWeight: 0, cardDamage: 0, eliteDamageBonus: 0 };
  Object.entries(state.monsterCodex || {}).forEach(([monsterId, data]) => {
    const mType = getMonsterTypeForCodex(monsterId, ctx);
    const rewardList = killRewards[mType] || killRewards.normal || {};
    const claimed = data.rewardsClaimed || {};
    milestones.forEach((ms, i) => {
      if (claimed[ms]) {
        const r = rewardList[i] || {};
        if (r.stats) Object.entries(r.stats).forEach(([k, v]) => { stats[k] = finite(stats[k]) + finite(v); });
      }
    });
  });
  Object.keys(caps).forEach((k) => { if (stats[k] !== undefined) stats[k] = Math.min(stats[k], caps[k]); });
  return stats;
}

export function getTotalCodexLevel(ctx = codexContext) {
  const state = ctx.getState?.() || {};
  let sum = 0;
  Object.values(state.monsterCodex || {}).forEach((d) => { sum += getMonsterMasteryLevel(d.killCount || 0, ctx); });
  Object.values(state.cardCodex || {}).forEach((d) => { sum += getCardResearchLevel(d.obtainCount || 0, ctx); });
  return Math.floor(sum / 10);
}

export function getCodexBonuses(ctx = codexContext) {
  const state = ctx.getState?.() || {};
  const caps = ctx.getCodexCaps?.() || {};
  const masteryBonuses = ctx.getCodexMasteryBonuses?.() || {};
  const researchBonuses = ctx.getCodexResearchBonuses?.() || {};
  const bonuses = {
    goldBonus: 0, expBonus: 0, dropBonus: 0, materialDropBonus: 0, hpBonus: 0, defBonus: 0,
    critRateBonus: 0, bossDamage: 0, bossDamageReduction: 0, bossEquipDropBonus: 0, bossQualityWeight: 0,
    abyssDamage: 0, abyssDamageReduction: 0, abyssMaterialDropBonus: 0, mythicQualityWeight: 0,
    allStats: 0, hpPct: 0, cardDamage: 0,
    str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0,
  };
  Object.entries(state.monsterCodex || {}).forEach(([monsterId, data]) => {
    const level = getMonsterMasteryLevel(data.killCount || 0, ctx);
    if (level <= 0) return;
    const type = getMonsterTypeForCodex(monsterId, ctx);
    const tierBonuses = masteryBonuses[type] || masteryBonuses.normal || {};
    for (let i = 0; i < level; i += 1) {
      const b = tierBonuses[i] || {};
      Object.entries(b).forEach(([key, val]) => { bonuses[key] = finite(bonuses[key]) + finite(val); });
    }
  });
  Object.entries(state.cardCodex || {}).forEach(([cardId, data]) => {
    const level = getCardResearchLevel(data.obtainCount || 0, ctx);
    if (level <= 0) return;
    const type = getCardTypeForCodex(cardId, ctx);
    const tierBonuses = researchBonuses[type] || researchBonuses.normal || {};
    for (let i = 0; i < level; i += 1) {
      const b = tierBonuses[i] || {};
      Object.entries(b).forEach(([key, val]) => { bonuses[key] = finite(bonuses[key]) + finite(val); });
    }
  });
  const totalLevel = getTotalCodexLevel(ctx);
  bonuses.allStats = finite(bonuses.allStats) + totalLevel * 0.001;
  bonuses.dropBonus = finite(bonuses.dropBonus) + Math.floor(totalLevel / 5) * 0.002;
  bonuses.bossQualityWeight = finite(bonuses.bossQualityWeight) + Math.floor(totalLevel / 10) * 0.001;
  bonuses.mythicQualityWeight = finite(bonuses.mythicQualityWeight) + Math.floor(totalLevel / 20) * 0.0005;
  bonuses.dropBonus = Math.min(bonuses.dropBonus, caps.globalDrop || 0);
  bonuses.cardDamage = Math.min(bonuses.cardDamage, caps.cardDamage || 0);
  bonuses.bossQualityWeight = Math.min(bonuses.bossQualityWeight, caps.bossQualityWeight || 0);
  bonuses.mythicQualityWeight = Math.min(bonuses.mythicQualityWeight, caps.mythicQualityWeight || 0);
  bonuses.allStats = Math.min(bonuses.allStats, caps.allStats || 0);
  bonuses.abyssDamage = Math.min(bonuses.abyssDamage, caps.abyssDamage || 0);
  bonuses.abyssDamageReduction = Math.min(bonuses.abyssDamageReduction, caps.abyssReduction || 0);
  bonuses.bossDamage = Math.min(bonuses.bossDamage, caps.bossDamage || 0);
  bonuses.hpBonus = Math.min(bonuses.hpBonus, caps.hpDef || 0);
  bonuses.defBonus = Math.min(bonuses.defBonus, caps.hpDef || 0);
  return bonuses;
}

export function claimCodexReward(type, monsterId, milestone, ctx = codexContext) {
  const state = ctx.getState?.();
  if (!state) return;
  const num = Number(milestone);
  if (type === 'monster') {
    if (!state.monsterCodex) state.monsterCodex = {};
    const data = state.monsterCodex[monsterId] || { killCount: 0, rewardsClaimed: {} };
    const claimed = data.rewardsClaimed || {};
    if (claimed[num]) { ctx.showToast?.('\u5df2\u9886\u53d6'); return; }
    const mType = getMonsterTypeForCodex(monsterId, ctx);
    const killRewards = ctx.getCodexKillRewards?.() || {};
    const rewardList = killRewards[mType] || killRewards.normal || {};
    const milestonesArr = ctx.getCodexKillMilestones?.() || [];
    const idx = milestonesArr.indexOf(num);
    if (idx < 0 || (data.killCount || 0) < num) { ctx.showToast?.('\u672a\u8fbe\u6210'); return; }
    const reward = rewardList[idx] || {};
    if (reward.items && ctx.grantGenericReward) ctx.grantGenericReward(reward.items);
    claimed[num] = true;
    data.rewardsClaimed = claimed;
    state.monsterCodex[monsterId] = data;
    ctx.addLog?.(`\u56fe\u9274\u5956\u52b1\u9886\u53d6\uff1a${ctx.getMonsterName?.(monsterId) || monsterId} \u51fb\u6740${num}\u3002`);
    ctx.showToast?.(`\u9886\u53d6\u6210\u529f\uff1a\u51fb\u6740${num}\u5956\u52b1`);
  }
  if (type === 'card') {
    const cardRewards = ctx.getCodexCardRewards?.() || {};
    const cardMilestones = ctx.getCodexCardMilestones?.() || [];
    const idx = cardMilestones.indexOf(num);
    if (idx < 0) return;
    if (state.codexRewardsClaimed?.card?.[num]) { ctx.showToast?.('\u5df2\u9886\u53d6'); return; }
    const reward = cardRewards[idx] || {};
    if (ctx.grantGenericReward) ctx.grantGenericReward(reward);
    if (!state.codexRewardsClaimed) state.codexRewardsClaimed = {};
    if (!state.codexRewardsClaimed.card) state.codexRewardsClaimed.card = {};
    state.codexRewardsClaimed.card[num] = true;
    ctx.addLog?.(`\u5361\u7247\u56fe\u9274\u5956\u52b1\u9886\u53d6\uff1a\u6536\u96c6 ${num} \u5f20\u4e0d\u540c\u5361\u7247\u3002`);
    ctx.showToast?.(`\u9886\u53d6\u6210\u529f\uff1a\u6536\u96c6 ${num} \u5f20\u5361\u7247\u91cc\u7a0b\u7891\u5956\u52b1`);
  }
  ctx.renderAll?.();
  ctx.save?.();
}

export function installCodexRuntime(context = {}) {
  configureCodexContext(context);
  const runtime = Object.freeze({
    buildMonsterNameMap,
    buildMonsterSourceMap,
    buildMonsterCardDropMap,
    getMonsterTypeLabel,
    getMonsterTypeForCodex,
    getCardTypeForCodex,
    getMonsterMasteryLevel,
    getCardResearchLevel,
    getCodexBonusStats,
    getCodexBonuses,
    getTotalCodexLevel,
    claimCodexReward,
  });
  window.RuneFrontierCodexRuntime = runtime;
  return runtime;
}
