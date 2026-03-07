/**
 * RED フェーズ: テーマ設定のバリデーションテスト
 * このテストはテーマ定数が存在しない間は失敗する（期待どおり）
 */
import { describe, it, expect } from 'vitest';
import { THEME_COLORS, THEME_FONTS } from '../lib/theme';

describe('テーマ設定', () => {
  describe('カラーパレット（ディストピア法廷テーマ）', () => {
    it('Deep Space（背景色）が正しく定義されている', () => {
      expect(THEME_COLORS.deepSpace).toBe('#0A0E1A');
    });

    it('Indigo Dark（カード色）が正しく定義されている', () => {
      expect(THEME_COLORS.indigoDark).toBe('#1A2744');
    });

    it('Verdict Red（強調色）が正しく定義されている', () => {
      expect(THEME_COLORS.verdictRed).toBe('#C41E3A');
    });

    it('Circuit Green（AI要素色）が正しく定義されている', () => {
      expect(THEME_COLORS.circuitGreen).toBe('#4FFFB0');
    });

    it('Parchment（本文色）が正しく定義されている', () => {
      expect(THEME_COLORS.parchment).toBe('#E8E3D8');
    });

    it('Slate Purple（サブ色）が正しく定義されている', () => {
      expect(THEME_COLORS.slatePurple).toBe('#7B68EE');
    });

    it('全6色が定義されている', () => {
      expect(Object.keys(THEME_COLORS)).toHaveLength(6);
    });
  });

  describe('フォントファミリー', () => {
    it('ディスプレイフォント（Playfair Display）が設定されている', () => {
      expect(THEME_FONTS.display).toContain('Playfair Display');
    });

    it('本文フォント（Noto Serif JP）が設定されている', () => {
      expect(THEME_FONTS.serif).toContain('Noto Serif JP');
    });

    it('等幅フォント（JetBrains Mono）が設定されている', () => {
      expect(THEME_FONTS.mono).toContain('JetBrains Mono');
    });

    it('全フォントファミリーにフォールバックが設定されている', () => {
      expect(THEME_FONTS.display).toContain(',');
      expect(THEME_FONTS.serif).toContain(',');
      expect(THEME_FONTS.mono).toContain(',');
    });
  });
});
