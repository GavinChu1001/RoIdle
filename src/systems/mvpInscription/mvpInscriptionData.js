export const MVP_INSCRIPTION_MAX_LEVEL = 100;
export const MVP_INSCRIPTION_STAGE_SIZE = 10;
export const MVP_INSCRIPTION_BASE_EXP_PER_MINUTE = 10;
export const MVP_INSCRIPTION_REBIRTH_EXP_BONUS = 0.027044025157232742;
export const MVP_INSCRIPTION_LOW_LEVEL_GAP = 25;
export const MVP_INSCRIPTION_LOW_MAP_GAP = 2;

export const MVP_INSCRIPTION_DIFFICULTY_MULTIPLIERS = Object.freeze({
  normal: 1,
  hard: 1.2,
  abyss: 1.45,
});

export const MVP_INSCRIPTION_MONSTER_EXP = Object.freeze({
  normal: 0.2,
  mutated: 0.45,
  elite: 0.6,
  boss: 8,
  abyssBoss: 16,
  firstBossClear: 30,
});

export const MVP_INSCRIPTION_BREAKTHROUGH_REQUIREMENTS = Object.freeze({
  10: { label: 'BASE Lv20', heroLevel: 20 },
  20: { label: '击败森林 Boss', bossKey: 'forest_normal' },
  30: { label: 'BASE Lv70', heroLevel: 70 },
  40: { label: '解锁困难难度', difficultyUnlocked: 'hard' },
  50: { label: '击败兽人村 Boss', bossKey: 'orc_village_normal' },
  60: { label: '击败任意 Boss', anyBossClear: true },
  70: { label: '击败钟塔 Boss', bossKey: 'clock_normal' },
  80: { label: '击败古城 Boss', bossKey: 'glast_heim_normal' },
  90: { label: '击败高阶 Boss', anyHighTierBossClear: true },
});

export const MVP_INSCRIPTION_STAGES = Object.freeze([
  { id: 'kingPoring', name: '波利王铭刻', minLevel: 1, maxLevel: 10, bonus: { baseExpBonus: 0.02, jobExpBonus: 0.02 } },
  { id: 'goldenThiefBug', name: '黄金盗虫铭刻', minLevel: 11, maxLevel: 20, bonus: { goldBonus: 0.02 } },
  { id: 'moonlightFlower', name: '月夜猫铭刻', minLevel: 21, maxLevel: 30, bonus: { attackSpeedPct: 0.01, combatPaceBonus: 0.01 } },
  { id: 'drake', name: '海盗之王铭刻', minLevel: 31, maxLevel: 40, bonus: { bossDamageBonus: 0.02 } },
  { id: 'phreeoni', name: '皮里恩铭刻', minLevel: 41, maxLevel: 50, bonus: { hitRate: 0.02, critRatePct: 0.01 } },
  { id: 'orcHero', name: '兽人英雄铭刻', minLevel: 51, maxLevel: 60, bonus: { hpPct: 0.02, statusResist: 0.03 } },
  { id: 'turtleGeneral', name: '龟将军铭刻', minLevel: 61, maxLevel: 70, bonus: { physicalFinalDamageBonus: 0.01 } },
  { id: 'doppelganger', name: '多佩雷根铭刻', minLevel: 71, maxLevel: 80, bonus: { normalAttackDamageBonus: 0.02, attackSpeedPct: 0.01 } },
  { id: 'darkLord', name: '黑暗领主铭刻', minLevel: 81, maxLevel: 90, bonus: { skillDamageBonus: 0.02, matkPct: 0.01 } },
  { id: 'baphomet', name: '巴风特铭刻', minLevel: 91, maxLevel: 100, bonus: { finalDamageBonus: 0.015 } },
]);
