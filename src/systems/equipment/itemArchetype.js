export const EQUIPMENT_ARCHETYPES = Object.freeze({
  physical: Object.freeze({ id: 'physical', label: '\u7269\u7406' }),
  magic: Object.freeze({ id: 'magic', label: '\u9b54\u6cd5' }),
  general: Object.freeze({ id: 'general', label: '\u901a\u7528' }),
});

const PHYSICAL_JOBS = new Set([
  'swordman',
  'knight',
  'lordKnight',
  'runeKnight',
  'archer',
  'hunter',
  'sniper',
  'ranger',
  'thief',
  'assassin',
  'assassinCross',
  'guillotineCross',
  'merchant',
  'blacksmith',
  'whiteSmith',
  'mechanic',
]);

const MAGIC_JOBS = new Set([
  'mage',
  'wizard',
  'highWizard',
  'warlock',
  'acolyte',
  'priest',
  'highPriest',
  'archbishop',
]);

const PHYSICAL_SIGNAL_STATS = Object.freeze([
  'atk',
  'atkPct',
  'physicalAttack',
  'physicalDamageBonus',
  'str',
  'agi',
  'dex',
  'aspd',
  'attackSpeedPct',
  'crit',
  'critRatePct',
  'critDamageBonus',
  'ignoreDefense',
  'lifeSteal',
]);

const MAGIC_SIGNAL_STATS = Object.freeze([
  'matk',
  'matkPct',
  'magicAttack',
  'magicDamageBonus',
  'int',
  'skillDamageBonus',
  'echoChance',
]);

const STAT_POOLS = Object.freeze({
  physical: Object.freeze({
    primary: Object.freeze(['atkPct', 'atk', 'str', 'dex', 'critDamageBonus']),
    secondary: Object.freeze(['agi', 'attackSpeedPct', 'critRatePct', 'ignoreDefense']),
    utility: Object.freeze(['hpPct', 'defPct', 'lifeSteal', 'bossDamageBonus']),
  }),
  magic: Object.freeze({
    primary: Object.freeze(['matkPct', 'matk', 'int', 'skillDamageBonus']),
    secondary: Object.freeze(['dex', 'finalDamageBonus', 'echoChance', 'monsterDamageBonus']),
    utility: Object.freeze(['hpPct', 'defPct', 'hpRegenPct', 'abyssDamageBonus']),
  }),
  general: Object.freeze({
    primary: Object.freeze(['str', 'int', 'dex', 'vit', 'agi', 'luk']),
    secondary: Object.freeze(['hpPct', 'defPct', 'finalDamageBonus', 'bossDamageBonus']),
    utility: Object.freeze(['drop', 'gold', 'rareDropBonus', 'equipmentDrop', 'materialQuantityBonus']),
  }),
});

const PROTECTED_RARITIES = new Set(['epic', 'legend', 'legendary', 'darkgold', 'mythic']);

function knownArchetype(value) {
  const key = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return Object.hasOwn(EQUIPMENT_ARCHETYPES, key) ? key : '';
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statValue(source = {}, key) {
  if (!source || typeof source !== 'object') return 0;
  const direct = key === 'luk'
    ? number(source.luk) + number(source.luck)
    : number(source[key]);
  return direct +
    number(source.randomStats?.[key]) +
    number(source.baseStats?.[key]) +
    number(source.templateBaseStats?.[key]) +
    number(source.effects?.[key]);
}

function statSignal(source, keys) {
  return keys.reduce((sum, key) => sum + Math.max(0, statValue(source, key)), 0);
}

function resolveJobId(jobOrId) {
  if (!jobOrId) return '';
  if (typeof jobOrId === 'string') return jobOrId;
  if (typeof jobOrId === 'function') {
    try {
      return resolveJobId(jobOrId());
    } catch {
      return '';
    }
  }
  if (typeof jobOrId !== 'object') return '';
  if (jobOrId.currentJobId) return String(jobOrId.currentJobId);
  if (jobOrId.jobId) return String(jobOrId.jobId);
  const nestedJob = resolveJobId(jobOrId.job);
  if (nestedJob) return nestedJob;
  if (typeof jobOrId.currentJob === 'function') {
    try {
      const currentJob = resolveJobId(jobOrId.currentJob());
      if (currentJob) return currentJob;
    } catch {
      return '';
    }
  }
  if (jobOrId.id) return String(jobOrId.id);
  return '';
}

function contextLooksLikeJob(value) {
  if (!value || typeof value !== 'object') return false;
  if ('currentJobId' in value || 'jobId' in value || 'job' in value || 'currentJob' in value) return true;
  return Boolean(value.id && (PHYSICAL_JOBS.has(String(value.id)) || MAGIC_JOBS.has(String(value.id))));
}

function rollValue(context = {}) {
  const random = typeof context.rng === 'function'
    ? context.rng
    : typeof context.random === 'function'
      ? context.random
      : null;
  const raw = random ? random() : Math.random();
  return Math.min(0.999999, Math.max(0, number(raw)));
}

export function normalizeEquipmentArchetype(value) {
  return knownArchetype(value) || 'general';
}

export function getArchetypeLabel(value) {
  return EQUIPMENT_ARCHETYPES[normalizeEquipmentArchetype(value)].label;
}

export const getEquipmentArchetypeLabel = getArchetypeLabel;

export function getJobPreferredArchetype(jobOrId) {
  const jobId = resolveJobId(jobOrId);
  if (PHYSICAL_JOBS.has(jobId)) return 'physical';
  if (MAGIC_JOBS.has(jobId)) return 'magic';
  return 'general';
}

export const getJobArchetypeRoute = getJobPreferredArchetype;

export function inferEquipmentArchetype(item = {}, context = {}) {
  if (!item || typeof item !== 'object') return 'general';
  const explicit = knownArchetype(item.archetype);
  if (explicit) return explicit;
  if (Object.hasOwn(item, 'archetype')) return 'general';
  const templateArchetype =
    knownArchetype(item.templateArchetype) ||
    knownArchetype(item.template?.archetype) ||
    knownArchetype(item.template?.templateArchetype) ||
    knownArchetype(context.templateArchetype) ||
    knownArchetype(context.template?.archetype) ||
    knownArchetype(context.template?.templateArchetype);
  if (templateArchetype) return templateArchetype;

  const physicalSignal = statSignal(item, PHYSICAL_SIGNAL_STATS);
  const magicSignal = statSignal(item, MAGIC_SIGNAL_STATS);
  if (physicalSignal > 0 && magicSignal > 0) return 'general';
  if (physicalSignal > 0) return 'physical';
  if (magicSignal > 0) return 'magic';
  return 'general';
}

export function getArchetypeStatPools(archetype) {
  const pools = STAT_POOLS[normalizeEquipmentArchetype(archetype)] || STAT_POOLS.general;
  return {
    primary: [...pools.primary],
    secondary: [...pools.secondary],
    utility: [...pools.utility],
  };
}

export function rollEquipmentArchetype(template = {}, context = {}) {
  const explicit = knownArchetype(template?.archetype) || knownArchetype(template?.templateArchetype);
  if (explicit) return explicit;
  const inferred = inferEquipmentArchetype(template, context);
  if (inferred !== 'general') return inferred;

  const preferred = getJobPreferredArchetype(context);
  if (preferred === 'general') return 'general';

  const roll = rollValue(context);
  const slot = template?.equipSlot || template?.slot || '';
  const preferredChance = slot === 'weapon' ? 0.75 : 0.55;
  if (roll < preferredChance) return preferred;
  if (roll < preferredChance + 0.2) return 'general';
  return preferred === 'physical' ? 'magic' : 'physical';
}

export function calculateArchetypeScores(item = {}, effectiveStatsOrContext = {}, maybeJob = null) {
  const context = maybeJob || (contextLooksLikeJob(effectiveStatsOrContext) ? effectiveStatsOrContext : {});
  const stats = maybeJob || !contextLooksLikeJob(effectiveStatsOrContext)
    ? effectiveStatsOrContext || item || {}
    : item || {};
  const source = { ...(item || {}), ...(stats || {}) };
  const archetype = inferEquipmentArchetype(source, context);

  const physicalRaw =
    statValue(source, 'atk') * 2 +
    statValue(source, 'atkPct') * 10000 +
    statValue(source, 'str') * 45 +
    statValue(source, 'dex') * 22 +
    statValue(source, 'agi') * 18 +
    statValue(source, 'aspd') * 800 +
    statValue(source, 'attackSpeedPct') * 4200 +
    statValue(source, 'crit') * 3600 +
    statValue(source, 'critRatePct') * 3600 +
    statValue(source, 'critDamageBonus') * 4200 +
    statValue(source, 'ignoreDefense') * 5200 +
    statValue(source, 'lifeSteal') * 2600;

  const magicRaw =
    statValue(source, 'matk') * 2 +
    statValue(source, 'matkPct') * 10000 +
    statValue(source, 'int') * 48 +
    statValue(source, 'dex') * 20 +
    statValue(source, 'skillDamageBonus') * 6200 +
    statValue(source, 'echoChance') * 4200 +
    statValue(source, 'finalDamageBonus') * 3000 +
    statValue(source, 'monsterDamageBonus') * 2200;

  const utilityRaw =
    statValue(source, 'hp') * 0.25 +
    statValue(source, 'def') * 2 +
    statValue(source, 'vit') * 28 +
    statValue(source, 'hpPct') * 6000 +
    statValue(source, 'defPct') * 3600 +
    statValue(source, 'damageReductionPct') * 8500 +
    statValue(source, 'drop') * 2600 +
    statValue(source, 'gold') * 1600 +
    statValue(source, 'rareDropBonus') * 5000 +
    statValue(source, 'equipmentDrop') * 4600 +
    statValue(source, 'materialQuantityBonus') * 3200;

  const archetypeBonus = 900;
  const physicalScore = Math.max(0, Math.round(physicalRaw + utilityRaw * 0.2 + (archetype === 'physical' ? archetypeBonus : 0)));
  const magicScore = Math.max(0, Math.round(magicRaw + utilityRaw * 0.2 + (archetype === 'magic' ? archetypeBonus : 0)));
  const generalScore = Math.max(0, Math.round(utilityRaw + (physicalRaw + magicRaw) * 0.35 + (archetype === 'general' ? archetypeBonus * 0.6 : 0)));
  const preferred = getJobPreferredArchetype(context);
  const currentJobScore = preferred === 'physical'
    ? physicalScore
    : preferred === 'magic'
      ? magicScore
      : generalScore;
  const archetypeFit = preferred === 'general'
    ? (archetype === 'general' ? 1 : 0.7)
    : archetype === preferred
      ? 1
      : archetype === 'general'
        ? 0.75
        : 0.35;

  return {
    physicalScore,
    magicScore,
    generalScore,
    currentJobScore,
    archetypeFit,
  };
}

export function getEquipmentFitTags(item = {}, context = {}) {
  const archetype = inferEquipmentArchetype(item, context);
  const preferred = getJobPreferredArchetype(context);
  const tags = [getArchetypeLabel(archetype)];
  if (preferred !== 'general' && (archetype === preferred || archetype === 'general')) {
    tags.push('\u9002\u5408\u5f53\u524d\u804c\u4e1a');
    if (archetype === 'general') tags.push('\u901a\u7528\u5b9a\u4f4d');
  } else if (preferred !== 'general' && archetype !== 'general') {
    tags.push('\u53ef\u7559\u7ed9\u5176\u4ed6\u804c\u4e1a');
  } else {
    tags.push('\u901a\u7528\u5b9a\u4f4d');
  }
  return [...new Set(tags)];
}

export function shouldProtectEquipmentByArchetype(item = {}, context = {}) {
  if (!item || typeof item !== 'object') return false;
  if (item.locked) return true;
  if (item.setId || item.setName || item.originalSetId || item.abyssSetVariant) return true;
  const rarity = String(item.rarity || item.tier || '').toLowerCase();
  if (PROTECTED_RARITIES.has(rarity)) return true;
  const scores = calculateArchetypeScores(item, context);
  return scores.archetypeFit >= 0.9 && scores.currentJobScore >= 500;
}

export function getReforgeCost(itemOrArchetype, targetArchetype = null, options = {}) {
  const item = itemOrArchetype && typeof itemOrArchetype === 'object' ? itemOrArchetype : null;
  const target = item ? targetArchetype : itemOrArchetype;
  const archetype = normalizeEquipmentArchetype(target);
  const directed = archetype !== 'general';
  const rarity = String(item?.rarity || item?.tier || '').toLowerCase();
  const rarityMultiplier = rarity === 'mythic' ? 2 : rarity === 'darkgold' ? 1.6 : rarity === 'legend' ? 1.35 : rarity === 'epic' ? 1.15 : 1;
  const levelMultiplier = 1 + Math.max(0, number(item?.requiredLevel || item?.level || options.level || 1) - 1) * 0.01;
  const multiplier = rarityMultiplier * levelMultiplier;
  return {
    ticket: Math.ceil((directed ? 2 : 1) * multiplier),
    gold: Math.round((directed ? 1200 : 700) * multiplier),
    materials: directed
      ? { ore: Math.ceil(8 * multiplier), crystal: Math.ceil(2 * multiplier) }
      : { ore: Math.ceil(5 * multiplier) },
  };
}
