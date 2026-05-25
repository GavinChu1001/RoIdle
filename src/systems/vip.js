// VIP / Adventure Honor system — Phase 3 wrapper
// Delegates to game.js functions via window.
// Future Phase 4+: move actual function bodies here.

import { clampNumber } from '../utils/math.js';
import { escapeHtml, formatNumber, percent } from '../utils/format.js';

const VIP_MAX_LEVEL = 20;

export function getVipBonuses(level = 0) {
  if (typeof window.getVipBonuses === 'function') return window.getVipBonuses(level);
  const capped = clampNumber(Math.floor(level || 0), 0, VIP_MAX_LEVEL);
  return { gold: capped * 0.06, itemDrop: capped * 0.025, equipmentDrop: capped * 0.02 };
}

export function gainVipExp(amount) {
  if (typeof window.gainVipExp === 'function') return window.gainVipExp(amount);
  // Fallback: minimal implementation
  if (!amount) return;
  if (window.state) {
    window.state.vip.exp = (window.state.vip.exp || 0) + Math.floor(amount);
    window.state.vip.totalExp = (window.state.vip.totalExp || 0) + Math.floor(amount);
  }
}

export function getVipProgressInfo(vipInput) {
  if (typeof window.getVipProgressInfo === 'function') return window.getVipProgressInfo(vipInput);
  return { level: 0, totalExp: 0, currentLevelExp: 0, requiredForNext: 0, remaining: 0, progressPct: 0, isMax: false };
}

export function getVipMilestoneBonuses(level = 0) {
  if (typeof window.getVipMilestoneBonuses === 'function') return window.getVipMilestoneBonuses(level);
  return {};
}

export function getUnlockedVipMilestones(level = 0) {
  if (typeof window.getUnlockedVipMilestones === 'function') return window.getUnlockedVipMilestones(level);
  return [];
}

export function getNextVipMilestone(level = 0) {
  if (typeof window.getNextVipMilestone === 'function') return window.getNextVipMilestone(level);
  return null;
}

export function claimVipDailyGift() {
  if (typeof window.claimVipDailyGift === 'function') return window.claimVipDailyGift();
}

export function getInventoryLimit() {
  if (typeof window.getInventoryLimit === 'function') return window.getInventoryLimit();
  return 48;
}

// Attach to window for legacy compatibility
window.VIP = { getVipBonuses, gainVipExp, getVipProgressInfo, getVipMilestoneBonuses, getUnlockedVipMilestones, getNextVipMilestone, claimVipDailyGift, getInventoryLimit };
