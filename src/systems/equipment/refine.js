let refineCtx = {};

function finite(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }

export function configureRefineContext(ctx = {}) { refineCtx = ctx || {}; }

export function getEnhanceCost(item, ctx = refineCtx) {
  if (!item) return { materials: {}, gold: 0 };
  const next = finite(item.enhanceLevel) + 1;
  const slotFn = ctx.equipmentSlot || ((i) => i?.slot || 'weapon');
  const slot = slotFn(item);
  const mats = {};
  if (next <= 4) {
    if (slot === 'weapon') mats.oridecon = 1 + Math.floor(next / 2);
    else mats.elunium = 1 + Math.floor(next / 2);
    if (slot === 'trinket') { mats.elunium = finite(mats.elunium) + 1; if (next >= 3) mats.oridecon = 1; }
  } else if (next <= 7) {
    if (slot === 'weapon') mats.oridecon = 2 + Math.floor(next / 3);
    else mats.elunium = 2 + Math.floor(next / 3);
    mats.ore = 3 + next;
    if (slot === 'trinket') mats.elunium = finite(mats.elunium) + 1;
  } else if (next <= 10) {
    if (slot === 'weapon') mats.oridecon = 3 + Math.floor(next / 3);
    else mats.elunium = 3 + Math.floor(next / 3);
    mats.ancientCore = Math.floor((next - 5) / 2);
    if (slot === 'trinket') { mats.elunium = finite(mats.elunium) + 2; mats.oridecon = 1; }
  } else {
    if (slot === 'weapon') mats.oridecon = 3 + Math.floor(next / 3);
    else mats.elunium = 3 + Math.floor(next / 3);
    mats.starShard = next >= 13 ? 2 : 1;
    mats.mythicEssence = next >= 14 ? 1 : 0;
    if (slot === 'trinket') { mats.elunium = finite(mats.elunium) + 2; mats.oridecon = 2; }
  }
  const gold = Math.round((next <= 4 ? 3000 : next <= 7 ? 15000 : next <= 10 ? 80000 : 300000) * Math.pow(next <= 7 ? 1.25 : 1.18, next - 1));
  return { materials: mats, gold };
}

export function getEnhanceChance(item, ctx = refineCtx) {
  const next = finite(item?.enhanceLevel) + 1;
  const maxLvl = ctx.getEnhanceMaxLevel?.() || 20;
  if (next < 1 || next > maxLvl) return 0;
  const chances = ctx.getEnhanceChances?.() || [];
  return chances[next - 1] || 0;
}

export function getEnhanceMilestoneBonuses(item, ctx = refineCtx) {
  const lvl = finite(item?.enhanceLevel);
  const slotFn = ctx.equipmentSlot || ((i) => i?.slot || 'trinket');
  const slot = slotFn(item);
  const milestones = ctx.getEnhanceMilestoneLevels?.() || [];
  const bonusTable = ctx.getEnhanceMilestoneBonuses?.() || {};
  const tier = bonusTable[slot] || [];
  const bonuses = {};
  milestones.forEach((ms, i) => {
    if (lvl >= ms && tier[i]) Object.entries(tier[i]).forEach(([k, v]) => { bonuses[k] = finite(bonuses[k]) + finite(v); });
  });
  return bonuses;
}

export function getEnhanceEffect(item, level, ctx = refineCtx) {
  if (!item || !level) return '';
  const slotFn = ctx.equipmentSlot || ((i) => i?.slot || 'trinket');
  const slot = slotFn(item);
  const pct = Math.round(level * (slot === 'weapon' ? 3 : slot === 'armor' ? 2.5 : 2) * 10) / 10;
  const labels = [];
  if (slot === 'weapon') labels.push(`攻击 +${pct}%`, `魔攻 +${pct}%`);
  else if (slot === 'armor') labels.push(`防御 +${pct}%`, `生命 +${(pct * 0.6).toFixed(1)}%`);
  else if (slot === 'headgear') labels.push(`生命 +${pct}%`);
  else if (slot === 'shoes') labels.push(`攻速 +${(pct * 0.3).toFixed(1)}%`);
  else labels.push(`全属性 +${(pct * 0.35).toFixed(1)}%`);
  const ms = getEnhanceMilestoneBonuses(item, ctx);
  if (Object.keys(ms).length) {
    Object.entries(ms).forEach(([k, v]) => {
      if (v) {
        const isPct = ctx.statIsPercent?.(k) || (typeof v === 'number' && v < 1);
        labels.push(`${ctx.statLabelName?.(k) || k} +${isPct ? (v * 100).toFixed(1) + '%' : ctx.formatNumber?.(v) || v}`);
      }
    });
  }
  return labels.join(' · ');
}

export function enhanceItem(itemId, ctx = refineCtx) {
  const state = ctx.getState?.();
  if (!state) return;
  const item = (state.inventory || []).find((i) => i.id === itemId);
  if (!item) return;
  const current = finite(item.enhanceLevel);
  const maxLvl = ctx.getEnhanceMaxLevel?.() || 20;
  if (current >= maxLvl) { ctx.showToast?.('已达精炼上限'); return; }
  const nextLevel = current + 1;
  const cost = getEnhanceCost(item, ctx);
  if (state.gold < finite(cost.gold) || !ctx.hasMaterials?.(cost.materials || {})) { ctx.showToast?.('材料不足'); return; }
  state.gold -= finite(cost.gold);
  ctx.consumeMaterials?.(cost.materials || {});
  const chance = getEnhanceChance(item, ctx);
  const displayName = ctx.getDisplayItemName?.(item) || item.name || '装备';
  if (Math.random() < chance) {
    item.enhanceLevel = nextLevel;
    const passiveChance = ctx.getEnhancePassiveChances?.()?.[nextLevel - 1] || 0;
    if (Math.random() < passiveChance && (!item.specialPassives || !item.specialPassives.length)) {
      const pool = ctx.getEnhancePassivePool?.() || [];
      const passiveId = pool[Math.floor(Math.random() * pool.length)];
      item.specialPassives = [passiveId];
      const db = ctx.getEnhancePassiveDb?.() || {};
      const pName = db[passiveId]?.name || passiveId;
      ctx.addLog?.(`${displayName} 精炼至 +${item.enhanceLevel}，获得高精炼特效：${pName}。`);
      ctx.showToast?.(`精炼成功！获得 ${pName}`);
    } else {
      ctx.addLog?.(`${displayName} 精炼至 +${item.enhanceLevel}。`);
      ctx.showToast?.(`精炼成功 +${item.enhanceLevel}`);
    }
  } else {
    const downgradeFn = ctx.getEnhanceDowngrade || ((nl) => nl <= 4 ? 0 : nl <= 7 ? 0 : nl <= 10 ? 1 : Math.random() < 0.5 ? 1 : 2);
    const downgrade = downgradeFn(nextLevel);
    if (downgrade > 0 && nextLevel >= 8 && finite(state.materials?.enhanceProtect) > 0) {
      state.materials.enhanceProtect -= 1;
      ctx.addLog?.(`${displayName} 精炼失败，精炼保护卷已消耗，等级保持不变。`);
      ctx.showToast?.('精炼失败，保护卷已消耗');
    } else if (downgrade > 0) {
      item.enhanceLevel = Math.max(0, current - downgrade);
      ctx.addLog?.(`${displayName} 精炼失败，降级至 +${item.enhanceLevel}。`);
      ctx.showToast?.(`精炼失败，降级至 +${item.enhanceLevel}`);
    } else {
      ctx.addLog?.(`${displayName} 精炼失败，材料已消耗。`);
      ctx.showToast?.('精炼失败，材料已消耗');
    }
  }
  ctx.renderAll?.();
  ctx.save?.();
}
