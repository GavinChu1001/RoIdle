# game.js Migration Status - Batch 17d

## Runtime Authority

`game.js` remains the authoritative stateful gameplay runtime. Startup ownership is held by `src/main.js`.

## Formalized In This Batch

### Character Page Renderer
- `src/ui/characterPage.js` rewritten from delegation wrapper to real implementation (~250 lines).
- 11 functions migrated: `renderHeroes`, `renderTown`, `renderCharacterStatSections`, `renderCharacterStatBreakdown`, `renderPowerSourcePanel`, `renderSkillPanel`, `renderTitlePanel`, `renderSkillSummaryCard`, `renderJobSkills`, `renderSkillMilestonePanel`, `renderSkillSpecialization`.
- Full context injection for: stats calculation, job system, equipment stats, skill system, prestige system, format helpers, DOM elements.

### Render Runtime Progress
| Module | Functions |
|--------|-----------|
| `offlineLoot.js` | 20 |
| `vipPage.js` | 1 |
| `shopPage.js` | 1 |
| `codexPage.js` | 4 |
| `characterPage.js` | 11 |
| **Total** | **37** / ~100 |

## Next

Batch 17e: Equipment page (20 functions).