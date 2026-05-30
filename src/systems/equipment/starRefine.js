let starCtx = {};

function finite(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureStarRefineContext(ctx = {}) { starCtx = ctx || {}; }

export function refineMultiplier(star) {
  return 1 + Math.max(0, Number(star) || 0) * 0.02;
}

export function refineGrowthFactorForStat(stat, star = 0) {
  const level = Math.max(0, Number(star) || 0);
  if (!level) return 1;
  const flatStats = new Set(['atk', 'matk', 'def', 'hp', 'hpRegen', 'str', 'agi', 'vit', 'int', 'dex', 'luk', 'luck']);
  if (flatStats.has(stat)) return refineMultiplier(level);
  const highValueStats = new Set(['finalDamageBonus', 'bossDamageBonus', 'eliteDamageBonus', 'abyssDamageBonus', 'abyssDamageReduction', 'rareDropBonus', 'drop', 'gold', 'goldBonus', 'expBonus', 'equipmentDrop', 'cardDrop', 'materialQuantityBonus', 'highTierFind', 'echoChance']);
  if (highValueStats.has(stat)) return 1 + level * 0.006;
  return 1 + level * 0.01;
}

export function star15Bonus(item, ctx = starCtx) {
  if (finite(item?.refine) < 15 || !['rare', 'epic', 'ancient', 'legend', 'darkGold', 'mythic'].includes(item?.rarity)) return {};
  const slotFn = ctx.equipmentSlot || ((i) => i?.slot || 'trinket');
  const slot = slotFn(item);
  if (slot === 'weapon') return item.matk > item.atk ? { atk: 8, matk: 22, skillDamageBonus: 0.03 } : { atk: 22, matk: 8, skillDamageBonus: 0.03 };
  if (slot === 'armor') return { hp: 20, damageReductionPct: 0.02 };
  if (slot === 'headgear') return { crit: 0.01, allStats: 2 };
  if (slot === 'shoes') return { dodgeRate: 0.01, attackSpeedPct: 0.01 };
  return { critDamageBonus: 0.04, drop: 0.01, gold: 0.01 };
}

export function getRefineMilestoneBonuses(item, ctx = starCtx) {
  const star = finite(item?.refine);
  const slotFn = ctx.equipmentSlot || ((i) => i?.slot || 'trinket');
  const slot = slotFn(item);
  const tiers = {
    weapon: [{ str: 2 }, { skillDamageBonus: 0.01 }, { str: 2 }, { bossDamageBonus: 0.02 }, { finalDamageBonus: 0.02 }],
    armor: [{ vit: 2 }, { hp: 20 }, { damageReductionPct: 0.01 }, { hp: 30 }, { damageReductionPct: 0.02 }],
    headgear: [{ int: 2 }, { crit: 0.005 }, { expBonus: 0.01 }, { allStats: 1 }, { skillDamageBonus: 0.01 }],
    shoes: [{ agi: 2 }, { dodgeRate: 0.01 }, { attackSpeedPct: 0.01 }, { hpRegenPct: 0.02 }, { combatPaceBonus: 0.01 }],
    trinket: [{ luk: 2 }, { drop: 0.005 }, { gold: 0.01 }, { cardDrop: 0.005 }, { drop: 0.01 }],
  };
  const tier = tiers[slot] || tiers.trinket;
  const bonuses = {};
  if (star >= 3) Object.entries(tier[0] || {}).forEach(([k, v]) => { bonuses[k] = finite(bonuses[k]) + finite(v); });
  if (star >= 6) Object.entries(tier[1] || {}).forEach(([k, v]) => { bonuses[k] = finite(bonuses[k]) + finite(v); });
  if (star >= 9) Object.entries(tier[2] || {}).forEach(([k, v]) => { bonuses[k] = finite(bonuses[k]) + finite(v); });
  if (star >= 12) Object.entries(tier[3] || {}).forEach(([k, v]) => { bonuses[k] = finite(bonuses[k]) + finite(v); });
  if (star >= 15) Object.entries(tier[4] || {}).forEach(([k, v]) => { bonuses[k] = finite(bonuses[k]) + finite(v); });
  return bonuses;
}

export function getRefineChance(nextStar, item = null, ctx = starCtx) {
  const chances = [1, 0.9, 0.82, 0.74, 0.66, 0.58, 0.5, 0.42, 0.35, 0.29, 0.23, 0.18, 0.14, 0.1, 0.07];
  return Math.min(0.85, (chances[nextStar - 1] || 0.05) + (item ? finite(item.refineFailCount) * 0.015 : 0));
}

export function getRefineCost(item, ctx = starCtx) {
  const next = finite(item?.refine) + 1;
  if (next <= 3) return { dust: 2 + next };
  if (next <= 6) return { ore: 2 + next, dust: 2 };
  if (next <= 9) return { crystal: next, ore: 3 };
  if (next <= 12) return { rune: next - 5, crystal: 4 };
  return { ancientCore: next - 10, rune: 6, starShard: next >= 14 ? 1 : 0 };
}

export function snapshotRefineStats(item, ctx = starCtx) {
  const getStats = ctx.getEffectiveItemStats;
  if (!getStats || !item) return {};
  const stats = getStats(item);
  return Object.fromEntries(Object.entries(stats).filter(([key, value]) => key !== 'luck' && Number.isFinite(Number(value)) && Number(value) !== 0).map(([key, value]) => [key, Number(value || 0)]));
}

export function diffRefineStats(before = {}, after = {}) {
  const diff = {};
  Object.keys(after).forEach((key) => {
    const isPct = starCtx.statIsPercent?.(key);
    const delta = Number(((after[key] || 0) - (before[key] || 0)).toFixed(isPct ? 3 : 0));
    if (delta) diff[key] = delta;
  });
  return diff;
}

export function refineItem(id, ctx = starCtx) {
  const state = ctx.getState?.();
  if (!state) return;
  const item = (state.inventory || []).find((e) => e.id === id);
  if (!item) return;
  const current = finite(item.refine);
  if (current >= 15) { ctx.showToast?.('已达到 15 星'); return; }
  const cost = getRefineCost(item, ctx);
  if (!ctx.hasMaterials?.(cost)) { ctx.showToast?.(`材料不足：${ctx.materialText?.(cost) || ''}`); return; }
  const star = finite(item.refineFailCount) * 0.015;
  const beforeStats = snapshotRefineStats(item, ctx);
  ctx.consumeMaterials?.(cost);
  const chance = getRefineChance(current + 1, item, ctx);
  const displayName = ctx.getDisplayItemName?.(item) || item.name || '装备';
  if (Math.random() < chance) {
    item.refine = current + 1;
    item.refineFailCount = 0;
    const session = ctx.getRuntimeSessionStats?.() || {};
    session.refineSuccessCount = finite(session.refineSuccessCount) + 1;
    ctx.updateDailyGoalProgress?.('daily_refine', 1);
    const afterStats = snapshotRefineStats(item, ctx);
    const deltaStats = diffRefineStats(beforeStats, afterStats);
    ctx.addLog?.(`${displayName} 星炼成功，达到 ${item.refine} 星，保底已重置。`);
    ctx.showRefineResult?.({ itemId: item.id, success: true, itemName: displayName, beforeLevel: current, afterLevel: item.refine, chance, pityBonus: star, cost, afterStats: ctx.renderRefineStatDelta?.(deltaStats) || '属性已提升', unlockedStar15Bonus: item.refine >= 15 && Object.keys(star15Bonus(item, ctx)).length > 0 });
    if (item.refine >= 10) ctx.updateAchievementProgress?.('refine10_1', 1, { absolute: true });
  } else {
    item.refineFailCount = finite(item.refineFailCount) + 1;
    const session = ctx.getRuntimeSessionStats?.() || {};
    session.refineFailCount = finite(session.refineFailCount) + 1;
    ctx.updateDailyGoalProgress?.('daily_refine', 1);
    ctx.addLog?.(`${displayName} 星炼失败，星级保持 ${current} 星，保底成功率提升 +1.5%。`);
    ctx.showRefineResult?.({ itemId: item.id, success: false, itemName: displayName, beforeLevel: current, afterLevel: current, chance, pityBonus: star, nextPityBonus: finite(item.refineFailCount) * 0.015, cost, unlockedStar15Bonus: false });
  }
  ctx.renderAll?.();
  ctx.save?.();
}

export function getRefineGrowthStats(item, ctx = starCtx) {
  const refin = finite(item?.refine);
  if (!item || refin <= 0) return {};
  const getStats = ctx.getEffectiveItemStats;
  if (!getStats) return {};
  const before = getStats({ ...item, refine: 0, refineFailCount: 0 });
  const after = getStats(item);
  return diffRefineStats(before, after);
}
