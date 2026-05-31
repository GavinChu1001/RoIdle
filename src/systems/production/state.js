const PRODUCTION_STATE_VERSION = 1;
const CRAFTING_MAX_LEVEL = 100;
const DEFAULT_MINING_NODE_IDS = ['grass', 'forest', 'abyss'];

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function clampInt(value, min, max) {
  return Math.max(min, Math.min(max, Math.floor(finite(value))));
}

function nonNegativeInt(value) {
  return Math.max(0, Math.floor(finite(value)));
}

function normalizeNode(id, input = {}) {
  return {
    unlocked: id === 'grass' ? true : Boolean(input.unlocked),
    exp: nonNegativeInt(input.exp),
    lastClaimedAt: nonNegativeInt(input.lastClaimedAt),
  };
}

export function craftingExpForLevel(level) {
  const safeLevel = clampInt(level, 1, CRAFTING_MAX_LEVEL);
  if (safeLevel >= CRAFTING_MAX_LEVEL) return Infinity;
  return 80 + safeLevel * 40;
}

export function defaultProductionState() {
  return {
    version: PRODUCTION_STATE_VERSION,
    mining: {
      level: 1,
      exp: 0,
      lastClaimedAt: 0,
      nodes: Object.fromEntries(DEFAULT_MINING_NODE_IDS.map((id) => [id, normalizeNode(id)])),
    },
    artisan: {
      level: 1,
      exp: 0,
      jobsCompleted: 0,
      activeJob: null,
    },
    crafting: {
      level: 1,
      exp: 0,
      totalCrafts: 0,
      masterCrafts: 0,
    },
    blueprints: {
      known: [],
      fragments: {},
    },
  };
}

function normalizeFragments(input = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return {};
  return Object.fromEntries(Object.entries(input)
    .filter(([id]) => typeof id === 'string' && id.trim())
    .map(([id, amount]) => [id, nonNegativeInt(amount)])
    .filter(([, amount]) => amount > 0));
}

function normalizeKnownBlueprints(input = []) {
  if (!Array.isArray(input)) return [];
  return [...new Set(input.filter((id) => typeof id === 'string' && id.trim()).map((id) => id.trim()))];
}

export function normalizeProductionState(input = {}) {
  const base = defaultProductionState();
  if (!input || typeof input !== 'object') return base;

  const mining = input.mining && typeof input.mining === 'object' ? input.mining : {};
  const miningNodes = mining.nodes && typeof mining.nodes === 'object' ? mining.nodes : {};
  base.mining.level = clampInt(mining.level ?? base.mining.level, 1, CRAFTING_MAX_LEVEL);
  base.mining.exp = nonNegativeInt(mining.exp);
  base.mining.lastClaimedAt = nonNegativeInt(mining.lastClaimedAt);
  base.mining.nodes = Object.fromEntries(DEFAULT_MINING_NODE_IDS.map((id) => [id, normalizeNode(id, miningNodes[id])]));

  const artisan = input.artisan && typeof input.artisan === 'object' ? input.artisan : {};
  base.artisan.level = clampInt(artisan.level ?? base.artisan.level, 1, CRAFTING_MAX_LEVEL);
  base.artisan.exp = nonNegativeInt(artisan.exp);
  base.artisan.jobsCompleted = nonNegativeInt(artisan.jobsCompleted);
  base.artisan.activeJob = artisan.activeJob && typeof artisan.activeJob === 'object' ? { ...artisan.activeJob } : null;

  const crafting = input.crafting && typeof input.crafting === 'object' ? input.crafting : {};
  base.crafting.level = clampInt(crafting.level ?? base.crafting.level, 1, CRAFTING_MAX_LEVEL);
  base.crafting.exp = nonNegativeInt(crafting.exp);
  base.crafting.totalCrafts = nonNegativeInt(crafting.totalCrafts);
  base.crafting.masterCrafts = nonNegativeInt(crafting.masterCrafts);

  const blueprints = input.blueprints && typeof input.blueprints === 'object' ? input.blueprints : {};
  base.blueprints.known = normalizeKnownBlueprints(blueprints.known);
  base.blueprints.fragments = normalizeFragments(blueprints.fragments);
  return base;
}

export function addCraftingExperience(productionState, amount) {
  const normalized = normalizeProductionState(productionState);
  const gained = nonNegativeInt(amount);
  if (gained <= 0) return normalized;

  normalized.crafting.exp += gained;
  normalized.crafting.totalCrafts += 1;
  while (normalized.crafting.level < CRAFTING_MAX_LEVEL) {
    const required = craftingExpForLevel(normalized.crafting.level);
    if (normalized.crafting.exp < required) break;
    normalized.crafting.exp -= required;
    normalized.crafting.level += 1;
  }
  if (normalized.crafting.level >= CRAFTING_MAX_LEVEL) {
    normalized.crafting.level = CRAFTING_MAX_LEVEL;
    normalized.crafting.exp = Math.max(0, normalized.crafting.exp);
  }

  if (productionState && typeof productionState === 'object') {
    Object.assign(productionState, normalized);
    return productionState;
  }
  return normalized;
}
