// 转生研究 & 锻造系�?// Rebirth Research & Forging System

let rebirthContext = {};

function getState() {
  return rebirthContext.getState?.() || (typeof window !== 'undefined' ? window.state : undefined) || {};
}

function getTree() {
  return rebirthContext.getRebirthResearchTree?.()
    || (typeof window !== 'undefined' ? window.REBIRTH_RESEARCH_TREE : undefined)
    || [];
}

function getAffixes() {
  return rebirthContext.getRebirthForgeAffixes?.()
    || (typeof window !== 'undefined' ? window.REBIRTH_FORGE_AFFIXES : undefined)
    || [];
}

function getSeals() {
  const state = getState();
  return Math.max(0, Number(state.rebirthSeals) || 0);
}

function getResearch() {
  const state = getState();
  if (!state.rebirthResearch || typeof state.rebirthResearch !== 'object') {
    state.rebirthResearch = {};
  }
  return state.rebirthResearch;
}

function getForging() {
  const state = getState();
  if (!state.rebirthForging || typeof state.rebirthForging !== 'object') {
    state.rebirthForging = {};
  }
  return state.rebirthForging;
}

export function configureRebirthContext(context = {}) {
  rebirthContext = context || {};
}

// ── 研究�?──

export function canUnlockNode(nodeId) {
  const research = getResearch();
  if (research[nodeId]?.unlocked) return false;
  const node = getTree().find((n) => n.id === nodeId);
  if (!node) return false;
  if (getSeals() < node.cost) return false;
  for (const req of node.requires || []) {
    if (!research[req]?.unlocked) return false;
  }
  return true;
}

export function unlockNode(nodeId) {
  const state = getState();
  if (!canUnlockNode(nodeId)) return false;
  const node = getTree().find((n) => n.id === nodeId);
  if (!node) return false;
  state.rebirthSeals = Math.max(0, getSeals() - node.cost);
  const research = getResearch();
  research[nodeId] = { unlocked: true, level: 1 };
  rebirthContext.addLog?.(`解锁转生研究�?{node.name}。`);
  return true;
}

export function isNodeUnlocked(nodeId) {
  const research = getResearch();
  return Boolean(research[nodeId]?.unlocked);
}

export function getResearchBonuses() {
  const research = getResearch();
  const bonuses = {};
  getTree().forEach((node) => {
    if (research[node.id]?.unlocked && node.effect) {
      Object.assign(bonuses, node.effect);
    }
  });
  return bonuses;
}

// ── 锻�?──

export function getAffixLevel(affixId) {
  const forging = getForging();
  return Math.max(0, Number(forging[affixId]) || 0);
}

export function getAffixMaxLevel(affixId) {
  const affix = getAffixes().find((a) => a.id === affixId);
  return affix?.maxLevel || 5;
}

export function getAffixUpgradeCost(affixId) {
  const affix = getAffixes().find((a) => a.id === affixId);
  if (!affix) return Infinity;
  const currentLevel = getAffixLevel(affixId);
  if (currentLevel >= getAffixMaxLevel(affixId)) return Infinity;
  return affix.baseCost * Math.pow(currentLevel + 1, 2);
}

export function canUpgradeAffix(affixId) {
  if (getAffixLevel(affixId) >= getAffixMaxLevel(affixId)) return false;
  return getSeals() >= getAffixUpgradeCost(affixId);
}

export function upgradeAffix(affixId) {
  if (!canUpgradeAffix(affixId)) return false;
  const state = getState();
  const cost = getAffixUpgradeCost(affixId);
  state.rebirthSeals = Math.max(0, getSeals() - cost);
  const forging = getForging();
  forging[affixId] = getAffixLevel(affixId) + 1;
  const affix = getAffixes().find((a) => a.id === affixId);
  rebirthContext.addLog?.(`轮回锻造：${affix?.name || affixId} 提升�?Lv.${forging[affixId]}。`);
  return true;
}

export function getForgingBonuses() {
  const forging = getForging();
  const bonuses = {};
  getAffixes().forEach((affix) => {
    const level = Math.max(0, Number(forging[affix.id]) || 0);
    if (level > 0 && affix.effectPerLevel) {
      Object.entries(affix.effectPerLevel).forEach(([key, perLevel]) => {
        bonuses[key] = (bonuses[key] || 0) + perLevel * level;
      });
    }
  });
  return bonuses;
}

// ── 综合 ──

export function getAllRebirthBonuses() {
  const research = getResearchBonuses();
  const forging = getForgingBonuses();
  return { ...research, ...forging };
}

export function getRebirthInventoryBonus() {
  const bonuses = getResearchBonuses();
  const state = getState();
  if (state.rebirthMode) {
    return Number(bonuses.inventoryBonus) || 0;
  }
  return 0;
}

export function getRebirthSealDropBonus() {
  const bonuses = getResearchBonuses();
  return Number(bonuses.sealDropBonus) || 0;
}

export function getRebirthDamageBonus() {
  const bonuses = getAllRebirthBonuses();
  return Number(bonuses.rebirthDamageBonus) || 0;
}

export function getRebirthAllStatsPct() {
  const bonuses = getForgingBonuses();
  return Number(bonuses.rebirthAllStatsPct) || 0;
}

export function isAutoPatrolUnlocked() {
  const bonuses = getResearchBonuses();
  return Boolean(bonuses.autoPatrol);
}

export function isAffixPoolUnlocked() {
  const bonuses = getResearchBonuses();
  return Boolean(bonuses.unlockAffixPool);
}

// 装备转生词缀

export function maybeAddRebirthAffix(item) {
  if (!item) return false;
  const state = getState();
  if (!state.rebirthMode) return false;
  if (!isAffixPoolUnlocked()) return false;
  const chance = (typeof window !== 'undefined' ? window.REBIRTH_EQUIP_AFFIX_CHANCE : undefined) ?? 0.12;
  return Math.random() < chance;
}

export function getAssignedRebirthAffix() {
  const pool = (typeof window !== 'undefined' ? window.REBIRTH_EQUIP_AFFIX_POOL : undefined) || [];
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── 技能觉�?──

export function getAwakenableSkill() {
  const state = getState();
  if (!isAffixPoolUnlocked()) return null;
  const job = rebirthContext.currentJob?.() || (typeof window !== 'undefined' ? window.currentJob?.() : undefined) || {};
  const awakenings = (typeof window !== 'undefined' ? window.v3SkillAwakenings : undefined) || {};
  const config = awakenings[job.id];
  if (!config) return null;
  if (state.rebirthAwakenings?.[job.id]) return null; // Already awakened
  return config;
}

export function canAwakenSkill() {
  const config = getAwakenableSkill();
  if (!config) return false;
  return getSeals() >= config.cost;
}

export function awakenSkill() {
  const config = getAwakenableSkill();
  if (!config || !canAwakenSkill()) return false;
  const state = getState();
  state.rebirthSeals = Math.max(0, getSeals() - config.cost);
  const job = rebirthContext.currentJob?.() || (typeof window !== 'undefined' ? window.currentJob?.() : undefined) || {};
  state.rebirthAwakenings = state.rebirthAwakenings || {};
  state.rebirthAwakenings[job.id] = true;
  rebirthContext.addLog?.(`⚡技能觉醒：${config.skill} �?${config.desc}`);
  return true;
}

export function isSkillAwakened(jobId) {
  const state = getState();
  return Boolean(state.rebirthAwakenings?.[jobId]);
}

// ── Runtime 注册 ──

export function installRebirthRuntime(context = {}) {
  configureRebirthContext(context);
  const runtime = Object.freeze({
    canUnlockNode,
    unlockNode,
    isNodeUnlocked,
    getResearchBonuses,
    getAffixLevel,
    getAffixMaxLevel,
    getAffixUpgradeCost,
    canUpgradeAffix,
    upgradeAffix,
    getForgingBonuses,
    getAllRebirthBonuses,
    getRebirthInventoryBonus,
    getRebirthSealDropBonus,
    getRebirthDamageBonus,
    getRebirthAllStatsPct,
    isAutoPatrolUnlocked,
    isAffixPoolUnlocked,
    maybeAddRebirthAffix,
    getAssignedRebirthAffix,
    getAwakenableSkill,
    canAwakenSkill,
    awakenSkill,
    isSkillAwakened,
  });
  if (typeof window !== 'undefined') {
    window.RuneFrontierRebirthRuntime = runtime;
  }
  return runtime;
}
