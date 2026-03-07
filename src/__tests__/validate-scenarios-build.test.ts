/**
 * ビルド時シナリオJSONスキーマ検証（public/scenarios/ 配下の全JSONを検証）
 * Requirements: 6.5
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { isScenario } from '@/lib/scenarioSchema';

const PUBLIC_SCENARIOS = join(process.cwd(), 'public', 'scenarios');

describe('Build-time scenario JSON schema validation', () => {
  it('manifest.json が存在し entries を持つ', () => {
    const manifestPath = join(PUBLIC_SCENARIOS, 'manifest.json');
    expect(existsSync(manifestPath)).toBe(true);
    const raw = readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(raw) as { entries?: Array<{ id: string; publishDate: string }> };
    expect(Array.isArray(manifest.entries)).toBe(true);
    expect(manifest.entries!.length).toBeGreaterThanOrEqual(1);
  });

  it('manifest の全 id に対応するシナリオJSONがスキーマを満たす', () => {
    const manifestPath = join(PUBLIC_SCENARIOS, 'manifest.json');
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as {
      entries: Array<{ id: string; publishDate: string }>;
    };
    for (const entry of manifest.entries) {
      const filePath = join(PUBLIC_SCENARIOS, `${entry.id}.json`);
      expect(existsSync(filePath)).toBe(true);
      const raw = readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw) as unknown;
      expect(isScenario(data)).toBe(true);
    }
  });
});
