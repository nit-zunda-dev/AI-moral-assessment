/**
 * シナリオJSONの取得・スキーマ検証
 * Requirements: 6.1, 6.2, 6.4, 6.6
 */
import type { Scenario, Result, ScenarioLoadError } from '@/types/scenario';
import { isScenario } from './scenarioSchema';

const SCENARIOS_BASE = '/scenarios';
const SERIES_BASE = '/series';

function notFound(message: string): ScenarioLoadError {
  return { type: 'NOT_FOUND', message };
}
function invalidSchema(message: string): ScenarioLoadError {
  return { type: 'INVALID_SCHEMA', message };
}
function networkError(message: string): ScenarioLoadError {
  return { type: 'NETWORK_ERROR', message };
}

/**
 * デイリーシナリオを取得する。publishDate が指定日付と一致するシナリオを manifest から特定して fetch する。
 */
export async function loadDaily(date: string): Promise<Result<Scenario, ScenarioLoadError>> {
  try {
    const manifestRes = await fetch(`${SCENARIOS_BASE}/manifest.json`);
    if (!manifestRes.ok) {
      if (manifestRes.status === 404) return { ok: false, error: notFound('manifest not found') };
      return { ok: false, error: networkError(`manifest fetch failed: ${manifestRes.status}`) };
    }
    const manifest = (await manifestRes.json()) as { entries?: Array<{ id: string; publishDate: string }> };
    const entries = Array.isArray(manifest?.entries) ? manifest.entries : [];
    const entry = entries.find((e) => e.publishDate === date);
    if (!entry) return { ok: false, error: notFound(`No scenario for date: ${date}`) };

    const scenarioRes = await fetch(`${SCENARIOS_BASE}/${entry.id}.json`);
    if (!scenarioRes.ok) {
      if (scenarioRes.status === 404) return { ok: false, error: notFound(`Scenario ${entry.id} not found`) };
      return { ok: false, error: networkError(`Scenario fetch failed: ${scenarioRes.status}`) };
    }
    const raw = await scenarioRes.json();
    if (!isScenario(raw)) return { ok: false, error: invalidSchema('Scenario schema validation failed') };
    return { ok: true, value: raw };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: networkError(message) };
  }
}

/**
 * シリーズIDに紐づくシナリオリストを取得する。
 */
export async function loadSeries(seriesId: string): Promise<Result<Scenario[], ScenarioLoadError>> {
  try {
    const seriesRes = await fetch(`${SERIES_BASE}/${seriesId}.json`);
    if (!seriesRes.ok) {
      if (seriesRes.status === 404) return { ok: false, error: notFound(`Series ${seriesId} not found`) };
      return { ok: false, error: networkError(`Series fetch failed: ${seriesRes.status}`) };
    }
    const seriesManifest = (await seriesRes.json()) as { scenarioIds?: string[] };
    const ids = Array.isArray(seriesManifest?.scenarioIds) ? seriesManifest.scenarioIds : [];
    const scenarios: Scenario[] = [];
    for (const id of ids) {
      const scenarioRes = await fetch(`${SCENARIOS_BASE}/${id}.json`);
      if (!scenarioRes.ok) {
        if (scenarioRes.status === 404) return { ok: false, error: notFound(`Scenario ${id} not found`) };
        return { ok: false, error: networkError(`Scenario ${id} fetch failed: ${scenarioRes.status}`) };
      }
      const raw = await scenarioRes.json();
      if (!isScenario(raw)) return { ok: false, error: invalidSchema(`Scenario ${id} schema validation failed`) };
      scenarios.push(raw);
    }
    return { ok: true, value: scenarios };
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    return { ok: false, error: networkError(message) };
  }
}
