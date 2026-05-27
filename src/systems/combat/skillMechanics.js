// 技能系统 V3 — 机制执行引擎
// Skill Mechanics Engine

let mechContext = {};

function finite(v) { const n = Number(v || 0); return Number.isFinite(n) ? n : 0; }
function random(ctx = mechContext) { return ctx.random?.() ?? Math.random(); }
function stateFrom(ctx = mechContext) { return ctx.getState?.() || {}; }

export function configureSkillMechanicsContext(ctx = {}) {
  mechContext = ctx || {};
}

// ── 伤害计算 ──
// V4 统一公式：技能伤害 = 攻击力 × 技能总倍率 × 暴击期望修正 × 怪物减伤修正

function calcSkillDamage(source, multiplier, stats, monster, ctx = mechContext) {
  const critRate = Math.min(1.0, finite(stats.crit) || 0);
  const critExpectation = 1 + critRate * 0.35;
  const monsterGuard = Math.min(0.65, finite(monster.damageReduction) || 0);
  const state = stateFrom(ctx);
  const passive = getPassiveMechanismEffects(state, stats, ctx);
  const passiveDamageMultiplier = (1 + finite(passive.damagePct)) *
    (hasMark(state, 'any') ? (1 + finite(passive.markedVulnerablePct)) : 1);
  const dmg = finite(source) * finite(multiplier) * critExpectation * (1 - monsterGuard) * passiveDamageMultiplier;
  return ctx.normalizeDamage?.(dmg) || Math.max(0, Math.round(dmg));
}

export function formatSkillPower(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(2).replace(/\.?0+$/, '');
}

function applyDamage(damage, state, ctx = mechContext) {
  state.enemyHp -= damage;
  ctx.showDamageNumber?.('monster', damage, 'skill');
  ctx.showHitFeedback?.('skill');
}

// ── 状态管理 ──

function getCooldowns(state) {
  state.skillCooldowns = state.skillCooldowns || {};
  return state.skillCooldowns;
}

function getZones(state) {
  state.activeZones = state.activeZones || [];
  return state.activeZones;
}

function getMarks(state) {
  state.enemyMarks = state.enemyMarks || {};
  return state.enemyMarks;
}

function getBuffs(state) {
  state.activeBuffs = state.activeBuffs || [];
  return state.activeBuffs;
}

function hasMark(state, markType) {
  const marks = getMarks(state);
  if (markType === 'any') return Object.keys(marks).some((k) => !k.startsWith('_') && finite(marks[k]) > 0);
  return finite(marks[markType]) > 0;
}

function applyMark(state, markType, duration, data = {}) {
  const marks = getMarks(state);
  // 元素主宰：标记时长翻倍
  const passive = getPassiveMechanismEffects(state, {}, mechContext);
  if (passive.markDurationMult && passive.markDurationMult[markType]) {
    duration *= passive.markDurationMult[markType];
  }
  // 元素主宰：allowBoth — burn和freeze可共存
  if (!passive.allowBothMarks && markType === 'burn' && finite(marks.freeze) > 0) {
    marks.freeze = 0;
  }
  if (!passive.allowBothMarks && markType === 'freeze' && finite(marks.burn) > 0) {
    marks.burn = 0;
  }
  marks[markType] = Math.max(finite(marks[markType]), finite(duration));
  if (markType === 'burn') {
    marks._burnStat = data.stat === 'matk' ? 'matk' : 'atk';
    if (data.burnRamp) {
      marks._burnRampPerSecond = finite(data.rampPerSecond);
      marks._burnRampMax = finite(data.rampMax);
      marks._burnTicks = Math.max(0, finite(marks._burnTicks));
    }
  }
  if (markType === 'poison') {
    const stackAdd = Math.max(0, finite(data.stackAdd || data.stackCount || 1));
    const maxStacks = Math.max(1, finite(data.maxStacks || 5));
    marks._poisonStacks = Math.min(maxStacks, Math.max(1, finite(marks._poisonStacks) + stackAdd));
  }
  if (data.stackName) {
    marks[data.stackName] = finite(marks[data.stackName]) + (data.stackCount || 1);
  }
}

function tickMarks(state, dt, stats, ctx = mechContext) {
  const marks = getMarks(state);
  const monster = ctx.currentMonsterStats?.() || {};
  Object.keys(marks).forEach((key) => {
    if (key.startsWith('_')) return;
    if (typeof marks[key] !== 'number' || marks[key] <= 0) return;
    marks[key] = Math.max(0, marks[key] - dt);
    // 标记持续效果
    if (key === 'burn' || key === 'poison') {
      const tickDmg = key === 'burn' ? 0.12 : 0.16; // V4: 灼烧12%，中毒16%
      if (Math.abs(marks[key] % 1) < dt || marks[key] <= dt) {
        const source = key === 'burn' && marks._burnStat === 'matk' ? finite(stats.matkPower) : finite(stats.atkPower);
        const monsterGuard = Math.min(0.65, finite(monster.damageReduction) || 0);
        const poisonStacks = key === 'poison' ? Math.max(1, Math.min(5, finite(marks._poisonStacks))) : 1;
        const burnRamp = key === 'burn' ? 1 + Math.min(finite(marks._burnRampMax), finite(marks._burnTicks) * finite(marks._burnRampPerSecond)) : 1;
        const dmg = Math.max(0, Math.round(source * tickDmg * poisonStacks * burnRamp * (1 - monsterGuard)));
        if (dmg > 0) {
          state.enemyHp -= dmg;
          ctx.showDamageNumber?.('monster', dmg, 'skill', { skillName: key === 'burn' ? '灼烧' : '中毒' });
        }
        if (key === 'burn' && finite(marks._burnRampPerSecond) > 0) marks._burnTicks = finite(marks._burnTicks) + 1;
      }
    }
    // 中毒叠层上限
    if (key === 'poison') {
      const stackKey = '_poisonStacks';
      marks[stackKey] = Math.min(5, Math.max(1, finite(marks[stackKey]) || 1));
      if (marks[key] <= 0) marks[stackKey] = 0;
    }
  });
}

function tickZones(state, dt, stats, ctx = mechContext) {
  const zones = getZones(state);
  for (const zone of zones) {
    zone.remaining = Math.max(0, zone.remaining - dt);
    if (zone.remaining > 0 && zone.tickTimer <= 0) {
      zone.tickTimer = 1.0; // tick every second
      const source = getSkillSource(zone, stats, state);
      const dmg = calcSkillDamage(source, zone.perTick, stats, ctx.currentMonsterStats?.() || {}, ctx);
      applyDamage(dmg, state, ctx);
      ctx.showSkillCastFeedback?.({ name: zone.name });
      if (zone.mark) applyMark(state, zone.mark, zone.markDuration || 3, {
        stat: zone.stat,
        burnRamp: zone.burnRamp,
        rampPerSecond: zone.rampPerSecond,
        rampMax: zone.rampMax,
      });
    }
    zone.tickTimer -= dt;
  }
  // Remove expired
  state.activeZones = zones.filter((z) => z.remaining > 0 || z.onExpire);
}

function tickBuffs(state, dt) {
  const buffs = getBuffs(state);
  state.activeBuffs = buffs.filter((b) => {
    b.remaining = Math.max(0, b.remaining - dt);
    return b.remaining > 0;
  });
}

function tickCooldowns(state, dt) {
  const cds = getCooldowns(state);
  Object.keys(cds).forEach((key) => {
    if (cds[key] > 0) cds[key] = Math.max(0, cds[key] - dt);
  });
  state.deathDefyCooldown = Math.max(0, finite(state.deathDefyCooldown) - dt);
}

function hasBuff(state, buffId) {
  return getBuffs(state).some((b) => b.id === buffId && b.remaining > 0);
}

function getSkillSource(mechanism, stats, state) {
  const isMagic = mechanism.stat === 'matk';
  const base = isMagic ? finite(stats.matkPower) : finite(stats.atkPower);
  if (isMagic) return base;
  return base * (1 + finite(getSkillBuffMultipliers(state).atkPct));
}

function consumeSkillDamageEnhancement(state, skill, ctx = mechContext) {
  const result = { multiplier: 1, forceCritFeedback: false, source: '' };
  if (!skill || skill.kind !== '主动') return result;
  if (state.guaranteedCritNext?.skillOnly) {
    result.multiplier *= Math.max(1, finite(state.guaranteedCritNext.multiplier) || 1);
    result.forceCritFeedback = true;
    result.source = '龙族血统';
    delete state.guaranteedCritNext;
  }
  if (state.stealthSkillReady) {
    result.multiplier *= Math.max(1, finite(state.stealthSkillDamageMultiplier) || 1.35);
    result.forceCritFeedback = true;
    result.source = result.source ? `${result.source} / 隐匿` : '隐匿';
    state.stealthSkillReady = false;
    state.stealthSkillDamageMultiplier = 0;
    state.idleTimer = 0;
  }
  if (result.multiplier > 1) {
    ctxSkillEnhancementFeedback(state, skill, result, ctx);
  }
  return result;
}

function ctxSkillEnhancementFeedback(state, skill, enhancement, ctx = mechContext) {
  ctx.showHitFeedback?.('crit');
  ctx.addLog?.(`${enhancement.source}：${skill.name} 伤害 ×${formatSkillPower(enhancement.multiplier)}。`);
}

function hasMonsterTrait(monster, trait, ctx = mechContext) {
  if (ctx.hasMonsterTrait?.(monster, trait)) return true;
  const traits = Array.isArray(monster?.traits) ? monster.traits : [];
  if (traits.includes(trait)) return true;
  const text = `${monster?.id || ''} ${monster?.templateId || ''} ${monster?.name || ''}`.toLowerCase();
  if (trait === 'dark') return /dark|demon|黑暗|暗影|恶魔/.test(text);
  if (trait === 'undead') return /undead|skeleton|zombie|ghost|不死|亡灵|骷髅|幽灵/.test(text);
  return false;
}

// ── 机制执行函数 ──

function executeMultihit(mechanism, skill, state, stats, monster, ctx) {
  const baseHits = mechanism.hits || 1;
  const perHit = mechanism.multiplierPerHit || mechanism.perHit || 1.0;
  const critRate = Math.min(1, finite(stats.crit));
  const markedTarget = hasMark(state, 'mark');
  const extraHits = mechanism.extraHits && (!mechanism.extraHitsCondition || markedTarget)
    ? mechanism.extraHits
    : 0;
  const totalHits = baseHits + extraHits;

  // 带标记额外伤害
  let markedBonus = 1;
  if (mechanism.markedMultiplier && markedTarget) markedBonus *= mechanism.markedMultiplier;
  else if (mechanism.markedBonus && markedTarget) markedBonus += mechanism.markedBonus;

  let critHits = 0;
  let firstHitCrit = false;
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  // 大地之击：破甲 3 层 → 下一次手推车强击获得明确的 1.4 倍技能伤害。
  let earthStrikeActive = false;
  let earthStrikeMultiplier = 1;
  if (skill.name === '手推车强击' && state.earthStrikeReady) {
    const marks = getMarks(state);
    if (finite(marks['破甲']) >= 3) {
      marks['破甲'] = Math.max(0, finite(marks['破甲']) - 3);
      state.earthStrikeReady = false;
      earthStrikeActive = true;
      earthStrikeMultiplier = 1.4;
      ctx.showHitFeedback?.('crit');
      ctx.addLog?.('大地之击：手推车强击伤害 ×1.4。');
    }
  }
  const source = getSkillSource(mechanism, stats, state);

  for (let i = 0; i < totalHits; i++) {
    let isCrit = earthStrikeActive || random(ctx) < critRate;
    if (i === 0) firstHitCrit = isCrit;
    // 二刀连击：仅首段触发暴击效果时，第二段触发暴击效果。
    if ((mechanism.firstCritSecondForceCrit || mechanism.chainCrit) && i === 1 && firstHitCrit) isCrit = true;
    if (isCrit) critHits++;

    const priorCritBonus = finite(mechanism.bonusDamagePerCritHit || mechanism.bonusPerCritHit) * Math.max(0, critHits - (isCrit ? 1 : 0));
    const woundBonus = skill.name === '十字斩'
      ? finite(getMarks(state)['伤口']) * finite(mechanism.woundDamageBonusPerStack || mechanism.stack?.damagePct)
      : 0;
    const hitMultiplier = i >= baseHits ? (mechanism.extraHitMultiplier || perHit) : perHit;
    const finalDmg = calcSkillDamage(
      source,
      hitMultiplier * markedBonus * (1 + priorCritBonus + woundBonus) * skillEnhancement.multiplier * earthStrikeMultiplier,
      stats,
      monster,
      ctx,
    );
    applyDamage(finalDmg, state, ctx);
    if (isCrit) ctx.showHitFeedback?.('crit');

    // 伤口叠加（十字斩）
    if ((mechanism.woundStackAdd || mechanism.stack?.perCrit) && isCrit) {
      const stackName = mechanism.stack?.name || '伤口';
      const marks = getMarks(state);
      const perCrit = mechanism.awakenedStackPerCrit || mechanism.woundStackAdd || mechanism.stack?.perCrit || 1;
      marks[stackName] = Math.min(mechanism.maxWoundStacks || mechanism.stack?.max || 10, finite(marks[stackName]) + perCrit);
    }

    // 破甲叠加（手推车强击）
    if (mechanism.armorBreakStack || (mechanism.stack && !mechanism.stack.perCrit)) {
      const stackName = mechanism.stack?.name || '破甲';
      const marks = getMarks(state);
      marks[stackName] = Math.min(mechanism.maxArmorBreakStacks || mechanism.stack?.max || 3, finite(marks[stackName]) + (mechanism.armorBreakStack || mechanism.stack?.perHit || 1));
    }
  }

  // 溅射
  if (mechanism.splashMultiplier || mechanism.splash) {
    const splashDmg = calcSkillDamage(
      source,
      (mechanism.splashMultiplier || 0.6) * skillEnhancement.multiplier * earthStrikeMultiplier,
      stats,
      monster,
      ctx,
    );
    ctx.applySkillSplashDamageToEncounter?.(splashDmg, skill.name);
  }

  // 弹射
  const bounceHits = mechanism.bounceHits || mechanism.bounce || 0;
  if (bounceHits) {
    for (let b = 0; b < bounceHits; b++) {
      const bounceDmg = calcSkillDamage(source, (mechanism.bounceMultiplierPerHit || mechanism.bounceMultiplier || 0.45) * skillEnhancement.multiplier, stats, monster, ctx);
      applyDamage(bounceDmg, state, ctx);
    }
  }

  // 自身 Buff
  if (mechanism.attackSpeedBonus || mechanism.selfBuff) {
    getBuffs(state).push({
      id: skill.id + '_buff',
      remaining: mechanism.buffDuration || mechanism.selfBuff?.duration || 4,
      effect: { aspdPct: mechanism.attackSpeedBonus || mechanism.selfBuff?.aspdPct || 0 },
    });
  }

  ctx.addLog?.(`${skill.name} 造成 ${totalHits} 段攻击。`);
  return true;
}

function executeSingleHit(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const stat = getSkillSource(mechanism, stats, state);
  const dmg = calcSkillDamage(stat, (mechanism.multiplier || 1.0) * skillEnhancement.multiplier, stats, monster, ctx);
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 造成 ${ctx.formatNumber?.(dmg) || dmg} 点伤害。`);
  applyDamage(dmg, state, ctx);

  const oppositeMark = mechanism.mark?.type === 'burn' ? 'freeze' : mechanism.mark?.type === 'freeze' ? 'burn' : '';
  const resonanceWasReady = oppositeMark ? hasMark(state, oppositeMark) : false;
  if (mechanism.mark) {
    applyMark(state, mechanism.mark.type, mechanism.mark.duration, { ...mechanism.mark, stat: mechanism.stat });
  }

  // 元素共鸣：对灼烧目标用冰箭 / 对冰冻目标用火箭 → 伤害翻倍
  if (mechanism.mark) {
    const resonance = getPassiveMechanismEffects(state, stats, ctx).elementalResonance;
    if (resonance) {
      if (resonanceWasReady) {
        const resonanceDmg = Math.round(dmg * (resonance.multiplier - 1));
        applyDamage(resonanceDmg, state, ctx);
        ctx.showSkillCastFeedback?.({ name: '元素共鸣' });
        ctx.addLog?.('⚡元素共鸣触发！');
        state.resonanceTriggered = true;
      }
    }
  }

  return true;
}

function executeZone(mechanism, skill, state, stats, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const mark = mechanism.applyBurn ? 'burn'
    : mechanism.applyFreeze ? 'freeze'
    : mechanism.applySnare ? 'snare'
    : mechanism.applyMark ? 'mark'
    : mechanism.mark || null;
  getZones(state).push({
    name: skill.name,
    remaining: mechanism.duration || 5,
    perTick: (mechanism.multiplierPerSecond || mechanism.perSecond || 1.0) * skillEnhancement.multiplier,
    tickTimer: 0,
    mark,
    markDuration: mechanism.burnDuration || mechanism.freezeDuration || mechanism.snareDuration || mechanism.markDuration || 3,
    burnRamp: Boolean(mechanism.burnRamp),
    rampPerSecond: mechanism.rampPerSecond,
    rampMax: mechanism.rampMax,
    stat: mechanism.stat || 'atk',
    skillId: skill.id,
  });
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 释放！`);
  return true;
}

function executeFinisher(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const hpRatio = finite(monster.currentHp || state.enemyHp) / Math.max(1, finite(monster.maxHp || state.enemyMaxHp));
  const threshold = mechanism.thresholdHpPct ?? mechanism.normalInstantKillThreshold ?? mechanism.hpThreshold ?? 0;
  const baseMultiplier = mechanism.baseMultiplier ?? mechanism.multiplier ?? mechanism.bossMultiplier ?? 2.6;
  const snareMultiplier = mechanism.snareMultiplier && hasMark(state, 'snare')
    ? mechanism.snareMultiplier
    : 0;
  if (!snareMultiplier && (threshold <= 0 || hpRatio > threshold)) {
    // Above threshold: use base multiplier
    const source = getSkillSource(mechanism, stats, state);
    const dmg = calcSkillDamage(source, baseMultiplier * skillEnhancement.multiplier, stats, monster, ctx);
    applyDamage(dmg, state, ctx);
    ctx.showSkillCastFeedback?.(skill);
    ctx.addLog?.(`${skill.name} 造成 ${ctx.formatNumber?.(dmg) || dmg} 点伤害。`);
    return true;
  }

  let mult = snareMultiplier || mechanism.finisherMultiplier || baseMultiplier;
  if (mechanism.statusExploit && hasMark(state, mechanism.statusExploit.mark)) {
    mult = mechanism.statusExploit.multiplier || mult;
  }

  const source = getSkillSource(mechanism, stats, state);
  let dmg = calcSkillDamage(source, mult * skillEnhancement.multiplier, stats, monster, ctx);

  // V4 即死规则
  if (mechanism.instantKill) {
    const isBoss = Boolean(state.enemyBoss);
    const isElite = monster?.type === 'elite' || Boolean(monster?.mutation);
    const isAbyss = state.currentDifficulty === 'abyss';
    if (!isBoss && !isElite) {
      dmg = Math.max(dmg, finite(state.enemyMaxHp));
      ctx.addLog?.('天罚：即死！');
    } else if (isElite) {
      dmg = calcSkillDamage(source, 10.0 * skillEnhancement.multiplier, stats, monster, ctx);
      ctx.addLog?.('天罚：精英抵抗即死，转为 10.0x 伤害。');
    } else if (isBoss) {
      const bossMult = mechanism.bossMultiplier || 5.0;
      const abyssMult = isAbyss ? 0.75 : 1.0;
      dmg = calcSkillDamage(source, bossMult * abyssMult * skillEnhancement.multiplier, stats, monster, ctx);
      ctx.addLog?.(`天罚：${isAbyss ? '深渊' : ''}Boss 抵抗即死，转为 ${formatSkillPower(bossMult * abyssMult)}x 伤害。`);
    }
  }

  applyDamage(dmg, state, ctx);
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 终结一击！`);

  // V4 killRefundPct: 击杀返还部分冷却
  const refundPct = mechanism.killCooldownRefundPct ?? mechanism.killRefundPct ?? (mechanism.resetOnKill ? 1.0 : 0);
  if (refundPct > 0 && state.enemyHp <= 0) {
    state.pendingSkillCooldownRefunds = state.pendingSkillCooldownRefunds || {};
    state.pendingSkillCooldownRefunds[skill.id] = Math.min(1, Math.max(0, refundPct));
  }
  if ((mechanism.killEnterStealth || mechanism.enterStealth) && state.enemyHp <= 0) {
    state.stealthSkillReady = true;
    state.stealthSkillDamageMultiplier = 1.35;
  }

  return true;
}

function executeSelfDamage(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const hpCost = Math.round(finite(state.hero?.currentHp) * (mechanism.hpCostCurrentPct || mechanism.hpCostPct || 0.1));
  state.hero.currentHp = Math.max(1, finite(state.hero.currentHp) - hpCost);

  let mult = mechanism.multiplier || 3;
  if (mechanism.bonusVs) {
    if (hasMonsterTrait(monster, 'dark', ctx)) mult = mechanism.bonusVs.dark || mult;
    if (hasMonsterTrait(monster, 'undead', ctx)) mult = mechanism.bonusVs.undead || mult;
  }

  const source = getSkillSource(mechanism, stats, state);
  const dmg = calcSkillDamage(source, mult * skillEnhancement.multiplier, stats, monster, ctx);
  applyDamage(dmg, state, ctx);
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 消耗生命爆发！`);
  return true;
}

function executeHeal(mechanism, skill, state, stats, ctx) {
  const healAmount = Math.round(finite(stats.maxHp) * (mechanism.hpPct || 0.2));
  const before = finite(state.hero?.currentHp);
  state.hero.currentHp = Math.min(finite(stats.maxHp), before + healAmount);
  const actual = state.hero.currentHp - before;

  const shieldRatio = mechanism.overhealToShieldPct || (mechanism.overflow === 'shield' ? (mechanism.shieldRatio || 1) : 0);
  if (shieldRatio > 0 && actual < healAmount) {
    state.shieldHp = finite(state.shieldHp) + Math.round((healAmount - actual) * shieldRatio);
  }

  ctx.showDamageNumber?.('hero', actual, 'heal');
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 恢复 ${ctx.formatNumber?.(actual) || actual} 点生命。`);
  return true;
}

function executeStatusExploit(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const marked = hasMark(state, mechanism.mark);
  const source = getSkillSource(mechanism, stats, state);
  const multiplier = marked ? (mechanism.markedMultiplier || mechanism.multiplier || 2) : (mechanism.baseMultiplier || mechanism.multiplier || 2);
  const dmg = calcSkillDamage(source, multiplier * skillEnhancement.multiplier, stats, monster, ctx);
  applyDamage(dmg, state, ctx);
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 追击命中！`);
  return true;
}

function executeStatusExploitAll(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const marks = getMarks(state);
  const statusCount = Object.keys(marks).filter((k) => !k.startsWith('_') && finite(marks[k]) > 0).length;
  const source = getSkillSource({ ...mechanism, stat: 'matk' }, stats, state);
  const multiplier = Math.min(
    mechanism.maxMultiplier || Infinity,
    (mechanism.baseMultiplier || mechanism.multiplier || 2.5) + statusCount * (mechanism.multiplierPerStatus || 0)
  );
  const dmg = calcSkillDamage(source, multiplier * skillEnhancement.multiplier, stats, monster, ctx);
  applyDamage(dmg, state, ctx);
  ctx.showSkillCastFeedback?.(skill);
  ctx.addLog?.(`${skill.name} 风暴席卷！`);
  return true;
}

function executeLifestealDamage(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const source = finite(stats.matkPower);
  const dmg = calcSkillDamage(source, (mechanism.multiplier || 2) * skillEnhancement.multiplier, stats, monster, ctx);
  applyDamage(dmg, state, ctx);
  const heal = Math.round(dmg * (mechanism.healRatio || 0.3));
  state.hero.currentHp = Math.min(finite(stats.maxHp), finite(state.hero.currentHp) + heal);
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeGoldCost(mechanism, skill, state, stats, monster, ctx) {
  const proportionalCost = Math.round(finite(state.gold) * (mechanism.goldCostPct || mechanism.goldPct || 0.001));
  const levelCap = mechanism.goldCostLevelCapMultiplier
    ? Math.round(Math.max(1, finite(state.hero?.baseLevel) || finite(state.hero?.jobLevel) || 1) * mechanism.goldCostLevelCapMultiplier)
    : Infinity;
  const goldCost = Math.min(proportionalCost, levelCap);
  if (goldCost <= 0 || finite(state.gold) < goldCost) return false;
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill);
  state.gold = Math.max(0, finite(state.gold) - goldCost);
  const source = getSkillSource(mechanism, stats, state);
  const dmg = calcSkillDamage(source, (mechanism.multiplier || 5) * skillEnhancement.multiplier, stats, monster, ctx);
  applyDamage(dmg, state, ctx);
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeGoldGenerate(mechanism, skill, state, stats, monster, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  const source = getSkillSource(mechanism, stats, state);
  const dmg = calcSkillDamage(source, (mechanism.multiplier || 2.5) * skillEnhancement.multiplier, stats, monster, ctx);
  applyDamage(dmg, state, ctx);
  const goldEarned = Math.round(dmg * (mechanism.goldFromDamagePct || mechanism.goldPerDamage || 0.3));
  state.gold = finite(state.gold) + goldEarned;
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeShield(mechanism, skill, state, stats, ctx) {
  getBuffs(state).push({
    id: skill.id + '_shield',
    remaining: mechanism.duration || 8,
    effect: { shieldPct: mechanism.damageReduction || mechanism.perHitReduction || 0.4 },
  });
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeDelayedBurst(mechanism, skill, state, stats, ctx) {
  const skillEnhancement = consumeSkillDamageEnhancement(state, skill, ctx);
  getZones(state).push({
    name: skill.name + '(待爆)',
    remaining: mechanism.delay || 6,
    perTick: 0, // No tick damage
    tickTimer: 999,
    onExpire: {
      multiplier: mechanism.multiplier || 5,
      aoe: mechanism.aoe,
      stat: mechanism.stat || 'atk',
      guaranteedCrit: Boolean(mechanism.guaranteedCrit),
      killCooldownRefundPct: mechanism.killCooldownRefundPct || 0,
      damageMultiplier: skillEnhancement.multiplier,
    },
    skillId: skill.id,
  });
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeSelfBuff(mechanism, skill, state, stats, ctx) {
  const goldRate = typeof mechanism.goldCost === 'number' ? mechanism.goldCost : 0;
  const goldCost = Math.round(finite(state.gold) * goldRate);
  if (goldCost > 0 && finite(state.gold) >= goldCost) {
    state.gold = Math.max(0, finite(state.gold) - goldCost);
  }
  getBuffs(state).push({
    id: skill.id + '_buff',
    remaining: mechanism.duration || 10,
    effect: { ...mechanism, atkPct: mechanism.atkBonus || mechanism.atkPct || 0 },
  });
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeSpreadMark(mechanism, skill, state, ctx) {
  const marks = getMarks(state);
  if (mechanism.refreshPoison) {
    if (!hasMark(state, 'poison')) return false;
    marks.poison = Math.max(finite(marks.poison), mechanism.poisonDuration || 6);
    marks._poisonStacks = Math.min(
      mechanism.maxPoisonStacks || 5,
      Math.max(1, finite(marks._poisonStacks)) + (mechanism.poisonStackAdd || 1)
    );
  } else {
    if (!hasMark(state, mechanism.mark)) return false;
    marks[mechanism.mark] = finite(marks[mechanism.mark]) * (mechanism.multiplier || 2);
  }
  ctx.showSkillCastFeedback?.(skill);
  return true;
}

function executeDeathDefy(mechanism, skill, state, ctx) {
  // Handled in combat tick - marks availability
  return true;
}

function executeStealth(mechanism, skill, state, ctx) {
  // The actual stealth check happens in combat tick when attacking
  state.stealthReady = false; // will be set by idle timer
  return true;
}

// ── 被动机制效果查询 ──

export function getPassiveMechanismEffects(state, stats, ctx = mechContext) {
  const effects = { damagePct: 0, damageReductionPct: 0, ignoreDefRatio: 0, critDamageBonus: 0, markedVulnerablePct: 0, deathDefyReady: false, enhanceDeathDefy: false, enhanceDoubleStrafe: null, enhanceAngelGuard: null, enhanceSelfDestruct: null, angelGuard: null, elementalResonance: null, killGoldBonus: 0, bossGoldBonus: 0, markDurationMult: {}, allowBothMarks: false, cooldownReduce: 0, stealthSkillDamageMultiplier: 0, reviveReady: false, reviveAwakening: null };

  // Iterate all unlocked passive skills and collect effects
  const job = ctx.currentJob?.() || {};
  const v3Skills = (typeof window !== 'undefined' ? window.v3JobSkills : undefined) || {};
  const jobSkills = ctx.getV3CombatSkills?.(job.id) || v3Skills[job.id] || [];
  const unlockedSkills = ctx.getUnlockedSkills?.() || [];

  jobSkills.forEach((skill) => {
    if (skill.kind !== '被动') return;
    const unlocked = unlockedSkills.find((s) => s.name === skill.name);
    if (!unlocked) return;

    const mech = skill.mechanism;
    if (!mech) return;

    switch (mech.type) {
      case 'hpThreshold': {
        const hpRatio = finite(state.hero?.currentHp) / Math.max(1, finite(stats.maxHp));
        if (mech.high && hpRatio >= (mech.high.hpPct || 0.6)) {
          effects.damagePct += mech.high.bonus?.damagePct || 0;
        }
        if (mech.low && skill.name === '天使之护') {
          effects.angelGuard = {
            hpPct: mech.low.hpPct || 0.4,
            duration: mech.low.duration || 6,
            cooldown: skill.cooldown || 60,
            damageReductionPct: mech.low.bonus?.damageReductionPct || 0.3,
          };
          if (finite(state.angelGuardActiveTimer) > 0) effects.damageReductionPct += effects.angelGuard.damageReductionPct;
        } else if (mech.low && hpRatio <= (mech.low.hpPct || 0.3)) {
            effects.damageReductionPct += mech.low.bonus?.damageReductionPct || 0;
        }
        break;
      }
      case 'ignoreDefIfMarked': {
        if (hasMark(state, 'mark')) {
          effects.ignoreDefRatio = Math.max(effects.ignoreDefRatio, mech.ratio || 0.3);
        }
        break;
      }
      case 'markedCritBonus': {
        if (hasMark(state, mech.mark)) {
          effects.critDamageBonus += mech.critDamageBonus || 0;
        }
        break;
      }
      case 'goldBonus': {
        effects.killGoldBonus = mech.kill || 0.15;
        effects.bossGoldBonus = mech.boss || 0;
        break;
      }
      case 'markDuration': {
        effects.markDurationMult = { burn: mech.burn || 1, freeze: mech.freeze || 1 };
        effects.allowBothMarks = mech.allowBoth || false;
        break;
      }
      case 'markedVulnerable': {
        if (hasMark(state, 'mark')) effects.markedVulnerablePct = mech.damagePct || 0.25;
        break;
      }
      case 'cooldownReduce': {
        effects.cooldownReduce = mech.reduction || 0.5;
        break;
      }
      case 'elementalResonance': {
        effects.elementalResonance = { multiplier: mech.pairs?.[0]?.multiplier || 2 };
        break;
      }
      case 'enhanceSkill': {
        if (mech.baseSkill === '霸体') effects.enhanceDeathDefy = true;
        if (mech.baseSkill === '二连矢') effects.enhanceDoubleStrafe = mech.mutate || {};
        if (mech.baseSkill === '天使之护') effects.enhanceAngelGuard = mech.extra || {};
        if (mech.baseSkill === '自爆装置') effects.enhanceSelfDestruct = mech.extra || {};
        break;
      }
      case 'stealth': {
        effects.stealthSkillDamageMultiplier = mech.nextHit?.crit?.multiplier || 1.35;
        break;
      }
      case 'stackTrigger': {
        if (skill.name === '死神之镰' && finite(getMarks(state)['伤口']) >= finite(mech.threshold || 5)) {
          effects.ignoreDefRatio = Math.max(effects.ignoreDefRatio, finite(mech.effect?.ignoreDefPct));
        }
        break;
      }
      case 'revive': {
        effects.reviveReady = true;
        if (state.rebirthAwakenings?.archbishop) {
          const awakening = (typeof window !== 'undefined' ? window.v3SkillAwakenings?.archbishop : null)?.effect || {};
          effects.reviveAwakening = {
            healPct: awakening.healPct || 0.30,
            shieldPct: awakening.shieldPct || 0.20,
          };
        }
        break;
      }
      case 'deathDefy': {
        effects.deathDefyReady = true;
        break;
      }
    }
  });

  return effects;
}

function mergeAwakenedMechanism(mechanism, awakeningEffect) {
  if (!awakeningEffect) return mechanism;
  switch (awakeningEffect.type) {
    case 'zone':
      return { ...mechanism, ...awakeningEffect };
    case 'extraHits':
      return {
        ...mechanism,
        extraHits: awakeningEffect.hits || 0,
        extraHitMultiplier: awakeningEffect.perHit,
        extraHitsCondition: awakeningEffect.condition,
      };
    case 'earlyDetonate':
      return {
        ...mechanism,
        delay: awakeningEffect.minDelay || mechanism.delay,
        multiplier: awakeningEffect.multiplier || mechanism.multiplier,
        guaranteedCrit: awakeningEffect.guaranteedCrit,
      };
    case 'stackBonus':
      return { ...mechanism, awakenedStackPerCrit: awakeningEffect.perCrit || 0 };
    default:
      return mechanism;
  }
}

// ── 每个节拍调用 ──

export function tickSkillSystem(dt, stats, ctx = mechContext) {
  const state = stateFrom(ctx);
  const passiveEffects = getPassiveMechanismEffects(state, stats, ctx);
  tickCooldowns(state, dt);
  tickMarks(state, dt, stats, ctx);
  tickZones(state, dt, stats, ctx);
  tickBuffs(state, dt);

  // 隐匿：准备下一次造成伤害的主动技能强化。
  state.idleTimer = finite(state.idleTimer) + dt;
  if (passiveEffects.stealthSkillDamageMultiplier > 0 && state.idleTimer >= 5) {
    state.stealthSkillReady = true;
    state.stealthSkillDamageMultiplier = passiveEffects.stealthSkillDamageMultiplier;
  }

  // Check delayed burst expiration
  const zones = getZones(state);
  for (const zone of zones) {
    if (zone.remaining <= 0 && zone.onExpire) {
      const source = getSkillSource(zone.onExpire, stats, state);
      const dmg = calcSkillDamage(source, (zone.onExpire.multiplier || 5) * (zone.onExpire.damageMultiplier || 1), stats, ctx.currentMonsterStats?.() || {}, ctx);
      applyDamage(dmg, state, ctx);
      if (zone.onExpire.guaranteedCrit) ctx.showHitFeedback?.('crit');
      ctx.showSkillCastFeedback?.({ name: zone.name.replace('(待爆)', ' 爆炸') });
      if (state.enemyHp <= 0 && zone.onExpire.killCooldownRefundPct > 0) {
        const cds = getCooldowns(state);
        cds[zone.skillId] = Math.max(0, finite(cds[zone.skillId]) * (1 - zone.onExpire.killCooldownRefundPct));
      }
      // Reset on kill
      const job = ctx.currentJob?.() || {};
      if (state.enemyHp <= 0 && job.id === 'mechanic' && passiveEffects.enhanceSelfDestruct) {
        const cds = getCooldowns(state);
        if (cds[zone.skillId] !== undefined) cds[zone.skillId] = 0;
        state.selfDestructBonusReady = true;
      }
    }
  }
  state.activeZones = zones.filter((z) => !(z.remaining <= 0 && z.onExpire));

  // Execute active skills (cooldown-based, not probability-based)
  const job = ctx.currentJob?.() || {};
  const v3Skills = (typeof window !== 'undefined' ? window.v3JobSkills : undefined);
  if (!v3Skills) { console.warn('[V3 Skill] window.v3JobSkills not available, skill system disabled'); return; }
  const jobSkills = ctx.getV3CombatSkills?.(job.id) || v3Skills[job.id] || [];
  const unlockedSkills = ctx.getUnlockedSkills?.() || [];
  const monster = ctx.currentMonsterStats?.() || {};
  const cds = getCooldowns(state);

  for (const skill of jobSkills) {
    if (skill.kind !== '主动') continue;
    const unlocked = unlockedSkills.find((s) => s.name === skill.name);
    if (!unlocked) continue;

    const cdRemaining = cds[skill.id] || 0;
    if (cdRemaining > 0) continue;

    const mech = skill.mechanism;
    if (!mech) continue;

    // 觉醒效果：检查是否有觉醒并修改机制
    let awakenedMech = null;
    const awakenings = (typeof window !== 'undefined' ? window.v3SkillAwakenings : undefined) || {};
    const jobForAwaken = ctx.currentJob?.() || {};
    const awakenConfig = awakenings[jobForAwaken.id];
    if (awakenConfig && awakenConfig.skill === skill.name && state.rebirthAwakenings?.[jobForAwaken.id]) {
      awakenedMech = awakenConfig.effect;
    }

    // 觉醒机制类型映射处理
    const reduceThisSkillCooldown = Boolean(state.cooldownReductionNextSkill);
    let fired = false;
    let activeMech = mergeAwakenedMechanism(mech, awakenedMech);
    if (skill.name === '二连矢' && passiveEffects.enhanceDoubleStrafe && hasMark(state, 'mark')) {
      activeMech = { ...activeMech, hits: passiveEffects.enhanceDoubleStrafe.hits || 3 };
    }
    if (skill.name === '自爆装置' && passiveEffects.enhanceSelfDestruct && state.selfDestructBonusReady) {
      activeMech = { ...activeMech, multiplier: finite(activeMech.multiplier) * (1 + finite(passiveEffects.enhanceSelfDestruct.nextBonus || 0.35)) };
      state.selfDestructBonusReady = false;
    }
    switch (mech.type) {
      case 'multihit': fired = executeMultihit(activeMech, skill, state, stats, monster, ctx); break;
      case 'singleHit': fired = executeSingleHit(activeMech, skill, state, stats, monster, ctx); break;
      case 'zone': fired = executeZone(activeMech, skill, state, stats, ctx); break;
      case 'finisher': fired = executeFinisher(activeMech, skill, state, stats, monster, ctx); break;
      case 'selfDamage': fired = executeSelfDamage(activeMech, skill, state, stats, monster, ctx); break;
      case 'heal': fired = executeHeal(activeMech, skill, state, stats, ctx); break;
      case 'statusExploit': fired = executeStatusExploit(activeMech, skill, state, stats, monster, ctx); break;
      case 'statusExploitAll': fired = executeStatusExploitAll(activeMech, skill, state, stats, monster, ctx); break;
      case 'lifestealDamage': fired = executeLifestealDamage(activeMech, skill, state, stats, monster, ctx); break;
      case 'goldCost': fired = executeGoldCost(activeMech, skill, state, stats, monster, ctx); break;
      case 'goldGenerate': fired = executeGoldGenerate(activeMech, skill, state, stats, monster, ctx); break;
      case 'shield': fired = executeShield(activeMech, skill, state, stats, ctx); break;
      case 'delayedBurst': fired = executeDelayedBurst(activeMech, skill, state, stats, ctx); break;
      case 'selfBuff': fired = executeSelfBuff(activeMech, skill, state, stats, ctx); break;
      case 'spreadMark': fired = executeSpreadMark(activeMech, skill, state, ctx); break;
    }

    if (fired) {
      let cd = skill.cooldown || 5;
      // 魔力增幅
      if (reduceThisSkillCooldown && passiveEffects.cooldownReduce) {
        cd = Math.max(1, Math.round(cd * (1 - passiveEffects.cooldownReduce)));
        state.cooldownReductionNextSkill = false;
      }
      const pendingRefund = finite(state.pendingSkillCooldownRefunds?.[skill.id]);
      if (pendingRefund > 0) {
        cd *= (1 - Math.min(1, pendingRefund));
        delete state.pendingSkillCooldownRefunds[skill.id];
      }
      cds[skill.id] = cd;
      if (state.resonanceTriggered && passiveEffects.cooldownReduce) {
        state.cooldownReductionNextSkill = true;
        state.resonanceTriggered = false;
      }

      // 觉醒后处理：元素风暴额外触发连锁闪电
      if (awakenedMech?.type === 'extraTrigger' && skill.name === '元素风暴') {
        const chainSkill = (window.v3JobSkills?.warlock || []).find((s) => s.name === '连锁闪电');
        if (chainSkill) {
          const chain = chainSkill.mechanism || {};
          const coefficient = (
            finite(chain.hits) * finite(chain.multiplierPerHit || chain.perHit) +
            finite(chain.bounceHits || chain.bounce) * finite(chain.bounceMultiplierPerHit || chain.bounceMultiplier)
          ) * finite(awakenedMech.multiplier || 0.7);
          const echoDamage = calcSkillDamage(finite(stats.matkPower), coefficient, stats, monster, ctx);
          applyDamage(echoDamage, state, ctx);
          ctx.showSkillCastFeedback?.({ name: '觉醒·连锁闪电' });
          ctx.addLog?.(`元素风暴觉醒：额外触发 ${formatSkillPower(coefficient)}x 连锁闪电。`);
        }
      }
    }
  }

  // 叠层阈值触发
  const marks = getMarks(state);
  const jobForStack = ctx.currentJob?.() || {};
  const routeSkills = ctx.getV3CombatSkills?.(jobForStack.id) || [];
  const hasEarthStrikePassive = jobForStack.id === 'blacksmith'
    || routeSkills.some((entry) => entry.name === '大地之击' && entry.kind === '被动');
  // 大地之击：破甲 3 层后强化下一次手推车强击。
  if (finite(marks['破甲']) >= 3 && hasEarthStrikePassive) {
    state.earthStrikeReady = true;
  }
  // 死神之镰：普通怪即死，精英与 Boss 依照 V4 规则转换为伤害。
  if (finite(marks['伤口']) >= 10 && jobForStack.id === 'guillotineCross') {
    const monster = ctx.currentMonsterStats?.() || {};
    const isElite = monster.type === 'elite' || Boolean(monster.mutation);
    if (!state.enemyBoss && !isElite) {
      state.enemyHp = 0;
      ctx.addLog?.('死神之镰：即死！');
      marks['伤口'] = 0;
    } else {
      const source = finite(stats.atkPower);
      const isAbyssBoss = Boolean(state.enemyBoss) && state.currentDifficulty === 'abyss';
      const multiplier = isElite ? 10 : 8 * (isAbyssBoss ? 0.75 : 1);
      const dmg = calcSkillDamage(source, multiplier, stats, monster, ctx);
      state.enemyHp -= dmg;
      ctx.showDamageNumber?.('monster', dmg, 'skill', { skillName: '死神之镰' });
      ctx.addLog?.(`死神之镰：目标抵抗即死，转为 ${formatSkillPower(multiplier)}x 伤害。`);
      marks['伤口'] = Math.max(0, finite(marks['伤口']) - 10);
    }
  }
}

export function getSkillBuffMultipliers(state) {
  const buffs = getBuffs(state);
  let atkPct = 0, aspdPct = 0, shieldPct = 0;
  buffs.forEach((b) => {
    if (b.effect?.atkPct) atkPct += b.effect.atkPct;
    if (b.effect?.aspdPct) aspdPct += b.effect.aspdPct;
    if (b.effect?.shieldPct) shieldPct = Math.max(shieldPct, b.effect.shieldPct);
  });
  return { atkPct, aspdPct, shieldPct };
}

export function applyShieldReduction(damage, state) {
  const { shieldPct } = getSkillBuffMultipliers(state);
  if (shieldPct > 0) return Math.round(damage * (1 - shieldPct));
  if (finite(state.shieldHp) > 0) {
    const absorbed = Math.min(finite(state.shieldHp), damage);
    state.shieldHp = finite(state.shieldHp) - absorbed;
    return damage - absorbed;
  }
  return damage;
}
