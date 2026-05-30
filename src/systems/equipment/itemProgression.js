const MAP_ORDER = ['grass', 'forest', 'sewer', 'desert', 'orc_village', 'mine', 'clock', 'glast_heim', 'abyss_lake', 'sky'];

export const PROGRESSION_EQUIPMENT_SLOTS = Object.freeze([
  { id: 'weapon', label: '\u6b66\u5668', physicalName: '\u6218\u5203', magicName: '\u6cd5\u6756', generalName: '\u4eea\u5668', weight: 1.25 },
  { id: 'armor', label: '\u9632\u5177', physicalName: '\u6218\u7532', magicName: '\u6cd5\u8863', generalName: '\u62a4\u7532', weight: 1 },
  { id: 'headgear', label: '\u5934\u9970', physicalName: '\u5934\u76d4', magicName: '\u5934\u51a0', generalName: '\u9762\u5177', weight: 0.9 },
  { id: 'shoes', label: '\u978b\u5b50', physicalName: '\u6218\u9774', magicName: '\u6cd5\u9774', generalName: '\u8f7b\u9774', weight: 0.95 },
  { id: 'trinket', label: '\u9970\u54c1', physicalName: '\u7eb9\u7ae0', magicName: '\u9b54\u5bfc\u6838', generalName: '\u62a4\u7b26', weight: 1 },
]);

const PROGRESSION_EQUIPMENT_ARCHETYPES = Object.freeze([
  { id: 'physical', label: '\u7269\u7406' },
  { id: 'magic', label: '\u9b54\u6cd5' },
  { id: 'general', label: '\u517c\u4fee' },
]);

const PROGRESSION_MAP_LEVEL_RANGES = Object.freeze({
  grass: [1, 10],
  forest: [8, 20],
  sewer: [18, 32],
  desert: [28, 45],
  orc_village: [40, 58],
  mine: [52, 70],
  clock: [68, 88],
  glast_heim: [84, 105],
  abyss_lake: [100, 125],
  sky: [120, 150],
});

export const EQUIPMENT_GROWTH_TIERS = Object.freeze({
  T1: { id: 'T1', label: 'T1 旧世过渡', level: 1 },
  T2: { id: 'T2', label: 'T2 古代英雄', level: 100 },
  T3: { id: 'T3', label: 'T3 OS / 幻象', level: 130 },
  T4: { id: 'T4', label: 'T4 改良 OS', level: 170 },
  T5: { id: 'T5', label: 'T5 信念', level: 180 },
  T6: { id: 'T6', label: 'T6 冰川', level: 210 },
  T7: { id: 'T7', label: 'T7 悔恨', level: 230 },
  T8: { id: 'T8', label: 'T8 善恶 / 星云', level: 240 },
  T9: { id: 'T9', label: 'T9 莫卡迪斯', level: 250 },
  T10: { id: 'T10', label: 'T10 次元', level: 250 },
});

export const EQUIPMENT_LINE_MATERIALS = Object.freeze({
  ancientHero: {
    basic: { id: 'ancientHeroShard', name: '古代英雄碎片', rarity: 'rare' },
    advanced: { id: 'heroReformInscription', name: '英雄改良铭文', rarity: 'epic' },
    core: { id: 'mythicHeroCore', name: '神话英雄核心', rarity: 'legend' },
  },
  os: {
    basic: { id: 'osGear', name: 'OS齿轮', rarity: 'rare' },
    advanced: { id: 'illusionModule', name: '幻象模块', rarity: 'epic' },
    core: { id: 'osAdCore', name: 'OS-AD核心', rarity: 'legend' },
  },
  fides: {
    basic: { id: 'fidesFragment', name: '信念残片', rarity: 'rare' },
    advanced: { id: 'purificationSeal', name: '净化印记', rarity: 'epic' },
    core: { id: 'vivatusCore', name: '活力信念核心', rarity: 'legend' },
  },
  glacier: {
    basic: { id: 'snowflowerStone', name: '雪花魔石', rarity: 'rare' },
    advanced: { id: 'glacierCrystal', name: '冰川结晶', rarity: 'epic' },
    core: { id: 'dimGlacierCore', name: '黯淡冰川核心', rarity: 'legend' },
  },
  poenitentia: {
    basic: { id: 'penitentiaChapter', name: '悔恨篇章', rarity: 'rare' },
    advanced: { id: 'awakeningStigma', name: '觉醒圣痕', rarity: 'epic' },
    core: { id: 'penitentiaCore', name: '悔恨核心', rarity: 'legend' },
  },
  goodEvil: {
    basic: { id: 'justiceEvilMark', name: '善恶刻印', rarity: 'rare' },
    advanced: { id: 'demonTempleEcho', name: '魔神殿回响', rarity: 'epic' },
    core: { id: 'goodEvilCore', name: '善恶核心', rarity: 'legend' },
  },
  nebula: {
    basic: { id: 'nebulaDust', name: '星云尘', rarity: 'rare' },
    advanced: { id: 'geoborgGear', name: '葛帔尼亚齿轮', rarity: 'epic' },
    core: { id: 'geoborgCore', name: '葛帔尼亚核心', rarity: 'legend' },
  },
  muqaddas: {
    basic: { id: 'muqaddasFragment', name: '莫卡迪斯碎片', rarity: 'rare' },
    advanced: { id: 'sanctuaryPlate', name: '圣域装甲片', rarity: 'epic' },
    core: { id: 'muqaddasCore', name: '莫卡迪斯核心', rarity: 'legend' },
  },
  dimensional: {
    basic: { id: 'dimensionalShard', name: '次元碎片', rarity: 'rare' },
    advanced: { id: 'timeRune', name: '时间符文', rarity: 'epic' },
    core: { id: 'dimensionalCrownCore', name: '次元冠冕核心', rarity: 'mythic' },
  },
});

export const EQUIPMENT_SERIES = Object.freeze({
  oldWorld: {
    id: 'oldWorld',
    label: '旧世过渡',
    defaultTier: 'T1',
    stages: [{ id: 'field', label: '旧世过渡', growthTier: 'T1', rarity: 'normal', statMultiplier: 1 }],
  },
  ancientHero: {
    id: 'ancientHero',
    label: '古代英雄',
    defaultTier: 'T2',
    stages: [
      { id: 'base', label: '古代英雄', growthTier: 'T2', rarity: 'rare', statMultiplier: 1 },
      { id: 'reform', label: '神话/觉醒英雄', growthTier: 'T2', rarity: 'epic', materialKind: 'advanced', materialAmount: 4, gold: 8000, levelBonus: 12, statMultiplier: 1.14 },
      { id: 'lt', label: '英雄-LT', growthTier: 'T3', rarity: 'legend', materialKind: 'core', materialAmount: 2, gold: 42000, levelBonus: 20, statMultiplier: 1.18 },
    ],
  },
  os: {
    id: 'os',
    label: 'OS / 幻象',
    defaultTier: 'T3',
    stages: [
      { id: 'os', label: 'OS', growthTier: 'T3', rarity: 'rare', statMultiplier: 1 },
      { id: 'illusion', label: '幻象改良', growthTier: 'T3', rarity: 'epic', materialKind: 'advanced', materialAmount: 5, gold: 18000, levelBonus: 14, statMultiplier: 1.13 },
      { id: 'osAd', label: 'OS-AD', growthTier: 'T4', rarity: 'legend', materialKind: 'core', materialAmount: 2, gold: 56000, levelBonus: 22, statMultiplier: 1.2 },
    ],
  },
  fides: {
    id: 'fides',
    label: '信念',
    defaultTier: 'T5',
    stages: [
      { id: 'adulter', label: '虚伪信念', growthTier: 'T5', rarity: 'epic', statMultiplier: 1 },
      { id: 'purified', label: '净化信念', growthTier: 'T5', rarity: 'legend', materialKind: 'advanced', materialAmount: 6, gold: 72000, levelBonus: 18, statMultiplier: 1.15 },
      { id: 'vivatus', label: '活力信念', growthTier: 'T6', rarity: 'legend', materialKind: 'core', materialAmount: 3, gold: 120000, levelBonus: 26, statMultiplier: 1.2 },
    ],
  },
  glacier: {
    id: 'glacier',
    label: '冰川',
    defaultTier: 'T6',
    stages: [
      { id: 'snowflower', label: '雪花', growthTier: 'T6', rarity: 'epic', statMultiplier: 1 },
      { id: 'glacier', label: '冰川', growthTier: 'T6', rarity: 'legend', materialKind: 'advanced', materialAmount: 6, gold: 90000, levelBonus: 18, statMultiplier: 1.16 },
      { id: 'dimGlacier', label: '黯淡冰川', growthTier: 'T7', rarity: 'legend', materialKind: 'core', materialAmount: 3, gold: 150000, levelBonus: 28, statMultiplier: 1.22 },
    ],
  },
  poenitentia: {
    id: 'poenitentia',
    label: '悔恨',
    defaultTier: 'T7',
    stages: [
      { id: 'chapter', label: '悔恨篇章', growthTier: 'T7', rarity: 'epic', statMultiplier: 1 },
      { id: 'awakened', label: '觉醒悔恨', growthTier: 'T7', rarity: 'legend', materialKind: 'advanced', materialAmount: 7, gold: 120000, levelBonus: 20, statMultiplier: 1.16 },
      { id: 'penitentia', label: '悔恨完全体', growthTier: 'T8', rarity: 'legend', materialKind: 'core', materialAmount: 3, gold: 190000, levelBonus: 30, statMultiplier: 1.22 },
    ],
  },
  goodEvil: {
    id: 'goodEvil',
    label: '善恶',
    defaultTier: 'T8',
    stages: [
      { id: 'mark', label: '善恶刻印', growthTier: 'T8', rarity: 'epic', statMultiplier: 1 },
      { id: 'temple', label: '魔神殿回响', growthTier: 'T8', rarity: 'legend', materialKind: 'advanced', materialAmount: 7, gold: 140000, levelBonus: 22, statMultiplier: 1.16 },
      { id: 'core', label: '善恶核心', growthTier: 'T9', rarity: 'legend', materialKind: 'core', materialAmount: 3, gold: 220000, levelBonus: 30, statMultiplier: 1.22 },
    ],
  },
  nebula: {
    id: 'nebula',
    label: '星云 / 葛帔尼亚',
    defaultTier: 'T8',
    stages: [
      { id: 'nebula', label: '星云', growthTier: 'T8', rarity: 'epic', statMultiplier: 1 },
      { id: 'geoborg', label: '葛帔尼亚', growthTier: 'T9', rarity: 'legend', materialKind: 'advanced', materialAmount: 7, gold: 150000, levelBonus: 24, statMultiplier: 1.18 },
      { id: 'core', label: '葛帔尼亚核心', growthTier: 'T9', rarity: 'legend', materialKind: 'core', materialAmount: 3, gold: 240000, levelBonus: 30, statMultiplier: 1.22 },
    ],
  },
  muqaddas: {
    id: 'muqaddas',
    label: '莫卡迪斯',
    defaultTier: 'T9',
    stages: [
      { id: 'base', label: '莫卡迪斯', growthTier: 'T9', rarity: 'legend', statMultiplier: 1 },
      { id: 'sanctuary', label: '圣域莫卡迪斯', growthTier: 'T9', rarity: 'legend', materialKind: 'advanced', materialAmount: 8, gold: 220000, levelBonus: 24, statMultiplier: 1.18 },
      { id: 'core', label: '莫卡迪斯核心', growthTier: 'T10', rarity: 'mythic', materialKind: 'core', materialAmount: 3, gold: 320000, levelBonus: 32, statMultiplier: 1.24 },
    ],
  },
  dimensional: {
    id: 'dimensional',
    label: '次元',
    defaultTier: 'T10',
    stages: [
      { id: 'base', label: '次元', growthTier: 'T10', rarity: 'legend', statMultiplier: 1 },
      { id: 'timeRune', label: '时间符文', growthTier: 'T10', rarity: 'mythic', materialKind: 'advanced', materialAmount: 8, gold: 280000, levelBonus: 26, statMultiplier: 1.18 },
      { id: 'crown', label: '次元冠冕', growthTier: 'T10', rarity: 'mythic', materialKind: 'core', materialAmount: 4, gold: 420000, levelBonus: 36, statMultiplier: 1.25 },
    ],
  },
});

export const MAP_EQUIPMENT_PROGRESSION = Object.freeze({
  grass: {
    normal: { targetMapOffset: 0, tiers: ['T1'], series: ['oldWorld'], grade: 'field', upgradeStage: 0 },
    hard: { targetMapOffset: 2, tiers: ['T1'], series: ['oldWorld'], grade: 'polished', upgradeStage: 0, materialSeries: ['ancientHero'], materialKinds: ['basic'] },
    abyss: { targetMapOffset: 4, tiers: ['T2'], series: ['ancientHero'], grade: 'embryo', upgradeStage: 0, materialSeries: ['ancientHero'], materialKinds: ['advanced', 'core'] },
  },
  forest: {
    normal: { targetMapOffset: 0, tiers: ['T1', 'T2'], series: ['oldWorld', 'ancientHero'], grade: 'field', upgradeStage: 0, materialSeries: ['ancientHero'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T2'], series: ['ancientHero'], grade: 'polished', upgradeStage: 0, materialSeries: ['os'], materialKinds: ['basic'] },
    abyss: { targetMapOffset: 4, tiers: ['T3'], series: ['os'], grade: 'embryo', upgradeStage: 0, materialSeries: ['os'], materialKinds: ['advanced', 'core'] },
  },
  sewer: {
    normal: { targetMapOffset: 0, tiers: ['T2'], series: ['ancientHero'], grade: 'base', upgradeStage: 0, materialSeries: ['ancientHero'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T2'], series: ['ancientHero'], grade: 'reform', upgradeStage: 1, materialSeries: ['os'], materialKinds: ['basic', 'advanced'] },
    abyss: { targetMapOffset: 4, tiers: ['T3'], series: ['os'], grade: 'embryo', upgradeStage: 0, materialSeries: ['os'], materialKinds: ['advanced', 'core'] },
  },
  desert: {
    normal: { targetMapOffset: 0, tiers: ['T2', 'T3'], series: ['ancientHero', 'os'], grade: 'base', upgradeStage: 0, materialSeries: ['os'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T3'], series: ['os'], grade: 'polished', upgradeStage: 0, materialSeries: ['fides'], materialKinds: ['basic'] },
    abyss: { targetMapOffset: 4, tiers: ['T4'], series: ['os'], grade: 'osAd', upgradeStage: 1, materialSeries: ['os', 'fides'], materialKinds: ['advanced', 'core'] },
  },
  orc_village: {
    normal: { targetMapOffset: 0, tiers: ['T3'], series: ['os'], grade: 'base', upgradeStage: 0, materialSeries: ['os'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T4'], series: ['os'], grade: 'osAd', upgradeStage: 1, materialSeries: ['fides'], materialKinds: ['basic', 'advanced'] },
    abyss: { targetMapOffset: 4, tiers: ['T5'], series: ['fides'], grade: 'embryo', upgradeStage: 0, materialSeries: ['fides'], materialKinds: ['advanced', 'core'] },
  },
  mine: {
    normal: { targetMapOffset: 0, tiers: ['T4', 'T5'], series: ['os', 'fides'], grade: 'base', upgradeStage: 0, materialSeries: ['fides'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T5'], series: ['fides'], grade: 'purified', upgradeStage: 1, materialSeries: ['glacier'], materialKinds: ['basic'] },
    abyss: { targetMapOffset: 4, tiers: ['T6'], series: ['glacier'], grade: 'embryo', upgradeStage: 0, materialSeries: ['glacier'], materialKinds: ['advanced', 'core'] },
  },
  clock: {
    normal: { targetMapOffset: 0, tiers: ['T5', 'T6'], series: ['fides', 'glacier'], grade: 'base', upgradeStage: 0, materialSeries: ['glacier'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T6'], series: ['glacier'], grade: 'glacier', upgradeStage: 1, materialSeries: ['poenitentia'], materialKinds: ['basic'] },
    abyss: { targetMapOffset: 4, tiers: ['T7'], series: ['poenitentia'], grade: 'embryo', upgradeStage: 0, materialSeries: ['poenitentia'], materialKinds: ['advanced', 'core'] },
  },
  glast_heim: {
    normal: { targetMapOffset: 0, tiers: ['T6', 'T7'], series: ['glacier', 'poenitentia'], grade: 'base', upgradeStage: 0, materialSeries: ['poenitentia'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T7'], series: ['poenitentia'], grade: 'awakened', upgradeStage: 1, materialSeries: ['goodEvil', 'nebula'], materialKinds: ['basic'] },
    abyss: { targetMapOffset: 4, tiers: ['T8'], series: ['goodEvil', 'nebula'], grade: 'embryo', upgradeStage: 0, materialSeries: ['goodEvil', 'nebula'], materialKinds: ['advanced', 'core'] },
  },
  abyss_lake: {
    normal: { targetMapOffset: 0, tiers: ['T8'], series: ['goodEvil', 'nebula'], grade: 'base', upgradeStage: 0, materialSeries: ['goodEvil', 'nebula'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T9'], series: ['nebula', 'muqaddas'], grade: 'geoborg', upgradeStage: 1, materialSeries: ['muqaddas'], materialKinds: ['basic', 'advanced'] },
    abyss: { targetMapOffset: 4, tiers: ['T9'], series: ['muqaddas'], grade: 'embryo', upgradeStage: 0, materialSeries: ['muqaddas'], materialKinds: ['advanced', 'core'] },
  },
  sky: {
    normal: { targetMapOffset: 0, tiers: ['T9', 'T10'], series: ['muqaddas', 'dimensional'], grade: 'base', upgradeStage: 0, materialSeries: ['muqaddas', 'dimensional'], materialKinds: ['basic'] },
    hard: { targetMapOffset: 2, tiers: ['T10'], series: ['dimensional'], grade: 'timeRune', upgradeStage: 1, materialSeries: ['dimensional'], materialKinds: ['basic', 'advanced'] },
    abyss: { targetMapOffset: 4, tiers: ['T10'], series: ['dimensional'], grade: 'crown', upgradeStage: 1, materialSeries: ['dimensional'], materialKinds: ['advanced', 'core'] },
  },
});

const DEFAULT_PROGRESSION = MAP_EQUIPMENT_PROGRESSION.grass.normal;

function finiteNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeList(value, fallback = []) {
  if (Array.isArray(value)) return value.filter(Boolean);
  return value ? [value] : fallback;
}

function pick(list, rng = Math.random) {
  const values = normalizeList(list);
  if (!values.length) return '';
  const roll = typeof rng === 'function' ? rng() : Math.random();
  return values[Math.min(values.length - 1, Math.floor(Math.max(0, roll) * values.length))];
}

let progressionEquipmentTemplatesCache = null;

function tierPower(tier) {
  return ({
    T1: 1,
    T2: 1.55,
    T3: 2.05,
    T4: 2.55,
    T5: 3.05,
    T6: 3.55,
    T7: 4.05,
    T8: 4.55,
    T9: 5.05,
    T10: 5.55,
  }[normalizeGrowthTier(tier)] || 1);
}

function slotNameForArchetype(slot, archetype) {
  const config = PROGRESSION_EQUIPMENT_SLOTS.find((entry) => entry.id === slot) || PROGRESSION_EQUIPMENT_SLOTS[0];
  if (archetype === 'physical') return config.physicalName || config.label;
  if (archetype === 'magic') return config.magicName || config.label;
  return config.generalName || config.label;
}

function roundStat(value, min = 0) {
  return Math.max(min, Math.round(Number(value) || 0));
}

function buildProgressionTemplateStats(slot, archetype, growthTier, stage = {}) {
  const scale = tierPower(growthTier) * finiteNumber(stage.statMultiplier, 1);
  if (slot === 'weapon') {
    if (archetype === 'physical') return { atk: roundStat(10 * scale, 1), str: roundStat(2.2 * scale), dex: roundStat(1.2 * scale), aspd: 0.02, crit: 0.02, atkPct: Number((0.012 * scale).toFixed(3)) };
    if (archetype === 'magic') return { matk: roundStat(11 * scale, 1), int: roundStat(2.3 * scale), dex: roundStat(1.1 * scale), skillDamageBonus: Number((0.012 * scale).toFixed(3)), matkPct: Number((0.012 * scale).toFixed(3)) };
    return { atk: roundStat(7 * scale, 1), matk: roundStat(7 * scale, 1), str: roundStat(1.2 * scale), int: roundStat(1.2 * scale), dex: roundStat(1.4 * scale), finalDamageBonus: Number((0.004 * scale).toFixed(3)) };
  }
  if (slot === 'armor') {
    return { def: roundStat(8 * scale, 1), hp: roundStat(70 * scale, 10), vit: roundStat(2.4 * scale), hpPct: Number((0.012 * scale).toFixed(3)), damageReductionPct: Number((0.004 * scale).toFixed(3)) };
  }
  if (slot === 'headgear') {
    const main = archetype === 'magic' ? { int: roundStat(2.2 * scale), matk: roundStat(2.4 * scale) } : archetype === 'physical' ? { str: roundStat(2.2 * scale), atk: roundStat(2.4 * scale) } : { str: roundStat(1.2 * scale), int: roundStat(1.2 * scale), dex: roundStat(1.5 * scale) };
    return { def: roundStat(3.5 * scale, 1), luk: roundStat(1.1 * scale), expBonus: Number((0.01 * scale).toFixed(3)), ...main };
  }
  if (slot === 'shoes') {
    return { def: roundStat(4.5 * scale, 1), agi: roundStat(2.3 * scale), vit: roundStat(1.4 * scale), aspd: Number((0.008 * scale).toFixed(3)), attackSpeedPct: Number((0.006 * scale).toFixed(3)), combatPaceBonus: Number((0.004 * scale).toFixed(3)) };
  }
  const output = archetype === 'magic'
    ? { int: roundStat(2.4 * scale), matk: roundStat(3 * scale), matkPct: Number((0.008 * scale).toFixed(3)) }
    : archetype === 'physical'
      ? { str: roundStat(2.4 * scale), atk: roundStat(3 * scale), atkPct: Number((0.008 * scale).toFixed(3)) }
      : { str: roundStat(1.2 * scale), int: roundStat(1.2 * scale), dex: roundStat(1.4 * scale), finalDamageBonus: Number((0.003 * scale).toFixed(3)) };
  return { def: roundStat(2.5 * scale, 1), luk: roundStat(1.6 * scale), crit: Number((0.006 * scale).toFixed(3)), drop: Number((0.004 * scale).toFixed(3)), ...output };
}

function buildProgressionTemplate(seriesId, stage, archetype, slotConfig) {
  const growthTier = normalizeGrowthTier(stage.growthTier || getEquipmentSeriesConfig(seriesId).defaultTier);
  const stats = buildProgressionTemplateStats(slotConfig.id, archetype.id, growthTier, stage);
  const name = `${stage.label}${slotNameForArchetype(slotConfig.id, archetype.id)}`;
  return Object.freeze({
    id: `prog_${seriesId}_${stage.id}_${archetype.id}_${slotConfig.id}`,
    name,
    slot: slotConfig.id,
    equipSlot: slotConfig.id,
    rarity: stage.rarity || 'rare',
    source: 'progression_drop',
    archetype: archetype.id,
    growthTier,
    series: seriesId,
    upgradeStage: Math.max(0, getEquipmentSeriesConfig(seriesId).stages.findIndex((entry) => entry.id === stage.id)),
    grade: stage.id,
    upgradePathId: seriesId,
    progressionLabel: stage.label || getEquipmentSeriesConfig(seriesId).label,
    requiredLevel: EQUIPMENT_GROWTH_TIERS[growthTier]?.level || 1,
    description: `${getEquipmentSeriesConfig(seriesId).label} ${archetype.label}${slotConfig.label}`,
    baseStats: Object.freeze({ ...stats }),
    ...stats,
  });
}

function progressionStageIdsFor(seriesConfig, progression) {
  const exact = seriesConfig.stages.find((stage) => stage.id === progression.grade);
  if (exact) return [exact.id];
  const indexed = seriesConfig.stages[Math.max(0, Math.round(finiteNumber(progression.upgradeStage, 0)))];
  const byTier = seriesConfig.stages
    .filter((stage) => progression.tiers.includes(normalizeGrowthTier(stage.growthTier || seriesConfig.defaultTier, seriesConfig.defaultTier)))
    .map((stage) => stage.id);
  return [...new Set([indexed?.id, ...byTier].filter(Boolean))];
}

function progressionDropRateFor(difficulty, slot, rarity) {
  const difficultyRate = ({ normal: 0.006, hard: 0.011, abyss: 0.018 }[difficulty] || 0.006);
  const rarityRate = ({ normal: 1, fine: 0.95, rare: 0.85, epic: 0.62, ancient: 0.5, legend: 0.36, darkGold: 0.22, mythic: 0.14 }[rarity] || 0.75);
  const slotWeight = PROGRESSION_EQUIPMENT_SLOTS.find((entry) => entry.id === slot)?.weight || 1;
  return Number((difficultyRate * rarityRate * slotWeight).toFixed(5));
}

function progressionLevelRange(mapId) {
  const range = PROGRESSION_MAP_LEVEL_RANGES[mapId] || PROGRESSION_MAP_LEVEL_RANGES.grass;
  return { minLevel: range[0], maxLevel: range[1] };
}

export function normalizeGrowthTier(value, fallback = 'T1') {
  const tier = String(value || '').toUpperCase();
  return EQUIPMENT_GROWTH_TIERS[tier] ? tier : fallback;
}

export function normalizeEquipmentSeries(value, fallback = 'oldWorld') {
  return EQUIPMENT_SERIES[value] ? value : fallback;
}

export function getEquipmentSeriesConfig(series) {
  return EQUIPMENT_SERIES[normalizeEquipmentSeries(series)] || EQUIPMENT_SERIES.oldWorld;
}

export function getEquipmentLineMaterials(series) {
  return EQUIPMENT_LINE_MATERIALS[normalizeEquipmentSeries(series, '')] || {};
}

export function getMapEquipmentProgression(mapId, difficulty = 'normal') {
  const mapProgression = MAP_EQUIPMENT_PROGRESSION[mapId] || {};
  const selected = mapProgression[difficulty] || mapProgression.normal || DEFAULT_PROGRESSION;
  return {
    ...selected,
    mapId: mapId || 'grass',
    difficulty,
    tiers: normalizeList(selected.tiers, ['T1']),
    series: normalizeList(selected.series, ['oldWorld']),
    materialSeries: normalizeList(selected.materialSeries, []),
    materialKinds: normalizeList(selected.materialKinds, []),
  };
}

export function getProgressionEquipmentTemplates() {
  if (progressionEquipmentTemplatesCache) return progressionEquipmentTemplatesCache;
  const templates = [];
  Object.values(EQUIPMENT_SERIES).forEach((seriesConfig) => {
    (seriesConfig.stages || []).forEach((stage) => {
      PROGRESSION_EQUIPMENT_ARCHETYPES.forEach((archetype) => {
        PROGRESSION_EQUIPMENT_SLOTS.forEach((slot) => {
          templates.push(buildProgressionTemplate(seriesConfig.id, stage, archetype, slot));
        });
      });
    });
  });
  progressionEquipmentTemplatesCache = Object.freeze(templates);
  return progressionEquipmentTemplatesCache;
}

export function getProgressionEquipmentTemplate(id) {
  return getProgressionEquipmentTemplates().find((template) => template.id === id) || null;
}

export function getProgressionEquipmentDropTable(mapId, difficulty = 'normal') {
  const progression = getMapEquipmentProgression(mapId, difficulty);
  const range = progressionLevelRange(progression.mapId);
  const allowedSeries = new Set(progression.series);
  const allowedTiers = new Set(progression.tiers.map((tier) => normalizeGrowthTier(tier)));
  const allowedStageIds = new Map();
  progression.series.forEach((series) => {
    const config = getEquipmentSeriesConfig(series);
    allowedStageIds.set(series, new Set(progressionStageIdsFor(config, progression)));
  });
  return getProgressionEquipmentTemplates()
    .filter((template) => allowedSeries.has(template.series))
    .filter((template) => allowedTiers.has(normalizeGrowthTier(template.growthTier)))
    .filter((template) => {
      const stageIds = allowedStageIds.get(template.series);
      return !stageIds || !stageIds.size || stageIds.has(template.grade);
    })
    .map((template) => ({
      equipmentId: template.id,
      itemName: template.name,
      rarity: template.rarity,
      dropRate: progressionDropRateFor(difficulty, template.slot, template.rarity),
      minLevel: range.minLevel,
      maxLevel: range.maxLevel,
      mapId: progression.mapId,
      difficulty,
      monsterIds: [],
      weight: PROGRESSION_EQUIPMENT_SLOTS.find((slot) => slot.id === template.slot)?.weight || 1,
      progression: true,
      series: template.series,
      growthTier: template.growthTier,
      upgradeStage: template.upgradeStage,
      grade: template.grade,
      archetype: template.archetype,
      slot: template.slot,
    }));
}

export function getEquipmentLineFilterOptions() {
  return Object.values(EQUIPMENT_SERIES)
    .filter((series) => series.id !== 'oldWorld')
    .map((series) => ({ id: `line:${series.id}`, label: series.label, series: series.id }));
}

export function getEquipmentLineMaterialOverview(series = '') {
  const id = normalizeEquipmentSeries(series, '');
  if (!id || id === 'oldWorld') return null;
  const config = getEquipmentSeriesConfig(id);
  const materials = getEquipmentLineMaterials(id);
  const directSources = [];
  const salvageSources = [];
  Object.entries(MAP_EQUIPMENT_PROGRESSION).forEach(([mapId, difficulties]) => {
    Object.entries(difficulties || {}).forEach(([difficulty, progression]) => {
      const materialSeries = normalizeList(progression.materialSeries, []);
      const equipmentSeries = normalizeList(progression.series, []);
      const source = {
        mapId,
        difficulty,
        materialKinds: normalizeList(progression.materialKinds, []),
        tiers: normalizeList(progression.tiers, []),
        series: equipmentSeries,
      };
      if (materialSeries.includes(id)) directSources.push({ ...source, sourceType: 'direct' });
      if (equipmentSeries.includes(id)) salvageSources.push({ ...source, sourceType: 'salvage' });
    });
  });
  return {
    series: id,
    label: config.label,
    materials,
    directSources,
    salvageSources,
    sources: [...directSources, ...salvageSources],
  };
}

export function getAllEquipmentLineMaterialOverviews() {
  return Object.keys(EQUIPMENT_SERIES)
    .filter((series) => series !== 'oldWorld')
    .map((series) => getEquipmentLineMaterialOverview(series))
    .filter(Boolean);
}

export function formatEquipmentProgressionSummary(mapId, difficulty = 'normal') {
  const progression = getMapEquipmentProgression(mapId, difficulty);
  const seriesText = progression.series.map((id) => getEquipmentSeriesConfig(id).label).join(' / ');
  const tierText = progression.tiers.join(' / ');
  const materials = progression.materialSeries
    .map((id) => getEquipmentSeriesConfig(id).label)
    .filter(Boolean)
    .join(' / ');
  return `${tierText} ${seriesText}${materials ? ` · 材料：${materials}` : ''}`;
}

export function resolveEquipmentProgressionContext(input = {}) {
  const mapId = input.mapId || input.dropMapId || '';
  const difficulty = input.difficulty || input.sourceDifficulty || 'normal';
  const progression = getMapEquipmentProgression(mapId, difficulty);
  const rng = input.rng || input.random || Math.random;
  const drop = input.drop || {};
  const template = input.template || {};
  const series = normalizeEquipmentSeries(input.series || drop.series || template.series || pick(progression.series, rng));
  const config = getEquipmentSeriesConfig(series);
  const growthTier = normalizeGrowthTier(input.growthTier || drop.growthTier || template.growthTier || pick(progression.tiers, rng) || config.defaultTier, config.defaultTier);
  const upgradeStage = Math.max(0, Math.round(finiteNumber(input.upgradeStage ?? drop.upgradeStage ?? template.upgradeStage, progression.upgradeStage || 0)));
  const stage = config.stages?.[upgradeStage] || config.stages?.[0] || {};
  return {
    growthTier,
    series,
    upgradeStage,
    grade: input.grade || drop.grade || template.grade || progression.grade || stage.id || 'base',
    upgradePathId: input.upgradePathId || series,
    progressionLabel: stage.label || config.label,
    progressionSource: `${mapId || 'unknown'}:${difficulty}`,
    targetMapOffset: progression.targetMapOffset || 0,
  };
}

export function resolveItemProgression(template = {}, context = {}, runtime = {}) {
  if (context.series || context.growthTier || context.upgradePathId) {
    return resolveEquipmentProgressionContext({ ...context, mapId: context.dropMapId, random: context.rng || runtime.random });
  }
  const resolved = runtime.resolveEquipmentProgressionContext?.({
    ...context,
    template,
    mapId: context.dropMapId,
    difficulty: context.difficulty || context.sourceDifficulty,
    random: context.rng || runtime.random,
  });
  return resolved || resolveEquipmentProgressionContext({
    ...context,
    mapId: context.dropMapId,
    difficulty: context.difficulty || context.sourceDifficulty,
    random: context.rng || runtime.random,
  });
}

function dropRateFor(kind, difficulty, boss) {
  if (boss) {
    if (kind === 'core') return difficulty === 'abyss' ? 1 : difficulty === 'hard' ? 0.7 : 0.42;
    if (kind === 'advanced') return difficulty === 'abyss' ? 0.75 : difficulty === 'hard' ? 0.55 : 0.28;
    return difficulty === 'abyss' ? 0.9 : difficulty === 'hard' ? 0.75 : 0.5;
  }
  const table = {
    normal: { basic: 0.035, advanced: 0.012, core: 0.002 },
    hard: { basic: 0.11, advanced: 0.045, core: 0.01 },
    abyss: { basic: 0.14, advanced: 0.08, core: 0.025 },
  }[difficulty] || {};
  return table[kind] || 0;
}

function qtyFor(kind, difficulty, boss) {
  if (boss) return kind === 'core' ? [1, difficulty === 'abyss' ? 2 : 1] : [2, difficulty === 'abyss' ? 4 : 3];
  if (kind === 'basic') return [1, difficulty === 'abyss' ? 3 : 2];
  return [1, 1];
}

export function getProgressionMaterialDrops(mapId, difficulty = 'normal', options = {}) {
  const progression = getMapEquipmentProgression(mapId, difficulty);
  const boss = Boolean(options.boss);
  const seriesList = boss
    ? [...new Set([...progression.materialSeries, ...progression.series])]
    : progression.materialSeries;
  const kinds = boss ? ['core'] : progression.materialKinds;
  const rows = [];
  seriesList.forEach((series) => {
    const materials = getEquipmentLineMaterials(series);
    if (!materials.basic && !materials.advanced && !materials.core) return;
    kinds.forEach((kind) => {
      const material = materials[kind];
      if (!material) return;
      const qty = qtyFor(kind, difficulty, boss);
      rows.push({
        materialId: material.id,
        name: material.name,
        rarity: material.rarity,
        dropRate: dropRateFor(kind, difficulty, boss),
        minQty: qty[0],
        maxQty: qty[1],
        progression: true,
        series,
        kind,
      });
    });
  });
  return rows.filter((row) => row.dropRate > 0);
}

export function getNextEquipmentUpgrade(item = {}) {
  const series = normalizeEquipmentSeries(item.series, '');
  if (!series) return null;
  const config = getEquipmentSeriesConfig(series);
  const currentStage = Math.max(0, Math.round(finiteNumber(item.upgradeStage, 0)));
  const nextStage = config.stages?.[currentStage + 1];
  if (!nextStage) return null;
  return {
    series,
    upgradePathId: item.upgradePathId || series,
    upgradeStage: currentStage + 1,
    growthTier: normalizeGrowthTier(nextStage.growthTier || item.growthTier || config.defaultTier, config.defaultTier),
    grade: nextStage.id,
    label: nextStage.label,
    rarity: nextStage.rarity,
    levelBonus: nextStage.levelBonus || 0,
    statMultiplier: nextStage.statMultiplier || 1,
    materialKind: nextStage.materialKind || 'advanced',
    materialAmount: nextStage.materialAmount || 1,
    gold: nextStage.gold || 0,
  };
}

export function getEquipmentUpgradeCost(item = {}) {
  const next = getNextEquipmentUpgrade(item);
  if (!next) return null;
  const materials = getEquipmentLineMaterials(next.series);
  const material = materials[next.materialKind];
  if (!material) return null;
  const amount = Math.max(1, Math.ceil(next.materialAmount));
  return {
    materials: { [material.id]: amount },
    gold: Math.round(next.gold),
    next,
    material,
  };
}

export function getEquipmentProgressionTags(item = {}) {
  const series = normalizeEquipmentSeries(item.series, '');
  if (!series) return [];
  const config = getEquipmentSeriesConfig(series);
  const stage = config.stages?.[Math.max(0, Math.round(finiteNumber(item.upgradeStage, 0)))] || {};
  return [...new Set([
    config.label,
    stage.label || item.progressionLabel || item.grade || '',
  ].filter(Boolean))];
}
