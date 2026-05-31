import { ARTISAN_JOBS } from './catalog.js';
import { normalizeProductionState } from './state.js';

const MAX_PRODUCTION_LEVEL = 100;

function nowMs(context = {}) {
  const value = typeof context.now === 'function' ? context.now() : Date.now();
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : Date.now();
}

function nonNegativeInt(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
}

function normalizeTargetState(state = {}) {
  const target = state && typeof state === 'object' ? state : {};
  target.production = normalizeProductionState(target.production);
  if (!target.materials || typeof target.materials !== 'object' || Array.isArray(target.materials)) {
    target.materials = {};
  }
  return target;
}

function expForLevel(level) {
  return 80 + Math.max(1, Math.floor(Number(level) || 1)) * 40;
}

function addArtisanExperience(production, amount) {
  const artisan = production.artisan;
  const gained = nonNegativeInt(amount);
  if (gained <= 0 || artisan.level >= MAX_PRODUCTION_LEVEL) return 0;
  artisan.exp += gained;
  while (artisan.level < MAX_PRODUCTION_LEVEL && artisan.exp >= expForLevel(artisan.level)) {
    artisan.exp -= expForLevel(artisan.level);
    artisan.level += 1;
  }
  if (artisan.level >= MAX_PRODUCTION_LEVEL) {
    artisan.level = MAX_PRODUCTION_LEVEL;
    artisan.exp = 0;
  }
  return gained;
}

function canAfford(materials, cost = {}) {
  return Object.entries(cost).every(([id, amount]) => nonNegativeInt(materials[id]) >= nonNegativeInt(amount));
}

export function startArtisanJob(state = {}, jobId = '', context = {}) {
  const job = ARTISAN_JOBS[jobId];
  if (!job) return { ok: false, reason: 'job_missing' };

  const target = normalizeTargetState(state);
  const artisan = target.production.artisan;
  if (artisan.activeJob) return { ok: false, reason: 'busy' };
  if (!canAfford(target.materials, job.cost)) return { ok: false, reason: 'not_affordable' };

  for (const [materialId, amount] of Object.entries(job.cost || {})) {
    target.materials[materialId] = Math.max(0, nonNegativeInt(target.materials[materialId]) - nonNegativeInt(amount));
  }

  const startedAt = nowMs(context);
  const finishAt = startedAt + nonNegativeInt(job.seconds) * 1000;
  artisan.activeJob = { id: job.id, startedAt, finishAt };
  return { ok: true, job: artisan.activeJob };
}

export function claimArtisanJob(state = {}, context = {}) {
  const target = normalizeTargetState(state);
  const artisan = target.production.artisan;
  const activeJob = artisan.activeJob;
  if (!activeJob) return { ok: false, reason: 'no_job' };

  const job = ARTISAN_JOBS[activeJob.id];
  if (!job) {
    artisan.activeJob = null;
    return { ok: false, reason: 'job_missing' };
  }

  const current = nowMs(context);
  const finishAt = nonNegativeInt(activeJob.finishAt);
  if (current < finishAt) {
    return { ok: false, reason: 'in_progress', finishAt };
  }

  const output = {};
  for (const [materialId, amount] of Object.entries(job.output || {})) {
    const gained = nonNegativeInt(amount);
    if (gained <= 0) continue;
    target.materials[materialId] = nonNegativeInt(target.materials[materialId]) + gained;
    output[materialId] = (output[materialId] || 0) + gained;
  }
  artisan.activeJob = null;
  artisan.jobsCompleted = nonNegativeInt(artisan.jobsCompleted) + 1;
  const exp = addArtisanExperience(target.production, Math.max(1, nonNegativeInt(job.seconds) / 30));
  return { ok: true, output, exp };
}
