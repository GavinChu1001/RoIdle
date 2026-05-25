// Save/load abstraction layer
// Phase 2 delegates to game.js functions. Phase 3+ will move logic here.

import {
  STORAGE_KEYS,
  getBackup as storageGetBackup,
  getSave as storageGetSave,
  setBackup as storageSetBackup,
  setSave as storageSetSave,
  clearSave as storageClearSave,
} from '../platform/browserStorage.js';

export const SAVE_KEY = STORAGE_KEYS.save;
export const LEGACY_SAVE_KEY = STORAGE_KEYS.legacySave;

export function loadGame() {
  try {
    const saved = storageGetSave();
    if (!saved) return null;
    if (typeof window.mergeState !== 'function' || typeof window.createDefaultState !== 'function') {
      return saved;
    }
    const base = window.createDefaultState();
    return window.mergeState(base, saved);
  } catch (e) {
    console.error('loadGame error:', e);
    return null;
  }
}

export function backupSave() {
  const current = storageGetSave();
  return current ? storageSetBackup(current) : false;
}

export function restoreBackup() {
  return storageGetBackup();
}

export function saveGame(state) {
  try {
    if (!state) return false;
    backupSave();
    state.lastSavedAt = Date.now();
    state.lastActiveAt = state.lastSavedAt;
    return storageSetSave(state);
  } catch (e) {
    console.error('saveGame error:', e);
    return false;
  }
}

export function clearGameSave() {
  storageClearSave();
}

export function exportSave(state) {
  return JSON.stringify(state, null, 2);
}

export function importSave(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}
