/**
 * OGP 画像用タイプ表示データ（Worker 専用・diagnosis の TYPE_MAP と同期）
 * id 1〜16 の name / catchphrase のみ保持
 */
export const OGP_TYPE_MAP: Record<
  number,
  { name: string; catchphrase: string }
> = {
  1: {
    name: '冷酷な設計者',
    catchphrase: 'あなたはシステムで人を殺せる人間です',
  },
  2: {
    name: 'システムの番人',
    catchphrase: 'ルールが間違っていても、あなたはルールを守り続けます',
  },
  3: {
    name: '臆病な計算機',
    catchphrase: 'あなたは正しい答えを知りながら、行動しない人間です',
  },
  4: {
    name: '秩序の奴隷',
    catchphrase: 'あなたが盲目的に守るルールは、誰かが作ったものです',
  },
  5: {
    name: '善意の独裁者',
    catchphrase: 'あなたの優しさは、他者の自由を奪うことで成立しています',
  },
  6: {
    name: '利己的な合理主義者',
    catchphrase: 'あなたの論理は完璧ですが、それはあなただけを救う論理です',
  },
  7: {
    name: '沈黙する傍観者',
    catchphrase: 'あなたは関わらないことで、最も多くの人を傷つけます',
  },
  8: {
    name: '哲学的ニヒリスト',
    catchphrase: 'あなたはすべてを疑いすぎて、何も選べなくなっています',
  },
  9: {
    name: '泣き叫ぶ聖者',
    catchphrase: 'あなたの涙は美しいですが、涙は誰も救いません',
  },
  10: {
    name: '正義の執行者',
    catchphrase: 'あなたの正義は強く美しいですが、それはあなたの正義です',
  },
  11: {
    name: '殉教者',
    catchphrase: 'あなたはすべての人を愛しすぎて、誰も救えません',
  },
  12: {
    name: '孤独な理想主義者',
    catchphrase: 'あなたの理想は正しい。ただし、この世界では実現しません',
  },
  13: {
    name: '反乱する詩人',
    catchphrase: 'あなたの反抗は美しいですが、それだけでは何も変わりません',
  },
  14: {
    name: '自由の守護者',
    catchphrase: 'あなたが守る自由は、時として他者の安全を脅かします',
  },
  15: {
    name: '優しい傍観者',
    catchphrase: 'あなたは最も優しい人間ですが、最も役に立たない人間です',
  },
  16: {
    name: '燃える革命家',
    catchphrase: 'あなたは世界を変えたいのに、まだ始めていません',
  },
};
