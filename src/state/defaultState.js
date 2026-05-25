// Default game state factory
// Delegates to game.js `createDefaultState()` (attached to window)
// Future: move the full function body here once systems are modular

export function createDefaultState() {
  if (typeof window.createDefaultState !== 'function') {
    throw new Error('game.js must be loaded before state modules.');
  }
  return window.createDefaultState();
}

// SAVE_VERSION used for migration tracking
export const SAVE_VERSION = 2;
