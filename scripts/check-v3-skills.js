// V3 技能系统自测脚本
// 用法：在浏览器控制台中运行，或在 Node.js 中先加载 data.js

(function checkV3Skills() {
  var v3 = window.v3JobSkills;
  var aw = window.v3SkillAwakenings;
  var errors = [];
  var warnings = [];

  if (!v3) { console.error('FAIL: window.v3JobSkills is not defined'); return; }

  var expectedJobs = [
    'novice',
    'swordman', 'knight', 'runeKnight',
    'mage', 'wizard', 'warlock',
    'archer', 'hunter', 'ranger',
    'acolyte', 'priest', 'archbishop',
    'merchant', 'blacksmith', 'mechanic',
    'thief', 'assassin', 'guillotineCross',
  ];

  var validMechTypes = [
    'multihit', 'singleHit', 'zone', 'finisher', 'selfDamage', 'heal',
    'statusExploit', 'statusExploitAll', 'lifestealDamage',
    'goldCost', 'goldGenerate', 'shield', 'delayedBurst', 'selfBuff',
    'spreadMark', 'deathDefy', 'stealth', 'hpThreshold',
    'ignoreDefIfMarked', 'markedCritBonus', 'markedVulnerable',
    'elementalResonance', 'cooldownReduce', 'markDuration',
    'enhanceSkill', 'goldBonus', 'stackTrigger', 'revive',
  ];

  var totalSkills = 0;
  var totalPassive = 0;
  var totalActive = 0;

  expectedJobs.forEach(function(jobId) {
    var skills = v3[jobId];
    if (!skills || !Array.isArray(skills)) {
      errors.push('Missing skills for job: ' + jobId);
      return;
    }
    if (skills.length < 2 || skills.length > 3) {
      warnings.push('Job ' + jobId + ' has ' + skills.length + ' skills (expected 2-3)');
    }
    skills.forEach(function(skill, i) {
      totalSkills++;
      if (!skill.id) errors.push('Job ' + jobId + ' skill[' + i + ']: missing id');
      if (!skill.name) errors.push('Job ' + jobId + ' skill[' + i + ']: missing name');
      if (!skill.kind) errors.push('Job ' + jobId + ' skill[' + i + '] (' + skill.name + '): missing kind');
      if (skill.kind === '被动') totalPassive++;
      else if (skill.kind === '主动') {
        totalActive++;
        if (!skill.cooldown && skill.cooldown !== 0) warnings.push('Job ' + jobId + ' skill ' + skill.name + ': active skill missing cooldown');
      }
      if (!skill.mechanism) errors.push('Job ' + jobId + ' skill ' + skill.name + ': missing mechanism');
      else if (validMechTypes.indexOf(skill.mechanism.type) === -1) {
        errors.push('Job ' + jobId + ' skill ' + skill.name + ': unknown mechanism type "' + skill.mechanism.type + '"');
      }
    });
  });

  // Check awakenings
  if (aw) {
    var expectedAwakenJobs = ['runeKnight', 'warlock', 'ranger', 'archbishop', 'mechanic', 'guillotineCross'];
    expectedAwakenJobs.forEach(function(jobId) {
      if (!aw[jobId]) warnings.push('Missing awakening for job: ' + jobId);
    });
  } else {
    warnings.push('v3SkillAwakenings not defined');
  }

  console.log('=== V3 Skill System Self-Check ===');
  console.log('Jobs: ' + expectedJobs.length + ' (found ' + Object.keys(v3).length + ')');
  console.log('Total skills: ' + totalSkills + ' (active: ' + totalActive + ', passive: ' + totalPassive + ')');
  console.log('Errors: ' + errors.length);
  console.log('Warnings: ' + warnings.length);

  if (errors.length) { console.error('ERRORS:'); errors.forEach(function(e) { console.error('  - ' + e); }); }
  if (warnings.length) { console.warn('WARNINGS:'); warnings.forEach(function(w) { console.warn('  - ' + w); }); }
  if (!errors.length && !warnings.length) console.log('All checks passed!');

  return { errors: errors, warnings: warnings, totalSkills: totalSkills };
})();
