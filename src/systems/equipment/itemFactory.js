let runtimeContext = {};

const number = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export function configureItemFactoryContext(context = {}) {
  runtimeContext = context || {};
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
  const statScale = safeTier.scale * number(itemTier.scale, 1) * quality * (1 + safeLevel * slotGrowth);
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
    randomStats: runtime.shouldRollRandomStats?.(template) ? runtime.rollRandomStats?.(safeTier.id) : runtime.defaultRandomStats?.() || {},
    level: safeLevel,
    atk: Math.round(number(template.atk) * statScale),
    matk: Math.round(number(template.matk) * statScale),
    def: Math.round(number(template.def) * statScale),
    hp: Math.round(number(template.hp) * statScale),
    aspd: Number((number(template.aspd) * (1 + safeLevel * 0.018)).toFixed(3)),
    luck: Math.round(number(template.luck) * statScale),
    str: Math.round(number(template.str) * statScale),
    agi: Math.round(number(template.agi) * statScale),
    vit: Math.round(number(template.vit) * statScale),
    int: Math.round(number(template.int) * statScale),
    dex: Math.round(number(template.dex) * statScale),
    luk: Math.round(number(template.luk) * statScale),
    gold: Number((number(template.gold) * (1 + safeLevel * 0.025)).toFixed(3)),
    crit: Number((number(template.crit) * (1 + safeLevel * 0.018)).toFixed(3)),
    drop: Number((number(template.drop) * (1 + safeLevel * 0.018)).toFixed(3)),
    hpRegen: Math.round(number(template.hpRegen) * statScale),
    dodgeRate: Number((number(template.dodgeRate) * (1 + safeLevel * 0.018)).toFixed(3)),
    atkPct: number(template.atkPct),
    matkPct: number(template.matkPct),
    hpPct: number(template.hpPct),
    defPct: number(template.defPct),
    attackSpeedPct: number(template.attackSpeedPct),
    critRatePct: number(template.critRatePct),
    critDamageBonus: number(template.critDamageBonus),
    skillDamageBonus: number(template.skillDamageBonus),
    monsterDamageBonus: number(template.monsterDamageBonus),
    bossDamageBonus: number(template.bossDamageBonus),
    finalDamageBonus: number(template.finalDamageBonus),
    eliteDamageBonus: number(template.eliteDamageBonus),
    rareDropBonus: number(template.rareDropBonus),
    damageReductionPct: number(template.damageReductionPct),
    lifeSteal: number(template.lifeSteal),
    dodgeRatePct: number(template.dodgeRatePct),
    hpRegenPct: number(template.hpRegenPct),
    ignoreDefense: number(template.ignoreDefense),
    baseExpBonus: number(template.baseExpBonus),
    jobExpBonus: number(template.jobExpBonus),
    equipmentDrop: number(template.equipmentDrop),
    cardDrop: number(template.cardDrop),
    materialQuantityBonus: number(template.materialQuantityBonus),
    powerPct: number(template.powerPct),
    combatPaceBonus: number(template.combatPaceBonus),
    patrolEfficiency: number(template.patrolEfficiency),
    hitRate: number(template.hitRate),
    statusResist: number(template.statusResist),
    abyssDamageBonus: number(template.abyssDamageBonus),
    abyssBossDamageBonus: number(template.abyssBossDamageBonus),
    abyssDamageReduction: number(template.abyssDamageReduction),
    mythicWeightBonus: number(template.mythicWeightBonus),
    echoChance: number(template.echoChance),
    mutationMaterialDoubleChance: number(template.mutationMaterialDoubleChance),
    thornVitMultiplier: number(template.thornVitMultiplier),
  };
  item.instanceId = item.id;
  runtime.addBaseRanges?.(item, template, safeTier, safeLevel, itemTier, slotGrowth);
  runtime.applyRandomAffixes?.(item, safeTier, safeLevel, itemTier);
  runtime.applyAbyssEquipmentBonus?.(item);
  runtime.applyRarityPerk?.(item, safeTier, template);
  return item;
}

export function normalizeItem(item = {}, runtime = runtimeContext) {
  item = item && typeof item === 'object' ? item : {};
  const fallbackPower = number(item.power);
  const abyssForged = Boolean(item.abyssForged || item.sourceDifficulty === 'abyss' || item.prefix === '\u6df1\u6e0a');
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
    luck: item.luck ?? 0,
    str: item.str ?? 0,
    agi: item.agi ?? 0,
    vit: item.vit ?? 0,
    int: item.int ?? 0,
    dex: item.dex ?? 0,
    luk: item.luk ?? 0,
    gold: item.gold ?? 0,
    crit: item.crit ?? 0,
    drop: item.drop ?? 0,
    hpRegen: item.hpRegen ?? 0,
    dodgeRate: item.dodgeRate ?? 0,
    atkPct: item.atkPct ?? 0,
    matkPct: item.matkPct ?? 0,
    hpPct: item.hpPct ?? 0,
    defPct: item.defPct ?? 0,
    attackSpeedPct: item.attackSpeedPct ?? 0,
    critRatePct: item.critRatePct ?? 0,
    critDamageBonus: item.critDamageBonus ?? 0,
    skillDamageBonus: item.skillDamageBonus ?? 0,
    monsterDamageBonus: item.monsterDamageBonus ?? 0,
    bossDamageBonus: item.bossDamageBonus ?? 0,
    finalDamageBonus: item.finalDamageBonus ?? 0,
    eliteDamageBonus: item.eliteDamageBonus ?? 0,
    rareDropBonus: item.rareDropBonus ?? 0,
    damageReductionPct: item.damageReductionPct ?? 0,
    dodgeRatePct: item.dodgeRatePct ?? 0,
    hpRegenPct: item.hpRegenPct ?? 0,
    ignoreDefense: item.ignoreDefense ?? 0,
    baseExpBonus: item.baseExpBonus ?? 0,
    jobExpBonus: item.jobExpBonus ?? 0,
    equipmentDrop: item.equipmentDrop ?? 0,
    cardDrop: item.cardDrop ?? 0,
    materialQuantityBonus: item.materialQuantityBonus ?? 0,
    powerPct: item.powerPct ?? 0,
    combatPaceBonus: item.combatPaceBonus ?? 0,
    patrolEfficiency: item.patrolEfficiency ?? 0,
    hitRate: item.hitRate ?? 0,
    statusResist: item.statusResist ?? 0,
    echoChance: item.echoChance ?? 0,
    mutationMaterialDoubleChance: item.mutationMaterialDoubleChance ?? 0,
    thornVitMultiplier: item.thornVitMultiplier ?? 0,
    enhanceLevel: item.enhanceLevel || 0,
    specialPassives: Array.isArray(item.specialPassives) ? item.specialPassives : [],
    rarityPerk: item.rarityPerk || null,
  };
  runtime.applyAbyssEquipmentBonus?.(normalized);
  runtime.applyAbyssSetItemBonus?.(normalized);
  return normalized;
}

export function equipmentSlot(item, runtime = runtimeContext) {
  return runtime.normalizeEquipmentSlot?.(item?.equipSlot || item?.slot) || item?.slot || 'trinket';
}
