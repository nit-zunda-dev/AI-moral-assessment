# 7.3 シナリオJSONスキーマ・7.4 診断ロジック

## シナリオJSONスキーマ（TypeScript型）

- **Scenario:** id, title, subtitle, category, difficulty, illustration, body (200-350字), choices { A, B }, publishDate（デイリー用）
- **Choice:** label, rebuttal（論破テキスト・事前生成）, params（ParameterDelta）
- **ParameterDelta:** result_efficiency, rule_discipline, humanity_morality, self_preservation, empathy_kindness, logic_coldness（各 number）

---

## 診断ロジック概要

- **DiagnosisParams:** 6軸の数値
- **calculateType(params):**  
  - 功利 vs 共感: result_efficiency > empathy_kindness → U/E  
  - 秩序 vs 自由: rule_discipline > self_preservation → O/F  
  - 能動 vs 受動: 閾値で A/P  
  - 個人 vs 集団: 閾値で I/C  
- 4軸の組み合わせで 16 タイプコード（UEOA 等）→ TYPE_MAP で PersonalityType に変換

---

事前生成型のため、本番ではAPIを呼ばずクライアントだけでタイプ判定が完結する。
