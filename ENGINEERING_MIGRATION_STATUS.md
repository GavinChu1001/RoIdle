# game.js Migration Status - Batch 14 (Audit & Cleanup)

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js` which installs 9 module runtimes (including RuneFrontierStateRuntime bridge) and boots the classic runtime.

## Migration Completion Summary

| Metric | Count |
|--------|-------|
| Total `game.js` lines | 13,780 |
| Total functions | 700 |
| `RuneFrontier*Runtime` references | 236 |
| Runtime modules (with `install*Runtime`) | 9 |
| Functions with runtime delegation | ~220 (95 render + 78 legacy-delegated + ~47 inline) |
| `legacyXxx` fallback functions | 78 |
| Render functions with delegation bridge | 95 |
| `LegacyContext` bridge objects | 8 (Equipment/Drops/Offline/Combat/Vip/Codex/Shop/State) |

## Core Runtime Migration: Substantially Complete

All major game logic domains now have module-owned runtimes:

| Domain | Runtime | Delegation | Context |
|--------|---------|------------|---------|
| Equipment (read + mutation) | `RuneFrontierEquipmentRuntime` | 31 functions | LegacyEquipmentContext |
| Drops (online + offline roll) | `RuneFrontierDropsRuntime` | 20 functions | LegacyDropsContext |
| Offline rewards | `RuneFrontierOfflineRuntime` | 15 functions | LegacyOfflineContext |
| Combat (rounds + boss + settlement + monster + encounter) | `RuneFrontierCombatRuntime` | 39 functions | LegacyCombatContext |
| VIP calculations | `RuneFrontierVipRuntime` | 9 functions | LegacyVipContext |
| Codex calculations | `RuneFrontierCodexRuntime` | 12 functions | LegacyCodexContext |
| Shop calculations | `RuneFrontierShopRuntime` | 7 functions | LegacyShopContext |
| State persistence | `RuneFrontierStateRuntime` | 6 functions | LegacyStateContext |
| UI rendering | `RuneFrontierRenderRuntime` | 95 functions | (not yet extracted) |

## Legacy Audit — 78 `legacyXxx` Functions

**Status:** RETAINED — tagged `/* [LEGACY-AUDIT: verify runtime parity before deletion] */`

These fallback bodies are not called in normal operation (runtimes are installed before bootstrap). They remain as startup safety.

**Deletion preconditions:**
1. Verify runtime implementations produce identical results via regression testing
2. Confirm all 9 runtimes install successfully in production
3. Confirm no direct `legacyXxx` callers exist in event handlers or tests

## Do Not Delete — Bridge Adapters

| Component | Reason |
|-----------|--------|
| `window.RuneFrontierDevBridge` | Used by `selfCheck.js:59` and `debugPanel.js` for state inspection and maintenance actions. Required diagnostic adapter. |
| `formatNumber`/`formatDuration`/`percent`/`escapeHtml` in game.js | Classic script loading order. `index.html` loads `src/main.js` (module, deferred) after `game.js` (classic, immediate). Replacing with module versions requires unified tool loading strategy. `formatDuration` has known behavioral difference (字符串格式). |
| 7 `LegacyContext` objects | Provide data-table access to module runtimes. Remove only when config tables are extracted to data scripts. |
| `bootstrapLegacyRuntime` | One-shot gate for classic runtime init. Required for startup. |

## Legacy Audit Inventory

### 14A. `legacyXxx` Function Index (78 functions)

All marked `[LEGACY-AUDIT]` in game.js. Deletion precondition: parity verified, all 9 runtimes installed, no direct callers.

| # | Function | Line | Runtime | Domain |
|---|----------|------|---------|--------|
| 1 | `legacyUpdateCombat` | 4506 | Combat | Combat round |
| 2 | `legacyGetTargetDamageBonus` | 4556 | Combat | Damage |
| 3 | `legacyIsBossChallengeReady` | 4601 | Combat | Boss state |
| 4 | `legacyIsCurrentlyFightingBoss` | 4611 | Combat | Boss state |
| 5 | `legacyCanHeroFight` | 4621 | Combat | Boss state |
| 6 | `legacyIsAutoBossInCooldown` | 4631 | Combat | Boss state |
| 7 | `legacyChallengeBoss` | 4641 | Combat | Boss |
| 8 | `legacyTryAutoChallengeBoss` | 4665 | Combat | Boss auto |
| 9 | `legacyGetAutoBossStatusText` | 4681 | Combat | Boss status |
| 10 | `legacyHandleAutoBossFailure` | 4698 | Combat | Boss failure |
| 11 | `legacyUpdateRecovery` | 4710 | Combat | Recovery |
| 12 | `legacyUpdateMonsterAttack` | 4731 | Combat | Monster attack |
| 13 | `legacyRollActiveSkill` | 4801 | Combat | Skills |
| 14 | `legacySkillAttributeMultiplier` | 4856 | Combat | Skills |
| 15 | `legacyNormalizeDamage` | 5130 | Combat | Damage |
| 16 | `legacySanitizeDamage` | 5144 | Combat | Damage |
| 17 | `legacyGrantBossEssence` | 5154 | Combat | Boss reward |
| 18 | `legacyDefeatEnemy` | 5178 | Combat | Settlement |
| 19 | `legacySpawnEnemy` | 5309 | Combat | Encounter |
| 20 | `legacyCurrentMonsterStats` | 5331 | Combat | Encounter |
| 21 | `legacyNormalizeEnemyGroup` | 5346 | Combat | Encounter |
| 22 | `legacyCreateEnemyGroup` | 5366 | Combat | Encounter |
| 23 | `legacyGetEncounterSize` | 5381 | Combat | Encounter |
| 24 | `legacyGetEncounterLabel` | 5396 | Combat | Encounter |
| 25 | `legacyCreateEncounterMonster` | 5411 | Combat | Encounter |
| 26 | `legacySyncActiveEnemyFromGroup` | 5433 | Combat | Encounter |
| 27 | `legacyUpdateActiveEnemyHpInGroup` | 5461 | Combat | Encounter |
| 28 | `legacyHasLivingEncounterMembers` | 5478 | Combat | Encounter |
| 29 | `legacyGetMapLevelRange` | 5491 | Combat | Map data |
| 30 | `legacyBossDisplayName` | 5506 | Combat | Presentation |
| 31 | `legacyPickMonsterTemplate` | 5519 | Combat | Monster |
| 32 | `legacyGetMonsterTemplate` | 5537 | Combat | Monster |
| 33 | `legacyCurrentDifficultyConfig` | 5551 | Combat | Difficulty |
| 34 | `legacyGetMutationById` | 5563 | Combat | Mutation |
| 35 | `legacyRollMonsterMutation` | 5575 | Combat | Mutation |
| 36 | `legacyRollMonsterLevel` | 5589 | Combat | Monster |
| 37 | `legacyBuildMonsterStats` | 5605 | Combat | Monster stats |
| 38 | `legacyGetMonsterDifficultyType` | 5666 | Combat | Difficulty |
| 39 | `legacyApplyMonsterDifficultyModifier` | 5687 | Combat | Difficulty |
| 40 | `legacyRollDrops` | 5799 | Drops | Orchestration |
| 41 | `legacyGrantCardDrop` | 5824 | Drops | Cards |
| 42 | `legacyRollCardDropsFromTable` | 5844 | Drops | Cards |
| 43 | `legacyMaybeDropBossCardFragments` | 5867 | Drops | Boss card |
| 44 | `legacyMaybeDropSocketMaterials` | 5888 | Drops | Socket mats |
| 45 | `legacyMaybeDropDarkGoldFragments` | 5917 | Drops | Dark gold |
| 46 | `legacyRollMythicEquipmentDrop` | 5942 | Drops | Mythic |
| 47 | `legacyRollMapMaterialDrops` | 5964 | Drops | Materials |
| 48 | `legacyRollZodiacSetDrops` | 5989 | Drops | Zodiac set |
| 49 | `legacyRollTransitionSetDrops` | 6037 | Drops | Transition set |
| 50 | `legacyRollEquipmentTableDrops` | 6074 | Drops | Equipment table |
| 51 | `legacyRollEquipmentDropsFromTable` | 6091 | Drops | Equipment table |
| 52 | `legacyRollMutationExtraDrops` | 6192 | Drops | Mutation |
| 53 | `legacyGrantMutationMaterial` | 6232 | Drops | Materials |
| 54 | `legacyMaybeDropMythicEssence` | 6252 | Drops | Mythic |
| 55 | `legacyAddEquipmentToInventory` | 6306 | Equipment | Inventory |
| 56 | `legacyCreateItem` | 6414 | Equipment | Creation |
| 57 | `legacyGetDisplayItemName` | 6809 | Equipment | Display |
| 58 | `legacyNormalizeItem` | 6827 | Equipment | Normalization |
| 59 | `legacyClaimOffline` | 7549 | Offline | Claim |
| 60 | `legacyGetPendingOfflineRewards` | 7608 | Offline | View |
| 61 | `legacyHasPendingOfflineRewards` | 7612 | Offline | View |
| 62 | `legacyGetLootRewardsForView` | 7626 | Offline | View |
| 63 | `legacyNormalizeRecentLoot` | 7840 | Drops | Recent loot |
| 64 | `legacyRecordRecentLoot` | 7868 | Drops | Recent loot |
| 65 | `legacyGetLatestRecentLootRewards` | 7960 | Drops | Recent loot |
| 66 | `legacyMarkRecentLootViewed` | 7968 | Drops | Recent loot |
| 67 | `legacyMergeRecentLootRewards` | 7981 | Drops | Recent loot |
| 68 | `legacyCalculateOfflineRewards` | 8111 | Offline | Calculation |
| 69 | `legacyBuildOfflineMonsterStats` | 8175 | Offline | Monster |
| 70 | `legacyRollOfflineZodiacSetDrops` | 8224 | Offline | Zodiac |
| 71 | `legacyRollOfflineTransitionSetDrops` | 8256 | Offline | Transition |
| 72 | `legacyRollOfflineMythicDrops` | 8283 | Offline | Mythic |
| 73 | `legacyRollOfflineCardDrops` | 8304 | Offline | Cards |
| 74 | `legacyRollOfflineMaterialDrops` | 8330 | Offline | Materials |
| 75 | `legacyRollOfflineMutationExtraDrops` | 8354 | Offline | Mutation |
| 76 | `legacyNormalizeLootRewards` | 8401 | Drops | Loot model |
| 77 | `legacyCalculateEquipmentScores` | 13005 | Equipment | Scoring |
| 78 | `legacyGetEffectiveItemStats` | 13394 | Equipment | Stats calc |

### 14B. Runtime Forwarding Points (~236)

| Runtime | Count | Delegates from |
|---------|-------|----------------|
| `RuneFrontierRenderRuntime` | 96 | 95 render functions + 1 helper |
| `RuneFrontierCombatRuntime` | 39 | Combat rounds, boss, damage, skills, settlement, monster pipeline, encounter pipeline |
| `RuneFrontierEquipmentRuntime` | 32 | Item creation, stats, scoring, naming, dismantle, refine, star refine, socket, inventory |
| `RuneFrontierDropsRuntime` | 20 | Online/offline drop rolling, loot normalization, recent loot |
| `RuneFrontierOfflineRuntime` | 15 | Offline calculation, drop loops, claiming, equipment processing |
| `RuneFrontierCodexRuntime` | 12 | Monster/card mastery, bonuses, reward claiming |
| `RuneFrontierVipRuntime` | 9 | VIP bonuses, milestones, daily gift, inventory limit |
| `RuneFrontierShopRuntime` | 7 | Shop state, purchase counting, cost formatting, buy/ship |
| `RuneFrontierStateRuntime` | 6 | load, save, mergeState, sanitizeProgression, createDefaultState, resetSave |
| **Total** | **236** | |

### 14C. bindEvents() Button Bridge Audit

| Callback | Delegated? | Runtime | Notes |
|----------|:--:|---------|-------|
| `challengeBoss` | Yes | Combat | Boss challenge button |
| `setAutoBossEnabled` | No | — | Auto-boss toggle checkbox |
| `claimOffline` | Yes | Offline | Claim rewards button |
| `openOfflineRewardModal` | No | — | View offline rewards (DOM) |
| `closeOfflineRewardModal` | No | — | Close modal (DOM) |
| `closeRefineResultModal` | No | — | Close refine modal (DOM) |
| `refineItem` | Yes | Equipment | Star refine continue |
| `punchCardSlot` | No | — | Socket punch (DOM) |
| `renderAll` | Yes | Render | Any render-triggering action |
| `salvageItem` | Yes | Equipment | Equipment salvage |
| `salvageAllUnequipped` | Yes | Equipment | Batch salvage |
| `equipBest` | Yes | Equipment | Auto-equip best |
| `enhanceItem` | Yes | Equipment | Refine/enhance |
| `empowerItem` | No | — | Empowerment (not yet delegated) |
| `buyShopItem` | Yes | Shop | Shop purchase |
| `claimCodexReward` | Yes | Codex | Codex reward claim |
| `toggleItemLock` | No | — | Equipment lock toggle (DOM) |
| `showToast` | No | — | Toast notification (DOM) |
| `canContinueRefine` | No | — | Refine continuation check |
| `ensureSettings` | No | — | Settings initialization |

**Delegated:** 10 functions. **Non-delegated (DOM/presentation):** 10 functions.

### 14D. Non-Delegated Function Categories (~420 functions)

| Category | Est. Count | Examples | Migration Strategy |
|----------|:--:|------|------|
| DOM/Canvas presentation | ~30 | `showDamageNumber`, `addFloatText`, `drawScene`, `showBossBanner` | Keep in game.js (canvas-bound) |
| Startup/lifecycle | 6 | `init`, `loop`, `cacheElements` | Keep (entry point) |
| State persistence | 9 | `load`, `save`, `mergeState` | Already bridged to StateRuntime |
| Core calculation | ~45 | `computeStats`, `calculateBattleStats` | Deferred (depends on config unification) |
| Utility/formatting | ~60 | `formatNumber`, `escapeHtml`, `statLabelName` | Candidate for data.js extraction |
| Equipment data utils | ~70 | `normalizeEquipmentSlot`, `rollRandomStats`, `getCardSocketCost` | Partially bridged via EquipmentRuntime context |
| Skill/hero/progress | ~55 | `gainExp`, `trainBase`, `changeJob`, `getSkillGrowthEntry` | Not yet delegated |
| Auth/quest/achievement | ~40 | `loadAuth`, `updateQuestProgress`, `claimAchievementReward` | Lightweight, low priority |
| Config/data tables | — | `maps`, `equipmentDropTables`, `SHOP_ITEMS` (~3160 lines) | Extract to classic data.js |
| Misc helpers | ~100 | `currentMap`, `equipmentSlot`, `rarityRank`, `isAbyssEquipment` | Utility keepers |

### 14E. Deletion Priority Order

| Priority | Group | Count | Blocked By |
|----------|-------|:--:|------|
| **1** | `legacyXxx` standalone bodies | 78 | 15b (tool unification) + 15d (DevBridge extraction) |
| **2** | Duplicate utility functions | 8 | 15a-c (unified tool loading) |
| **3** | Config data tables (extraction) | ~3160 lines | 15a (classic data.js loading order) |
| **4** | Non-delegated auth/quest functions | ~40 | Low priority, low risk |
| **5** | Page renderer HTML bodies | ~4000 lines | 17a-c (page-by-page migration) |
| **6** | Non-delegated skill/hero functions | ~55 | Deferred |

## Next Steps

Per the approved roadmap:
1. **Batch 15**: Unify tool loading & extract DevBridge.
2. **Batch 16**: Offline orchestration & loot UI.
3. **Batch 17**: Page renderers (VIP → Shop → Codex → Character → Equipment/Smithy).
4. **Batch 18**: Event delegation & window bridge cleanup.
5. **Batch 19**: Final entry-file slimming + full regression.