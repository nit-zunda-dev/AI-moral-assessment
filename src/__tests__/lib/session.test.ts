/**
 * SessionManager のユニットテスト
 * Requirements: 1.6
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  saveSession,
  loadSession,
  clearSession,
  isDailyCompleted,
  markDailyCompleted,
  __resetInMemoryFallbackForTests,
} from '@/lib/session';
import type { GameSession } from '@/types/game';
import type { TypeCode } from '@/types/game';

const sampleSession: GameSession = {
  scenarioIds: ['case-001', 'case-002'],
  currentIndex: 1,
  scores: {
    result_efficiency: 5,
    rule_discipline: 0,
    humanity_morality: 0,
    self_preservation: 0,
    empathy_kindness: 0,
    logic_coldness: 0,
  },
  selectedChoices: { 'case-001': 'A' },
  completedAt: null,
};

describe('SessionManager', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    __resetInMemoryFallbackForTests();
    vi.clearAllMocks();
  });

  describe('saveSession / loadSession', () => {
    it('保存したセッションを復元できる', () => {
      saveSession(sampleSession);
      const loaded = loadSession();
      expect(loaded).not.toBeNull();
      expect(loaded?.scenarioIds).toEqual(sampleSession.scenarioIds);
      expect(loaded?.currentIndex).toBe(sampleSession.currentIndex);
      expect(loaded?.scores).toEqual(sampleSession.scores);
      expect(loaded?.selectedChoices).toEqual(sampleSession.selectedChoices);
      expect(loaded?.completedAt).toBe(sampleSession.completedAt);
    });

    it('何も保存していないとき loadSession は null を返す', () => {
      expect(loadSession()).toBeNull();
    });

    it('completedAt が設定されたセッションも保存・復元できる', () => {
      const completed: GameSession = {
        ...sampleSession,
        completedAt: '2025-03-07T12:00:00Z',
      };
      saveSession(completed);
      const loaded = loadSession();
      expect(loaded?.completedAt).toBe('2025-03-07T12:00:00Z');
    });
  });

  describe('clearSession', () => {
    it('clearSession 後に loadSession は null を返す', () => {
      saveSession(sampleSession);
      clearSession();
      expect(loadSession()).toBeNull();
    });
  });

  describe('isDailyCompleted / markDailyCompleted', () => {
    it('未記録の日付は isDailyCompleted が false', () => {
      expect(isDailyCompleted('2025-03-07')).toBe(false);
    });

    it('markDailyCompleted 後にその日付は isDailyCompleted が true', () => {
      markDailyCompleted('2025-03-07', 'UOAC' as TypeCode);
      expect(isDailyCompleted('2025-03-07')).toBe(true);
    });

    it('別の日付は mark 後も false のまま', () => {
      markDailyCompleted('2025-03-07', 'UOAC' as TypeCode);
      expect(isDailyCompleted('2025-03-08')).toBe(false);
    });
  });

  describe('localStorage 利用不可時のフォールバック', () => {
    it('localStorage が書き込みで例外を投げても saveSession はクラッシュしない', () => {
      const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveSession(sampleSession)).not.toThrow();
      setItem.mockRestore();
    });

    it('localStorage が読み込みで例外を投げてもクラッシュせず、未保存時は null を返す', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      const loaded = loadSession();
      expect(loaded).toBeNull();
    });

    it('localStorage が clear で例外を投げても clearSession はクラッシュしない', () => {
      const removeItem = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(() => clearSession()).not.toThrow();
      removeItem.mockRestore();
    });
  });
});
