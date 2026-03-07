/**
 * シェアテキスト・結果URL生成ロジックのユニットテスト
 * Requirements: 5.2, 5.5, 4.5
 */
import { describe, it, expect } from 'vitest';
import { buildResultUrl, getShareText } from '@/lib/share';
import type { TypeCode, PersonalityType } from '@/types/game';

describe('buildResultUrl', () => {
  it('TypeCode をクエリパラメータに含む結果URLを返す', () => {
    const url = buildResultUrl('UOAC');
    expect(url).toContain('/result');
    expect(url).toContain('type=UOAC');
  });

  it('baseUrl を渡した場合そのオリジンで結果URLを組み立てる', () => {
    const url = buildResultUrl('UOAI', 'https://example.com');
    expect(url).toBe('https://example.com/result?type=UOAI');
  });

  it('baseUrl が空の場合は相対パスで返す', () => {
    const url = buildResultUrl('UOPC', '');
    expect(url).toBe('/result?type=UOPC');
  });

  it('全16タイプコードで有効なURLが生成できる', () => {
    const codes: TypeCode[] = [
      'UOAC', 'UOAI', 'UOPC', 'UOPI', 'UFAC', 'UFAI', 'UFPC', 'UFPI',
      'EOAC', 'EOAI', 'EOPC', 'EOPI', 'EFAC', 'EFAI', 'EFPC', 'EFPI',
    ];
    for (const code of codes) {
      const url = buildResultUrl(code, 'https://game.example.com');
      expect(url).toBe(`https://game.example.com/result?type=${code}`);
    }
  });
});

describe('getShareText', () => {
  const sampleType: PersonalityType = {
    code: 'UOAC',
    id: 1,
    name: '冷酷な設計者',
    catchphrase: 'あなたはシステムで人を殺せる人間です',
    description: '規律に従いながら最大多数の幸福を計算する。',
    rival: 9,
  };

  it('タイプ名を含む', () => {
    const text = getShareText(sampleType, 'https://example.com');
    expect(text).toContain(sampleType.name);
  });

  it('辛口コメント（キャッチフレーズ）を含む', () => {
    const text = getShareText(sampleType, 'https://example.com');
    expect(text).toContain(sampleType.catchphrase);
  });

  it('ハッシュタグ #AIモラル診断 を含む', () => {
    const text = getShareText(sampleType, 'https://example.com');
    expect(text).toContain('#AIモラル診断');
  });

  it('サービスURL（結果URL）を含む', () => {
    const baseUrl = 'https://share.example.com';
    const text = getShareText(sampleType, baseUrl);
    expect(text).toContain(`${baseUrl}/result?type=UOAC`);
  });

  it('baseUrl が空でも相対結果URLを含む', () => {
    const text = getShareText(sampleType, '');
    expect(text).toContain('/result?type=UOAC');
  });
});
