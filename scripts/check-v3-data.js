const fs = require('fs');
const d = fs.readFileSync('./data.js', 'utf8');

const hasV3 = d.includes('var v3JobSkills = {');
const skillCount = (d.match(/v3Skill\(/g) || []).length;
const passiveCount = (d.match(/'被动'/g) || []).length;
const activeCount = skillCount - passiveCount;
const hasAwakenings = d.includes('v3SkillAwakenings');

const mechMatches = d.match(/mech\("(\w+)"/g) || [];
const mechTypes = [...new Set(mechMatches.map(m => m.match(/"(\w+)"/)[1]))];

const jobMatches = d.match(/v3JobSkills = \{([\s\S]*?)\n\};/) || [];
const jobNames = jobMatches[1]
  ? (jobMatches[1].match(/(\w+):\s*\[/g) || []).map(m => m.match(/(\w+):/)[1])
  : [];

console.log('=== V3 Skill Data Check ===');
console.log('v3JobSkills defined:', hasV3);
console.log('Jobs defined:', jobNames.length, '→', jobNames.join(', '));
console.log('Total skills:', skillCount);
console.log('  Active:', activeCount);
console.log('  Passive:', passiveCount);
console.log('Awakenings defined:', hasAwakenings);
console.log('Mechanism types (' + mechTypes.length + '):');
mechTypes.forEach(m => console.log('  -', m));

const expectedJobs = ['novice','swordman','knight','runeKnight','mage','wizard','warlock','archer','hunter','ranger','acolyte','priest','archbishop','merchant','blacksmith','mechanic','thief','assassin','guillotineCross'];
const missing = expectedJobs.filter(j => !jobNames.includes(j));
if (missing.length) {
  console.log('MISSING JOBS:', missing.join(', '));
} else {
  console.log('All 19 jobs present.');
}

if (activeCount === 36 && passiveCount === 18) {
  console.log('Skill count matches: 36 active + 18 passive = 54 total.');
} else {
  console.log('Skill count MISMATCH: expected 36/18, got ' + activeCount + '/' + passiveCount);
}
