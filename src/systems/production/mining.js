import { MINING_NODES } from './catalog.js';
import { normalizeProductionState } from './state.js';

const MAX_PRODUCTION_LEVEL = 100;

function nowMs(context = {}) {
  const value = typeof context.now === 'function' ? context.now() : Date.now();
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : Date.now();
}

function nonNegativeInt(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
}

function rollInt(min, max, context = {}) {
  const low = Math.floor(Number(min) || 0);
  const high = Math.floor(Number(max) || low);
  if (typeof context.randomInt === 'function') {
    return nonNegativeInt(context.randomInt(low, high));
  }
  if (high <= low) return nonNegativeInt(low);
  return low + Math.floor(Math.random() * (high - low + 1));
}

function expForLevel(level) {
  return 80 + Math.max(1, Math.floor(Number(level) || 1)) * 40;
}

function addMiningExperience(production, amount) {
  const mining = production.mining;
  let gained = nonNegativeInt(amount);
  if (gained <= 0 || mining.level >= MAX_PRODUCTION_LEVEL) return 0;
  mining.exp += gained;
  while (mining.level < MAX_PRODUCTION_LEVEL && mining.exp >= expForLevel(mining.level)) {
    mining.exp -= expForLevel(mining.level);
    mining.level += 1;
  }
  if (mining.level >= MAX_PRODUCTION_LEVEL) {
    mining.level = MAX_PRODUCTION_LEVEL;
    mining.exp = 0;
  }
  return gained;
}

export function claimMiningProduction(state = {}, context = {}) {
  const target = state && typeof state === 'object' ? state : {};
  target.production = normalizeProductionState(target.production);
  if (!target.materials || typeof target.materials !== 'object' || Array.isArray(target.materials)) {
    target.materials = {};
  }

  const production = target.production;
  const mining = production.mining;
  const current = nowMs(context);
  const lastClaimedAt = nonNegativeInt(mining.lastClaimedAt);
  if (lastClaimedAt <= 0 && current > 0) {
    mining.lastClaimedAt = current;
    return { ok: false, reason: 'initialized', rewards: {}, exp: 0 };
  }
  const elapsedSec = Math.max(0, Math.floor((current - lastClaimedAt) / 1000));
  if (elapsedSec <= 0) {
    mining.lastClaimedAt = current;
    return { ok: false, reason: 'no_elapsed_time', rewards: {}, exp: 0 };
  }

  const rewards = {};
  let exp = 0;
  for (const [nodeId, node] of Object.entries(MINING_NODES)) {
    const nodeState = mining.nodes[nodeId] || {};
    if (!nodeState.unlocked && mining.level < node.unlockLevel) continue;
    const intervalSec = Math.max(1, nonNegativeInt(node.intervalSec));
    const cycles = Math.floor(elapsedSec / intervalSec);
    if (cycles <= 0) continue;
    for (const [materialId, range] of Object.entries(node.yields || {})) {
      const [min, max] = Array.isArray(range) ? range : [range, range];
      const amount = rollInt(min, max, context) * cycles;
      if (amount <= 0) continue;
      rewards[materialId] = (rewards[materialId] || 0) + amount;
    }
    exp += cycles;
    nodeState.exp = nonNegativeInt(nodeState.exp) + cycles;
    mining.nodes[nodeId] = nodeState;
  }

  mining.lastClaimedAt = current;
  if (Object.keys(rewards).length === 0) {
    return { ok: false, reason: 'no_rewards', rewards: {}, exp: 0 };
  }

  for (const [materialId, amount] of Object.entries(rewards)) {
    target.materials[materialId] = nonNegativeInt(target.materials[materialId]) + amount;
  }
  const gainedExp = addMiningExperience(production, exp);
  return { ok: true, rewards, exp: gainedExp };
}
