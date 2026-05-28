let vipContext = {};

function finite(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, finite(value)));
}

export function configureVipContext(context = {}) {
  vipContext = context || {};
}

export function normalizeVip(vip, ctx = vipContext) {
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  const v = vip || {};
  return {
    level: clamp(Math.floor(v.level || 0), 0, maxLevel),
    exp: Math.max(0, Math.floor(v.exp || 0)),
    totalExp: Math.max(0, Math.floor(v.totalExp || v.exp || 0)),
    dailyGiftClaimed: typeof v.dailyGiftClaimed === 'string' ? v.dailyGiftClaimed : '',
    bossFirstKills: v.bossFirstKills && typeof v.bossFirstKills === 'object' ? v.bossFirstKills : {},
    onlineSecondsToday: Math.max(0, Number(v.onlineSecondsToday || 0)),
    onlineRewardClaimed: typeof v.onlineRewardClaimed === 'string' ? v.onlineRewardClaimed : '',
  };
}

export function getVipBonuses(level, ctx = vipContext) {
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  const perLevel = ctx.getVipBonusPerLevel?.() || { gold: 0.06, itemDrop: 0.025, equipmentDrop: 0.02 };
  const capped = clamp(Math.floor(level ?? 0), 0, maxLevel);
  return {
    gold: capped * finite(perLevel.gold),
    itemDrop: capped * finite(perLevel.itemDrop),
    equipmentDrop: capped * finite(perLevel.equipmentDrop),
  };
}

export function getVipProgressInfo(vipInput, ctx = vipContext) {
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  const expTable = ctx.getVipExpRequirements?.() || [];
  const vip = normalizeVip(vipInput, ctx);
  const level = clamp(Math.floor(vip.level || 0), 0, maxLevel);
  const totalExp = Math.max(0, Math.floor(vip.totalExp || vip.exp || 0));
  if (level >= maxLevel) {
    return { level, totalExp, currentLevelExp: 0, requiredForNext: 0, remaining: 0, progressPct: 1, isMax: true };
  }
  const currentLevelReq = Math.max(0, Number(expTable[level] || 0));
  const nextLevelReq = Math.max(currentLevelReq, Number(expTable[level + 1] || expTable[maxLevel] || currentLevelReq));
  const currentLevelExp = Math.max(0, totalExp - currentLevelReq);
  const requiredForNext = Math.max(1, nextLevelReq - currentLevelReq);
  return {
    level,
    totalExp,
    currentLevelExp: Math.min(currentLevelExp, requiredForNext),
    requiredForNext,
    remaining: Math.max(0, nextLevelReq - totalExp),
    progressPct: clamp(currentLevelExp / requiredForNext, 0, 1),
    isMax: false,
  };
}

export function getVipMilestoneBonuses(level, ctx = vipContext) {
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  const milestones = ctx.getVipMilestones?.() || {};
  const capped = clamp(Math.floor(level ?? 0), 0, maxLevel);
  const bonuses = {};
  Object.entries(milestones).forEach(([ml, bonus]) => {
    if (capped >= Number(ml)) {
      Object.entries(bonus).forEach(([k, v]) => { if (k !== 'label') bonuses[k] = (bonuses[k] || 0) + finite(v); });
    }
  });
  return bonuses;
}

export function getUnlockedVipMilestones(level, ctx = vipContext) {
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  const milestones = ctx.getVipMilestones?.() || {};
  const capped = clamp(Math.floor(level ?? 0), 0, maxLevel);
  return Object.entries(milestones)
    .filter(([ml]) => capped >= Number(ml))
    .map(([ml, b]) => ({ level: Number(ml), ...b }));
}

export function getNextVipMilestone(level, ctx = vipContext) {
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  const milestones = ctx.getVipMilestones?.() || {};
  const capped = clamp(Math.floor(level ?? 0), 0, maxLevel);
  const next = Object.entries(milestones).find(([ml]) => capped < Number(ml));
  return next ? { level: Number(next[0]), ...next[1] } : null;
}

export function getInventoryLimit(ctx = vipContext) {
  const state = ctx.getState?.() || {};
  const milestones = getVipMilestoneBonuses(state.vip?.level || 0, ctx);
  return (ctx.getBaseInventoryLimit?.() ?? 48) + finite(milestones.inventoryLimitBonus);
}

export function gainVipExp(amount, ctx = vipContext) {
  const state = ctx.getState?.();
  if (!state) return;
  const gain = Math.max(0, Math.floor(amount || 0));
  if (!gain) return;
  const maxLevel = ctx.getVipMaxLevel?.() ?? 20;
  state.vip = normalizeVip(state.vip, ctx);
  state.vip.exp += gain;
  state.vip.totalExp += gain;
  while (state.vip.level < maxLevel) {
    const nextLevel = state.vip.level + 1;
    const expTable = ctx.getVipExpRequirements?.() || [];
    const need = expTable[nextLevel] || Infinity;
    if (state.vip.totalExp < need) break;
    state.vip.level = nextLevel;
    ctx.addLog?.(`冒险者荣誉等级提升至 Lv.${state.vip.level}`);
    const milestones = ctx.getVipMilestones?.() || {};
    if (milestones[nextLevel]) {
      ctx.showToast?.(`新特权解锁：${milestones[nextLevel].label}`);
      ctx.addLog?.(`新特权解锁：${milestones[nextLevel].label}`);
    }
  }
}

export function claimVipDailyGift(ctx = vipContext) {
  const state = ctx.getState?.();
  if (!state) return;
  state.vip = normalizeVip(state.vip, ctx);
  const todayKey = ctx.todayKey?.() || new Date().toISOString().slice(0, 10);
  if (state.vip.dailyGiftClaimed === todayKey) {
    ctx.showToast?.('今日礼包已领取');
    return;
  }
  const dailyGifts = ctx.getVipDailyGifts?.() || {};
  let giftLevel = 0;
  [1, 5, 10, 15, 20].reverse().forEach((lv) => { if (state.vip.level >= lv && giftLevel === 0) giftLevel = lv; });
  const gift = dailyGifts[giftLevel] || dailyGifts[0];
  if (gift?.materials && ctx.addMaterials) ctx.addMaterials(gift.materials);
  state.vip.dailyGiftClaimed = todayKey;
  ctx.addLog?.(`领取冒险者每日礼包（Lv.${giftLevel}）。`);
  ctx.showToast?.('每日礼包已领取');
  ctx.renderAll?.();
  ctx.save?.();
}

export function installVipRuntime(context = {}) {
  configureVipContext(context);
  const runtime = Object.freeze({
    normalizeVip,
    getVipBonuses,
    getVipProgressInfo,
    getVipMilestoneBonuses,
    getUnlockedVipMilestones,
    getNextVipMilestone,
    getInventoryLimit,
    gainVipExp,
    claimVipDailyGift,
  });
  window.RuneFrontierVipRuntime = runtime;
  return runtime;
}
