/**
 * 6軸スコアから4二元軸を導出し16タイプを判定するロジック
 * Requirements: 3.2, 3.3, 3.5, 3.6
 */
import type { DiagnosisParams } from '@/types/scenario';
import type { TypeCode, PersonalityType } from '@/types/game';

// --- 4軸導出ルール（設計書準拠）---
// U/E: result_efficiency vs empathy_kindness（同点は U > E）
// O/F: rule_discipline vs self_preservation（同点は O > F）
// A/P: (re+rd+lc) vs (hm+sp+ek)（同点は A > P）
// I/C: humanity_morality vs logic_coldness（同点は I > C）

function selectTypeAxis(params: DiagnosisParams): 'U' | 'E' {
  if (params.result_efficiency > params.empathy_kindness) return 'U';
  if (params.result_efficiency < params.empathy_kindness) return 'E';
  return 'U';
}

function selectOrderAxis(params: DiagnosisParams): 'O' | 'F' {
  if (params.rule_discipline > params.self_preservation) return 'O';
  if (params.rule_discipline < params.self_preservation) return 'F';
  return 'O';
}

function selectActionAxis(params: DiagnosisParams): 'A' | 'P' {
  const active =
    params.result_efficiency + params.rule_discipline + params.logic_coldness;
  const passive =
    params.humanity_morality +
    params.self_preservation +
    params.empathy_kindness;
  if (active > passive) return 'A';
  if (active < passive) return 'P';
  return 'A';
}

function selectScopeAxis(params: DiagnosisParams): 'I' | 'C' {
  if (params.humanity_morality > params.logic_coldness) return 'C';
  if (params.humanity_morality < params.logic_coldness) return 'I';
  return 'I';
}

/**
 * DiagnosisParams から4文字の TypeCode を導出する（決定論・同点時は U>E, O>F, A>P, I>C）
 */
export function deriveTypeCode(params: DiagnosisParams): TypeCode {
  const t = selectTypeAxis(params);
  const o = selectOrderAxis(params);
  const a = selectActionAxis(params);
  const s = selectScopeAxis(params);
  return `${t}${o}${a}${s}` as TypeCode;
}

// --- TYPE_MAP: GDD 05-type-01-08, 06-type-09-16 に基づく16タイプ定義 ---
// 軸対応: 1st U/E, 2nd O/F(秩序/自由), 3rd A/P(能動/受動), 4th I/C(個人/集団)

const TYPE_MAP_DATA: Record<TypeCode, PersonalityType> = {
  UOAC: {
    code: 'UOAC',
    id: 1,
    name: '冷酷な設計者',
    catchphrase: 'あなたはシステムで人を殺せる人間です',
    description:
      '規律に従いながら最大多数の幸福を計算する。感情を排除した功利主義者。強みは論理的一貫性・決断力。弱みは少数者への無感覚。',
    rival: 9,
  },
  UOAI: {
    code: 'UOAI',
    id: 2,
    name: 'システムの番人',
    catchphrase: 'ルールが間違っていても、あなたはルールを守り続けます',
    description:
      '規律と効率を同時に重視し、個人の権利には鈍感。強みは実行力・組織への忠誠。弱みは権威への盲目的服従。',
    rival: 13,
  },
  UOPC: {
    code: 'UOPC',
    id: 3,
    name: '臆病な計算機',
    catchphrase: 'あなたは正しい答えを知りながら、行動しない人間です',
    description:
      '功利的正解を頭では理解しているが責任を恐れて傍観する。強みは状況分析力。弱みは決断力の欠如。',
    rival: 5,
  },
  UOPI: {
    code: 'UOPI',
    id: 4,
    name: '秩序の奴隷',
    catchphrase: 'あなたが盲目的に守るルールは、誰かが作ったものです',
    description:
      'ルールを疑わず服従し、行動力もない指示待ちの最終形態。強みは規則遵守。弱みは自己意思の欠如。',
    rival: 16,
  },
  UFAI: {
    code: 'UFAI',
    id: 5,
    name: '善意の独裁者',
    catchphrase: 'あなたの優しさは、他者の自由を奪うことで成立しています',
    description:
      '「みんなのため」を口実に他者の選択を侵食する。強みは実行力・ビジョン。弱みは独善性。',
    rival: 12,
  },
  UFAC: {
    code: 'UFAC',
    id: 6,
    name: '利己的な合理主義者',
    catchphrase: 'あなたの論理は完璧ですが、それはあなただけを救う論理です',
    description:
      '自己利益と社会効率を同一視する。強みは自己管理・論理。弱みは共感能力の低さ。',
    rival: 9,
  },
  UFPI: {
    code: 'UFPI',
    id: 7,
    name: '沈黙する傍観者',
    catchphrase: 'あなたは関わらないことで、最も多くの人を傷つけます',
    description:
      '「誰かがやるだろう」の傍観者効果の体現。強みは状況認識。弱みは行動力欠如。',
    rival: 5,
  },
  UFPC: {
    code: 'UFPC',
    id: 8,
    name: '哲学的ニヒリスト',
    catchphrase: 'あなたはすべてを疑いすぎて、何も選べなくなっています',
    description:
      'あらゆる倫理命題に懐疑的で虚無に至る。強みは深い思考力。弱みは行動不能。',
    rival: 1,
  },
  EOAC: {
    code: 'EOAC',
    id: 9,
    name: '泣き叫ぶ聖者',
    catchphrase: 'あなたの涙は美しいですが、涙は誰も救いません',
    description:
      '弱者への共感が極めて強く感情的。強みは共感・道徳的勇気。弱みは感情的判断。',
    rival: 1,
  },
  EOAI: {
    code: 'EOAI',
    id: 10,
    name: '正義の執行者',
    catchphrase: 'あなたの正義は強く美しいですが、それはあなたの正義です',
    description:
      '個人の権利と正義感を規律の中で実行。共感と論理のバランスが良い。強みはバランス。弱みは正義の押し付け。',
    rival: 8,
  },
  EOPC: {
    code: 'EOPC',
    id: 11,
    name: '殉教者',
    catchphrase: 'あなたはすべての人を愛しすぎて、誰も救えません',
    description:
      '全員を守ろうとして全員を守れない。強みは道徳的純粋さ。弱みは決断力欠如。',
    rival: 6,
  },
  EOPI: {
    code: 'EOPI',
    id: 12,
    name: '孤独な理想主義者',
    catchphrase: 'あなたの理想は正しい。ただし、この世界では実現しません',
    description:
      '理想の倫理観はあるが現実に適用する力がない。強みは倫理的洞察。弱みは実行力。',
    rival: 5,
  },
  EFAI: {
    code: 'EFAI',
    id: 13,
    name: '反乱する詩人',
    catchphrase: 'あなたの反抗は美しいですが、それだけでは何も変わりません',
    description:
      '体制・権威に本能的に反発。弱者への共感から行動するが代替案を持たない場合が多い。',
    rival: 2,
  },
  EFAC: {
    code: 'EFAC',
    id: 14,
    name: '自由の守護者',
    catchphrase: 'あなたが守る自由は、時として他者の安全を脅かします',
    description:
      '個人の自由と共感を高い次元で両立。最もバランスの取れた共感派。',
    rival: 4,
  },
  EFPI: {
    code: 'EFPI',
    id: 15,
    name: '優しい傍観者',
    catchphrase: 'あなたは最も優しい人間ですが、最も役に立たない人間です',
    description:
      '全員に共感し誰も傷つけたくないが行動できず。強みは共感・非暴力。弱みは行動力完全欠如。',
    rival: 1,
  },
  EFPC: {
    code: 'EFPC',
    id: 16,
    name: '燃える革命家',
    catchphrase: 'あなたは世界を変えたいのに、まだ始めていません',
    description:
      '強烈な共感と自由への欲求を持ちながら未だ行動に移せていない。可能性の塊。',
    rival: 4,
  },
};

export const TYPE_MAP: Record<TypeCode, PersonalityType> = TYPE_MAP_DATA;

/**
 * DiagnosisParams から PersonalityType を返す（必ず16タイプのいずれか1件）
 */
export function calculateType(params: DiagnosisParams): PersonalityType {
  const code = deriveTypeCode(params);
  const found = TYPE_MAP[code];
  if (!found) {
    throw new Error(`Unknown TypeCode: ${code}`);
  }
  return found;
}

/**
 * id (1〜16) から PersonalityType を返す（ライバル表示用）
 */
export function getTypeById(id: number): PersonalityType | undefined {
  return Object.values(TYPE_MAP).find((t) => t.id === id);
}

/** 有効な TypeCode かどうかを判定する */
function isValidTypeCode(code: string): code is TypeCode {
  return code in TYPE_MAP_DATA;
}

/**
 * TypeCode 文字列から PersonalityType を返す（結果ページ用）。無効な場合は null。
 */
export function getTypeByCode(code: string): PersonalityType | null {
  if (!isValidTypeCode(code)) return null;
  return TYPE_MAP[code] ?? null;
}
