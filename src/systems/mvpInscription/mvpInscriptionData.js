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

export const MVP_INSCRIPTION_STAGES = Object.freeze([
  { id: 'kingPoring', name: '娉㈠埄鐜嬮摥鍒?', minLevel: 1, maxLevel: 10, bonus: { baseExpBonus: 0.02, jobExpBonus: 0.02 } },
  { id: 'goldenThiefBug', name: '榛勯噾鐩楄櫕閾埢', minLevel: 11, maxLevel: 20, bonus: { goldBonus: 0.02 } },
  { id: 'moonlightFlower', name: '鏈堝鐚摥鍒?', minLevel: 21, maxLevel: 30, bonus: { attackSpeedPct: 0.01, combatPaceBonus: 0.01 } },
  { id: 'drake', name: '娴风洍涔嬬帇閾埢', minLevel: 31, maxLevel: 40, bonus: { bossDamageBonus: 0.02 } },
  { id: 'phreeoni', name: '鐨噷鎭╅摥鍒?', minLevel: 41, maxLevel: 50, bonus: { hitRate: 0.02, critRatePct: 0.01 } },
  { id: 'orcHero', name: '鍏戒汉鑻遍泟閾埢', minLevel: 51, maxLevel: 60, bonus: { hpPct: 0.02, statusResist: 0.03 } },
  { id: 'turtleGeneral', name: '榫熷皢鍐涢摥鍒?', minLevel: 61, maxLevel: 70, bonus: { physicalFinalDamageBonus: 0.01 } },
  { id: 'doppelganger', name: '澶氫僵闆锋牴閾埢', minLevel: 71, maxLevel: 80, bonus: { normalAttackDamageBonus: 0.02, attackSpeedPct: 0.01 } },
  { id: 'darkLord', name: '榛戞殫棰嗕富閾埢', minLevel: 81, maxLevel: 90, bonus: { skillDamageBonus: 0.02, matkPct: 0.01 } },
  { id: 'baphomet', name: '宸撮鐗归摥鍒?', minLevel: 91, maxLevel: 100, bonus: { finalDamageBonus: 0.015 } },
]);
