const ROUTE_BY_JOB = Object.freeze({
  swordman: ['swordman'],
  knight: ['swordman', 'knight'],
  lordKnight: ['swordman', 'knight'],
  runeKnight: ['swordman', 'knight', 'runeKnight'],
  mage: ['mage'],
  wizard: ['mage', 'wizard'],
  highWizard: ['mage', 'wizard'],
  warlock: ['mage', 'wizard', 'warlock'],
  archer: ['archer'],
  hunter: ['archer', 'hunter'],
  sniper: ['archer', 'hunter'],
  ranger: ['archer', 'hunter', 'ranger'],
  acolyte: ['acolyte'],
  priest: ['acolyte', 'priest'],
  highPriest: ['acolyte', 'priest'],
  archbishop: ['acolyte', 'priest', 'archbishop'],
  merchant: ['merchant'],
  blacksmith: ['merchant', 'blacksmith'],
  whiteSmith: ['merchant', 'blacksmith'],
  mechanic: ['merchant', 'blacksmith', 'mechanic'],
  thief: ['thief'],
  assassin: ['thief', 'assassin'],
  assassinCross: ['thief', 'assassin'],
  guillotineCross: ['thief', 'assassin', 'guillotineCross'],
});

const ROUTE_SKILL_ROWS = Object.freeze([
  { jobId: 'swordman', routeTier: 1, skillNames: ['狂击', '怒爆'], multiplierBonus: 0.08, cooldownMultiplier: 0.97 },
  { jobId: 'knight', routeTier: 2, skillNames: ['骑乘攻击', '怪物互击'], multiplierBonus: 0.10, cooldownMultiplier: 0.96 },
  { jobId: 'runeKnight', routeTier: 3, skillNames: ['龙息', '符文爆发'], multiplierBonus: 0.12, cooldownMultiplier: 0.95 },
  { jobId: 'mage', routeTier: 1, skillNames: ['火箭术', '冰箭术'], multiplierBonus: 0.08, cooldownMultiplier: 0.97 },
  { jobId: 'wizard', routeTier: 2, skillNames: ['陨石术', '暴风雪'], multiplierBonus: 0.10, cooldownMultiplier: 0.96 },
  { jobId: 'warlock', routeTier: 3, skillNames: ['连锁闪电', '元素风暴'], multiplierBonus: 0.12, cooldownMultiplier: 0.95 },
  { jobId: 'archer', routeTier: 1, skillNames: ['二连矢', '箭雨'], multiplierBonus: 0.08, cooldownMultiplier: 0.97 },
  { jobId: 'hunter', routeTier: 2, skillNames: ['陷阱', '锐利射击'], multiplierBonus: 0.10, cooldownMultiplier: 0.96 },
  { jobId: 'ranger', routeTier: 3, skillNames: ['箭矢风暴', '狼突袭'], multiplierBonus: 0.12, cooldownMultiplier: 0.95 },
  { jobId: 'acolyte', routeTier: 1, skillNames: ['治愈术', '神圣之光'], multiplierBonus: 0.08, cooldownMultiplier: 0.97, healBonus: 0.08 },
  { jobId: 'priest', routeTier: 2, skillNames: ['群体治愈', '审判'], multiplierBonus: 0.10, cooldownMultiplier: 0.96, healBonus: 0.10 },
  { jobId: 'archbishop', routeTier: 3, skillNames: ['圣堂庇护', '天罚'], multiplierBonus: 0.12, cooldownMultiplier: 0.95, healBonus: 0.12 },
  { jobId: 'merchant', routeTier: 1, skillNames: ['手推车攻击', '金钱攻击'], multiplierBonus: 0.08, cooldownMultiplier: 0.97 },
  { jobId: 'blacksmith', routeTier: 2, skillNames: ['手推车强击', '武器精炼'], multiplierBonus: 0.10, cooldownMultiplier: 0.96 },
  { jobId: 'mechanic', routeTier: 3, skillNames: ['自爆装置', '金币风暴'], multiplierBonus: 0.12, cooldownMultiplier: 0.95 },
  { jobId: 'thief', routeTier: 1, skillNames: ['二刀连击', '施毒'], multiplierBonus: 0.08, cooldownMultiplier: 0.97 },
  { jobId: 'assassin', routeTier: 2, skillNames: ['音速投掷', '毒性扩散'], multiplierBonus: 0.10, cooldownMultiplier: 0.96 },
  { jobId: 'guillotineCross', routeTier: 3, skillNames: ['十字斩', '暗杀'], multiplierBonus: 0.12, cooldownMultiplier: 0.95 },
]);

export const ROUTE_SKILL_ENHANCEMENTS = Object.freeze(Object.fromEntries(
  ROUTE_SKILL_ROWS.map((row) => [row.jobId, Object.freeze({ ...row, skillNames: Object.freeze([...row.skillNames]) })]),
));

function thresholds() {
  return Object.freeze({
    refine10: Object.freeze({ id: 'refine10', refineTotal: 10, routeTier: 1, label: '一转技能联动', effects: Object.freeze({ skillDamageBonus: 0.02 }) }),
    refine20: Object.freeze({ id: 'refine20', refineTotal: 20, routeTier: 2, label: '二转技能联动', effects: Object.freeze({ skillDamageBonus: 0.03 }) }),
    refine30: Object.freeze({ id: 'refine30', refineTotal: 30, routeTier: 3, label: '三转技能联动', effects: Object.freeze({ skillDamageBonus: 0.04 }) }),
  });
}

function mechanism(id, unlockPieces, label, description, effects = {}, runtime = {}) {
  return Object.freeze({
    id,
    unlockPieces,
    label,
    description,
    effects: Object.freeze({ ...effects }),
    runtime: Object.freeze({ ...runtime }),
  });
}

function line(id, label, summaryName, mechanisms) {
  return Object.freeze({
    id,
    label,
    summaryName,
    thresholds: thresholds(),
    mechanisms: Object.freeze(mechanisms),
  });
}

export const EQUIPMENT_SYNERGY_LINES = Object.freeze({
  oldWorld: line('oldWorld', '旧世共鸣', 'Old World Resonance', [
    mechanism('fieldTraining', 4, '野外训练', '击杀节奏与前期生存提高。', { hp: 80, combatPaceBonus: 0.03 }, { earlySustain: 0.06 }),
    mechanism('fieldTrainingUpgrade', 5, '野外训练+', '额外提高装备掉落与金币收益。', { equipmentDrop: 0.04, goldBonus: 0.04 }, { earlySustain: 0.04 }),
  ]),
  ancientHero: line('ancientHero', '古代英雄共鸣', 'Hero Resonance', [
    mechanism('heroBurst', 4, '英雄爆发', '技能命中会积累英雄气势，周期性提高下一次伤害。', { finalDamageBonus: 0.02, skillDamageBonus: 0.04 }, { burstDamage: 0.18 }),
    mechanism('heroBurstUpgrade', 5, '英雄爆发+', '爆发后的短时间内提高推进节奏。', { combatPaceBonus: 0.04, bossDamageBonus: 0.03 }, { burstDamage: 0.08 }),
  ]),
  os: line('os', 'OS 超频', 'OS Overclock', [
    mechanism('osOverclock', 4, '自动超频', '普攻和技能交替时提高攻速与技能伤害。', { attackSpeedPct: 0.04, skillDamageBonus: 0.04 }, { cooldownHaste: 0.04 }),
    mechanism('osOverclockUpgrade', 5, '自动超频+', '击杀后短暂提高装备掉落率。', { equipmentDrop: 0.05, rareDropBonus: 0.02 }, { killDropWindow: 0.10 }),
  ]),
  fides: line('fides', '信念誓约', 'Fides Conviction', [
    mechanism('fidesConviction', 4, '信念誓约', '生命越稳定，最终伤害越高。', { finalDamageBonus: 0.03, damageReductionPct: 0.02 }, { highHpDamage: 0.10 }),
    mechanism('fidesConvictionUpgrade', 5, '信念誓约+', 'Boss 战中额外提高伤害与减伤。', { bossDamageBonus: 0.05, bossDamageReduction: 0.03 }, { bossGuard: 0.06 }),
  ]),
  glacier: line('glacier', '冰川回路', 'Glacier Circuit', [
    mechanism('glacierCircuit', 4, '冰川回路', '连续战斗会逐步提高技能伤害。', { skillDamageBonus: 0.05, statusResist: 0.04 }, { rampSkillDamage: 0.12 }),
    mechanism('glacierCircuitUpgrade', 5, '冰川回路+', '离线战斗也能保留部分回路效率。', { offlineEfficiencyBonus: 0.06, materialQuantityBonus: 0.04 }, { offlineRamp: 0.08 }),
  ]),
  poenitentia: line('poenitentia', '悔恨裁决', 'Poenitentia Verdict', [
    mechanism('penitenceVerdict', 4, '悔恨裁决', '对高血量和低血量目标都有额外压制力。', { eliteDamageBonus: 0.04, bossDamageBonus: 0.04 }, { executeDamage: 0.10 }),
    mechanism('penitenceVerdictUpgrade', 5, '悔恨裁决+', '精英和 Boss 掉落材料更稳定。', { materialQuantityBonus: 0.06, rareDropBonus: 0.03 }, { materialPityBonus: 0.10 }),
  ]),
  goodEvil: line('goodEvil', '善恶审判', 'Good-Evil Judgment', [
    mechanism('goodEvilJudgment', 4, '善恶审判', '伤害与防御在战斗中交替强化。', { finalDamageBonus: 0.035, damageReductionPct: 0.025 }, { stanceCycle: 0.12 }),
    mechanism('goodEvilJudgmentUpgrade', 5, '善恶审判+', '切换姿态时触发额外技能伤害。', { skillDamageBonus: 0.05, bossDamageReduction: 0.03 }, { stanceBurst: 0.10 }),
  ]),
  nebula: line('nebula', '星云矩阵', 'Nebula Matrix', [
    mechanism('nebulaMatrix', 4, '星云矩阵', '多段技能与暴击形成矩阵增幅。', { crit: 0.04, critDamageBonus: 0.08 }, { multihitBonus: 0.10, highTierDropBonus: 0.06 }),
    mechanism('nebulaMatrixUpgrade', 5, '星云矩阵+', '矩阵稳定后提高高阶装备掉落。', { equipmentDrop: 0.06, highTierFind: 0.03 }, { highTierDropBonus: 0.10 }),
  ]),
  muqaddas: line('muqaddas', '莫卡迪斯圣域', 'Muqaddas Sanctuary', [
    mechanism('muqaddasSanctuary', 4, '圣域庇护', '圣域提供持续减伤与反击窗口。', { damageReductionPct: 0.035, skillDamageBonus: 0.05 }, { sanctuaryCounter: 0.12 }),
    mechanism('muqaddasSanctuaryUpgrade', 5, '圣域庇护+', 'Boss 战中延长反击窗口。', { bossDamageBonus: 0.06, bossDamageReduction: 0.04 }, { sanctuaryCounter: 0.08 }),
  ]),
  dimensional: line('dimensional', '次元冠冕', 'Dimensional Crown', [
    mechanism('dimensionalCrown', 4, '次元冠冕', '技能冷却与最终伤害同时获得高阶压缩。', { finalDamageBonus: 0.05, skillDamageBonus: 0.06 }, { cooldownHaste: 0.06 }),
    mechanism('dimensionalCrownUpgrade', 5, '次元冠冕+', '跨越次元后提高全部高阶资源收益。', { equipmentDrop: 0.08, rareDropBonus: 0.04, materialQuantityBonus: 0.08 }, { dimensionalEcho: 0.12 }),
  ]),
});

function number(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function addStats(target, stats = {}) {
  Object.entries(stats || {}).forEach(([stat, value]) => {
    const next = number(target[stat]) + number(value);
    target[stat] = Number(next.toFixed(3));
  });
}

function mergeRuntimeEffects(target, effects = {}) {
  Object.entries(effects || {}).forEach(([key, value]) => {
    target[key] = Number((number(target[key]) + number(value)).toFixed(3));
  });
}

function applyMechanismRuntimeEffects(mechanism, combatEffects, dropEffects) {
  const runtime = mechanism?.runtime || {};
  mergeRuntimeEffects(combatEffects, {
    autoStrikePct: number(runtime.cooldownHaste) + number(runtime.earlySustain) + number(runtime.offlineRamp),
    burstDamageBonus: number(runtime.burstDamage) + number(runtime.stanceBurst) + number(runtime.sanctuaryCounter),
  });
  mergeRuntimeEffects(dropEffects, {
    dropChainBonus: number(runtime.killDropWindow) + number(runtime.highTierDropBonus) + number(runtime.dimensionalEcho),
    materialChainBonus: number(runtime.materialPityBonus),
  });
}

function equippedItemsFromState(state = {}) {
  const inventory = Array.isArray(state.inventory) ? state.inventory : [];
  const byId = new Map(inventory.map((item) => [String(item?.id || ''), item]).filter(([id]) => id));
  return Object.values(state.equipped || {})
    .map((entry) => (entry && typeof entry === 'object' ? entry : byId.get(String(entry || ''))))
    .filter((item) => item && typeof item === 'object');
}

function itemSeries(item = {}) {
  return item.series || item.equipmentSeries || item.progressionSeries || item.line || '';
}

function itemRefine(item = {}) {
  return Math.max(0, number(item.refine ?? item.star ?? item.starRefine ?? 0));
}

function itemUpgradeStage(item = {}) {
  return Math.max(0, number(item.upgradeStage, 0));
}

function mechanismMeetsUpgradeStage(mechanismEntry, averageUpgradeStage) {
  if (mechanismEntry.unlockPieces >= 5) return averageUpgradeStage >= 2;
  if (mechanismEntry.unlockPieces >= 4 && String(mechanismEntry.id || '').endsWith('Upgrade')) return averageUpgradeStage >= 1;
  return true;
}

function mechanismIsActiveForGroup(mechanismEntry, group) {
  return group.pieceCount >= mechanismEntry.unlockPieces
    && mechanismMeetsUpgradeStage(mechanismEntry, group.averageUpgradeStage || 0);
}

export function getProfessionRoute(jobOrState = {}) {
  const hero = jobOrState?.hero || jobOrState || {};
  const jobId = String(hero.jobId || jobOrState || '');
  if (ROUTE_BY_JOB[jobId]) return [...ROUTE_BY_JOB[jobId]];
  const history = Array.isArray(hero.jobHistory) ? hero.jobHistory.filter((entry) => ROUTE_SKILL_ENHANCEMENTS[entry]) : [];
  return history.length ? history.slice(-3) : (ROUTE_SKILL_ENHANCEMENTS[jobId] ? [jobId] : []);
}

export function getProfessionRouteTier(jobOrState = {}) {
  return Math.min(3, getProfessionRoute(jobOrState).length);
}

function routeEnhancementsFor(state, threshold) {
  const route = getProfessionRoute(state);
  if (route.length < threshold.routeTier) return [];
  const routeJobId = route[threshold.routeTier - 1];
  const enhancement = ROUTE_SKILL_ENHANCEMENTS[routeJobId];
  if (!enhancement) return [];
  return [{
    ...enhancement,
    thresholdId: threshold.id,
    thresholdLabel: threshold.label,
    refineTotalRequired: threshold.refineTotal,
  }];
}

export function computeEquipmentSynergies(state = {}) {
  const groups = new Map();
  equippedItemsFromState(state).forEach((item) => {
    const series = itemSeries(item);
    const config = EQUIPMENT_SYNERGY_LINES[series];
    if (!config) return;
    const group = groups.get(series) || { series, config, items: [], pieceCount: 0, refineTotal: 0, upgradeStageTotal: 0 };
    group.items.push(item);
    group.pieceCount += 1;
    group.refineTotal += itemRefine(item);
    group.upgradeStageTotal += itemUpgradeStage(item);
    groups.set(series, group);
  });

  const stats = {};
  const combatEffects = {};
  const dropEffects = {};
  const skillEnhancements = [];
  const activeLines = [...groups.values()]
    .filter((group) => group.pieceCount >= 2)
    .map((group) => {
      const averageUpgradeStage = group.pieceCount ? group.upgradeStageTotal / group.pieceCount : 0;
      group.averageUpgradeStage = averageUpgradeStage;
      const activeMechanisms = group.config.mechanisms.filter((entry) => mechanismIsActiveForGroup(entry, group));
      const routeEnhancements = Object.values(group.config.thresholds)
        .filter((threshold) => group.refineTotal >= threshold.refineTotal)
        .flatMap((threshold) => routeEnhancementsFor(state, threshold));
      activeMechanisms.forEach((entry) => {
        addStats(stats, entry.effects);
        applyMechanismRuntimeEffects(entry, combatEffects, dropEffects);
      });
      routeEnhancements.forEach((entry) => {
        addStats(stats, EQUIPMENT_SYNERGY_LINES[group.series].thresholds[entry.thresholdId]?.effects);
        skillEnhancements.push({ ...entry, sourceSeries: group.series, sourceLabel: group.config.label });
      });
      return {
        series: group.series,
        label: group.config.label,
        summaryName: group.config.summaryName,
        pieceCount: group.pieceCount,
        refineTotal: group.refineTotal,
        upgradeStageTotal: group.upgradeStageTotal,
        averageUpgradeStage,
        items: group.items,
        activeMechanisms,
        routeEnhancements,
        nextMechanism: group.config.mechanisms.find((entry) => !mechanismIsActiveForGroup(entry, group)) || null,
        nextThreshold: Object.values(group.config.thresholds).find((entry) => group.refineTotal < entry.refineTotal) || null,
      };
    })
    .sort((a, b) => (b.pieceCount - a.pieceCount) || (b.refineTotal - a.refineTotal));

  return {
    activeLines,
    stats,
    combatEffects,
    dropEffects,
    skillEnhancements,
    activeLineIds: activeLines.map((entry) => entry.series),
    activeMechanismIds: activeLines.flatMap((entry) => entry.activeMechanisms.map((mechanismEntry) => mechanismEntry.id)),
    bestLine: activeLines[0] || null,
  };
}

export function getEquipmentSynergySummary(synergy = {}) {
  const lineEntry = synergy.bestLine || synergy.activeLines?.[0];
  if (!lineEntry) return 'No active equipment synergy';
  const routeText = lineEntry.routeEnhancements?.length ? `, route +${lineEntry.routeEnhancements.length}` : '';
  return `${lineEntry.summaryName || lineEntry.label}: ${lineEntry.pieceCount}/5 pieces, refine +${lineEntry.refineTotal}${routeText}`;
}
