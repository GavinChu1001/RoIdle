import { inferEquipmentArchetype, normalizeEquipmentArchetype, rollEquipmentArchetype } from './itemArchetype.js';
import {
  EQUIPMENT_GROWTH_MODEL,
  calculateCreationStatScale,
  growthModelFor,
  snapshotLegacyPower,
  usesProgressionGrowth,
} from './equipmentGrowth.js';
import { resolveItemProgression } from './itemProgression.js';
import { DEPRECATED_EQUIPMENT_STATS, applyCanonicalEquipmentStats } from './statCatalog.js';

let runtimeContext = {};

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object || {}, key);

function clearDeprecatedEquipmentStats(item = {}) {
  DEPRECATED_EQUIPMENT_STATS.forEach((stat) => {
    delete item[stat];
  });
  return item;
}

export function configureItemFactoryContext(context = {}) {
  runtimeContext = context || {};
}

function archetypeContext(context = {}, runtime = {}) {
  return {
    ...context,
    normalizeEquipmentSlot: runtime.normalizeEquipmentSlot,
  };
}

function resolveCreatedItemArchetype(template = {}, context = {}, runtime = {}) {
  if (hasOwn(context, 'targetArchetype') && context.targetArchetype) return normalizeEquipmentArchetype(context.targetArchetype);
  if (hasOwn(context, 'archetype') && context.archetype) return normalizeEquipmentArchetype(context.archetype);
  const rollContext = archetypeContext(context, runtime);
  const rolled = typeof runtime.rollEquipmentArchetype === 'function'
    ? runtime.rollEquipmentArchetype(template, rollContext)
    : rollEquipmentArchetype(template, rollContext);
  return normalizeEquipmentArchetype(rolled);
}

function inferNormalizedItemArchetype(item = {}, runtime = {}) {
  const inferContext = archetypeContext({}, runtime);
  const inferred = typeof runtime.inferEquipmentArchetype === 'function'
    ? runtime.inferEquipmentArchetype(item, inferContext)
    : inferEquipmentArchetype(item, inferContext);
  return normalizeEquipmentArchetype(inferred);
}

function resolveNormalizedItemArchetype(item = {}, runtime = {}) {
  if (hasOwn(item, 'archetype')) return normalizeEquipmentArchetype(item.archetype);
  return inferNormalizedItemArchetype(item, runtime);
}

function resolveResetItemArchetype(item = {}, runtime = {}) {
  if (hasOwn(item, 'targetArchetype') && item.targetArchetype) return normalizeEquipmentArchetype(item.targetArchetype);
  if (hasOwn(item, 'archetype') && item.archetype) return normalizeEquipmentArchetype(item.archetype);
  return inferNormalizedItemArchetype(item, runtime);
}

export function createItem(template = {}, level, forcedTierId = null, context = {}, runtime = runtimeContext) {
  const tiers = runtime.getEquipmentTiers?.() || [];
  const fixedTier = template.source === 'monster_drop' || template.setId;
  const tier = forcedTierId
    ? tiers.find((entry) => entry.id === forcedTierId)
    : fixedTier && template.rarity
      ? tiers.find((entry) => entry.id === template.rarity) || runtime.rollEquipmentTier?.()
      : runtime.rollEquipmentTier?.();
  let safeTier = tier || tiers[0] || { id: 'normal', scale: 1, rolls: [1, 1] };
  if (safeTier.id === 'mythic' && !runtime.canCreateMythic?.(context)) {
    safeTier = tiers.find((entry) => entry.id === 'darkGold') || tiers.find((entry) => entry.id === 'legend') || safeTier;
  }
  const safeLevel = Math.max(1, number(level, 1));
  const dropLevel = Math.max(1, Math.round(context.dropLevel || level || runtime.safeHeroBaseLevel?.() || 1));
  const itemTier = context.itemTier
    ? { id: context.itemTier, ...(runtime.getItemTierConfig?.(context.itemTier) || {}) }
    : runtime.getItemTierForLevel?.(dropLevel) || { id: 'starter', scale: 1 };
  const slotGrowth = runtime.getSlotLevelGrowth?.(template.slot) || 0;
  const quality = runtime.randomFloat?.(safeTier.rolls[0], safeTier.rolls[1]) ?? safeTier.rolls[0];
  const progressionGrowth = usesProgressionGrowth(template, context);
  const statScale = calculateCreationStatScale({
    template,
    context,
    tier: safeTier,
    itemTier,
    quality,
    level: safeLevel,
    slotGrowth,
  });
  const levelGrowthFactor = progressionGrowth ? 1 : 1 + safeLevel * 0.018;
  const goldGrowthFactor = progressionGrowth ? 1 : 1 + safeLevel * 0.025;
  const archetype = resolveCreatedItemArchetype(template, context, runtime);
  const progression = resolveItemProgression(template, { ...context, archetype }, runtime);
  const item = {
    id: runtime.createItemId?.(template.slot) || `${template.slot || 'item'}-${Date.now().toString(36)}`,
    instanceId: '',
    templateId: template.id || '',
    name: template.name,
    slot: template.slot,
    equipSlot: template.equipSlot || runtime.normalizeEquipmentSlot?.(template.slot) || template.slot,
    weaponType: template.weaponType || '',
    armorType: template.armorType || '',
    subType: template.subType || runtime.inferEquipmentSubType?.(template) || '',
    equipType: template.equipType || template.weaponType || template.armorType || template.slot,
    source: template.source || 'monster_drop',
    image: template.image || runtime.equipmentImagePath?.(template.id || template.name || template.slot) || '',
    requiredLevel: template.requiredLevel || 1,
    requiredJob: template.requiredJob || [],
    allowedJobs: template.allowedJobs || [],
    setId: template.setId || '',
    setName: template.setName || '',
    baseStats: template.baseStats || {},
    description: template.description || '',
    archetype,
    growthTier: progression.growthTier || 'T1',
    series: progression.series || 'oldWorld',
    upgradeStage: Math.max(0, Math.round(number(progression.upgradeStage, 0))),
    grade: progression.grade || '',
    upgradePathId: progression.upgradePathId || progression.series || 'oldWorld',
    progressionLabel: progression.progressionLabel || '',
    progressionSource: progression.progressionSource || '',
    growthModel: progressionGrowth ? EQUIPMENT_GROWTH_MODEL.PROGRESSION_V2 : EQUIPMENT_GROWTH_MODEL.LEGACY_LEVEL,
    legacyPowerSnapshot: null,
    rarity: safeTier.id,
    tier: safeTier.id,
    itemTier: itemTier.id,
    dropMapId: context.dropMapId || '',
    dropLevel,
    sourceDifficulty: context.difficulty || '',
    abyssForged: context.difficulty === 'abyss',
    prefix: context.difficulty === 'abyss' ? '\u6df1\u6e0a' : '',
    abyssBonus: {},
    abyssAffixes: [],
    abyssBonusApplied: false,
    abyssSetVariant: false,
    abyssSetBonusApplied: false,
    originalSetId: template.setId || '',
    cardSlots: [],
    templateBaseStats: runtime.getTemplateBaseStats?.(template) || {},
    quality: Math.round(quality * 100),
    refine: 0,
    refineFailCount: 0,
    empower: 0,
    locked: false,
    affixes: [],
    affixDetails: [],
    mechanicAffixes: [],
    ranges: {},
    randomStats: runtime.shouldRollRandomStats?.(template) ? runtime.rollRandomStats?.(safeTier.id, archetype) : runtime.defaultRandomStats?.() || {},
    level: safeLevel,
    atk: Math.round(number(template.atk) * statScale),
    matk: Math.round(number(template.matk) * statScale),
    def: Math.round(number(template.def) * statScale),
    hp: Math.round(number(template.hp) * statScale),
    aspd: Number((number(template.aspd) * levelGrowthFactor).toFixed(3)),
    luck: 0,
    str: Math.round(number(template.str) * statScale),
    agi: Math.round(number(template.agi) * statScale),
    vit: Math.round(number(template.vit) * statScale),
    int: Math.round(number(template.int) * statScale),
    dex: Math.round(number(template.dex) * statScale),
    luk: Math.round((number(template.luk) + number(template.luck)) * statScale),
    gold: Number((number(template.gold) * goldGrowthFactor).toFixed(3)),
    crit: Number(((number(template.crit) + number(template.critRatePct)) * levelGrowthFactor).toFixed(3)),
    drop: Number((number(template.drop) * levelGrowthFactor).toFixed(3)),
    hpRegen: Math.round(number(template.hpRegen) * statScale),
    dodgeRate: Number(((number(template.dodgeRate) + number(template.dodgeRatePct)) * levelGrowthFactor).toFixed(3)),
    atkPct: number(template.atkPct),
    matkPct: number(template.matkPct),
    hpPct: number(template.hpPct),
    defPct: number(template.defPct),
    attackSpeedPct: number(template.attackSpeedPct),
    critDamageBonus: number(template.critDamageBonus),
    skillDamageBonus: number(template.skillDamageBonus),
    monsterDamageBonus: number(template.monsterDamageBonus),
    bossDamageBonus: number(template.bossDamageBonus),
    finalDamageBonus: number(template.finalDamageBonus),
    eliteDamageBonus: number(template.eliteDamageBonus),
    rareDropBonus: number(template.rareDropBonus),
    damageReductionPct: number(template.damageReductionPct),
    lifeSteal: number(template.lifeSteal),
    blockRate: number(template.blockRate),
    hpRegenPct: number(template.hpRegenPct),
    ignoreDefense: number(template.ignoreDefense),
    expBonus: number(template.expBonus) + number(template.baseExpBonus) + number(template.jobExpBonus),
    equipmentDrop: number(template.equipmentDrop),
    cardDrop: number(template.cardDrop),
    materialQuantityBonus: number(template.materialQuantityBonus),
    combatPaceBonus: number(template.combatPaceBonus) + number(template.patrolEfficiency) + number(template.powerPct),
    statusResist: number(template.statusResist),
    highTierFind: number(template.highTierFind) + number(template.mythicWeightBonus) + number(template.mythicEssenceDropBonus) + number(template.rebirthPrestigeWeightBonus),
    abyssDamageReduction: number(template.abyssDamageReduction),
    abyssDamageBonus: number(template.abyssDamageBonus) + number(template.abyssBossDamageBonus) + number(template.abyssSkillDamageBonus),
    echoChance: number(template.echoChance),
    mutationMaterialDoubleChance: number(template.mutationMaterialDoubleChance),
    thornVitMultiplier: number(template.thornVitMultiplier),
  };
  item.instanceId = item.id;
  runtime.addBaseRanges?.(item, template, safeTier, safeLevel, itemTier, slotGrowth);
  runtime.applyRandomAffixes?.(item, safeTier, safeLevel, itemTier);
  runtime.applyAbyssEquipmentBonus?.(item);
  runtime.applyRarityPerk?.(item, safeTier, template);
  return applyCanonicalEquipmentStats(item);
}

export function normalizeItem(item = {}, runtime = runtimeContext) {
  item = item && typeof item === 'object' ? item : {};
  const fallbackPower = number(item.power);
  const abyssForged = Boolean(item.abyssForged || item.sourceDifficulty === 'abyss');
  const progression = resolveItemProgression(item, {
    dropMapId: item.dropMapId || '',
    difficulty: item.sourceDifficulty || '',
    series: item.series || '',
    growthTier: item.growthTier || '',
    upgradeStage: item.upgradeStage ?? 0,
    grade: item.grade || '',
    upgradePathId: item.upgradePathId || '',
  }, runtime);
  const normalizedGrowthModel = item.growthModel || growthModelFor(item, item);
  const legacyPowerSnapshot = normalizedGrowthModel === EQUIPMENT_GROWTH_MODEL.LEGACY_LEVEL
    ? (item.legacyPowerSnapshot || snapshotLegacyPower(item))
    : null;
  const normalized = {
    id: item.id || runtime.createLegacyItemId?.() || `legacy-${Date.now().toString(36)}`,
    instanceId: item.instanceId || item.id || '',
    templateId: item.templateId || '',
    name: item.name || '\u65e7\u5f0f\u88c5\u5907',
    slot: item.slot || 'trinket',
    equipSlot: item.equipSlot || runtime.normalizeEquipmentSlot?.(item.slot || 'trinket') || 'trinket',
    weaponType: item.weaponType || '',
    armorType: item.armorType || '',
    subType: item.subType || runtime.inferEquipmentSubType?.(item) || '',
    equipType: item.equipType || item.weaponType || item.armorType || item.slot || 'trinket',
    source: item.source || 'legacy',
    image: item.image || runtime.equipmentImagePath?.(item.templateId || item.id || item.name || 'equipment') || '',
    requiredLevel: item.requiredLevel || 1,
    requiredJob: Array.isArray(item.requiredJob) ? item.requiredJob : [],
    allowedJobs: Array.isArray(item.allowedJobs) ? item.allowedJobs : [],
    setId: item.setId || '',
    setName: item.setName || '',
    baseStats: item.baseStats || {},
    description: item.description || '',
    archetype: resolveNormalizedItemArchetype(item, runtime),
    growthTier: progression.growthTier || 'T1',
    series: progression.series || 'oldWorld',
    upgradeStage: Math.max(0, Math.round(number(progression.upgradeStage, 0))),
    grade: progression.grade || '',
    upgradePathId: progression.upgradePathId || progression.series || 'oldWorld',
    progressionLabel: item.progressionLabel || progression.progressionLabel || '',
    progressionSource: item.progressionSource || progression.progressionSource || '',
    growthModel: normalizedGrowthModel,
    legacyPowerSnapshot,
    rarity: item.rarity || 'normal',
    tier: item.tier || item.rarity || 'normal',
    itemTier: runtime.inferItemTier?.(item)?.id || item.itemTier || '',
    dropMapId: item.dropMapId || '',
    dropLevel: item.dropLevel || item.level || 1,
    sourceDifficulty: item.sourceDifficulty || '',
    abyssForged,
    prefix: item.prefix || (abyssForged ? '\u6df1\u6e0a' : ''),
    abyssBonus: item.abyssBonus || {},
    abyssAffixes: Array.isArray(item.abyssAffixes) ? item.abyssAffixes : [],
    abyssBonusApplied: Boolean(item.abyssBonusApplied),
    abyssSetVariant: Boolean(item.abyssSetVariant || (abyssForged && item.setId)),
    abyssSetBonusApplied: Boolean(item.abyssSetBonusApplied),
    originalSetId: item.originalSetId || item.setId || '',
    cardSlots: runtime.normalizeCardSlots?.(item.cardSlots) || [],
    templateBaseStats: item.templateBaseStats || {},
    quality: item.quality || 100,
    refine: item.refine || 0,
    refineFailCount: Math.max(0, Math.floor(item.refineFailCount || 0)),
    empower: item.empower || 0,
    locked: Boolean(item.locked),
    affixes: Array.isArray(item.affixes) ? item.affixes : [],
    affixDetails: Array.isArray(item.affixDetails) ? item.affixDetails : [],
    mechanicAffixes: Array.isArray(item.mechanicAffixes) ? item.mechanicAffixes : [],
    ranges: item.ranges || runtime.inferItemRanges?.(item) || {},
    randomStats: runtime.normalizeRandomStats?.(item.randomStats) || {},
    level: item.level || 1,
    atk: item.atk ?? Math.round(fallbackPower * 0.6),
    matk: item.matk ?? Math.round(fallbackPower * 0.35),
    def: item.def ?? Math.round(fallbackPower * 0.25),
    hp: item.hp ?? 0,
    aspd: item.aspd ?? 0,
    luck: 0,
    str: item.str ?? 0,
    agi: item.agi ?? 0,
    vit: item.vit ?? 0,
    int: item.int ?? 0,
    dex: item.dex ?? 0,
    luk: number(item.luk) + number(item.luck),
    gold: item.gold ?? 0,
    crit: number(item.crit) + number(item.critRatePct),
    drop: item.drop ?? 0,
    hpRegen: item.hpRegen ?? 0,
    dodgeRate: number(item.dodgeRate) + number(item.dodgeRatePct),
    atkPct: item.atkPct ?? 0,
    matkPct: item.matkPct ?? 0,
    hpPct: item.hpPct ?? 0,
    defPct: item.defPct ?? 0,
    attackSpeedPct: item.attackSpeedPct ?? 0,
    critDamageBonus: item.critDamageBonus ?? 0,
    skillDamageBonus: item.skillDamageBonus ?? 0,
    monsterDamageBonus: item.monsterDamageBonus ?? 0,
    bossDamageBonus: item.bossDamageBonus ?? 0,
    finalDamageBonus: item.finalDamageBonus ?? 0,
    eliteDamageBonus: item.eliteDamageBonus ?? 0,
    rareDropBonus: item.rareDropBonus ?? 0,
    damageReductionPct: item.damageReductionPct ?? 0,
    lifeSteal: item.lifeSteal ?? 0,
    blockRate: item.blockRate ?? 0,
    hpRegenPct: item.hpRegenPct ?? 0,
    ignoreDefense: item.ignoreDefense ?? 0,
    expBonus: number(item.expBonus) + number(item.baseExpBonus) + number(item.jobExpBonus),
    equipmentDrop: item.equipmentDrop ?? 0,
    cardDrop: item.cardDrop ?? 0,
    materialQuantityBonus: item.materialQuantityBonus ?? 0,
    combatPaceBonus: number(item.combatPaceBonus) + number(item.patrolEfficiency) + number(item.powerPct),
    statusResist: item.statusResist ?? 0,
    highTierFind: number(item.highTierFind) + number(item.mythicWeightBonus) + number(item.mythicEssenceDropBonus) + number(item.rebirthPrestigeWeightBonus),
    abyssDamageBonus: number(item.abyssDamageBonus) + number(item.abyssBossDamageBonus) + number(item.abyssSkillDamageBonus),
    abyssDamageReduction: item.abyssDamageReduction ?? 0,
    echoChance: item.echoChance ?? 0,
    mutationMaterialDoubleChance: item.mutationMaterialDoubleChance ?? 0,
    thornVitMultiplier: item.thornVitMultiplier ?? 0,
    enhanceLevel: item.enhanceLevel || 0,
    specialPassives: Array.isArray(item.specialPassives) ? item.specialPassives : [],
    rarityPerk: item.rarityPerk || null,
  };
  runtime.applyAbyssEquipmentBonus?.(normalized);
  runtime.applyAbyssSetItemBonus?.(normalized);
  return clearDeprecatedEquipmentStats(applyCanonicalEquipmentStats(normalized));
}

export function resetItemForStatV2(item = {}, runtime = runtimeContext) {
  item = item && typeof item === 'object' ? item : {};
  const level = Math.max(1, Math.round(number(item.dropLevel || item.level || 1, 1)));
  const rarity = item.rarity || item.tier || 'normal';
  const archetype = resolveResetItemArchetype(item, runtime);
  const template =
    runtime.getEquipmentTemplate?.(item.templateId || '') ||
    runtime.getEquipmentTemplate?.(item.id || '') ||
    runtime.getEquipmentTemplate?.(item.name || '') ||
    {
      id: item.templateId || '',
      name: item.name || '\u65e7\u5f0f\u88c5\u5907',
      slot: item.slot || item.equipSlot || 'trinket',
      equipSlot: item.equipSlot || item.slot || 'trinket',
      weaponType: item.weaponType || '',
      armorType: item.armorType || '',
      subType: item.subType || '',
      source: item.source || 'monster_drop',
      rarity,
      atk: item.atk || 0,
      matk: item.matk || 0,
      def: item.def || 0,
      hp: item.hp || 0,
    };
  const rerolled = createItem(template, level, rarity, {
    dropMapId: item.dropMapId || '',
    dropLevel: level,
    difficulty: item.abyssForged || item.sourceDifficulty === '\u6df1\u6e0a' || item.sourceDifficulty === 'abyss' ? 'abyss' : item.sourceDifficulty || '',
    itemTier: item.itemTier || undefined,
    archetype,
    growthTier: item.growthTier || undefined,
    series: item.series || undefined,
    upgradeStage: item.upgradeStage ?? undefined,
    grade: item.grade || undefined,
    upgradePathId: item.upgradePathId || undefined,
  }, runtime);
  rerolled.id = item.id || rerolled.id;
  rerolled.instanceId = rerolled.id;
  rerolled.archetype = archetype;
  rerolled.growthTier = item.growthTier || rerolled.growthTier;
  rerolled.series = item.series || rerolled.series;
  rerolled.upgradeStage = item.upgradeStage ?? rerolled.upgradeStage;
  rerolled.grade = item.grade || rerolled.grade;
  rerolled.upgradePathId = item.upgradePathId || rerolled.upgradePathId;
  rerolled.level = level;
  rerolled.dropLevel = level;
  rerolled.rarity = rarity;
  rerolled.tier = rarity;
  rerolled.refine = 0;
  rerolled.refineFailCount = 0;
  rerolled.empower = 0;
  rerolled.locked = false;
  rerolled.cardSlots = [];
  return clearDeprecatedEquipmentStats(normalizeItem(rerolled, runtime));
}

export function equipmentSlot(item, runtime = runtimeContext) {
  return runtime.normalizeEquipmentSlot?.(item?.equipSlot || item?.slot) || item?.slot || 'trinket';
}
