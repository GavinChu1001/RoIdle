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
import { installEquipmentRuntime } from './systems/equipment/index.js';
import { installDropsRuntime } from './systems/drops/index.js';
import { installCombatRuntime } from './systems/combat/index.js';
import { installOfflineRuntime } from './systems/offline.js';

// UI layer (delegates to game.js via window)
import './ui/index.js';

export const DEV_MODE = new URLSearchParams(window.location.search).get('dev') === '1';
export const RUNTIME_AUTHORITY = 'game.js';

window.RuneFrontierModuleStatus = Object.freeze({
  authority: RUNTIME_AUTHORITY,
  bootstrapOwner: 'src/main.js',
  migrated: ['platform', 'storage-adapter', 'utils-surface', 'state-surface', 'equipment-read-calculations', 'equipment-online-mutations', 'online-equipment-drops', 'online-reward-categories', 'recent-loot-recording', 'loot-view-model', 'offline-equipment-settlement', 'offline-reward-categories', 'kill-and-boss-settlement', 'boss-challenge-state', 'combat-rounds-and-damage', 'active-skill-resolution', 'dev-diagnostics'],
  bridged: ['offline-time-and-exp-calculation', 'monster-spawn-and-stat-building', 'vip', 'codex', 'ui'],
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
const combatContext = typeof window.RuneFrontierLegacyCombatContext === 'function'
  ? window.RuneFrontierLegacyCombatContext()
  : {};
installCombatRuntime(combatContext);

if (typeof window.bootstrapLegacyRuntime === 'function') {
  window.bootstrapLegacyRuntime();
} else {
  console.error('[Rune Frontier] Classic runtime bootstrap bridge is unavailable.');
}

if (DEV_MODE) {
  import('./ui/debugPanel.js')
    .then(({ mountDebugPanel }) => mountDebugPanel())
    .catch((error) => console.error('[Dev Debug] Failed to initialize debug panel.', error));
}

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
    console.log('[Rune Frontier] Post-load material overrides applied.');
  };
  applyOverrides();
});

console.log('[Rune Frontier] Module system initialized. Phase 3 batch 6.');
