// Save migration and progression sanitization
// Phase 2 delegates to game.js functions via window

import { SAVE_VERSION } from './defaultState.js';

export function migrateSave(rawSave) {
  if (!rawSave || typeof rawSave !== 'object') return null;
  const save = { ...rawSave };

  // Version tracking
  if (typeof save.saveVersion !== 'number') save.saveVersion = 1;

  // grassBossSoul → grassEssence migration
  if (save.materials?.grassBossSoul > 0) {
    save.materials.grassEssence = (save.materials.grassEssence || 0) + save.materials.grassBossSoul;
    save.materials.grassBossSoul = 0;
  }

  // Ensure critical fields exist
  save.vip = save.vip || { level: 0, exp: 0, totalExp: 0, dailyGiftClaimed: '', bossFirstKills: {}, onlineSecondsToday: 0, onlineRewardClaimed: '' };
  save.monsterCodex = save.monsterCodex || {};
  save.cardCodex = save.cardCodex || {};
  save.materials = save.materials || {};
  save.equipmentPityKills = save.equipmentPityKills || 0;

  save.saveVersion = SAVE_VERSION;
  return save;
}

export function sanitizeProgression(state) {
  if (!state) return;
  // Delegates to game.js for full sanitization
  if (typeof window.sanitizeProgression === 'function') {
    window.sanitizeProgression.call(null, state);
    return;
  }
  // Minimal fallback
  if (state.vip) state.vip.exp = Math.max(0, Math.floor(state.vip.exp || 0));
  if (state.vip) state.vip.totalExp = Math.max(0, Math.floor(state.vip.totalExp || 0));
  if (state.hero) state.hero.baseLevel = Math.max(1, Math.floor(state.hero.baseLevel || 1));
}
