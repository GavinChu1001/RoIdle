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



var salvageRewards = {
  normal: { dust: [1, 2] },
  fine: { dust: [2, 4], ore: [1, 1] },
  rare: { ore: [2, 4], crystal: [1, 1] },
  epic: { crystal: [2, 4], rune: [1, 2] },
  ancient: { rune: [3, 5], ancientCore: [1, 2] },
  legend: { ancientCore: [2, 4], starShard: [1, 2] },
};
var mapOrder = ["grass", "forest", "sewer", "desert", "orc_village", "mine", "clock", "glast_heim", "abyss_lake", "sky"];

var mapLevelRanges = {
  grass: { minLevel: 1, maxLevel: 10, recommendedPower: 80, attackRange: [3, 14] },
  forest: { minLevel: 8, maxLevel: 20, recommendedPower: 240, attackRange: [12, 38] },
  mine: { minLevel: 52, maxLevel: 70, recommendedPower: 3200, attackRange: [110, 240] },
  clock: { minLevel: 68, maxLevel: 88, recommendedPower: 5200, attackRange: [170, 360] },
  sky: { minLevel: 120, maxLevel: 150, recommendedPower: 16500, attackRange: [760, 1450] },
  beginner_field: { minLevel: 1, maxLevel: 10, recommendedPower: 80, attackRange: [3, 12] },
  prontera_south: { minLevel: 8, maxLevel: 20, recommendedPower: 240, attackRange: [10, 28] },
  sewer: { minLevel: 18, maxLevel: 32, recommendedPower: 600, attackRange: [24, 72] },
  desert: { minLevel: 28, maxLevel: 45, recommendedPower: 1100, attackRange: [58, 140] },
  orc_village: { minLevel: 40, maxLevel: 58, recommendedPower: 2100, attackRange: [115, 260] },
  glast_heim_outside: { minLevel: 48, maxLevel: 70, recommendedPower: 3200, attackRange: [90, 160] },
  glast_heim_deep: { minLevel: 68, maxLevel: 90, recommendedPower: 5200, attackRange: [150, 260] },
  glast_heim: { minLevel: 84, maxLevel: 105, recommendedPower: 7800, attackRange: [230, 620] },
  abyss_lake: { minLevel: 100, maxLevel: 125, recommendedPower: 11500, attackRange: [430, 1100] },
  abyss_temple: { minLevel: 88, maxLevel: 120, recommendedPower: 11000, attackRange: [240, 420] },
};

var monsterTemplate = function monsterTemplate(id, name, levelRange, hpRange, attackRange, defenseRange, baseExpRange, jobExpRange, goldRange, type) { return { id: id, name: name, type: type || "normal", levelRange: levelRange, hpRange: hpRange, attackRange: attackRange, defenseRange: defenseRange, baseExpRange: baseExpRange, jobExpRange: jobExpRange, goldRange: goldRange }; };

var maps = [
  {
    id: "grass",
    name: "南门青草地",
    enemy: "果冻波波",
    boss: "青草地首领 · 巨型波波",
    bossSkill: "弹跳重压",
    baseHp: 520,
    gold: 11,
    baseExp: 12,
    jobExp: 10,
    bossMultiplier: 18,
    palette: ["#bfe4d2", "#7dbb87", "#52785a"],
  },
  {
    id: "forest",
    name: "斑光森林",
    enemy: "蘑菇巡游者",
    boss: "森林首领 · 树心看守",
    bossSkill: "藤蔓缠绕",
    baseHp: 2600,
    gold: 35,
    baseExp: 34,
    jobExp: 31,
    bossMultiplier: 22,
    palette: ["#b9ddc4", "#628f69", "#315441"],
  },
  {
    id: "mine",
    name: "蓝晶矿洞",
    enemy: "矿灯蝙蝠",
    boss: "矿洞首领 · 水晶甲虫",
    bossSkill: "晶壳反震",
    baseHp: 11000,
    gold: 96,
    baseExp: 92,
    jobExp: 86,
    bossMultiplier: 26,
    palette: ["#c7d7de", "#6f8fa0", "#456e91"],
  },
  {
    id: "clock",
    name: "旧钟塔回廊",
    enemy: "齿轮侍从",
    boss: "钟塔首领 · 整点守钟人",
    bossSkill: "逆时钟回响",
    baseHp: 46000,
    gold: 260,
    baseExp: 280,
    jobExp: 250,
    bossMultiplier: 30,
    palette: ["#d8ccb9", "#a97958", "#684b40"],
  },
  {
    id: "sky",
    name: "浮岛神殿",
    enemy: "星羽守卫",
    boss: "神殿首领 · 云阶执政官",
    bossSkill: "星辉审判",
    baseHp: 180000,
    gold: 720,
    baseExp: 760,
    jobExp: 690,
    bossMultiplier: 34,
    palette: ["#d7e5ef", "#8fa9c8", "#6a5f9f"],
  },
];

var extraMaps = [
  {
    id: "sewer",
    name: "普隆德拉下水道",
    enemy: "盗虫幼虫",
    boss: "下水道首领 · 黄金盗虫",
    bossSkill: "黄金甲壳",
    baseHp: 5600,
    gold: 86,
    baseExp: 140,
    jobExp: 120,
    bossMultiplier: 24,
    palette: ["#c4d0c8", "#718473", "#3f4d46"],
  },
  {
    id: "desert",
    name: "梦罗克沙漠",
    enemy: "沙漠幼狼",
    boss: "沙漠首领 · 蝎王",
    bossSkill: "毒尾穿刺",
    baseHp: 12500,
    gold: 145,
    baseExp: 210,
    jobExp: 180,
    bossMultiplier: 26,
    palette: ["#ead7a2", "#b98b4a", "#6f4b2b"],
  },
  {
    id: "orc_village",
    name: "兽人村落",
    enemy: "兽人战士",
    boss: "兽人首领 · 兽人英雄",
    bossSkill: "英雄怒吼",
    baseHp: 25000,
    gold: 220,
    baseExp: 330,
    jobExp: 290,
    bossMultiplier: 28,
    palette: ["#c8d2a4", "#768b4c", "#3c4b2e"],
  },
  {
    id: "glast_heim",
    name: "古城废墟",
    enemy: "幽灵剑士",
    boss: "古城首领 · 黑暗领主",
    bossSkill: "黑暗审判",
    baseHp: 185000,
    gold: 620,
    baseExp: 980,
    jobExp: 880,
    bossMultiplier: 32,
    palette: ["#d4ccd1", "#796778", "#3e3445"],
  },
  {
    id: "abyss_lake",
    name: "深渊湖",
    enemy: "蓝龙幼体",
    boss: "深渊首领 · 远古巨龙",
    bossSkill: "龙息洪流",
    baseHp: 420000,
    gold: 980,
    baseExp: 1450,
    jobExp: 1280,
    bossMultiplier: 34,
    palette: ["#bdd9e5", "#527f98", "#263e5f"],
  },
];

var mapMonsterConfig = {
  grass: {
    name: "南门青草地",
    enemy: "果冻波波",
    boss: "青草地首领 · 巨型波波",
    bossSkill: "弹跳重压",
    recommendedPower: 80,
    monsters: [
      monsterTemplate("grass_poring", "果冻波波", [1, 5], [120, 260], [3, 8], [1, 3], [8, 14], [6, 12], [6, 12]),
      monsterTemplate("grass_leaf_bug", "绿叶虫", [3, 8], [180, 360], [5, 11], [2, 4], [10, 18], [8, 14], [8, 14]),
      monsterTemplate("grass_lunatic", "疯兔幼崽", [5, 10], [260, 520], [8, 14], [3, 6], [14, 24], [10, 18], [10, 18], "elite"),
    ],
    bossTemplate: monsterTemplate("grass_boss_poring", "青草地首领 · 巨型波波", [10, 10], [2500, 2500], [22, 22], [8, 8], [140, 140], [110, 110], [90, 90], "boss"),
  },
  forest: {
    name: "斑光森林",
    enemy: "蘑菇巡游者",
    boss: "森林首领 · 树心看守",
    bossSkill: "藤蔓缠绕",
    recommendedPower: 240,
    monsters: [
      monsterTemplate("forest_mushroom", "蘑菇巡游者", [8, 14], [600, 1200], [12, 24], [6, 12], [28, 48], [24, 42], [20, 36]),
      monsterTemplate("forest_wolf", "森林小狼", [12, 18], [850, 1600], [18, 32], [8, 15], [38, 62], [32, 52], [28, 48]),
      monsterTemplate("forest_spore", "毒孢子", [15, 20], [1000, 2100], [22, 38], [10, 18], [48, 78], [40, 68], [36, 58], "elite"),
    ],
    bossTemplate: monsterTemplate("forest_boss_guardian", "森林首领 · 树心看守", [20, 20], [12000, 12000], [55, 55], [28, 28], [520, 520], [430, 430], [260, 260], "boss"),
  },
  sewer: {
    name: "普隆德拉下水道",
    enemy: "盗虫幼虫",
    boss: "下水道首领 · 黄金盗虫",
    bossSkill: "黄金甲壳",
    recommendedPower: 600,
    monsters: [
      monsterTemplate("sewer_bug_larva", "盗虫幼虫", [18, 24], [1800, 3600], [24, 45], [14, 26], [65, 110], [55, 95], [42, 76]),
      monsterTemplate("sewer_black_rat", "黑鼠", [22, 28], [2600, 5200], [34, 58], [18, 32], [85, 145], [70, 125], [55, 92]),
      monsterTemplate("sewer_poison_mushroom", "毒蘑菇", [26, 32], [3600, 6800], [45, 72], [24, 40], [110, 180], [90, 150], [70, 115], "elite"),
    ],
    bossTemplate: monsterTemplate("sewer_boss_golden_bug", "下水道首领 · 黄金盗虫", [32, 32], [42000, 42000], [115, 115], [70, 70], [1500, 1500], [1250, 1250], [620, 620], "boss"),
  },
  desert: {
    name: "梦罗克沙漠",
    enemy: "沙漠幼狼",
    boss: "沙漠首领 · 蝎王",
    bossSkill: "毒尾穿刺",
    recommendedPower: 1100,
    monsters: [
      monsterTemplate("desert_wolf", "沙漠幼狼", [28, 35], [5000, 9000], [58, 90], [32, 50], [150, 235], [125, 205], [95, 145]),
      monsterTemplate("desert_magnolia", "魔锅蛋", [34, 40], [6800, 12500], [72, 115], [42, 65], [190, 300], [160, 260], [120, 180]),
      monsterTemplate("desert_scorpion", "沙漠蝎", [38, 45], [9000, 16000], [90, 140], [55, 82], [240, 380], [205, 320], [150, 230], "elite"),
    ],
    bossTemplate: monsterTemplate("desert_boss_scorpion_king", "沙漠首领 · 蝎王", [45, 45], [88000, 88000], [210, 210], [120, 120], [2600, 2600], [2150, 2150], [1100, 1100], "boss"),
  },
  orc_village: {
    name: "兽人村落",
    enemy: "兽人战士",
    boss: "兽人首领 · 兽人英雄",
    bossSkill: "英雄怒吼",
    recommendedPower: 2100,
    monsters: [
      monsterTemplate("orc_warrior", "兽人战士", [40, 48], [13000, 23000], [115, 175], [75, 115], [300, 470], [250, 410], [180, 270]),
      monsterTemplate("orc_archer", "兽人弓手", [46, 54], [11000, 21000], [135, 205], [65, 100], [340, 540], [290, 470], [210, 320]),
      monsterTemplate("orc_brave", "兽人勇士", [52, 58], [18000, 32000], [170, 260], [100, 155], [430, 680], [360, 590], [260, 390], "elite"),
    ],
    bossTemplate: monsterTemplate("orc_boss_hero", "兽人首领 · 兽人英雄", [58, 58], [180000, 180000], [380, 380], [220, 220], [5200, 5200], [4300, 4300], [2100, 2100], "boss"),
  },
  mine: {
    name: "蓝晶矿洞",
    enemy: "矿灯蝙蝠",
    boss: "矿洞首领 · 水晶甲虫",
    bossSkill: "晶壳反震",
    recommendedPower: 3200,
    monsters: [
      monsterTemplate("mine_bat", "矿灯蝙蝠", [18, 25], [2200, 4200], [30, 55], [16, 28], [80, 135], [70, 118], [58, 92]),
      monsterTemplate("mine_beetle", "蓝晶甲虫", [24, 32], [3600, 7200], [42, 72], [24, 40], [115, 190], [98, 165], [82, 132]),
      monsterTemplate("mine_golem", "矿洞傀儡", [30, 35], [6000, 11000], [60, 95], [38, 60], [155, 250], [132, 215], [110, 170], "elite"),
    ],
    bossTemplate: monsterTemplate("mine_boss_crystal", "矿洞首领 · 水晶甲虫", [35, 35], [55000, 55000], [130, 130], [85, 85], [1800, 1800], [1450, 1450], [760, 760], "boss"),
  },
  clock: {
    name: "旧钟塔回廊",
    enemy: "齿轮侍从",
    boss: "钟塔首领 · 整点守钟人",
    bossSkill: "逆时钟回响",
    recommendedPower: 5200,
    monsters: [
      monsterTemplate("clock_gear", "齿轮侍从", [48, 56], [18000, 32000], [95, 150], [70, 110], [250, 380], [220, 330], [190, 280]),
      monsterTemplate("clock_ghost", "钟摆幽灵", [55, 64], [24000, 44000], [120, 190], [85, 135], [330, 500], [290, 430], [240, 360]),
      monsterTemplate("clock_guard", "逆时针守卫", [62, 70], [36000, 62000], [150, 240], [110, 170], [440, 660], [380, 560], [320, 470], "elite"),
    ],
    bossTemplate: monsterTemplate("clock_boss_keeper", "钟塔首领 · 整点守钟人", [70, 70], [280000, 280000], [360, 360], [260, 260], [6200, 6200], [5200, 5200], [2600, 2600], "boss"),
  },
  glast_heim: {
    name: "古城废墟",
    enemy: "幽灵剑士",
    boss: "古城首领 · 黑暗领主",
    bossSkill: "黑暗审判",
    recommendedPower: 7800,
    monsters: [
      monsterTemplate("glast_ghost_swordman", "幽灵剑士", [84, 92], [70000, 125000], [230, 360], [160, 250], [760, 1140], [680, 1020], [540, 760]),
      monsterTemplate("glast_abyss_knight", "深渊骑士", [92, 100], [95000, 180000], [310, 480], [220, 340], [980, 1480], [860, 1320], [680, 980]),
      monsterTemplate("glast_wraith", "古城恶灵", [100, 105], [120000, 240000], [390, 620], [260, 420], [1250, 1880], [1100, 1650], [820, 1180], "elite"),
    ],
    bossTemplate: monsterTemplate("glast_boss_dark_lord", "古城首领 · 黑暗领主", [105, 105], [950000, 950000], [900, 900], [650, 650], [14500, 14500], [12200, 12200], [6000, 6000], "boss"),
  },
  abyss_lake: {
    name: "深渊湖",
    enemy: "蓝龙幼体",
    boss: "深渊首领 · 远古巨龙",
    bossSkill: "龙息洪流",
    recommendedPower: 11500,
    monsters: [
      monsterTemplate("abyss_blue_dragon", "蓝龙幼体", [100, 110], [150000, 280000], [430, 680], [320, 520], [1150, 1720], [1010, 1520], [820, 1180]),
      monsterTemplate("abyss_dragonkin", "深渊龙人", [108, 118], [210000, 390000], [560, 850], [420, 680], [1450, 2180], [1280, 1920], [1050, 1500]),
      monsterTemplate("abyss_wyvern", "古代飞龙", [116, 125], [300000, 560000], [720, 1100], [560, 860], [1880, 2820], [1650, 2480], [1350, 1900], "elite"),
    ],
    bossTemplate: monsterTemplate("abyss_boss_ancient_dragon", "深渊首领 · 远古巨龙", [125, 125], [2600000, 2600000], [1600, 1600], [1200, 1200], [26000, 26000], [22000, 22000], [11000, 11000], "boss"),
  },
  sky: {
    name: "浮岛神殿",
    enemy: "星羽守卫",
    boss: "神殿首领 · 云阶执政官",
    bossSkill: "星辉审判",
    recommendedPower: 16500,
    monsters: [
      monsterTemplate("sky_guard", "星羽守卫", [88, 98], [90000, 160000], [260, 420], [180, 280], [720, 1080], [640, 960], [620, 860]),
      monsterTemplate("sky_priest", "云阶祭司", [96, 108], [120000, 220000], [340, 560], [230, 360], [920, 1380], [820, 1220], [760, 1080]),
      monsterTemplate("sky_judge", "神殿审判者", [108, 120], [180000, 340000], [480, 760], [320, 520], [1180, 1760], [1050, 1560], [980, 1380], "elite"),
    ],
    bossTemplate: monsterTemplate("sky_boss_archon", "神殿首领 · 云阶执政官", [120, 120], [1600000, 1600000], [1100, 1100], [850, 850], [18000, 18000], [15000, 15000], [7800, 7800], "boss"),
  },
};

var itemPool = [
  { name: "枫木短剑", slot: "weapon", rarity: "normal", atk: 9, matk: 0, def: 0, aspd: 0.01, luck: 0, gold: 0, crit: 0, drop: 0 },
  { name: "学徒法杖", slot: "weapon", rarity: "normal", atk: 2, matk: 12, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0 },
  { name: "猎风弓", slot: "weapon", rarity: "rare", atk: 21, matk: 0, def: 0, aspd: 0.05, luck: 2, gold: 0.03, crit: 0.03, drop: 0 },
  { name: "白银细剑", slot: "weapon", rarity: "rare", atk: 26, matk: 0, def: 1, aspd: 0.03, luck: 1, gold: 0.03, crit: 0.04, drop: 0 },
  { name: "星砂权杖", slot: "weapon", rarity: "epic", atk: 4, matk: 46, def: 0, aspd: 0, luck: 4, gold: 0.08, crit: 0.04, drop: 0.02 },
  { name: "晨辉重剑", slot: "weapon", rarity: "legend", atk: 78, matk: 8, def: 5, aspd: -0.02, luck: 6, gold: 0.12, crit: 0.07, drop: 0.04 },
  { name: "旅人披风", slot: "armor", rarity: "normal", atk: 0, matk: 0, def: 8, aspd: 0, luck: 1, gold: 0.03, crit: 0, drop: 0 },
  { name: "绿纹夹克", slot: "armor", rarity: "rare", atk: 2, matk: 0, def: 18, aspd: 0.02, luck: 2, gold: 0.07, crit: 0, drop: 0.01 },
  { name: "蓝晶护甲", slot: "armor", rarity: "epic", atk: 0, matk: 8, def: 42, aspd: 0, luck: 4, gold: 0.1, crit: 0.01, drop: 0.02 },
  { name: "钟楼礼装", slot: "armor", rarity: "legend", atk: 8, matk: 16, def: 64, aspd: 0.03, luck: 8, gold: 0.16, crit: 0.02, drop: 0.04 },
  { name: "草叶发带", slot: "headgear", rarity: "normal", atk: 1, matk: 1, def: 3, aspd: 0.01, luck: 2, gold: 0.02, crit: 0, drop: 0.01 },
  { name: "蓝晶头冠", slot: "headgear", rarity: "epic", atk: 5, matk: 18, def: 12, aspd: 0.02, luck: 8, gold: 0.08, crit: 0.02, drop: 0.04 },
  { name: "疾行短靴", slot: "shoes", rarity: "rare", atk: 3, matk: 0, def: 8, aspd: 0.07, luck: 1, gold: 0.05, crit: 0.01, drop: 0.01 },
  { name: "星尘长靴", slot: "shoes", rarity: "epic", atk: 7, matk: 7, def: 16, aspd: 0.09, luck: 5, gold: 0.08, crit: 0.02, drop: 0.03 },
  { name: "幸运铃铛", slot: "trinket", rarity: "rare", atk: 0, matk: 0, def: 2, aspd: 0.02, luck: 12, gold: 0.1, crit: 0.02, drop: 0.03 },
  { name: "露恩徽章", slot: "trinket", rarity: "epic", atk: 10, matk: 10, def: 8, aspd: 0.03, luck: 14, gold: 0.16, crit: 0.04, drop: 0.04 },
  { name: "星界罗盘", slot: "trinket", rarity: "legend", atk: 20, matk: 20, def: 16, aspd: 0.05, luck: 22, gold: 0.24, crit: 0.06, drop: 0.07 },
];

var jobTemplates = {
  novice: {
    id: "novice",
    name: "初学者",
    role: "front",
    baseDps: 4.8,
    baseHp: 150,
    baseDef: 3,
    baseAspd: 0.28,
    color: "#7d8b83",
    growth: { atkPct: 0.018, matkPct: 0.018, hpPct: 0.026, defPct: 0.018, aspdPct: 0.003 },
    skills: [
      skill("基础修炼", 1, "被动", "掌握最基本的武器和防具用法。", { atkPct: 0.04, defPct: 0.04 }),
      skill("急救", 3, "被动", "旅途中处理轻伤，提高生存能力。", { hpPct: 0.08 }),
      skill("投掷石头", 5, "主动", "丢出石块造成一次物理伤害。", { active: { stat: "atk", multiplier: 1.25, chance: 0.075 } }),
      skill("装死", 8, "被动", "用夸张的倒地姿势规避危险。", { defPct: 0.1, dropPct: 0.01 }),
    ],
  },
  swordman: {
    id: "swordman",
    name: "剑士",
    role: "front",
    baseDps: 7.6,
    baseHp: 230,
    baseDef: 9,
    baseAspd: 0.38,
    color: "#5d7fba",
    growth: { atkPct: 0.038, matkPct: 0.004, hpPct: 0.052, defPct: 0.045, aspdPct: 0.004 },
    skills: [
      skill("剑术修炼", 1, "被动", "提高近战武器熟练度。", { atkPct: 0.12 }),
      skill("狂击", 3, "主动", "以武器重击目标，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.25, chance: 0.065 } }),
      skill("挑衅", 5, "主动", "激怒敌人露出破绽，造成伤害并提高输出。", { dpsPct: 0.04, active: { stat: "atk", multiplier: 1.45, chance: 0.05 } }),
      skill("快速回复", 8, "被动", "提高生命与防御。", { hpPct: 0.16, defPct: 0.08 }),
      skill("霸体训练", 10, "被动", "减少战斗停顿。", { aspdPct: 0.04 }),
    ],
  },
  mage: {
    id: "mage",
    name: "魔法师",
    role: "mid",
    baseDps: 8.4,
    baseHp: 145,
    baseDef: 3,
    baseAspd: 0.31,
    color: "#8b64a7",
    growth: { atkPct: 0.004, matkPct: 0.056, hpPct: 0.026, defPct: 0.018, aspdPct: 0.003 },
    skills: [
      skill("火箭术", 1, "主动", "凝聚火焰攻击，威力受魔攻影响。", { active: { stat: "matk", multiplier: 2.45, chance: 0.07 } }),
      skill("冰箭术", 3, "主动", "以冰箭贯穿目标，威力受魔攻影响。", { active: { stat: "matk", multiplier: 2.05, chance: 0.055 } }),
      skill("禅心", 5, "被动", "提高魔攻与金币收益。", { matkPct: 0.12, goldPct: 0.04 }),
      skill("火焰之壁", 8, "被动", "用魔力形成防护。", { defPct: 0.08, hpPct: 0.06 }),
      skill("圣灵召唤", 10, "主动", "召唤魔力光弹连续轰击。", { active: { stat: "matk", multiplier: 3.2, chance: 0.028 } }),
    ],
  },
  archer: {
    id: "archer",
    name: "弓箭手",
    role: "back",
    baseDps: 7.2,
    baseHp: 170,
    baseDef: 5,
    baseAspd: 0.42,
    color: "#5e9662",
    growth: { atkPct: 0.044, matkPct: 0.004, hpPct: 0.032, defPct: 0.024, aspdPct: 0.006 },
    skills: [
      skill("苍鹰之眼", 1, "被动", "提高远程精准度与暴击。", { atkPct: 0.08, critPct: 0.02 }),
      skill("二连矢", 3, "主动", "连续射出两箭，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.15, chance: 0.075 } }),
      skill("心神凝聚", 5, "被动", "提高物攻与攻速。", { atkPct: 0.08, aspdPct: 0.04 }),
      skill("箭雨", 8, "主动", "向区域倾泻箭矢。", { active: { stat: "atk", multiplier: 1.8, chance: 0.05 } }),
      skill("精准射击", 10, "被动", "提高暴击与掉宝。", { critPct: 0.025, dropPct: 0.018 }),
    ],
  },
  acolyte: {
    id: "acolyte",
    name: "服事",
    role: "mid",
    baseDps: 6.2,
    baseHp: 185,
    baseDef: 6,
    baseAspd: 0.34,
    color: "#d4a85d",
    growth: { atkPct: 0.012, matkPct: 0.036, hpPct: 0.042, defPct: 0.036, aspdPct: 0.003 },
    skills: [
      skill("天使之赐福", 1, "被动", "祝福自身，提高物攻、魔攻与防御。", { atkPct: 0.05, matkPct: 0.05, defPct: 0.06 }),
      skill("治愈术", 3, "主动", "释放圣光治疗并伤害魔物，威力受魔攻影响。", { hpPct: 0.08, active: { stat: "matk", multiplier: 1.7, chance: 0.06 } }),
      skill("加速术", 5, "被动", "提高行动速度。", { aspdPct: 0.05 }),
      skill("钝器熟练", 8, "被动", "提高物攻与生命。", { atkPct: 0.08, hpPct: 0.08 }),
      skill("神圣之光", 10, "主动", "以神圣光芒攻击敌人。", { active: { stat: "matk", multiplier: 2.7, chance: 0.035 } }),
    ],
  },
  merchant: {
    id: "merchant",
    name: "商人",
    role: "front",
    baseDps: 6.8,
    baseHp: 210,
    baseDef: 7,
    baseAspd: 0.33,
    color: "#ba8750",
    growth: { atkPct: 0.032, matkPct: 0.006, hpPct: 0.042, defPct: 0.032, aspdPct: 0.003 },
    skills: [
      skill("低价买进", 1, "被动", "更会过日子，金币收益提高。", { goldPct: 0.08 }),
      skill("手推车攻击", 3, "主动", "用手推车撞击敌人，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.35, chance: 0.06 } }),
      skill("露天商店", 5, "被动", "提高金币与掉宝收益。", { goldPct: 0.08, dropPct: 0.02 }),
      skill("强化手推车", 8, "被动", "提高物攻与防御。", { atkPct: 0.1, defPct: 0.08 }),
      skill("金钱攻击", 10, "主动", "把金币的气势砸向敌人。", { active: { stat: "atk", multiplier: 3.0, chance: 0.028 } }),
    ],
  },
  thief: {
    id: "thief",
    name: "盗贼",
    role: "back",
    baseDps: 7.4,
    baseHp: 165,
    baseDef: 4,
    baseAspd: 0.46,
    color: "#56637f",
    growth: { atkPct: 0.04, matkPct: 0.004, hpPct: 0.03, defPct: 0.02, aspdPct: 0.007 },
    skills: [
      skill("二刀连击", 1, "主动", "快速追加一次攻击，威力受物攻影响。", { active: { stat: "atk", multiplier: 1.9, chance: 0.09 } }),
      skill("残影", 3, "被动", "提高攻速与防御。", { aspdPct: 0.05, defPct: 0.05 }),
      skill("偷窃", 5, "被动", "提高掉宝概率。", { dropPct: 0.035 }),
      skill("施毒", 8, "主动", "用毒刃造成伤害，威力受物攻影响。", { active: { stat: "atk", multiplier: 2.25, chance: 0.04 } }),
      skill("隐匿突袭", 10, "主动", "从阴影中发动重击。", { critPct: 0.03, active: { stat: "atk", multiplier: 3.1, chance: 0.026 } }),
    ],
  },
};

var firstJobs = ["swordman", "mage", "archer", "acolyte", "merchant", "thief"];

var secondJobMap = {
  swordman: "knight",
  mage: "wizard",
  archer: "hunter",
  acolyte: "priest",
  merchant: "blacksmith",
  thief: "assassin",
};

var advancedSecondJobMap = {
  swordman: "lordKnight",
  mage: "highWizard",
  archer: "sniper",
  acolyte: "highPriest",
  merchant: "whiteSmith",
  thief: "assassinCross",
};

var thirdJobMap = {
  knight: "runeKnight",
  lordKnight: "runeKnight",
  wizard: "warlock",
  highWizard: "warlock",
  hunter: "ranger",
  sniper: "ranger",
  priest: "archbishop",
  highPriest: "archbishop",
  blacksmith: "mechanic",
  whiteSmith: "mechanic",
  assassin: "guillotineCross",
  assassinCross: "guillotineCross",
};

var secondJobTemplates = {
  knight: { id: "knight", name: "骑士", from: "swordman", role: "front", growth: { str: 1.35, agi: 0.9, vit: 1.35, int: 0.35, dex: 0.75, luk: 0.45 }, baseDps: 11.4, baseHp: 340, baseDef: 15, baseAspd: 0.42 },
  wizard: { id: "wizard", name: "巫师", from: "mage", role: "mid", growth: { str: 0.25, agi: 0.45, vit: 0.65, int: 1.65, dex: 1.0, luk: 0.45 }, baseDps: 12.6, baseHp: 210, baseDef: 6, baseAspd: 0.34 },
  hunter: { id: "hunter", name: "猎人", from: "archer", role: "back", growth: { str: 0.65, agi: 1.35, vit: 0.75, int: 0.45, dex: 1.55, luk: 0.85 }, baseDps: 11.2, baseHp: 250, baseDef: 8, baseAspd: 0.48 },
  priest: { id: "priest", name: "牧师", from: "acolyte", role: "mid", growth: { str: 0.45, agi: 0.55, vit: 1.05, int: 1.45, dex: 0.9, luk: 0.7 }, baseDps: 9.6, baseHp: 285, baseDef: 10, baseAspd: 0.38 },
  blacksmith: { id: "blacksmith", name: "铁匠", from: "merchant", role: "front", growth: { str: 1.45, agi: 0.75, vit: 1.2, int: 0.35, dex: 0.9, luk: 0.75 }, baseDps: 10.9, baseHp: 320, baseDef: 13, baseAspd: 0.38 },
  assassin: { id: "assassin", name: "刺客", from: "thief", role: "back", growth: { str: 1.0, agi: 1.6, vit: 0.65, int: 0.25, dex: 0.95, luk: 1.1 }, baseDps: 11.7, baseHp: 245, baseDef: 7, baseAspd: 0.55 },
};


var equipmentDropTables = {
  beginner_field: [
    ["one_hand_sword_long_sword", 0.06, 1, 8],
    ["one_hand_sword_scimitar", 0.04, 1, 10],
    ["one_hand_sword_honor_sword", 0.025, 3, 12],
    ["one_hand_sword_ceremonial_dagger", 0.015, 4, 14],
    ["one_hand_sword_piercing_sword", 0.008, 8, 16],
  ],
  prontera_south: [
    ["one_hand_sword_scimitar", 0.05, 5, 14],
    ["one_hand_sword_honor_sword", 0.035, 6, 16],
    ["one_hand_sword_ceremonial_dagger", 0.022, 8, 18],
    ["one_hand_sword_piercing_sword", 0.015, 10, 20],
    ["one_hand_sword_saber", 0.01, 12, 22],
    ["one_hand_sword_round_hilt_saber", 0.006, 14, 24],
  ],
  sewer: [
    ["one_hand_sword_piercing_sword", 0.02, 16, 26],
    ["one_hand_sword_saber", 0.015, 18, 28],
    ["one_hand_sword_round_hilt_saber", 0.01, 20, 30],
    ["one_hand_sword_p_cavalry_i", 0.007, 22, 30],
    ["one_hand_sword_haedonggum", 0.0025, 24, 30],
  ],
  orc_village: [
    ["one_hand_sword_round_hilt_saber", 0.018, 22, 30],
    ["one_hand_sword_p_cavalry_i", 0.012, 24, 30],
    ["one_hand_sword_haedonggum", 0.006, 25, 30],
    ["one_hand_sword_katana", 0.0045, 26, 30],
    ["one_hand_sword_water_ripple", 0.003, 27, 30],
  ],
  glast_heim_outside: [
    ["one_hand_sword_haedonggum", 0.009, 25, 30],
    ["one_hand_sword_katana", 0.007, 26, 30],
    ["one_hand_sword_water_ripple", 0.005, 27, 30],
    ["one_hand_sword_tremor", 0.0025, 28, 30],
    ["one_hand_sword_boss_sword", 0.0006, 30, 30],
  ],
  glast_heim_deep: [
    ["one_hand_sword_water_ripple", 0.007, 48, 58],
    ["one_hand_sword_tremor", 0.0045, 50, 60],
    ["one_hand_sword_boss_sword", 0.0012, 55, 65],
    ["one_hand_sword_crimson", 0.0009, 55, 65],
    ["one_hand_sword_youjian_shiguang", 0.0006, 58, 65],
  ],
  abyss_temple: [
    ["one_hand_sword_boss_sword", 0.002, 62, 75],
    ["one_hand_sword_crimson", 0.0015, 65, 78],
    ["one_hand_sword_youjian_shiguang", 0.001, 68, 80],
    ["one_hand_sword_false_belief", 0.0008, 70, 82],
  ],
  sky_temple: [
    ["one_hand_sword_boss_sword", 0.0025, 72, 85],
    ["one_hand_sword_crimson", 0.002, 75, 88],
    ["one_hand_sword_youjian_shiguang", 0.0014, 78, 90],
    ["one_hand_sword_false_belief", 0.001, 80, 92],
  ],
};

var equipmentSets = {
  taurus_aldbaran: {
    id: "taurus_aldbaran",
    name: "金牛座-阿鲁迪巴套装",
    talentName: "金牛座的天赋",
    talentDescription: "金币收益 +500%，BASE经验 +100%，JOB经验 +100%，材料数量 +50%",
    effects: {
      full: { monsterGoldPct: 5, baseExpPct: 1, jobExpPct: 1, materialQuantityPct: 0.5 },
      pieces: {},
    },
    items: [
      { id: "taurus_aldbaran_helmet", name: "金牛座-阿鲁迪巴之盔", slot: "headgear", rarity: "legend", level: 30, requiredLevel: 30, atk: 16, matk: 4, def: 48, hp: 220, str: 4, vit: 8, gold: 0.08, materials: { ancientCore: 2, starShard: 1 }, goldCost: 1800, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_armor", name: "金牛座-阿鲁迪巴之铠", slot: "armor", rarity: "legend", level: 30, requiredLevel: 30, atk: 12, matk: 0, def: 82, hp: 520, str: 6, vit: 12, gold: 0.12, materials: { ancientCore: 3, rune: 6 }, goldCost: 2400, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_boots", name: "金牛座-阿鲁迪巴之靴", slot: "shoes", rarity: "epic", level: 30, requiredLevel: 30, atk: 10, matk: 0, def: 36, hp: 180, agi: 4, vit: 6, gold: 0.06, materials: { crystal: 8, rune: 4 }, goldCost: 1500, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_ring", name: "金牛座-阿鲁迪巴之戒", slot: "trinket", rarity: "legend", level: 30, requiredLevel: 30, atk: 28, matk: 12, def: 12, hp: 120, str: 8, luk: 4, gold: 0.16, materials: { ancientCore: 2, starShard: 1 }, goldCost: 2000, description: "金牛座-阿鲁迪巴套装部件。"},
      { id: "taurus_aldbaran_weapon", name: "金牛座-阿鲁迪巴之斧", slot: "weapon", rarity: "legend", level: 30, requiredLevel: 30, weaponType: "axe", equipType: "axe", atk: 260, matk: 0, def: 16, hp: 160, str: 16, vit: 8, crit: 0.04, gold: 0.18, materials: { ancientCore: 4, starShard: 2 }, goldCost: 3200, description: "金牛座-阿鲁迪巴套装部件。"},
    ],
  },
};

var materialDropTables = {
  grass: [
    { materialId: "dust", dropRate: 0.08, minQty: 1, maxQty: 3 },
    { materialId: "ore", dropRate: 0.018, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0003, minQty: 1, maxQty: 1 },
  ],
  forest: [
    { materialId: "dust", dropRate: 0.06, minQty: 1, maxQty: 3 },
    { materialId: "ore", dropRate: 0.035, minQty: 1, maxQty: 2 },
    { materialId: "crystal", dropRate: 0.01, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0004, minQty: 1, maxQty: 1 },
  ],
  sewer: [
    { materialId: "dust", dropRate: 0.05, minQty: 1, maxQty: 3 },
    { materialId: "ore", dropRate: 0.045, minQty: 1, maxQty: 2 },
    { materialId: "crystal", dropRate: 0.018, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.00055, minQty: 1, maxQty: 1 },
  ],
  desert: [
    { materialId: "ore", dropRate: 0.055, minQty: 1, maxQty: 3 },
    { materialId: "crystal", dropRate: 0.024, minQty: 1, maxQty: 2 },
    { materialId: "rune", dropRate: 0.006, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0007, minQty: 1, maxQty: 1 },
  ],
  orc_village: [
    { materialId: "ore", dropRate: 0.065, minQty: 1, maxQty: 3 },
    { materialId: "crystal", dropRate: 0.03, minQty: 1, maxQty: 2 },
    { materialId: "rune", dropRate: 0.01, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.004, minQty: 1, maxQty: 1 },
    { materialId: "elunium", dropRate: 0.004, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0009, minQty: 1, maxQty: 1 },
  ],
  mine: [
    { materialId: "ore", dropRate: 0.07, minQty: 1, maxQty: 3 },
    { materialId: "crystal", dropRate: 0.03, minQty: 1, maxQty: 2 },
    { materialId: "rune", dropRate: 0.008, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.01, minQty: 1, maxQty: 1 },
    { materialId: "elunium", dropRate: 0.008, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0011, minQty: 1, maxQty: 1 },
  ],
  clock: [
    { materialId: "crystal", dropRate: 0.05, minQty: 1, maxQty: 3 },
    { materialId: "rune", dropRate: 0.025, minQty: 1, maxQty: 2 },
    { materialId: "ancientCore", dropRate: 0.006, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.018, minQty: 1, maxQty: 2 },
    { materialId: "elunium", dropRate: 0.015, minQty: 1, maxQty: 1 },
    { materialId: "enhanceProtect", dropRate: 0.0014, minQty: 1, maxQty: 1 },
  ],
  glast_heim: [
    { materialId: "rune", dropRate: 0.045, minQty: 1, maxQty: 3 },
    { materialId: "ancientCore", dropRate: 0.014, minQty: 1, maxQty: 2 },
    { materialId: "starShard", dropRate: 0.0035, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.025, minQty: 1, maxQty: 2 },
    { materialId: "elunium", dropRate: 0.022, minQty: 1, maxQty: 2 },
    { materialId: "enhanceProtect", dropRate: 0.0017, minQty: 1, maxQty: 1 },
  ],
  abyss_lake: [
    { materialId: "rune", dropRate: 0.05, minQty: 1, maxQty: 3 },
    { materialId: "ancientCore", dropRate: 0.02, minQty: 1, maxQty: 2 },
    { materialId: "starShard", dropRate: 0.007, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.035, minQty: 1, maxQty: 3 },
    { materialId: "elunium", dropRate: 0.03, minQty: 1, maxQty: 2 },
    { materialId: "enhanceProtect", dropRate: 0.002, minQty: 1, maxQty: 1 },
  ],
  sky: [
    { materialId: "rune", dropRate: 0.04, minQty: 1, maxQty: 3 },
    { materialId: "ancientCore", dropRate: 0.018, minQty: 1, maxQty: 2 },
    { materialId: "starShard", dropRate: 0.006, minQty: 1, maxQty: 1 },
    { materialId: "oridecon", dropRate: 0.04, minQty: 1, maxQty: 3 },
    { materialId: "elunium", dropRate: 0.035, minQty: 1, maxQty: 2 },
    { materialId: "enhanceProtect", dropRate: 0.0024, minQty: 1, maxQty: 1 },
  ],
};

var oneHandSwordPoolFiltered = [
  { id: "one_hand_sword_long_sword", name: "长剑", slot: "weapon", rarity: "normal", atk: 25, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_scimitar", name: "圆月刀", slot: "weapon", rarity: "normal", atk: 39, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_honor_sword", name: "荣誉宝剑", slot: "weapon", rarity: "normal", atk: 50, matk: 50, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_ceremonial_dagger", name: "祭礼短剑", slot: "weapon", rarity: "normal", atk: 60, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_piercing_sword", name: "击刺长剑", slot: "weapon", rarity: "rare", atk: 70, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_saber", name: "弯刀", slot: "weapon", rarity: "rare", atk: 85, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_round_hilt_saber", name: "圆柄马刀", slot: "weapon", rarity: "rare", atk: 100, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_p_cavalry_i", name: "P.骑兵剑Ⅰ", slot: "weapon", rarity: "rare", atk: 147, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_haedonggum", name: "海东剑", slot: "weapon", rarity: "epic", atk: 120, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { id: "one_hand_sword_katana", name: "日本刀", slot: "weapon", rarity: "epic", atk: 130, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_water_ripple", name: "水纹之剑", slot: "weapon", rarity: "epic", atk: 150, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_tremor", name: "战栗诡剑", slot: "weapon", rarity: "epic", atk: 190, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 5, agi: 5, vit: 0, int: 0, dex: 0, luk: 0 },
  { id: "one_hand_sword_boss_sword", name: "首领之剑", slot: "weapon", rarity: "legend", atk: 150, matk: 0, def: 2, aspd: 0, luck: 0, gold: 0, crit: 0.02, drop: 0.02, str: 2, agi: 2, vit: 2, int: 2, dex: 2, luk: 2 },
  { id: "one_hand_sword_crimson", name: "红莲剑", slot: "weapon", rarity: "legend", atk: 160, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 2, agi: 0, vit: 0, int: 2, dex: 0, luk: 0 },
  { id: "one_hand_sword_youjian_shiguang", name: "妖剑 弒光", slot: "weapon", rarity: "legend", atk: 170, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0.03, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 3, luk: 0 },
  { id: "one_hand_sword_false_belief", name: "虚伪信念长剑", slot: "weapon", rarity: "legend", atk: 210, matk: 0, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
].map((item) => ({
  weaponType: "oneHandSword",
  equipType: "oneHandSword",
  source: "monster_drop",
  quality: item.rarity,
  level: 1,
  requiredLevel: 1,
  requiredJob: [],
  allowedJobs: ["novice", "swordman", "knight", "lordKnight", "runeKnight", "merchant", "blacksmith", "whiteSmith", "mechanic", "thief", "assassin", "assassinCross", "guillotineCross"],
  image: `assets/images/equipment/${item.id}.png`,
  description: "单手剑武器池掉落装备。",
  ...item,
}));

var equipmentTemplateDb = Object.fromEntries(oneHandSwordPoolFiltered.map((item) => [item.id, item]));

var oneHandStaffPoolFiltered = [
  { name: "手杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 15, matk: 30, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
  { name: "橡木魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 25, matk: 45, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 1, dex: 0, luk: 0 },
  { name: "智慧魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 40, matk: 70, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 2, dex: 0, luk: 0 },
  { name: "P.魔杖Ⅰ", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "normal", atk: 60, matk: 125, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 2, dex: 0, luk: 0 },
  { name: "言灵魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 60, matk: 95, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { name: "骷髅魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 40, matk: 110, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 4, dex: 0, luk: 0 },
  { name: "生存的魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 50, matk: 120, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 2, luk: 0 },
  { name: "圣杖 英灵", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "rare", atk: 75, matk: 105, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { name: "里奇的骷髅魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 60, matk: 170, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 1, dex: 1, luk: 0 },
  { name: "锐利波之杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 80, matk: 145, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 4, dex: 0, luk: 0 },
  { name: "水晶魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 30, matk: 125, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 0, luk: 0 },
  { name: "魔法师的魔杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "epic", atk: 70, matk: 125, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 4, dex: 3, luk: 0 },
  { name: "邪恶权杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 60, matk: 120, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 5, dex: 0, luk: 0 },
  { name: "黑暗的荆棘骷髅杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 60, matk: 160, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 3, luk: 0 },
  { name: "销魂杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 80, matk: 170, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 3, dex: 2, luk: 0 },
  { name: "驱魔圣杖", slot: "weapon", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 50, matk: 140, def: 0, aspd: 0, luck: 0, gold: 0, crit: 0, drop: 0, str: 0, agi: 0, vit: 0, int: 0, dex: 0, luk: 0 },
];

var bodyArmorPoolFiltered = [
  { name: "棉衬衫", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 10 },
  { name: "皮制外套", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 15 },
  { name: "冒险衣", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 20 },
  { name: "大衣", slot: "body", armorType: "bodyArmor", rarity: "normal", def: 37 },
  { name: "铁制铠甲", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 35 },
  { name: "钢铁锁子甲", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 55 },
  { name: "钢铁铠甲", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 70 },
  { name: "秘衣 美德", slot: "body", armorType: "bodyArmor", rarity: "rare", def: 59, int: 1 },
  { name: "变色龙铠甲", slot: "body", armorType: "bodyArmor", rarity: "epic", def: 55 },
  { name: "急速冲刺铠甲", slot: "body", armorType: "bodyArmor", rarity: "epic", def: 20, vit: 1 },
  { name: "那迦鳞片铠甲", slot: "body", armorType: "bodyArmor", rarity: "epic", atk: 20, def: 45 },
  { name: "生命链接", slot: "body", armorType: "bodyArmor", rarity: "epic", def: 75, vit: 2 },
  { name: "布林喜德", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 120 },
  { name: "陈旧内裤", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 60, str: 2, vit: 2 },
  { name: "华丽的勇士紫光外套", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 10 },
  { name: "暴躁龙内衣", slot: "body", armorType: "bodyArmor", rarity: "legend", def: 20, agi: 5 },
];

var headTopPoolFiltered = [
  { name: "发箍", slot: "headTop", armorType: "headTop", rarity: "normal", def: 1 },
  { name: "方头巾", slot: "headTop", armorType: "headTop", rarity: "normal", def: 1 },
  { name: "猫耳发圈", slot: "headTop", armorType: "headTop", rarity: "normal", def: 2 },
  { name: "兔耳发圈", slot: "headTop", armorType: "headTop", rarity: "normal", def: 2, luk: 2 },
  { name: "圆帽", slot: "headTop", armorType: "headTop", rarity: "rare", def: 5 },
  { name: "无边帽", slot: "headTop", armorType: "headTop", rarity: "rare", def: 7 },
  { name: "金属头盔", slot: "headTop", armorType: "headTop", rarity: "rare", def: 13 },
  { name: "王冠", slot: "headTop", armorType: "headTop", rarity: "rare", def: 7, int: 2 },
  { name: "天使头盔", slot: "headTop", armorType: "headTop", rarity: "epic", def: 10, agi: 1, luk: 1 },
  { name: "厨师帽", slot: "headTop", armorType: "headTop", rarity: "epic", def: 3, dex: 1 },
  { name: "魔法师帽", slot: "headTop", armorType: "headTop", rarity: "epic", def: 2, int: 2 },
  { name: "矿坑安全帽", slot: "headTop", armorType: "headTop", rarity: "epic", def: 9, dex: 2 },
  { name: "哥夫内的头具", slot: "headTop", armorType: "headTop", rarity: "legend", def: 10, vit: 3 },
  { name: "鸟窝", slot: "headTop", armorType: "headTop", rarity: "legend", def: 2, agi: 2 },
  { name: "爱丽丝女仆娃娃", slot: "headTop", armorType: "headTop", rarity: "legend", def: 1, str: 1 },
  { name: "海盗船长帽", slot: "headTop", armorType: "headTop", rarity: "legend", def: 11, vit: 1 },
];

var shoesPoolFiltered = [
  { name: "轻便鞋", slot: "shoes", armorType: "shoes", rarity: "normal", def: 5 },
  { name: "长靴", slot: "shoes", armorType: "shoes", rarity: "normal", def: 10 },
  { name: "战士长靴", slot: "shoes", armorType: "shoes", rarity: "normal", def: 16 },
  { name: "玻璃鞋", slot: "shoes", armorType: "shoes", rarity: "normal", def: 5, luk: 5 },
  { name: "脚链", slot: "shoes", armorType: "shoes", rarity: "rare", def: 18 },
  { name: "重靴", slot: "shoes", armorType: "shoes", rarity: "rare", def: 27 },
  { name: "安全鞋", slot: "shoes", armorType: "shoes", rarity: "rare", def: 22 },
  { name: "兔子拖鞋", slot: "shoes", armorType: "shoes", rarity: "rare", def: 9, luk: 3 },
  { name: "傅里哥长靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 12, agi: 2 },
  { name: "迪塔乐长靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 13, vit: 5 },
  { name: "哥夫内军靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 13 },
  { name: "巴基力的长靴", slot: "shoes", armorType: "shoes", rarity: "epic", def: 13 },
  { name: "史雷普尼尔之靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 40, int: 25 },
  { name: "变形长靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 10 },
  { name: "城战重靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 30 },
  { name: "阴暗步行长靴", slot: "shoes", armorType: "shoes", rarity: "legend", def: 0 },
];

var accessoryPoolFiltered = [
  { name: "力量戒指", slot: "accessory", armorType: "accessory", rarity: "normal", str: 2 },
  { name: "智力耳环", slot: "accessory", armorType: "accessory", rarity: "normal", int: 2 },
  { name: "体力项链", slot: "accessory", armorType: "accessory", rarity: "normal", vit: 2 },
  { name: "防御手套", slot: "accessory", armorType: "accessory", rarity: "normal", dex: 2 },
  { name: "敏捷别针", slot: "accessory", armorType: "accessory", rarity: "rare", agi: 2 },
  { name: "幸运珠链", slot: "accessory", armorType: "accessory", rarity: "rare", luk: 2 },
  { name: "防御戒指", slot: "accessory", armorType: "accessory", rarity: "rare", def: 3 },
  { name: "潜能戒指", slot: "accessory", armorType: "accessory", rarity: "rare", crit: 0.05 },
  { name: "智慧手套", slot: "accessory", armorType: "accessory", rarity: "epic", def: 1, int: 1 },
  { name: "黑狐颈链", slot: "accessory", armorType: "accessory", rarity: "epic", def: 1, agi: 1 },
  { name: "怪盗戒指", slot: "accessory", armorType: "accessory", rarity: "epic", atk: 10, crit: 0.1 },
  { name: "下级精灵的戒指", slot: "accessory", armorType: "accessory", rarity: "epic", str: 1, agi: 1, vit: 1, int: 1, dex: 1, luk: 1 },
  { name: "火焰国王戒指", slot: "accessory", armorType: "accessory", rarity: "legend", atk: 15, str: 2, vit: 1 },
  { name: "共鸣戒指", slot: "accessory", armorType: "accessory", rarity: "legend", def: 2, agi: 2, vit: 1 },
  { name: "共和国纪念日戒指", slot: "accessory", armorType: "accessory", rarity: "legend", str: 3, agi: 3, vit: 3, int: 3, dex: 3, luk: 3 },
  { name: "永恒戒指", slot: "accessory", armorType: "accessory", rarity: "legend" },
];

var roStyleEquipmentPoolFiltered = [
  { id: "ro_dagger_damascus", name: "大马士革短剑", slot: "weapon", subType: "dagger", weaponType: "dagger", equipType: "dagger", rarity: "epic", atk: 150, agi: 3, dex: 2, crit: 0.04 },
  { id: "ro_spear_trident", name: "三叉戟", slot: "weapon", subType: "spear", weaponType: "spear", equipType: "spear", rarity: "rare", atk: 170, str: 2, dex: 2 },
  { id: "ro_axe_orc_battle", name: "兽人战斧", slot: "weapon", subType: "axe", weaponType: "axe", equipType: "axe", rarity: "epic", atk: 235, str: 5, vit: 2 },
  { id: "ro_mace_golden", name: "黄金钉锤", slot: "weapon", subType: "mace", weaponType: "mace", equipType: "mace", rarity: "legend", atk: 220, matk: 60, str: 4, vit: 4, bossDamageBonus: 0.035 },
  { id: "ro_bow_hunter", name: "猎人之弓", slot: "weapon", subType: "bow", weaponType: "bow", equipType: "bow", rarity: "epic", atk: 185, dex: 6, agi: 3, crit: 0.05 },
  { id: "ro_katar_briar", name: "刺藤拳刃", slot: "weapon", subType: "katar", weaponType: "katar", equipType: "katar", rarity: "legend", atk: 245, agi: 6, luk: 6, crit: 0.08, critDamageBonus: 0.08 },
  { id: "ro_book_arcane", name: "星纹魔导书", slot: "weapon", subType: "book", weaponType: "book", equipType: "book", rarity: "epic", atk: 70, matk: 210, int: 6, dex: 3, skillDamageBonus: 0.035 },
  { id: "ro_knuckle_iron", name: "铁腕拳套", slot: "weapon", subType: "knuckle", weaponType: "knuckle", equipType: "knuckle", rarity: "rare", atk: 135, str: 3, agi: 2, aspd: 0.04 },
  { id: "ro_staff_dark_lord", name: "黑暗领主之杖", slot: "weapon", subType: "staff", weaponType: "oneHandStaff", equipType: "oneHandStaff", rarity: "legend", atk: 80, matk: 285, int: 8, skillDamageBonus: 0.06, abyssDamageBonus: 0.04 },
  { id: "ro_sword_ancient_dragonfang", name: "远古龙牙剑", slot: "weapon", subType: "sword", weaponType: "oneHandSword", equipType: "oneHandSword", rarity: "legend", atk: 285, str: 6, dex: 4, finalDamageBonus: 0.04 },
  { id: "ro_robe_priest", name: "圣职者长袍", slot: "body", subType: "robe", armorType: "bodyArmor", rarity: "epic", def: 68, hp: 260, int: 4, vit: 4, hpRegenPct: 0.04 },
  { id: "ro_plate_glast_knight", name: "古城骑士铠", slot: "body", subType: "plate", armorType: "bodyArmor", rarity: "legend", def: 135, hp: 520, str: 4, vit: 8, damageReductionPct: 0.035 },
  { id: "ro_armor_abyss_dragon_scale", name: "深渊龙鳞甲", slot: "body", subType: "plate", armorType: "bodyArmor", rarity: "legend", def: 160, hp: 680, vit: 9, abyssDamageReduction: 0.04 },
  { id: "ro_head_angel_circlet", name: "天使发圈", slot: "headTop", subType: "circlet", armorType: "headTop", rarity: "epic", def: 12, int: 3, luk: 3, baseExpBonus: 0.025 },
  { id: "ro_head_dark_lord_crown", name: "黑暗领主冠冕", slot: "headTop", subType: "crown", armorType: "headTop", rarity: "legend", def: 26, int: 7, dex: 3, skillDamageBonus: 0.04 },
  { id: "ro_shoes_abyss_walker", name: "深渊行者战靴", slot: "shoes", subType: "boots", armorType: "shoes", rarity: "legend", def: 46, hp: 220, agi: 6, abyssDamageReduction: 0.025, patrolEfficiency: 0.04 },
  { id: "ro_trinket_dragonblood", name: "龙血吊坠", slot: "accessory", subType: "necklace", armorType: "accessory", rarity: "legend", hp: 240, str: 3, vit: 3, lifeSteal: 0.025, bossDamageBonus: 0.025 },
  { id: "ro_trinket_abyss_mark", name: "深渊印记", slot: "accessory", subType: "charm", armorType: "accessory", rarity: "legend", atk: 18, matk: 18, abyssDamageBonus: 0.05, mythicWeightBonus: 0.003 },
];

var mapDropTableAlias = {
  grass: "beginner_field",
  forest: "prontera_south",
  sewer: "sewer",
  desert: "orc_village",
  orc_village: "orc_village",
  mine: "glast_heim_outside",
  clock: "glast_heim_deep",
  glast_heim: "glast_heim_deep",
  abyss_lake: "abyss_temple",
  sky: "sky_temple",
};

var mapDropTableAlias = {
  grass: "beginner_field",
  forest: "prontera_south",
  sewer: "sewer",
  desert: "orc_village",
  orc_village: "orc_village",
  mine: "glast_heim_outside",
  clock: "glast_heim_deep",
  glast_heim: "glast_heim_deep",
  abyss_lake: "abyss_temple",
  sky: "sky_temple",
};