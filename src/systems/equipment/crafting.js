import { PROGRESSION_EQUIPMENT_SLOTS, getEquipmentLineMaterials, normalizeEquipmentSeries, normalizeGrowthTier } from './itemProgression.js';

const RARITY_REQUIREMENTS = Object.freeze({
  rare: { level: 1 },
  epic: { level: 21 },
  legend: { level: 41 },
  darkGold: { level: 61, voucher: 1, extraCore: 2 },
  mythic: { level: 81, voucher: 3, extraCore: 4 },
});

const SLOT_EMBRYO = Object.freeze({
  weapon: 'weaponEmbryo',
  armor: 'armorEmbryo',
  headgear: 'armorEmbryo',
  shoes: 'armorEmbryo',
  trinket: 'accessoryEmbryo',
});

const RARITY_ORDER = Object.freeze(['rare', 'epic', 'legend', 'darkGold', 'mythic']);

function normalizeSlot(value) {
  const slot = String(value || 'weapon');
  return PROGRESSION_EQUIPMENT_SLOTS.some((entry) => entry.id === slot) ? slot : 'weapon';
}

function normalizeArchetype(value) {
  return ['physical', 'magic', 'general'].includes(value) ? value : 'general';
}

function normalizeRarity(value) {
  return RARITY_REQUIREMENTS[value] ? value : 'rare';
}

function addMaterial(materials, id, amount) {
  if (!id || amount <= 0) return;
  materials[id] = (materials[id] || 0) + Math.ceil(amount);
}

function tierNumber(growthTier) {
  return Math.max(1, Number(String(growthTier).replace(/^T/i, '')) || 1);
}

function hasRarityAtLeast(rarity, minimum) {
  return RARITY_ORDER.indexOf(rarity) >= RARITY_ORDER.indexOf(minimum);
}

function availableAmount(materials = {}, id) {
  return Math.max(0, Math.floor(Number(materials[id] || 0)));
}

function getProduction(state = {}) {
  if (!state.production || typeof state.production !== 'object') {
    state.production = { crafting: { level: 1, exp: 0, totalCrafts: 0, masterCrafts: 0 }, blueprints: { known: [], fragments: {} } };
  }
  if (!state.production.crafting || typeof state.production.crafting !== 'object') {
    state.production.crafting = { level: 1, exp: 0, totalCrafts: 0, masterCrafts: 0 };
  }
  if (!state.production.blueprints || typeof state.production.blueprints !== 'object') {
    state.production.blueprints = { known: [], fragments: {} };
  }
  if (!Array.isArray(state.production.blueprints.known)) {
    state.production.blueprints.known = [];
  }
  return state.production;
}

function templateMatches(template = {}, recipe = {}, archetype = recipe.archetype, requireGrowthTier = false) {
  if (!template || typeof template !== 'object') return false;
  if (template.series !== recipe.series) return false;
  if (template.slot !== recipe.slot && template.equipSlot !== recipe.slot) return false;
  if ((template.archetype || 'general') !== archetype) return false;
  return !requireGrowthTier || template.growthTier === recipe.growthTier;
}

function findTemplateFromList(recipe = {}, context = {}) {
  const templates = context.getProgressionEquipmentTemplates?.();
  if (!Array.isArray(templates)) return null;
  return templates.find((template) => templateMatches(template, recipe, recipe.archetype, true))
    || templates.find((template) => templateMatches(template, recipe, recipe.archetype, false))
    || templates.find((template) => templateMatches(template, recipe, 'general', true))
    || templates.find((template) => templateMatches(template, recipe, 'general', false))
    || null;
}

function getTemplateById(context = {}, id = '') {
  return context.getProgressionEquipmentTemplate?.(id) || context.getEquipmentTemplate?.(id) || null;
}

function resolveCraftingTemplate(recipe = {}, context = {}) {
  const listed = findTemplateFromList(recipe, context);
  if (listed) return listed;
  const candidates = [
    `prog_${recipe.series}_${recipe.series}_${recipe.archetype}_${recipe.slot}`,
    `prog_${recipe.series}_base_${recipe.archetype}_${recipe.slot}`,
    `prog_${recipe.series}_${recipe.growthTier}_${recipe.archetype}_${recipe.slot}`,
    `prog_${recipe.series}_${recipe.series}_general_${recipe.slot}`,
    `prog_${recipe.series}_base_general_${recipe.slot}`,
    `prog_${recipe.series}_${recipe.growthTier}_general_${recipe.slot}`,
  ];
  for (const id of candidates) {
    const template = getTemplateById(context, id);
    if (template) return template;
  }
  return null;
}

export function getEquipmentCraftingRecipe(request = {}) {
  const series = normalizeEquipmentSeries(request.series, 'ancientHero');
  const growthTier = normalizeGrowthTier(request.growthTier, 'T1');
  const slot = normalizeSlot(request.slot);
  const archetype = normalizeArchetype(request.archetype);
  const rarity = normalizeRarity(request.rarity);
  const requirement = RARITY_REQUIREMENTS[rarity];
  const tier = tierNumber(growthTier);
  const lineMaterials = getEquipmentLineMaterials(series);
  const materials = {};

  addMaterial(materials, SLOT_EMBRYO[slot], 1);
  addMaterial(materials, 'tierOre', 10 + tier * 4);
  addMaterial(materials, 'refinedOre', 3 + tier * 2);
  addMaterial(materials, lineMaterials.basic?.id, 4 + tier * 2);
  if (hasRarityAtLeast(rarity, 'epic')) {
    addMaterial(materials, lineMaterials.advanced?.id || 'craftingComponent', 2 + tier);
    addMaterial(materials, 'craftingComponent', 1 + Math.floor(tier / 2));
  }
  if (hasRarityAtLeast(rarity, 'legend')) {
    addMaterial(materials, lineMaterials.core?.id, 1 + Math.floor(tier / 3));
  }
  addMaterial(materials, lineMaterials.core?.id, requirement.extraCore || 0);
  addMaterial(materials, 'masterCraftVoucher', requirement.voucher || 0);

  return {
    id: `${series}_${slot}_${rarity}`,
    blueprintId: `${series}_${slot}_${rarity}`,
    series,
    growthTier,
    slot,
    archetype,
    rarity,
    level: requirement.level,
    materials,
    gold: Math.round(2500 * tier * (RARITY_ORDER.indexOf(rarity) + 1)),
    exp: Math.round(40 * tier * (RARITY_ORDER.indexOf(rarity) + 1)),
  };
}

export function canCraftEquipment(request = {}, context = {}) {
  const state = context.getState?.();
  if (!state || typeof state !== 'object') {
    return { ok: false, reason: 'state_missing', recipe: getEquipmentCraftingRecipe(request) };
  }
  const recipe = getEquipmentCraftingRecipe(request);
  const production = getProduction(state);
  const craftingLevel = Math.max(1, Math.floor(Number(production.crafting.level || 1)));
  if (craftingLevel < recipe.level) {
    return { ok: false, reason: 'level_too_low', recipe };
  }
  if (['darkGold', 'mythic'].includes(recipe.rarity) && !production.blueprints.known.includes(recipe.blueprintId)) {
    return { ok: false, reason: 'blueprint_missing', recipe };
  }
  if (Math.max(0, Number(state.gold || 0)) < recipe.gold) {
    return { ok: false, reason: 'not_affordable', recipe };
  }
  const materials = state.materials || {};
  const missingMaterial = Object.entries(recipe.materials)
    .some(([id, amount]) => availableAmount(materials, id) < amount);
  if (missingMaterial) {
    return { ok: false, reason: 'not_affordable', recipe };
  }
  return { ok: true, reason: 'ok', recipe };
}

export function craftEquipment(request = {}, context = {}) {
  const craftable = canCraftEquipment(request, context);
  if (!craftable.ok) return craftable;

  const state = context.getState();
  const { recipe } = craftable;
  const template = resolveCraftingTemplate(recipe, context);
  if (!template) {
    return { ok: false, reason: 'template_missing', recipe };
  }

  const dropLevel = template.requiredLevel || 1;
  const item = context.createItem?.(template, dropLevel, recipe.rarity, {
    source: 'crafted',
    dropMapId: 'crafting',
    dropLevel,
    series: recipe.series,
    growthTier: recipe.growthTier,
    archetype: recipe.archetype,
    allowMythic: recipe.rarity === 'mythic',
  });
  if (!item) {
    return { ok: false, reason: 'creation_failed', recipe };
  }

  state.gold -= recipe.gold;
  state.materials = state.materials || {};
  Object.entries(recipe.materials).forEach(([id, amount]) => {
    state.materials[id] = availableAmount(state.materials, id) - amount;
  });

  item.crafted = true;
  item.craftedBy = 'equipmentCrafting';
  item.craftingRecipeId = recipe.id;
  state.inventory = Array.isArray(state.inventory) ? state.inventory : [];
  state.inventory.unshift(item);

  const production = getProduction(state);
  if (['darkGold', 'mythic'].includes(recipe.rarity)) {
    production.crafting.masterCrafts = Math.max(0, Math.floor(Number(production.crafting.masterCrafts || 0))) + 1;
  }
  if (typeof context.addCraftingExperience === 'function') {
    context.addCraftingExperience(production, recipe.exp);
  } else {
    production.crafting.totalCrafts = Math.max(0, Math.floor(Number(production.crafting.totalCrafts || 0))) + 1;
    production.crafting.exp = Math.max(0, Math.floor(Number(production.crafting.exp || 0))) + recipe.exp;
  }

  context.recordEquipmentResearch?.(item, recipe);
  context.recordEquipmentCollection?.(item);
  context.showToast?.(`Crafted ${item.name || recipe.rarity}`);
  context.renderAll?.();
  context.save?.();

  return { ok: true, reason: 'crafted', recipe, item };
}
