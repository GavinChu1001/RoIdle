export const CRAFTING_MASTERY_MAX_LEVEL = 100;

export const PRODUCTION_MATERIALS = Object.freeze({
  tierOre: { id: 'tierOre', label: '阶位矿石', desc: '装备打造的基础矿石。' },
  refinedOre: { id: 'refinedOre', label: '精炼矿锭', desc: '经过冶炼的通用打造材料。' },
  rareOre: { id: 'rareOre', label: '稀有矿脉结晶', desc: '高阶打造所需的稀有矿物。' },
  weaponEmbryo: { id: 'weaponEmbryo', label: '武器胚子', desc: '用于打造武器的半成品。' },
  armorEmbryo: { id: 'armorEmbryo', label: '防具胚子', desc: '用于打造防具的半成品。' },
  accessoryEmbryo: { id: 'accessoryEmbryo', label: '饰品胚子', desc: '用于打造饰品的半成品。' },
  craftingComponent: { id: 'craftingComponent', label: '工匠组件', desc: '稳定打造品质的通用组件。' },
  masterCraftVoucher: { id: 'masterCraftVoucher', label: '大师打造券', desc: '用于大师级打造的凭证。' },
});

export const MINING_NODES = Object.freeze({
  grass: {
    id: 'grass',
    label: '南门矿点',
    unlockLevel: 1,
    intervalSec: 60,
    yields: { tierOre: [3, 6], refinedOre: [0, 1] },
  },
  forest: {
    id: 'forest',
    label: '森林矿脉',
    unlockLevel: 15,
    intervalSec: 120,
    yields: { tierOre: [5, 9], refinedOre: [1, 3], rareOre: [0, 1] },
  },
  abyss: {
    id: 'abyss',
    label: '深渊晶脉',
    unlockLevel: 60,
    intervalSec: 300,
    yields: { refinedOre: [4, 8], rareOre: [1, 3], masterCraftVoucher: [0, 1] },
  },
});

export const ARTISAN_JOBS = Object.freeze({
  weaponEmbryo: {
    id: 'weaponEmbryo',
    label: '锻造武器胚子',
    seconds: 180,
    cost: { tierOre: 12, refinedOre: 3 },
    output: { weaponEmbryo: 1 },
  },
  armorEmbryo: {
    id: 'armorEmbryo',
    label: '锻造防具胚子',
    seconds: 180,
    cost: { tierOre: 10, refinedOre: 4 },
    output: { armorEmbryo: 1 },
  },
  accessoryEmbryo: {
    id: 'accessoryEmbryo',
    label: '锻造饰品胚子',
    seconds: 210,
    cost: { tierOre: 8, refinedOre: 5, rareOre: 1 },
    output: { accessoryEmbryo: 1 },
  },
  craftingComponent: {
    id: 'craftingComponent',
    label: '组装工匠组件',
    seconds: 120,
    cost: { refinedOre: 4 },
    output: { craftingComponent: 2 },
  },
});

export const CRAFTING_MASTERY_LEVELS = Object.freeze([
  { level: 1, rarity: 'rare', tier: 3, label: 'Lv1 稀有 / T3' },
  { level: 21, rarity: 'epic', tier: 5, label: 'Lv21 史诗 / T5' },
  { level: 41, rarity: 'legend', tier: 7, label: 'Lv41 传说 / T7' },
  { level: 61, rarity: 'darkGold', tier: 9, label: 'Lv61 暗金 / T9' },
  { level: 81, rarity: 'mythic', tier: 10, label: 'Lv81 神话 / T10' },
]);

export function getCraftingMasteryBand(level) {
  const numericLevel = Math.max(1, Math.min(CRAFTING_MASTERY_MAX_LEVEL, Math.floor(Number(level) || 1)));
  return CRAFTING_MASTERY_LEVELS.reduce((best, band) => (
    numericLevel >= band.level ? band : best
  ), CRAFTING_MASTERY_LEVELS[0]);
}
