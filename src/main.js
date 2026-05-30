// Rune Frontier Idle - modular compatibility entry.
// The classic game.js runtime remains authoritative while domains are migrated in stages.

// Platform (no dependencies)
import './platform/browserStorage.js';
import { Platform } from './platform/platform.js';

// Utilities (no dependencies)
import './utils/math.js';
import './utils/format.js';

// Data tables (no dependencies)
import './data/quality.js';
import './data/materials.js';

// State framework surface. Default-state creation still delegates to the classic runtime.
import './state/index.js';

// System logic modules. Equipment/reward flows and online combat rounds are
// module-owned; rendering and remaining progression systems remain bridged.
import './systems/vip.js';
import './systems/codex.js';
import './systems/shop.js';
import { installEquipmentRuntime } from './systems/equipment/index.js';
import { installDropsRuntime } from './systems/drops/index.js';
import { installCombatRuntime } from './systems/combat/index.js';
import { installRebirthRuntime } from './systems/rebirth.js';
import { installOfflineRuntime } from './systems/offline.js';
import { installMvpInscriptionRuntime } from './systems/mvpInscription/mvpInscriptionSystem.js';
import { installVipRuntime } from './systems/vip.js';
import { installCodexRuntime } from './systems/codex.js';
import { installShopRuntime } from './systems/shop.js';
import { installOnboardingRuntime } from './systems/onboarding.js';

// UI layer (delegates to game.js via window)
import './ui/index.js';
import { installLootRenderRuntime } from './ui/offlineLoot.js';
import { installVipRenderRuntime } from './ui/vipPage.js';
import { installShopRenderRuntime } from './ui/shopPage.js';
import { installCodexRenderRuntime } from './ui/codexPage.js';
import { installCharacterRenderRuntime } from './ui/characterPage.js';
import { installEquipmentRenderRuntime } from './ui/equipmentPage.js';
import { installSmithyRenderRuntime } from './ui/smithyPage.js';
import { installMapRenderRuntime } from './ui/mapPage.js';
import { installCardRenderRuntime } from './ui/cardPage.js';
import { installOnboardingGuideRuntime } from './ui/onboardingGuide.js';
import { installTaskRenderRuntime } from './ui/taskPage.js';
import { installLogRenderRuntime } from './ui/logPanel.js';
import { installAdviceRenderRuntime } from './ui/components/actionButton.js';

export const DEV_MODE = new URLSearchParams(window.location.search).get('dev') === '1';
export const RUNTIME_AUTHORITY = 'game.js';

document.documentElement.dataset.runeModuleStatus = 'installing';

window.RuneFrontierModuleStatus = Object.freeze({
  authority: RUNTIME_AUTHORITY,
  bootstrapOwner: 'src/main.js',
  migrated: ['platform', 'storage-adapter', 'utils-surface', 'state-surface', 'equipment-read-calculations', 'equipment-online-mutations', 'online-equipment-drops', 'online-reward-categories', 'recent-loot-recording', 'loot-view-model', 'offline-equipment-settlement', 'offline-reward-categories', 'kill-and-boss-settlement', 'boss-challenge-state', 'combat-rounds-and-damage', 'active-skill-resolution', 'skill-mechanics-v3', 'monster-spawn-and-stat-building', 'vip-calculations', 'codex-calculations', 'shop-calculations', 'rebirth-research-and-forging', 'dev-diagnostics'],
  bridged: ['offline-time-and-exp-calculation', 'renderers', 'vip-render', 'codex-render', 'shop-render'],
});

const equipmentContext = typeof window.RuneFrontierLegacyEquipmentContext === 'function'
  ? window.RuneFrontierLegacyEquipmentContext()
  : {};
installEquipmentRuntime(equipmentContext);
const dropsContext = typeof window.RuneFrontierLegacyDropsContext === 'function'
  ? window.RuneFrontierLegacyDropsContext()
  : {};
installDropsRuntime(dropsContext);
const offlineContext = typeof window.RuneFrontierLegacyOfflineContext === 'function'
  ? window.RuneFrontierLegacyOfflineContext()
  : {};
installOfflineRuntime(offlineContext);
const rebirthContext = typeof window.RuneFrontierLegacyRebirthContext === 'function'
  ? window.RuneFrontierLegacyRebirthContext()
  : {};
installRebirthRuntime(rebirthContext);
installMvpInscriptionRuntime(window);
const combatContext = typeof window.RuneFrontierLegacyCombatContext === 'function'
  ? window.RuneFrontierLegacyCombatContext()
  : {};
installCombatRuntime(combatContext);

const vipContext = typeof window.RuneFrontierLegacyVipContext === 'function'
  ? window.RuneFrontierLegacyVipContext()
  : {};
installVipRuntime(vipContext);
const codexContext = typeof window.RuneFrontierLegacyCodexContext === 'function'
  ? window.RuneFrontierLegacyCodexContext()
  : {};
installCodexRuntime(codexContext);
const shopContext = typeof window.RuneFrontierLegacyShopContext === 'function'
  ? window.RuneFrontierLegacyShopContext()
  : {};
installShopRuntime(shopContext);
installOnboardingRuntime();
document.documentElement.dataset.runeModuleStatus = 'onboarding-ready';
document.documentElement.dataset.runeModuleStatus = 'systems-ready';

const lootContext = {
  getState() { return window.state || {}; },
  formatNumber: window.formatNumber,
  formatDuration: window.formatDuration,
  escapeHtml: window.escapeHtml,
  renderItemName: window.renderItemName,
  rarityName: window.rarityName,
  getMaterialName: window.materialNames ? (id) => window.materialNames[id] || id : (id) => id,
  getMaterialRarity: window.MATERIAL_DB ? (id) => window.MATERIAL_DB[id]?.rarity || 'normal' : () => 'normal',
  getOfflineEfficiency() { return window.OFFLINE_EFFICIENCY || 0.65; },
  getMaxOfflineSeconds() { return window.MAX_OFFLINE_SECONDS || 43200; },
  offlineMaterialObjectToList: window.offlineMaterialObjectToList,
  offlineHighlightClass: window.offlineHighlightClass,
  sortOfflineEquipment: window.sortOfflineEquipment,
};
installLootRenderRuntime(lootContext);
document.documentElement.dataset.runeModuleStatus = 'loot-render-ready';

const vipRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  normalizeVip: window.normalizeVip,
  getVipBonuses: window.getVipBonuses,
  getVipProgressInfo: window.getVipProgressInfo,
  getUnlockedVipMilestones: window.getUnlockedVipMilestones,
  getNextVipMilestone: window.getNextVipMilestone,
  getVipMaxLevel() { return window.VIP_MAX_LEVEL || 20; },
  getVipExpRequirements() { return window.VIP_EXP_REQUIREMENTS || []; },
  getVipMilestones() { return window.VIP_MILESTONE_BONUSES || {}; },
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
  percent: window.percent,
  todayKey() { return new Date().toISOString().slice(0, 10); },
};
installVipRenderRuntime(vipRenderContext);
document.documentElement.dataset.runeModuleStatus = 'vip-render-ready';

const shopRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  normalizeShopState: window.normalizeShopState,
  canBuyShopItem: window.canBuyShopItem,
  formatShopLimitText: window.formatShopLimitText,
  formatShopCost: window.formatShopCost,
  escapeHtml: window.escapeHtml,
};
installShopRenderRuntime(shopRenderContext);
document.documentElement.dataset.runeModuleStatus = 'shop-render-ready';

const codexRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  getCodexActiveTab() { return (window.state || {}).codexActiveTab || 'monster'; },
  getCodexBonuses: window.getCodexBonuses,
  getTotalCodexLevel: window.getTotalCodexLevel,
  getMonsterMasteryLevel: window.getMonsterMasteryLevel,
  getCardResearchLevel: window.getCardResearchLevel,
  getMonsterTypeLabel: window.getMonsterTypeLabel,
  getMonsterTypeForCodex: window.getMonsterTypeForCodex,
  buildMonsterNameMap: window.buildMonsterNameMap,
  buildMonsterSourceMap: window.buildMonsterSourceMap,
  buildMonsterCardDropMap: window.buildMonsterCardDropMap,
  getMapMonsterConfig() { return window.mapMonsterConfig || {}; },
  getCardPool() { return window.cardPool || []; },
  getMaterialNames() { return window.materialNames || {}; },
  getCodexKillMilestones() { return window.CODEX_KILL_MILESTONES || []; },
  getCodexKillRewards() { return window.CODEX_KILL_REWARDS || {}; },
  getCodexMilestoneLabels() { return window.CODEX_MILESTONE_LABELS || []; },
  getCodexMasteryThresholds() { return window.CODEX_MASTERY_THRESHOLDS || []; },
  getCodexCardMilestones() { return window.CODEX_CARD_MILESTONES || []; },
  getCodexCardRewards() { return window.CODEX_CARD_REWARDS || {}; },
  achievementRewardText: window.achievementRewardText,
  statLabelName: window.statLabelName,
  cardEffectText: window.cardEffectText,
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
};
installCodexRenderRuntime(codexRenderContext);
document.documentElement.dataset.runeModuleStatus = 'codex-render-ready';

const characterRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  computeStats: window.computeStats,
  currentJob: window.currentJob,
  getNextJobSkill: window.getNextJobSkill,
  maxBaseLevel: window.maxBaseLevel,
  jobExpCost: window.jobExpCost,
  getAttributeKeys() { return window.attributeKeys || []; },
  getHpRegenInterval() { return window.HP_REGEN_INTERVAL || 5; },
  normalizeRebirthPrestige: window.normalizeRebirthPrestige || ((p, r) => ({ level: r || 0, totalRebirths: r || 0 })),
  getRebirthPrestigeBonuses: window.getRebirthPrestigeBonuses || (() => ({})),
  calculatePlayerRatingScores: window.calculatePlayerRatingScores || (() => ({})),
  formatCritRateSummary: window.formatCritRateSummary,
  imageBackgroundList: window.imageBackgroundList || (() => ''),
  classImageCandidates: window.classImageCandidates || (() => []),
  heroTrainCost: window.heroTrainCost,
  renderCharacterStatSections: (s) => { if (window.RuneFrontierRenderRuntime?.renderCharacterStatSections) return window.RuneFrontierRenderRuntime.renderCharacterStatSections(s); return ''; },
  renderCharacterStatBreakdown: (s) => { if (window.RuneFrontierRenderRuntime?.renderCharacterStatBreakdown) return window.RuneFrontierRenderRuntime.renderCharacterStatBreakdown(s); return ''; },
  renderSetTalentStatus: window.renderSetTalentStatus,
  renderTitlePanel: () => { if (window.RuneFrontierRenderRuntime?.renderTitlePanel) return window.RuneFrontierRenderRuntime.renderTitlePanel(); return ''; },
  renderPowerSourcePanel: (s) => { if (window.RuneFrontierRenderRuntime?.renderPowerSourcePanel) return window.RuneFrontierRenderRuntime.renderPowerSourcePanel(s); return ''; },
  renderSkillPanel: () => { if (window.RuneFrontierRenderRuntime?.renderSkillPanel) return window.RuneFrontierRenderRuntime.renderSkillPanel(); return ''; },
  renderSkillSummaryCard: () => { if (window.RuneFrontierRenderRuntime?.renderSkillSummaryCard) return window.RuneFrontierRenderRuntime.renderSkillSummaryCard(); return ''; },
  renderJobSkills: () => { if (window.RuneFrontierRenderRuntime?.renderJobSkills) return window.RuneFrontierRenderRuntime.renderJobSkills(); return ''; },
  describeJobGrowth: window.describeJobGrowth,
  jobSummary: window.jobSummary,
  computeEquipmentFullStats: window.computeEquipmentFullStats,
  getCardStats: window.getCardStats,
  getTitleEffects: window.getTitleEffects,
  getVipBonuses: window.getVipBonuses,
  getMapExplorationBonuses: window.getMapExplorationBonuses,
  getMvpInscriptionView: window.getMvpInscriptionView,
  canGainMvpInscriptionOnCurrentMap: window.canGainMvpInscriptionOnCurrentMap,
  getNextJobId: window.getNextJobId,
  getFirstJobs() { return window.firstJobs || []; },
  getJobTemplates() { return window.jobTemplates || {}; },
  getJobTemplate() { return window.jobTemplates || {}; },
  getTitleDb() { return window.TITLE_DB || {}; },
  normalizeTitles: window.normalizeTitles,
  titleEffectText: window.titleEffectText,
  getUnlockedSkills: window.getUnlockedSkills,
  getV3CombatSkills: window.getV3CombatSkills,
  getSkillMaxLevel: window.getSkillMaxLevel,
  getSkillFragmentCost: window.getSkillFragmentCost,
  getPassiveSkillTotals: window.getPassiveSkillTotals,
  getSkillGrowthEntry: window.getSkillGrowthEntry,
  getSkillMilestoneBonuses: window.getSkillMilestoneBonuses,
  describeSkillMilestone: window.describeSkillMilestone,
  getSkillMilestoneEntries: window.getSkillMilestoneEntries,
  skillTooltip: window.skillTooltip,
  formatSkillMultiplier: window.formatSkillMultiplier,
  statLabelName: window.statLabelName,
  statLine: window.statLine,
  renderStatGroup: window.renderStatGroup,
  getVipProgressInfo: window.getVipProgressInfo,
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
  percent: window.percent,
  formatStatValue: window.formatStatValue,
};
installCharacterRenderRuntime(characterRenderContext);
document.documentElement.dataset.runeModuleStatus = 'character-render-ready';

const equipmentRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  escapeHtml: window.escapeHtml, escapeAttr: window.escapeAttr,
  formatNumber: window.formatNumber, formatStatValue: window.formatStatValue,
  isAbyssEquipment: window.isAbyssEquipment, rarityName: window.rarityName,
  slotName: window.slotName, equipmentSlot: window.equipmentSlot,
  getMaxEquipmentCardSlots: window.getMaxEquipmentCardSlots,
  getEquipmentCardSlotCount: window.getEquipmentCardSlotCount,
  getSocketCard: window.getSocketCard,
  getRefineCost: window.getRefineCost, getRefineChance: window.getRefineChance,
  getEmpowerCost: window.getEmpowerCost,
  getRefineGrowthStats: window.getRefineGrowthStats,
  renderRefineStatDelta: window.renderRefineStatDelta,
  getSalvageRewardsPreview: window.getSalvageRewardsPreview,
  getMaterialNames() { return window.materialNames || {}; },
  getEquipmentSummaryEntries: window.getEquipmentSummaryEntries,
  calculateEquipmentScores: window.calculateEquipmentScores,
  compareEquipmentScores: window.compareEquipmentScores,
  formatScoreDelta: window.formatScoreDelta,
  getEquipmentUsageTags: window.getEquipmentUsageTags,
  groupEquipmentStats: window.groupEquipmentStats,
  equipmentStatEntry: window.equipmentStatEntry,
  getEffectiveItemStats: window.getEffectiveItemStats,
  getSpecialStatKeys() { return window.specialStatKeys || []; },
  statLabelName: window.statLabelName,
  getMechanicAffixes() { return window.MECHANIC_AFFIXES || {}; },
  statObjectText: window.statObjectText,
  star15Bonus: window.star15Bonus,
  getRandomStatEntries: window.randomStatEntries,
  countEquippedSetPieces: window.countEquippedSetPieces,
  getEquipmentSet: (id) => window.equipmentSets?.[id],
  materialText: window.materialText,
  hasMaterials: window.hasMaterials,
  isZodiacItem: window.isZodiacItem,
  currentJob: window.currentJob,
  pruneEquipmentDetailExpandedState: window.pruneEquipmentDetailExpandedState,
  equippedSlotMeta: window.equippedSlotMeta,
  getEquipmentShowAll() { return window.equipmentShowAll || false; },
  getEquipmentDetailExpanded() { return window.equipmentDetailExpandedState || {}; },
  sortEquipmentList: window.sortEquipmentList,
  filterEquipmentList: window.filterEquipmentList,
  equipmentDetailKey: window.equipmentDetailKey,
  equipmentVisualClass: window.equipmentVisualClass,
  refineText: window.refineText,
  empowerText: window.empowerText,
  imageBackgroundList: window.imageBackgroundList || (() => ''),
  itemImageCandidates: window.itemImageCandidates || (() => []),
  itemRangeTooltip: window.itemRangeTooltip,
  renderMaterialGroups: window.renderMaterialGroups,
  renderZodiacCollectionPanel: window.renderZodiacCollectionPanel,
  renderCostumePanel: window.renderCostumePanel,
  getCardPool() { return window.cardPool || []; },
};
installEquipmentRenderRuntime(equipmentRenderContext);
document.documentElement.dataset.runeModuleStatus = 'equipment-render-ready';

const smithyRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  escapeHtml: window.escapeHtml, escapeAttr: window.escapeAttr,
  formatNumber: window.formatNumber, percent: window.percent,
  slotName: window.slotName,
  materialText: window.materialText,
  hasMaterials: window.hasMaterials,
  renderItemName: window.renderItemName,
  statIsPercent: window.statIsPercent,
  statLabelName: window.statLabelName,
  getSmithyActiveTab() { return (window.state || {}).smithyActiveTab || 'enhance'; },
  getEnhanceCost: window.getEnhanceCost,
  getEnhanceChance: window.getEnhanceChance,
  getEnhanceEffect: window.getEnhanceEffect,
  getEnhanceMilestoneBonuses: window.getEnhanceMilestoneBonuses,
  getEnhanceMaxLevel() { return window.ENHANCE_MAX_LEVEL || 20; },
  getEnhanceSafeZoneText: window.getEnhanceSafeZoneText,
  getEnhanceFailResultText: window.getEnhanceFailResultText,
  getEnhancePassiveDb() { return window.ENHANCE_PASSIVE_DB || {}; },
  getEquipmentSets() { return window.equipmentSets || {}; },
  getCraftableSets() { return Object.values(window.equipmentSets || {}).filter((s) => s.items?.some((i) => i.craftable)); },
  getZodiacCollection() { return window.getZodiacCollection?.() || {}; },
  renderStarRefineSmithyPanel: window.renderStarRefineSmithyPanel,
  renderCardSocketSmithyPanel: window.renderCardSocketSmithyPanel,
  renderCostumePanel: window.renderCostumePanel,
  renderDarkGoldExchangeCard: window.renderDarkGoldExchangeCard,
  getRefineResult() { return window.refineResultState || null; },
  getCardSocketCost: window.getCardSocketCost,
  getEquipmentCardSlotCount: window.getEquipmentCardSlotCount,
  getMaxEquipmentCardSlots: window.getMaxEquipmentCardSlots,
  canAffordSocketCost: window.canAffordSocketCost,
  canContinueRefine: window.canContinueRefine,
  getMaterialName: (id) => (window.materialNames || {})[id] || id,
};
installSmithyRenderRuntime(smithyRenderContext);
document.documentElement.dataset.runeModuleStatus = 'smithy-render-ready';

const mapRenderContext = { getState() { return window.state || {}; }, getEls() { return window.els || {}; }, escapeHtml: window.escapeHtml, escapeAttr: window.escapeAttr, formatNumber: window.formatNumber, percent: window.percent, getMaps() { return window.maps || []; }, progressText: window.progressText, getDifficultyConfigs() { return window.DIFFICULTY_CONFIG || {}; }, getMapLevelRange: window.getMapLevelRange, getMapPreviewStats: window.getMapPreviewStats, getRecommendedScoresForMap: window.getRecommendedScoresForMap, getAbyssMapTierScales() { return window.ABYSS_MAP_TIER_SCALE || {}; }, getHardMapTierScales() { return window.HARD_MAP_TIER_SCALE || {}; }, bossDisplayName: window.bossDisplayName, getMapExplorationEntry: window.getMapExplorationEntry, getMapExplorationRequirements() { return window.MAP_EXPLORATION_REQUIREMENTS || []; }, getMapExplorationBonuses: window.getMapExplorationBonuses, formatRangeNumber: window.formatRangeNumber, mapDropTooltip: window.mapDropTooltip, formatEquipmentProgressionSummary: window.formatMapEquipmentProgression };
installMapRenderRuntime(mapRenderContext);
document.documentElement.dataset.runeModuleStatus = 'map-render-ready';

const cardRenderContext = {
  getState() { return window.state || {}; },
  getEls() { return window.els || {}; },
  escapeHtml: window.escapeHtml,
  formatNumber: window.formatNumber,
  percent: window.percent,
  getCardPool() { return window.cardPool || []; },
  getBossCardPool() { return window.bossCardPool || []; },
  getCardType: window.getCardType,
  cardTypeLabel: window.cardTypeLabel,
  cardEffectText: window.cardEffectText,
  cardActivationText: window.cardActivationText,
  awakenedCardEffects: window.awakenedCardEffects,
  cardUsageText: window.cardUsageText,
  getAwakenCardCost() { return window.AWAKEN_CARD_COST || 100; },
  getBossCardSynthesisCost() { return window.BOSS_CARD_SYNTHESIS_COST || 100; },
  getMaterialName: (id) => (window.materialNames || {})[id] || id,
};
installCardRenderRuntime(cardRenderContext);
document.documentElement.dataset.runeModuleStatus = 'card-render-ready';

const onboardingGuideContext = {
	getState() { return window.state || {}; },
	getEls() { return window.els || {}; },
	escapeHtml: window.escapeHtml,
	progressText: window.progressText,
	bossDisplayName: window.bossDisplayName,
	currentMap: window.currentMap,
};
installOnboardingGuideRuntime(onboardingGuideContext);
document.documentElement.dataset.runeModuleStatus = 'onboarding-render-ready';

const taskRenderContext = { getState() { return window.state || {}; }, getEls() { return window.els || {}; }, escapeHtml: window.escapeHtml, formatNumber: window.formatNumber, normalizeDailyGoals: window.normalizeDailyGoals, achievementRewardText: window.achievementRewardText, questRewardText: window.questRewardText, getAchievementDb() { return window.ACHIEVEMENT_DB || []; }, getAchievementEntry: window.getAchievementEntry, };
installTaskRenderRuntime(taskRenderContext);
document.documentElement.dataset.runeModuleStatus = 'task-render-ready';

const logRenderContext = { getState() { return window.state || {}; }, getEls() { return window.els || {}; }, escapeHtml: window.escapeHtml, };
installLogRenderRuntime(logRenderContext);
document.documentElement.dataset.runeModuleStatus = 'log-render-ready';

installAdviceRenderRuntime({ escapeHtml: window.escapeHtml, formatNumber: window.formatNumber, getCurrentGoal: window.getCurrentGoal, getPlayerWeakness: window.getPlayerWeakness, getRecommendedActions: window.getRecommendedActions, getCurrentRecommendedScoreGap: window.getCurrentRecommendedScoreGap, });
document.documentElement.dataset.runeModuleStatus = 'render-ready';

if (typeof window.bootstrapLegacyRuntime === 'function') {
  const started = window.bootstrapLegacyRuntime();
  if (started === false && typeof window.renderAll === 'function') {
    window.renderAll();
  }
} else {
  console.error('[Rune Frontier] Classic runtime bootstrap bridge is unavailable.');
}

if (DEV_MODE) {
  const devContext = typeof window.RuneFrontierLegacyDevContext === 'function'
    ? window.RuneFrontierLegacyDevContext()
    : null;
  if (!devContext) {
    console.error('[Dev Debug] Live legacy diagnostics context is unavailable.');
  } else {
    import('./dev/devBridge.js')
      .then(({ createDevBridge }) => {
        window.RuneFrontierDevBridge = createDevBridge(devContext);
        return import('./ui/debugPanel.js');
      })
      .then(({ mountDebugPanel }) => mountDebugPanel())
      .catch((error) => console.error('[Dev Debug] Failed to initialize diagnostics.', error));
  }
}

document.documentElement.dataset.runeModuleStatus = 'ready';

// Post-load overrides for material descriptions defined by the classic runtime.
window.addEventListener('DOMContentLoaded', () => {
  const applyOverrides = () => {
    if (typeof ZODIAC_CARD_BY_SET === 'undefined') {
      setTimeout(applyOverrides, 50);
      return;
    }
    Object.entries(ZODIAC_CARD_BY_SET).forEach(([, materialId]) => {
      window.MATERIAL_DB[materialId] = {
        id: materialId,
        name: window.materialNames[materialId] || materialId,
        rarity: 'legend',
        type: 'zodiac_card',
        description: '\u5206\u89e3\u5bf9\u5e94\u661f\u5ea7\u5957\u88c5\u90e8\u4ef6\u83b7\u5f97\uff0c\u53ef\u7528\u4e8e\u6253\u9020\u661f\u5ea7\u65f6\u88c5\u3002',
      };
    });
    window.MATERIAL_DB.mythicEssence = {
      id: 'mythicEssence',
      name: window.materialNames.mythicEssence,
      rarity: 'mythic',
      type: 'material',
      description: '\u795e\u8bdd\u88c5\u5907\u5206\u89e3\u83b7\u5f97\u7684\u9ad8\u9636\u6750\u6599\u3002',
    };
    window.MATERIAL_DB.darkGoldFragment = {
      id: 'darkGoldFragment',
      name: window.materialNames.darkGoldFragment,
      rarity: 'darkGold',
      type: 'material',
      description: 'Boss\u6218\u548c\u6df1\u6e0a\u6218\u6781\u7a00\u6709\u6389\u843d\uff0c\u7528\u4e8e\u6697\u91d1\u88c5\u5907\u5151\u6362\u3002',
    };
    window.MATERIAL_DB.rebirthSeal = {
      id: 'rebirthSeal',
      name: window.materialNames.rebirthSeal,
      rarity: 'epic',
      type: 'material',
      description: '\u8f6c\u751f\u6a21\u5f0f\u51fb\u8d25\u8f6e\u56de\u654c\u4eba\u83b7\u5f97\uff0c\u7528\u4e8e\u8f6c\u751f\u7814\u7a76\u4e0e\u953b\u9020\u3002',
    };
    console.log('[Rune Frontier] Post-load material overrides applied.');
  };
  applyOverrides();
});

console.log('[Rune Frontier] Module system initialized. Phase 3 batch 6.');
