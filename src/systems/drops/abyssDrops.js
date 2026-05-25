import { grantMutationMaterial } from './materialDrops.js';

let runtimeContext = {};

export function configureAbyssDropsContext(context = {}) {
  runtimeContext = context || {};
}

function finite(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function random(context = runtimeContext) {
  return context.random?.() ?? Math.random();
}

export function rollMythicEquipmentDrop(monster, stats = {}, options = {}, context = runtimeContext) {
  if (context.currentDifficulty?.() !== 'abyss') return 0;
  const rates = context.getMythicDropRates?.() || {};
  const bossMultiplier = context.getAbyssBossMultiplier?.() || {};
  const isBoss = Boolean(options.boss);
  const baseRate = isBoss ? finite(rates.abyssBoss) : monster?.mutation ? finite(rates.abyssMutation) : finite(rates.abyssNormal);
  const rate = baseRate * (isBoss ? finite(bossMultiplier.mythicDrop || 1) : 1);
  if (random(context) >= rate) return 0;
  const item = context.createMutationEquipment?.('mythic');
  if (!item) return 0;
  context.addEquipmentToInventory?.(item, { logDrop: true });
  context.addLogHtml?.(`\u795e\u8bdd\u88c5\u5907\u73b0\u4e16\uff1a${context.renderItemName?.(item) || ''}`);
  return 1;
}

export function rollMutationExtraDrops(monster, stats = {}, existingEquipmentDrops = 0, context = runtimeContext) {
  const mutation = monster?.mutation;
  if (!mutation) return 0;
  const difficulty = context.getDifficultyConfig?.() || { materialDrop: 1 };
  const config = context.getMutationExtraDrops?.() || {};
  const difficultyId = context.currentDifficulty?.() || 'normal';
  const dropBonus = Math.min(1.5, finite(stats.dropBonus));
  const equipmentDropBonus = Math.min(1.5, finite(stats.equipmentDropBonus ?? stats.dropBonus));
  const hardExtra = difficultyId === 'abyss' ? 2 : difficultyId === 'hard' ? 1.5 : 1;
  const materialRate = finite(config.materialBonusRate) * hardExtra * (1 + dropBonus) * finite(mutation.rareMaterialBonus || 1);
  const rareMaterialRate = finite(config.rareMaterialBonusRate) * hardExtra * (1 + dropBonus) * finite(mutation.rareMaterialBonus || 1);
  if (random(context) < materialRate * finite(difficulty.materialDrop || 1)) grantMutationMaterial(false, context);
  if (random(context) < rareMaterialRate * finite(difficulty.materialDrop || 1)) grantMutationMaterial(true, context);

  const maxEquipment = context.getMaxEquipmentDrops?.(context.isBossEncounter?.()) || 1;
  if (existingEquipmentDrops >= maxEquipment) return 0;
  const highRate = finite(config.highRarityEquipmentRate) * hardExtra * (1 + equipmentDropBonus) * finite(mutation.highRarityEquipmentBonus || 1);
  const darkRate = finite(config.darkGoldEquipmentRate) * (difficultyId === 'abyss' ? 1.5 : difficultyId === 'hard' ? 1.2 : 1) *
    (1 + equipmentDropBonus) * finite(mutation.highRarityEquipmentBonus || 1);
  let item = null;
  if (random(context) < darkRate) {
    item = context.createMutationEquipment?.('darkGold');
  } else if (random(context) < highRate) {
    item = context.createMutationEquipment?.((context.currentMapIndex?.() || 0) >= 3 ? 'legend' : 'epic');
  }
  if (!item) return 0;
  context.addEquipmentToInventory?.(item, { logDrop: true });
  return 1;
}

export function createMutationEquipment(rarity) {
  if (typeof window.createMutationEquipment === 'function') return window.createMutationEquipment(rarity);
  return null;
}
