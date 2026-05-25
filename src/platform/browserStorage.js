// Browser localStorage wrapper
// Future: replace with wx.setStorageSync / wx.getStorageSync for WeChat Mini Games

export const STORAGE_KEYS = Object.freeze({
  save: 'rune-frontier-idle-save-v2',
  legacySave: 'rune-frontier-idle-save-v1',
  backup: 'rune-frontier-idle-save-v2-backup',
});

export function get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('Storage full or unavailable:', e);
    return false;
  }
}

export function remove(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getSave() {
  return get(STORAGE_KEYS.save) || get(STORAGE_KEYS.legacySave);
}

export function setSave(state) {
  return set(STORAGE_KEYS.save, state);
}

export function clearSave() {
  remove(STORAGE_KEYS.save);
  remove(STORAGE_KEYS.legacySave);
}

export function getBackup() {
  return get(STORAGE_KEYS.backup);
}

export function setBackup(state) {
  return set(STORAGE_KEYS.backup, state);
}

// Attach to window for legacy game.js access
window.storage = { get, set, remove, getSave, setSave, clearSave, getBackup, setBackup, keys: STORAGE_KEYS };
