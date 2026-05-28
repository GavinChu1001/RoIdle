let failureReasonContext = {};

export function configureFailureReasonContext(context = {}) {
  failureReasonContext = context || {};
}

export function getDifficultyFailureHint(monster = {}) {
  const state = failureReasonContext.getState?.() || {};
  if (state.currentDifficulty === 'abyss') return '深渊难度压力过高：建议提升深渊减伤、生命、防御、吸血和深渊伤害。';
  if (state.currentDifficulty === 'hard') return '困难难度压力过高：建议提升星炼等级、生命、防御、吸血和 Boss 伤害。';
  const stats = failureReasonContext.computeStats?.() || {};
  if ((monster?.attack || 0) > (stats.maxHp || 1) * 0.12) return '生存评分不足：建议提升生命、防御和伤害减免。';
  return '';
}

export function getPlayerWeakness(stats) {
  if (typeof window.getPlayerWeakness === 'function') return window.getPlayerWeakness(stats);
  return {};
}

export function weaknessPreset(type) {
  if (typeof window.weaknessPreset === 'function') return window.weaknessPreset(type);
  return {};
}
