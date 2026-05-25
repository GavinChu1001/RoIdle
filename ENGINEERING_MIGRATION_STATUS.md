# game.js Migration Status - Batch 5

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime in this batch. Startup ownership is now held by `src/main.js`: it installs module-owned read calculations and then invokes the guarded classic-runtime bootstrap exactly once. The classic fallback can still start the page if the module bootstrap is unavailable.

Equipment display naming, effective item stats, multi-axis equipment scores, equipment creation/acceptance, recent-loot recording, loot view normalization, offline equipment settlement, and online/offline reward categories now have formal implementations in `src/systems`. Existing global calls in `game.js` forward to module runtimes once installed, while legacy bodies remain startup-safety fallbacks during the staged migration.

## Formalized In This Batch

- Module-controlled one-shot startup via `window.bootstrapLegacyRuntime()`.
- Read-only equipment module runtime via `window.RuneFrontierEquipmentRuntime`.
- Equipment calculation parity fixtures covering refine/empower, abyss bonuses, mechanic affixes, socket bonuses, and safe display naming.
- Stateful online equipment generation, inventory acceptance and auto-salvage protection through `RuneFrontierEquipmentRuntime`.
- Online equipment table drops and recent-loot record management through `RuneFrontierDropsRuntime`.
- Stable loot-view normalization and recent-batch merging through `RuneFrontierDropsRuntime`.
- Offline equipment acceptance, auto-salvage handling, pending equipment retries and viewed-state handling through `RuneFrontierOfflineRuntime`.
- Online material, card, zodiac/transition set, mythic and mutation rewards through `RuneFrontierDropsRuntime`.
- Offline material, card and special-equipment reward candidates through `RuneFrontierOfflineRuntime`.
- Module status metadata now distinguishes migrated reward categories from deferred offline time/experience and Boss victory settlement.

## Deliberately Retained In game.js

- Offline time, kill-count and gold/experience calculations, plus the ordinary offline equipment random-table loop.
- The existing loot-summary HTML renderer.
- Refine/star-refine/socket state changes and legacy manual/batch dismantle entry points.
- Legacy equipment read bodies as guarded fallback implementations until stateful equipment migration is complete.
- Boss victory-specific reward/progression settlement, including Boss essence grants.
- Combat, skills, Boss/abyss handling, main loop.
- Character/equipment/smithy/VIP/codex/shop/battle renderers.
- Save/auth implementation and all `window` action interfaces still consumed by pages or diagnostics.

## Deferred Because It Is Unsafe In This Batch

- Data tables are not promoted as runtime authority yet. Some split table files contain historical display-text encoding damage or may differ from currently running tables.
- Display/configuration tables are not promoted as authority because split copies still require a separate encoding and behavior audit.
- No build pipeline is introduced. The repository currently has a Node server and browser ES modules, but no existing bundler configuration.

## Next Migration Order

1. Move Boss victory reward settlement together with combat entry points now that drop categories are module-owned.
2. Move remaining combat orchestration and offline time/experience calculation.
3. Move page renderers, VIP, codex, and shop behavior, then retire legacy fallbacks.
