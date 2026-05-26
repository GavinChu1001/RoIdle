var SAVE_KEY = "rune-frontier-idle-save-v2";
var LEGACY_SAVE_KEY = "rune-frontier-idle-save-v1";
var AUTH_KEY = "rune-frontier-auth-v1";
var API_BASE = "";
var MAX_OFFLINE_SECONDS = 12 * 60 * 60;
var COMBAT_PACE = 0.4;
var HP_REGEN_INTERVAL = 5;
var MONSTER_ATTACK_INTERVAL = 1.35;
var OFFLINE_EFFICIENCY = 0.65;
var OFFLINE_MAX_KILLS = 1200;
var INVENTORY_LIMIT = 48;
var EQUIPMENT_DROP_RATE_MULTIPLIER = 0.065;
var OFFLINE_EQUIPMENT_DROP_RATE_MULTIPLIER = 0.035;
var BOSS_EQUIPMENT_DROP_RATE_MULTIPLIER = 2.8;
var MAX_EQUIPMENT_DROPS_PER_KILL = 1;
var MAX_BOSS_EQUIPMENT_DROPS = 2;
var EQUIPMENT_PITY_THRESHOLDS = {
  grass: { normal: 60, hard: 45, abyss: 35 },
  forest: { normal: 60, hard: 45, abyss: 35 },
  sewer: { normal: 50, hard: 38, abyss: 30 },
  desert: { normal: 50, hard: 38, abyss: 30 },
  orc_village: { normal: 50, hard: 38, abyss: 30 },
  mine: { normal: 40, hard: 30, abyss: 25 },
  clock: { normal: 40, hard: 30, abyss: 25 },
  glast_heim: { normal: 40, hard: 30, abyss: 25 },
  abyss_lake: { normal: 40, hard: 30, abyss: 25 },
  sky: { normal: 40, hard: 30, abyss: 25 },
};
var BASE_EXP_GLOBAL_MULTIPLIER = 1;
var JOB_EXP_GLOBAL_MULTIPLIER = 1;
var BOSS_EXP_MULTIPLIER = 1;
var DIFFICULTY_CONFIG = {
  normal: { label: "普通", power: 1, hp: 1, attack: 1, defense: 1, exp: 1, jobExp: 1, gold: 1, equipmentDrop: 1, materialDrop: 1, cardDrop: 1, mutationChance: 0.05 },
  hard: { label: "困难", power: 2.65, hp: 2.35, attack: 2.05, defense: 1.85, exp: 1.9, jobExp: 1.9, gold: 1.8, equipmentDrop: 1.45, materialDrop: 1.45, cardDrop: 1.25, mutationChance: 0.12 },
  abyss: { label: "深渊", power: 5.4, hp: 6.2, attack: 4.9, defense: 3.7, exp: 3.4, jobExp: 3.4, gold: 2.9, equipmentDrop: 2.1, materialDrop: 2.05, cardDrop: 1.65, mutationChance: 0.2, mythicDrop: 1 },
};

var MAX_EQUIPMENT_LEVEL = 220;
var DIFFICULTY_DROP_LEVEL_BONUS = {
  normal: { min: 0, max: 0 },
  hard: { min: 20, max: 35 },
  abyss: { min: 45, max: 70 },
};

var DIFFICULTY_TIER_MODIFIERS = {
  normal: { hp: 1, atk: 1, def: 1, hit: 1, critChance: 1, critDamage: 1, damageReduction: 0 },
  hard: { hp: 2.35, atk: 2.05, def: 1.85, hit: 1.25, critChance: 1.8, critDamage: 1.35, damageReduction: 0.08, elitePower: 1.3, bossPower: 1.35 },
  abyss: { hp: 6.2, atk: 4.9, def: 3.7, hit: 1.45, critChance: 2.5, critDamage: 1.7, damageReduction: 0.15, armorPierce: 0.18, abyssPower: 1, antiLifeSteal: 0.18, abyssSuppression: 0.05 },
};
var MONSTER_DIFFICULTY_MODIFIERS = {
  normal: { hp: 1, atk: 1, def: 1, hit: 1, critChance: 0.02, critDamage: 1.5 },
  elite: { hp: 1.6, atk: 1.35, def: 1.12, hit: 1.12, critChance: 0.08, critDamage: 1.75 },
  boss: { hp: 2.0, atk: 1.55, def: 1.25, hit: 1.2, critChance: 0.1, critDamage: 1.9 },
  hard: { hp: 1.12, atk: 1.08, def: 1.06, hit: 1.16, critChance: 0.08, critDamage: 1.78, damageReduction: 0.04 },
  hardElite: { hp: 1.65, atk: 1.35, def: 1.18, hit: 1.28, critChance: 0.14, critDamage: 2.05, damageReduction: 0.06 },
  hardBoss: { hp: 2.45, atk: 1.68, def: 1.35, hit: 1.38, critChance: 0.18, critDamage: 2.2, damageReduction: 0.09, armorPierce: 0.08 },
  abyss: { hp: 1.35, atk: 1.38, def: 1.18, hit: 1.38, critChance: 0.16, critDamage: 2.35, armorPierce: 0.2, executeDamage: 0.12, abyssPower: 1.15, damageReduction: 0.08, antiLifeSteal: 0.12, abyssSuppression: 0.04 },
  abyssElite: { hp: 2.15, atk: 1.8, def: 1.42, hit: 1.55, critChance: 0.24, critDamage: 2.65, armorPierce: 0.32, executeDamage: 0.18, abyssPower: 1.65, damageReduction: 0.12, antiLifeSteal: 0.18, abyssSuppression: 0.06 },
  abyssBoss: { hp: 3.4, atk: 2.25, def: 1.72, hit: 1.7, critChance: 0.3, critDamage: 2.9, armorPierce: 0.45, executeDamage: 0.28, abyssPower: 2.35, damageReduction: 0.18, antiLifeSteal: 0.24, abyssSuppression: 0.08 },
};
var MUTATION_TYPES = [
  { id: "strong", prefix: "强壮的", hp: 1.5, attack: 1.25, defense: 1.15, exp: 1.3, jobExp: 1.3, gold: 1.2, extraDropBonus: 0.15, rareMaterialBonus: 1, highRarityEquipmentBonus: 1 },
  { id: "rage", prefix: "狂暴的", hp: 1.3, attack: 1.6, defense: 1, exp: 1.4, jobExp: 1.4, gold: 1.25, extraDropBonus: 0.18, rareMaterialBonus: 1, highRarityEquipmentBonus: 1.1 },
  { id: "elite", prefix: "精英", hp: 2, attack: 1.5, defense: 1.35, exp: 1.8, jobExp: 1.8, gold: 1.5, extraDropBonus: 0.25, rareMaterialBonus: 1.2, highRarityEquipmentBonus: 1.7 },
  { id: "treasure", prefix: "宝藏", hp: 1.2, attack: 1.1, defense: 1, exp: 1.2, jobExp: 1.2, gold: 2, extraDropBonus: 0.35, rareMaterialBonus: 1.8, highRarityEquipmentBonus: 1 },
];
var MUTATION_EXTRA_DROPS = {
  materialBonusRate: 0.08,
  rareMaterialBonusRate: 0.03,
  highRarityEquipmentRate: 0.01,
  darkGoldEquipmentRate: 0.001,
};
var AWAKEN_CARD_COST = 100;
var MAP_POOL_VERSION = 10;
var VIP_MAX_LEVEL = 20;
var VIP_EXP_REQUIREMENTS = [0, 100, 300, 700, 1500, 3000, 6000, 10000, 16000, 24000, 36000, 52000, 72000, 98000, 130000, 170000, 220000, 285000, 360000, 450000, 560000];
var VIP_BONUS_PER_LEVEL = { gold: 0.06, itemDrop: 0.025, equipmentDrop: 0.02 };
var VIP_MILESTONE_BONUSES = {
  3: { offlineHoursBonus: 1, label: "离线收益上限 +1小时" },
  5: { inventoryLimitBonus: 10, label: "装备背包上限 +10" },
  7: { offlineEfficiencyBonus: 0.05, label: "离线收益效率 +5%" },
  10: { rareLootBroadcast: true, label: "稀有掉落强化播报" },
  12: { offlineEquipPenaltyReduction: 0.1, label: "离线装备掉率衰减降低" },
  15: { abyssMaterialDropBonus: 0.05, label: "深渊材料掉率 +5%" },
  18: { rareQualityWeightBonus: 0.02, label: "稀有装备品质权重 +2%" },
  20: { mythicEssenceDropBonus: 0.03, label: "神话精粹掉率 +3%" },
};

var VIP_DAILY_GIFT = {
  0: { materials: { dust: 5 } },
  5: { materials: { ore: 5, crystal: 2 } },
  10: { materials: { ancientCore: 1, darkGoldFragment: 1 } },
  15: { materials: { starShard: 1, darkGoldFragment: 2 } },
  20: { materials: { darkGoldFragment: 3 } },
};

var DAILY_QUEST_COUNT = 3;
var AUTO_BOSS_FAIL_COOLDOWN_MS = 60 * 1000;
var ZODIAC_SET_DROP_RATES = {
  normal: 0.00055,
  hard: 0.001,
  mutation: 0.0015,
  hardMutation: 0.0022,
  boss: 0.0065,
  hardBoss: 0.011,
  darkGoldNormal: 0.00007,
  darkGoldBoss: 0.0006,
};
var MYTHIC_DROP_RATES = {
  abyssNormal: 0.00008,
  abyssMutation: 0.00018,
  abyssBoss: 0.0009,
};
var DARK_GOLD_UPGRADE_RATES = {
  normal: { glast_heim: 0.00008, abyss_lake: 0.00014, sky: 0.00022 },
  hard: { glast_heim: 0.0012, abyss_lake: 0.0022, sky: 0.0035 },
  abyss: { glast_heim: 0.0045, abyss_lake: 0.0075, sky: 0.011 },
  bossMultiplier: { normal: 8, hard: 18, abyss: 45 },
};
var DARK_GOLD_FRAGMENT_DROPS = {
  normal: { minMapIndex: 6, rate: 0.2, qty: [1, 1] },
  hard: { minMapIndex: 0, rate: 0.5, qty: [1, 2] },
  abyss: { minMapIndex: 0, rate: 1, qty: [1, 3] },
};
var DARK_GOLD_EXCHANGE_COSTS = {
  random: 100,
  slot: 160,
  map: 240,
};
var ABYSS_EQUIPMENT_BONUS = {
  statMultiplier: 1.8,
  randomStatMultiplier: 1.9,
  extra: {
    abyssDamageBonus: 0.22,
    abyssDamageReduction: 0.1,
    monsterDamageBonus: 0.12,
    bossDamageBonus: 0.08,
    finalDamageBonus: 0.06,
    eliteDamageBonus: 0.08,
    rareDropBonus: 0.08,
    baseExpBonus: 0.08,
    jobExpBonus: 0.08,
  },
};
var ABYSS_BASELINE = {
  minLevel: 150,
  hp: 1500000,
  attack: 3000,
  defense: 2200,
  baseExp: 6800,
  jobExp: 5900,
  gold: 4200,
};
var HARD_BASELINE = {
  minLevel: 120,
  hp: 420000,
  attack: 900,
  defense: 650,
  baseExp: 2600,
  jobExp: 2200,
  gold: 1700,
};
var HARD_MAP_TIER_SCALE = {
  grass: { hp: 1, attack: 1, defense: 1, exp: 1, gold: 1, recommendedPower: 130000 },
  forest: { hp: 1.12, attack: 1.1, defense: 1.1, exp: 1.08, gold: 1.08, recommendedPower: 145000 },
  sewer: { hp: 1.26, attack: 1.22, defense: 1.2, exp: 1.16, gold: 1.16, recommendedPower: 160000 },
  desert: { hp: 1.42, attack: 1.36, defense: 1.32, exp: 1.26, gold: 1.26, recommendedPower: 178000 },
  orc_village: { hp: 1.62, attack: 1.54, defense: 1.48, exp: 1.38, gold: 1.38, recommendedPower: 198000 },
  mine: { hp: 1.86, attack: 1.74, defense: 1.65, exp: 1.52, gold: 1.52, recommendedPower: 220000 },
  clock: { hp: 2.15, attack: 1.98, defense: 1.86, exp: 1.68, gold: 1.68, recommendedPower: 244000 },
  glast_heim: { hp: 2.48, attack: 2.25, defense: 2.1, exp: 1.86, gold: 1.86, recommendedPower: 270000 },
  abyss_lake: { hp: 2.86, attack: 2.55, defense: 2.36, exp: 2.06, gold: 2.06, recommendedPower: 300000 },
  sky: { hp: 3.3, attack: 2.9, defense: 2.65, exp: 2.3, gold: 2.3, recommendedPower: 335000 },
};
var ABYSS_MAP_TIER_SCALE = {
  grass: { hp: 1.25, attack: 1.2, defense: 1.2, exp: 1, gold: 1, recommendedPower: 350000 },
  forest: { hp: 1.65, attack: 1.55, defense: 1.5, exp: 1.15, gold: 1.15, recommendedPower: 480000 },
  sewer: { hp: 2.25, attack: 2.05, defense: 1.95, exp: 1.35, gold: 1.35, recommendedPower: 660000 },
  desert: { hp: 3.05, attack: 2.7, defense: 2.45, exp: 1.6, gold: 1.6, recommendedPower: 900000 },
  orc_village: { hp: 4.1, attack: 3.5, defense: 3.1, exp: 1.9, gold: 1.9, recommendedPower: 1250000 },
  mine: { hp: 5.45, attack: 4.45, defense: 3.9, exp: 2.25, gold: 2.25, recommendedPower: 1700000 },
  clock: { hp: 7.2, attack: 5.75, defense: 5, exp: 2.7, gold: 2.7, recommendedPower: 2300000 },
  glast_heim: { hp: 9.4, attack: 7.35, defense: 6.4, exp: 3.25, gold: 3.25, recommendedPower: 3100000 },
  abyss_lake: { hp: 12.2, attack: 9.4, defense: 8.1, exp: 3.9, gold: 3.9, recommendedPower: 4100000 },
  sky: { hp: 16, attack: 12.5, defense: 10.5, exp: 4.8, gold: 4.8, recommendedPower: 5400000 },
};
var ABYSS_BOSS_EXTRA_MULTIPLIER = {
  hp: 2.8,
  attack: 1.8,
  defense: 1.6,
  exp: 2.2,
  jobExp: 2.2,
  gold: 2,
  equipmentDrop: 1.5,
  mythicDrop: 2,
  abyssSetDrop: 1.8,
};
var ABYSS_SET_ITEM_BONUS = {
  statMultiplier: 1.18,
  randomStatMultiplier: 1.2,
  extra: {
    abyssDamageBonus: 0.06,
    abyssDamageReduction: 0.03,
    setPowerBonus: 0.05,
  },
};
var ABYSS_SET_STAGES = {
  2: { abyssDamageBonus: 0.05, abyssDamageReduction: 0.03 },
  3: { abyssDamageBonus: 0.08, abyssBossDamageBonus: 0.05 },
  5: { abyssDamageBonus: 0.15, abyssDamageReduction: 0.08, mythicWeightBonus: 0.02 },
};
var ABYSS_AFFIX_POOL = [
  { id: "abyss_slayer", name: "深渊破敌", desc: "对深渊怪物伤害 +8%", effects: { abyssDamageBonus: 0.08 } },
  { id: "abyss_guard", name: "深渊守护", desc: "受到深渊怪物伤害 -5%", effects: { abyssDamageReduction: 0.05 } },
  { id: "abyss_boss_hunter", name: "深渊猎首", desc: "对深渊 Boss 伤害 +10%", effects: { abyssBossDamageBonus: 0.1 } },
  { id: "abyss_looter", name: "深渊掠夺", desc: "深渊难度下材料掉率 +8%", effects: { abyssMaterialDropBonus: 0.08 } },
  { id: "abyss_revelation", name: "深渊启示", desc: "神话装备品质权重小幅提高", effects: { mythicWeightBonus: 0.01 } },
  { id: "abyss_echo", name: "深渊回响", desc: "深渊难度下主动技能伤害 +8%", effects: { abyssSkillDamageBonus: 0.08 } },
  { id: "abyss_essence", name: "神话精华", desc: "深渊难度下神话精粹掉率 +6%", effects: { mythicEssenceDropBonus: 0.06 } },
  { id: "abyss_prestige", name: "轮回共鸣", desc: "转生声望品质权重 +6%", effects: { rebirthPrestigeWeightBonus: 0.06 } },
  { id: "abyss_execute", name: "深渊斩杀", desc: "深渊怪物生命低于 20% 时伤害 +10%", effects: { abyssExecuteDamageBonus: 0.1 } },
  { id: "abyss_shield", name: "护盾转化", desc: "深渊减伤 +4%，生命 +4%", effects: { abyssDamageReduction: 0.04, hpPct: 0.04 } },
  { id: "abyss_final", name: "终末锋芒", desc: "最终伤害 +8%", effects: { finalDamageBonus: 0.08 } },
  { id: "abyss_elite_hunter", name: "首领猎杀", desc: "对精英/首领伤害 +12%", effects: { eliteDamageBonus: 0.12 } },
  { id: "abyss_rare_finder", name: "稀有嗅觉", desc: "稀有装备品质权重 +10%", effects: { rareDropBonus: 0.1 } },
];
var ABYSS_ZODIAC_SET_EFFECTS = {
  aries_mu: { abyssDamageBonus: 0.15, abyssBossDamageBonus: 0.08 },
  taurus_aldbaran: { abyssGoldPct: 0.8, abyssBaseExpPct: 0.3, abyssJobExpPct: 0.3 },
  gemini_saga: { abyssSkillDamageBonus: 0.12, abyssSkillChanceBonus: 0.05 },
  cancer_deathmask: { abyssMaterialDropBonus: 0.2, abyssDefenseReduction: 0.05 },
  leo_aiolia: { abyssAttackSpeedPct: 0.08, abyssCritRatePct: 0.05 },
  virgo_shaka: { abyssMagicDamageBonus: 0.15, abyssDamageReduction: 0.05 },
  libra_dohko: { abyssAttrPct: 0.08, abyssPowerPct: 0.08 },
  scorpio_milo: { abyssCritDamageBonus: 0.18, abyssEliteDamageBonus: 0.12 },
  sagittarius_aiolos: { abyssBossDamageBonus: 0.15, abyssDexPct: 0.08 },
  capricorn_shura: { abyssIgnoreDefense: 0.08, abyssSkillDamageBonus: 0.1 },
  aquarius_camue: { abyssMagicDamageBonus: 0.15, abyssBossDamageReduction: 0.05 },
  pisces_aphrodite: { abyssCardDropBonus: 0.2, abyssItemDropBonus: 0.12 },
};
var MAP_EXPLORATION_REQUIREMENTS = [0, 100, 300, 800, 1500, 3000, 6000, 10000, 16000, 24000, 36000];
var ACHIEVEMENT_DB = [
  { id: "totalKills_100", category: "战斗", title: "初露锋芒", description: "累计击杀 100 只魔物", target: 100, reward: { gold: 3000, vipExp: 10 } },
  { id: "totalKills_1000", category: "战斗", title: "魔物清扫者", description: "累计击杀 1000 只魔物", target: 1000, reward: { gold: 20000, vipExp: 30, titleId: "monster_cleaner" } },
  { id: "bossKills_10", category: "Boss", title: "首领猎人", description: "击败 10 个 Boss", target: 10, reward: { vipExp: 40, titleId: "boss_hunter" } },
  { id: "abyssBoss_1", category: "深渊", title: "深渊踏破者", description: "击败 1 个深渊 Boss", target: 1, reward: { materials: { mythicEssence: 1 }, titleId: "abyss_breaker" } },
  { id: "legendItem_1", category: "装备", title: "传说入手", description: "获得 1 件传说装备", target: 1, reward: { vipExp: 20 } },
  { id: "darkGoldItem_1", category: "装备", title: "暗金见证", description: "获得 1 件暗金装备", target: 1, reward: { materials: { starShard: 1 } } },
  { id: "mythicItem_1", category: "装备", title: "神话见证者", description: "获得 1 件神话装备", target: 1, reward: { materials: { mythicEssence: 2 }, titleId: "mythic_witness" } },
  { id: "refine10_1", category: "星炼", title: "锻造新星", description: "任意装备星炼 +10", target: 1, reward: { vipExp: 35, titleId: "forge_star" } },
  { id: "zodiacSet_1", category: "星座", title: "星座收藏家", description: "收藏 1 套星座套装", target: 1, reward: { vipExp: 50, titleId: "zodiac_collector" } },
  { id: "exploreLv5_1", category: "探索", title: "地图熟客", description: "任意地图探索 Lv.5", target: 1, reward: { vipExp: 30 } },
  { id: "tasks_10", category: "任务", title: "可靠委托人", description: "完成 10 个任务", target: 10, reward: { vipExp: 30 } },
];
var TITLE_DB = {
  monster_cleaner: { id: "monster_cleaner", name: "魔物清扫者", source: "击杀 1000 只怪物", rarity: "rare", effects: { goldBonus: 0.01 } },
  boss_hunter: { id: "boss_hunter", name: "首领猎人", source: "击败 10 个 Boss", rarity: "epic", effects: { bossDamageBonus: 0.02 } },
  zodiac_collector: { id: "zodiac_collector", name: "星座收藏家", source: "收藏 1 套星座套装", rarity: "legend", effects: { drop: 0.01 } },
  abyss_breaker: { id: "abyss_breaker", name: "深渊踏破者", source: "击败 1 个深渊 Boss", rarity: "darkGold", effects: { abyssDamageBonus: 0.03 } },
  mythic_witness: { id: "mythic_witness", name: "神话见证者", source: "获得 1 件神话装备", rarity: "mythic", effects: { powerPct: 0.01 } },
  forge_star: { id: "forge_star", name: "锻造新星", source: "任意装备星炼 +10", rarity: "epic", effects: { powerPct: 0.01 } },
};
var ACTIVE_SKILL_SPECIALIZATIONS = {
  power: { id: "power", name: "猛攻", description: "该技能伤害 +20%" },
  boss_damage: { id: "boss_damage", name: "首领杀手", description: "该技能对 Boss 伤害 +25%" },
  frequency: { id: "frequency", name: "迅捷", description: "触发率 +20%，伤害 -8%" },
  pierce: { id: "pierce", name: "破甲", description: "该技能无视怪物防御 +10%" },
};
var PASSIVE_SKILL_SPECIALIZATIONS = {
  enhance: { id: "enhance", name: "强化", description: "该被动效果 +15%" },
  utility: { id: "utility", name: "收益", description: "收益类被动额外 +10%" },
  survival: { id: "survival", name: "生存", description: "生存类被动额外 +10%" },
  combat: { id: "combat", name: "战斗", description: "战斗类被动额外 +10%" },
};
var ZODIAC_CARD_BY_SET = {
  aries_mu: "aries_card",
  taurus_aldbaran: "taurus_card",
  gemini_saga: "gemini_card",
  cancer_deathmask: "cancer_card",
  leo_aiolia: "leo_card",
  virgo_shaka: "virgo_card",
  libra_dohko: "libra_card",
  scorpio_milo: "scorpio_card",
  sagittarius_aiolos: "sagittarius_card",
  capricorn_shura: "capricorn_card",
  aquarius_camyu: "aquarius_card",
  pisces_aphrodite: "pisces_card",
};

var ENHANCE_MAX_LEVEL = 15;
var ENHANCE_BREAK_LEVEL = 999;
var ENHANCE_CHANCES = [1, 0.95, 0.9, 0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.28, 0.22, 0.18, 0.14, 0.1, 0.07];
var ENHANCE_PASSIVE_CHANCES = [0, 0, 0, 0, 0.06, 0.08, 0.12, 0.18, 0.26, 0.36, 0.45, 0.52, 0.58, 0.64, 0.72];
var ENHANCE_MILESTONE_LEVELS = [7, 10, 15];
var ENHANCE_MILESTONE_BONUSES = {
  weapon: [
    { monsterDamageBonus: 0.02 },
    { skillDamageBonus: 0.03 },
    { finalDamageBonus: 0.05 },
  ],
  armor: [
    { hpPct: 0.02 },
    { damageReductionPct: 0.02 },
    { hpPct: 0.05 },
  ],
  shoes: [
    { dodgeRatePct: 0.01 },
    { attackSpeedPct: 0.01 },
    { hpRegenPct: 0.05 },
  ],
  headgear: [
    { allStats: 1 },
    { skillDamageBonus: 0.01 },
    { allStats: 2 },
  ],
  trinket: [
    { critDamageBonus: 0.02 },
    { rareDropBonus: 0.01 },
    { finalDamageBonus: 0.02 },
  ],
};
var ENHANCE_PASSIVE_POOL = ["bloodRage", "ironWall", "criticalFury", "lifeStealBoost", "abyssAdaptation", "treasureInstinct", "bossHunter"];
var ENHANCE_PASSIVE_DB = {
  bloodRage: { id: "bloodRage", name: "血怒", desc: "生命低于 35% 时，攻击提高 12%。", effect: { lowHpAtkPct: 0.12 } },
  ironWall: { id: "ironWall", name: "铁壁", desc: "受到伤害降低 5%。", effect: { damageReductionPct: 0.05 } },
  criticalFury: { id: "criticalFury", name: "狂击", desc: "暴击伤害提高 15%。", effect: { critDamageBonus: 0.15 } },
  lifeStealBoost: { id: "lifeStealBoost", name: "吸血强化", desc: "攻击伤害 3% 转化为生命。", effect: { lifeStealPct: 0.03 } },
  abyssAdaptation: { id: "abyssAdaptation", name: "深渊适应", desc: "深渊减伤 +5%。", effect: { abyssDamageReduction: 0.05 } },
  treasureInstinct: { id: "treasureInstinct", name: "寻宝直觉", desc: "稀有掉率 +1%。", effect: { rareDropBonus: 0.01 } },
  bossHunter: { id: "bossHunter", name: "首领猎手", desc: "Boss 伤害 +6%。", effect: { bossDamageBonus: 0.06 } },
};

var CODEX_KILL_MILESTONES = [1, 100, 1000, 5000, 10000];
var CODEX_MILESTONE_LABELS = ["首杀登记", "熟练 Lv.1", "熟练 Lv.2", "熟练 Lv.3", "大师熟练"];
var CODEX_KILL_REWARDS = {
  normal: [
    { items: { gold: 1000 }, stats: {} },
    { items: { materials: { ore: 10 } }, stats: { cardDamage: 0.005 } },
    { items: { materials: { oridecon: 1, elunium: 1 } }, stats: { goldBonus: 0.0005 } },
    { items: { materials: { oridecon: 2, elunium: 2, crystal: 5 } }, stats: { materialDropBonus: 0.005 } },
    { items: { materials: { ancientCore: 1, starShard: 1 } }, stats: { dropBonus: 0.0005 } },
  ],
  elite: [
    { items: { gold: 2000 }, stats: {} },
    { items: { materials: { ore: 15 } }, stats: { hpBonus: 0.0005 } },
    { items: { materials: { oridecon: 1, elunium: 1 } }, stats: { defBonus: 0.0005 } },
    { items: { materials: { oridecon: 3, elunium: 3, crystal: 8 } }, stats: { eliteDamageBonus: 0.005 } },
    { items: { materials: { ancientCore: 1, starShard: 1 } }, stats: { critRateBonus: 0.0005 } },
  ],
  boss: [
    { items: { gold: 5000, materials: { bossSoul: 1 } }, stats: {} },
    { items: { materials: { ore: 20 } }, stats: { bossDamage: 0.002 } },
    { items: { materials: { oridecon: 2, elunium: 2 } }, stats: { bossDamageReduction: 0.001 } },
    { items: { materials: { ancientCore: 2, starShard: 1 } }, stats: { bossEquipDropBonus: 0.001 } },
    { items: { materials: { mythicEssence: 1 } }, stats: { bossQualityWeight: 0.0005 } },
  ],
  abyss: [
    { items: { materials: { abyssShard: 5 } }, stats: {} },
    { items: { materials: { abyssShard: 20 } }, stats: { abyssDamage: 0.002 } },
    { items: { materials: { abyssCore: 1 } }, stats: { abyssDamageReduction: 0.001 } },
    { items: { materials: { abyssCore: 2, oridecon: 2, elunium: 2 } }, stats: { abyssMaterialDropBonus: 0.001 } },
    { items: { materials: { mythicEssence: 1 } }, stats: { mythicQualityWeight: 0.0003 } },
  ],
};
CODEX_KILL_REWARDS.abyssBoss = CODEX_KILL_REWARDS.abyss;

var CODEX_STAT_CAPS = {
  goldBonus: 0.10, expBonus: 0.10, dropBonus: 0.05, materialDropBonus: 0.10,
  hpBonus: 0.10, defBonus: 0.10, critRateBonus: 0.03,
  bossDamage: 0.20, bossDamageReduction: 0.10, bossEquipDropBonus: 0.05, bossQualityWeight: 0.05,
  abyssDamage: 0.20, abyssDamageReduction: 0.10, abyssMaterialDropBonus: 0.05, mythicQualityWeight: 0.02,
  cardDamage: 0.05,
  eliteDamageBonus: 0.10,
};

var CODEX_CARD_MILESTONES = [3, 5, 8, 10];
var CODEX_CARD_REWARDS = [
  { gold: 5000 },
  { materials: { ore: 20 } },
  { materials: { oridecon: 1, elunium: 1 } },
  { materials: { starShard: 1, crystal: 10 } },
];

var CODEX_MASTERY_THRESHOLDS = [0, 10, 100, 500, 2000, 10000];
var CODEX_RESEARCH_THRESHOLDS = [0, 1, 10, 50, 100, 300];
var CODEX_CAPS = {
  globalDrop: 0.10, cardDamage: 0.05, bossQualityWeight: 0.05, mythicQualityWeight: 0.02,
  allStats: 0.10, abyssDamage: 0.20, abyssReduction: 0.10, bossDamage: 0.20, hpDef: 0.10,
};

var CODEX_MASTERY_BONUSES = {
  normal: [{ goldBonus: 0.001 }, { expBonus: 0.001 }, { cardDamage: 0.01 }, { materialDropBonus: 0.01 }, { dropBonus: 0.001 }],
  elite: [{ hpBonus: 0.001 }, { defBonus: 0.001 }, { cardDamage: 0.01 }, { materialDropBonus: 0.01 }, { critRateBonus: 0.001 }],
  boss: [{ bossDamage: 0.005 }, { hpBonus: 0.002 }, { bossDamageReduction: 0.003 }, { bossEquipDropBonus: 0.002 }, { bossQualityWeight: 0.001 }],
  abyss: [{ abyssDamage: 0.005 }, { abyssDamageReduction: 0.003 }, { hpBonus: 0.002 }, { abyssMaterialDropBonus: 0.003 }, { mythicQualityWeight: 0.0005 }],
  abyssBoss: [{ abyssDamage: 0.008 }, { abyssDamageReduction: 0.004 }, { hpBonus: 0.003 }, { abyssMaterialDropBonus: 0.004 }, { mythicQualityWeight: 0.0008 }],
};

var CODEX_RESEARCH_BONUSES = {
  normal: [{ str: 1 }, { str: 1 }, { str: 2 }, { allStats: 1 }, { hpPct: 0.001 }],
  boss: [{ bossDamage: 0.001 }, { bossDamage: 0.002 }, { bossDamage: 0.003 }, { bossDamage: 0.01, hpPct: 0.003 }, { bossQualityWeight: 0.0005 }],
  abyss: [{ abyssDamage: 0.001 }, { abyssDamage: 0.002 }, { abyssDamageReduction: 0.002 }, { abyssDamage: 0.01, abyssDamageReduction: 0.005 }, { mythicQualityWeight: 0.0003 }],
};

var SHOP_ITEMS = {
  normal: [
    { id: "dust_pack", name: "研磨粉", desc: "基础星炼材料。", cost: { gold: 2000 }, reward: { materials: { dust: 1 } }, dailyLimit: 100 },
    { id: "ore_pack", name: "精炼矿", desc: "中低级精造材料。", cost: { gold: 8000 }, reward: { materials: { ore: 1 } }, dailyLimit: 50 },
    { id: "crystal_pack", name: "蓝晶碎片", desc: "中级精造、赋能材料。", cost: { gold: 20000 }, reward: { materials: { crystal: 1 } }, dailyLimit: 20 },
    { id: "material_box", name: "低级材料箱", desc: "随机获得研磨粉、精炼矿、蓝晶碎片。", cost: { gold: 80000 }, reward: { materialBox: { dust: [10, 30], ore: [3, 8], crystal: [1, 3] } }, dailyLimit: 5 },
    { id: "boss_ticket", name: "Boss挑战券", desc: "额外挑战当前地图 Boss 一次。", cost: { gold: 250000 }, reward: { bossTicket: 1 }, dailyLimit: 3 },
    { id: "bag_expand", name: "背包扩展券", desc: "装备背包上限 +5，价格递增。", cost: { gold: 1000000 }, reward: { bagExpand: 5 }, totalLimit: 20, priceScale: 1.5 },
  ],
  enhance: [
    { id: "ancient_core_pack", name: "古代核心", desc: "高级精造材料。", cost: { gold: 150000, crystal: 3 }, reward: { materials: { ancientCore: 1 } }, dailyLimit: 10 },
    { id: "star_shard_pack", name: "星界碎片", desc: "顶级精造、套装打造材料。", cost: { gold: 500000, ancientCore: 2 }, reward: { materials: { starShard: 1 } }, dailyLimit: 3 },
    { id: "mythic_essence_pack", name: "神话精粹", desc: "神话装备制作核心。", cost: { gold: 3000000, starShard: 5 }, reward: { materials: { mythicEssence: 1 } }, weeklyLimit: 1 },
    { id: "oridecon_pack", name: "神之金属", desc: "武器强化材料。", cost: { gold: 150000, ore: 5 }, reward: { materials: { oridecon: 1 } }, dailyLimit: 10 },
    { id: "elunium_pack", name: "铝", desc: "防具强化材料。", cost: { gold: 150000, ore: 5 }, reward: { materials: { elunium: 1 } }, dailyLimit: 10 },
    { id: "enhance_low", name: "初级强化礼包", desc: "研磨粉x80、精炼矿x30、神之金属x2、铝x2。", cost: { gold: 500000 }, reward: { materials: { dust: 80, ore: 30, oridecon: 2, elunium: 2 } }, dailyLimit: 1 },
    { id: "enhance_high", name: "高级强化礼包", desc: "蓝晶碎片x20、古代核心x8、神之金属x5、铝x5。", cost: { gold: 2000000 }, reward: { materials: { crystal: 20, ancientCore: 8, oridecon: 5, elunium: 5 } }, weeklyLimit: 2 },
    { id: "protect_scroll", name: "强化保护卷", desc: "+13以上强化失败时消耗1个，防止装备损坏。", cost: { gold: 500000, ancientCore: 2 }, reward: { materials: { enhanceProtect: 1 } }, dailyLimit: 3 },
    { id: "socket_stone_pack", name: "打孔石", desc: "用于稀有/史诗装备开启卡槽。", cost: { gold: 250000, ore: 8 }, reward: { materials: { socketStone: 1 } }, dailyLimit: 10 },
    { id: "advanced_socket_stone_pack", name: "高级打孔石", desc: "用于古代/传说装备开启卡槽。", cost: { gold: 900000, crystal: 8, rune: 2 }, reward: { materials: { advancedSocketStone: 1 } }, dailyLimit: 5 },
    { id: "mythic_socket_stone_pack", name: "神话打孔石", desc: "用于暗金/神话装备开启卡槽。", cost: { gold: 3000000, ancientCore: 4, starShard: 1 }, reward: { materials: { mythicSocketStone: 1 } }, weeklyLimit: 3 },
    { id: "card_remover_pack", name: "卡片拆除器", desc: "拆除已镶嵌卡片并返还卡片。", cost: { gold: 500000, crystal: 5 }, reward: { materials: { cardRemover: 1 } }, dailyLimit: 5 },
  ],
  boss: [
    { id: "boss_ticket_soul", name: "Boss挑战券", desc: "消耗通用首领魂，额外挑战 Boss 一次。", cost: { bossSoul: 1 }, reward: { bossTicket: 1 }, dailyLimit: 3 },
    { id: "boss_equip_box", name: "当前地图Boss装备箱", desc: "史诗60%/古代28%/传说10%/暗金2%，不产神话。", cost: { bossSoul: 3 }, reward: { bossEquipBox: 1 }, dailyLimit: 2 },
    { id: "boss_card_shard", name: "Boss卡片碎片", desc: "100碎片合成1张Boss卡。", cost: { bossSoul: 2 }, reward: { materials: { bossCardShard: 1 } }, dailyLimit: 3 },
    { id: "soul_selector", name: "首领魂自选箱", desc: "自选一种地图首领魂x1。", cost: { bossSoul: 3 }, reward: { soulSelector: 1 }, dailyLimit: 3 },
    { id: "boss_sweep", name: "Boss扫荡券", desc: "快速结算已击败过的 Boss。", cost: { bossSoul: 2, gold: 500000 }, reward: { bossSweep: 1 }, dailyLimit: 2, requireBossCleared: true },
  ],
  abyss: [
    { id: "abyss_shard_pack", name: "深渊残片补给", desc: "深渊残片 x5，补充用非主要来源。", cost: { gold: 800000 }, reward: { materials: { abyssShard: 5 } }, dailyLimit: 3, requireAbyss: true },
    { id: "abyss_core_pack", name: "深渊精华", desc: "深渊精华 +1。", cost: { abyssShard: 25 }, reward: { materials: { abyssCore: 1 } }, dailyLimit: 5, requireAbyss: true },
    { id: "abyss_equip_box", name: "深渊装备箱", desc: "稀有25%/史诗35%/古代25%/传说12%/暗金2.7%/神话0.3%。", cost: { abyssShard: 120, abyssCore: 5 }, reward: { abyssEquipBox: 1 }, dailyLimit: 1, requireAbyss: true },
    { id: "abyss_dmg_stone", name: "深渊伤害词条石", desc: "深渊伤害 +3%~+8%。", cost: { abyssCore: 8 }, reward: {}, weeklyLimit: 3, requireAbyss: true },
    { id: "abyss_def_stone", name: "深渊减伤词条石", desc: "深渊减伤 +2%~+5%。", cost: { abyssCore: 10 }, reward: {}, weeklyLimit: 3, requireAbyss: true },
    { id: "abyss_ticket", name: "深渊挑战券", desc: "深渊挑战次数 +1。", cost: { abyssShard: 30 }, reward: {}, dailyLimit: 3, requireAbyss: true },
  ],
};

