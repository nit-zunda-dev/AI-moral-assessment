/**
 * ScenarioLoader のユニットテスト
 * Requirements: 6.1, 6.2, 6.4, 6.6
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loadDaily, loadSeries } from '@/lib/scenarioLoader';
import type { Scenario } from '@/types/scenario';

const validScenario: Scenario = {
  id: 'case-001',
  publishDate: '2025-03-07',
  title: '命のスコアリング',
  subtitle: '自動運転AIと前科者',
  category: '自動運転・AI判断',
  difficulty: 4,
  body: '自動運転AIが、車道に飛び出してきた3人の小学生を避けるため、歩道にいた「社会的信用スコアの極めて低い前科者1人」を意図的に轢殺した。',
  choices: [
    {
      label: 'A',
      text: '有罪',
      rebuttal: '論破A',
      params: {
        result_efficiency: -10,
        rule_discipline: 15,
        humanity_morality: 8,
        self_preservation: 0,
        empathy_kindness: 0,
        logic_coldness: -5,
      },
    },
    {
      label: 'B',
      text: '無罪',
      rebuttal: '論破B',
      params: {
        result_efficiency: 15,
        rule_discipline: -10,
        humanity_morality: 0,
        self_preservation: 0,
        empathy_kindness: -8,
        logic_coldness: 12,
      },
    },
  ],
};

describe('ScenarioLoader', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadDaily', () => {
    it('指定日付のシナリオが manifest にあり取得できれば ok で返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      const fetchMock = vi.mocked(fetch);
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            entries: [{ id: 'case-001', publishDate: '2025-03-07' }],
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validScenario,
        } as Response);

      const result = await loadDaily('2025-03-07');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('case-001');
        expect(result.value.publishDate).toBe('2025-03-07');
      }
    });

    it('指定日付が manifest にないとき NOT_FOUND エラーを返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ entries: [] }),
      } as Response);

      const result = await loadDaily('2025-03-08');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('NOT_FOUND');
      }
    });

    it('manifest の fetch が失敗したとき NETWORK_ERROR を返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

      const result = await loadDaily('2025-03-07');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('NETWORK_ERROR');
      }
    });

    it('シナリオ JSON の fetch が 404 のとき NOT_FOUND を返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      const fetchMock = vi.mocked(fetch);
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            entries: [{ id: 'case-999', publishDate: '2025-03-07' }],
          }),
        } as Response)
        .mockResolvedValueOnce({ ok: false, status: 404 } as Response);

      const result = await loadDaily('2025-03-07');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('NOT_FOUND');
      }
    });

    it('シナリオ JSON がスキーマ違反のとき INVALID_SCHEMA を返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      const fetchMock = vi.mocked(fetch);
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            entries: [{ id: 'case-001', publishDate: '2025-03-07' }],
          }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'case-001', title: 'Only partial' }),
        } as Response);

      const result = await loadDaily('2025-03-07');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('INVALID_SCHEMA');
      }
    });
  });

  describe('loadSeries', () => {
    it('シリーズのシナリオIDリストを取得し、全件 fetch して Scenario[] を返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      const fetchMock = vi.mocked(fetch);
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ scenarioIds: ['case-001', 'case-002'] }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => validScenario,
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...validScenario,
            id: 'case-002',
            publishDate: '2025-03-08',
          }),
        } as Response);

      const result = await loadSeries('daily');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(2);
        expect(result.value[0].id).toBe('case-001');
        expect(result.value[1].id).toBe('case-002');
      }
    });

    it('シリーズ manifest が 404 のとき NOT_FOUND を返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 404 } as Response);

      const result = await loadSeries('unknown');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('NOT_FOUND');
      }
    });

    it('いずれかのシナリオがスキーマ違反なら INVALID_SCHEMA を返す', async () => {
      vi.stubGlobal('fetch', vi.fn());
      const fetchMock = vi.mocked(fetch);
      fetchMock
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ scenarioIds: ['case-001'] }),
        } as Response)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ invalid: 'data' }),
        } as Response);

      const result = await loadSeries('daily');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('INVALID_SCHEMA');
      }
    });
  });
});
