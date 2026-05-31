function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function safeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function collectionKey(item = {}) {
  const series = item.series || item.upgradePathId || 'oldWorld';
  const tier = item.growthTier || item.tier || item.rarity || 'normal';
  const slot = item.slot || item.equipSlot || 'weapon';
  const rarity = item.rarity || item.tier || 'normal';
  return [series, tier, slot, rarity].map((part) => String(part || '')).join(':');
}

export function defaultCollectionState() {
  return {
    version: 1,
    equipment: {},
    cards: {},
    bosses: {},
    maps: {},
    rewardsClaimed: {},
  };
}

export function normalizeCollectionState(input = {}) {
  const source = safeObject(input);
  const base = defaultCollectionState();
  return {
    version: 1,
    equipment: { ...base.equipment, ...safeObject(source.equipment) },
    cards: { ...base.cards, ...safeObject(source.cards) },
    bosses: { ...base.bosses, ...safeObject(source.bosses) },
    maps: { ...base.maps, ...safeObject(source.maps) },
    rewardsClaimed: { ...base.rewardsClaimed, ...safeObject(source.rewardsClaimed) },
  };
}

export function recordEquipmentCollection(state = {}, item = {}, meta = {}) {
  if (!item || typeof item !== 'object') return null;
  const root = state && typeof state === 'object' ? state : {};
  const collections = normalizeCollectionState(root.collections);
  const key = collectionKey(item);
  const current = safeObject(collections.equipment[key]);
  const count = safeInteger(current.count) + 1;
  const entry = {
    ...current,
    key,
    count,
    firstSource: current.firstSource || meta.source || item.source || '',
  };
  collections.equipment[key] = entry;
  root.collections = collections;
  return entry;
}

export function recordBossCollection(state = {}, bossId = '', meta = {}) {
  const id = String(bossId || '');
  if (!id) return null;
  const root = state && typeof state === 'object' ? state : {};
  const collections = normalizeCollectionState(root.collections);
  const current = safeObject(collections.bosses[id]);
  const elapsed = Number(meta.fastestMs);
  const fastestMs = Number.isFinite(elapsed) && elapsed > 0
    ? Math.min(current.fastestMs || elapsed, elapsed)
    : current.fastestMs || null;
  const entry = {
    ...current,
    id,
    kills: safeInteger(current.kills) + 1,
    fastestMs,
  };
  collections.bosses[id] = entry;
  root.collections = collections;
  return entry;
}

export function buildCollectionSummary(state = {}) {
  const source = state?.collections && typeof state.collections === 'object' ? state.collections : state;
  const collections = normalizeCollectionState(source);
  return {
    equipmentCount: Object.keys(collections.equipment).length,
    cardCount: Object.keys(collections.cards).length,
    bossCount: Object.keys(collections.bosses).length,
    mapCount: Object.keys(collections.maps).length,
  };
}
