function safeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : {};
}

function safeInteger(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.floor(number)) : 0;
}

function safePositiveInteger(value, fallback = 1) {
  const count = safeInteger(value);
  return count > 0 ? count : fallback;
}

function collectionKey(item = {}) {
  const series = item.series || item.upgradePathId || 'oldWorld';
  const tier = item.growthTier || item.tier || item.rarity || 'normal';
  const slot = item.slot || item.equipSlot || 'weapon';
  const rarity = item.rarity || item.tier || 'normal';
  return [series, tier, slot, rarity].map((part) => String(part || '')).join(':');
}

function splitEquipmentKey(key = '') {
  const parts = String(key || '').split(':');
  return parts.length >= 4
    ? { series: parts[0], tier: parts[1], slot: parts[2], rarity: parts[3] }
    : {};
}

function normalizeEquipmentEntries(entries = {}) {
  return Object.entries(safeObject(entries)).reduce((result, [key, value]) => {
    const entry = safeObject(value);
    if (!Object.keys(entry).length) return result;
    const fromKey = splitEquipmentKey(entry.key || key);
    const series = entry.series || fromKey.series;
    const tier = entry.tier || entry.growthTier || fromKey.tier;
    const slot = entry.slot || entry.equipSlot || fromKey.slot;
    const rarity = entry.rarity || fromKey.rarity;
    if (!series || !tier || !slot || !rarity) return result;
    const id = entry.id || entry.key || key || collectionKey({ series, tier, slot, rarity });
    const normalizedKey = entry.key || collectionKey({ series, tier, slot, rarity });
    result[normalizedKey] = {
      ...entry,
      id,
      key: normalizedKey,
      series,
      tier,
      slot,
      rarity,
      count: safePositiveInteger(entry.count),
    };
    return result;
  }, {});
}

function normalizeCountedEntries(entries = {}, idField = 'id') {
  return Object.entries(safeObject(entries)).reduce((result, [key, value]) => {
    const entry = safeObject(value);
    if (!Object.keys(entry).length) return result;
    const id = entry[idField] || entry.id || key;
    if (!id) return result;
    result[id] = {
      ...entry,
      [idField]: id,
      count: safePositiveInteger(entry.count),
    };
    return result;
  }, {});
}

function normalizeBossEntries(entries = {}) {
  return Object.entries(safeObject(entries)).reduce((result, [key, value]) => {
    const entry = safeObject(value);
    if (!Object.keys(entry).length) return result;
    const id = entry.id || key;
    if (!id) return result;
    const fastestMs = safeInteger(entry.fastestMs);
    result[id] = {
      ...entry,
      id,
      kills: safeInteger(entry.kills),
      fastestMs: fastestMs > 0 ? fastestMs : null,
    };
    return result;
  }, {});
}

function normalizeRewardEntries(entries = {}) {
  return Object.entries(safeObject(entries)).reduce((result, [key, value]) => {
    const entry = safeObject(value);
    if (!Object.keys(entry).length) return result;
    result[key] = { ...entry };
    return result;
  }, {});
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
  return {
    version: 1,
    equipment: normalizeEquipmentEntries(source.equipment),
    cards: normalizeCountedEntries(source.cards),
    bosses: normalizeBossEntries(source.bosses),
    maps: normalizeCountedEntries(source.maps),
    rewardsClaimed: normalizeRewardEntries(source.rewardsClaimed),
  };
}

export function recordEquipmentCollection(state = {}, item = {}, meta = {}) {
  if (!item || typeof item !== 'object') return null;
  const root = state && typeof state === 'object' ? state : {};
  const collections = normalizeCollectionState(root.collections);
  const key = collectionKey(item);
  const parts = splitEquipmentKey(key);
  const current = safeObject(collections.equipment[key]);
  const count = safeInteger(current.count) + 1;
  const entry = {
    ...current,
    id: current.id || key,
    key,
    series: current.series || parts.series,
    tier: current.tier || parts.tier,
    slot: current.slot || parts.slot,
    rarity: current.rarity || parts.rarity,
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
