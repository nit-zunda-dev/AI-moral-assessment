/**
 * ディストピア法廷テーマ定数
 * src/index.css の @theme 定義と同期を保つこと
 */

export const THEME_COLORS = {
  deepSpace: '#0A0E1A',
  indigoDark: '#1A2744',
  verdictRed: '#C41E3A',
  circuitGreen: '#4FFFB0',
  parchment: '#E8E3D8',
  slatePurple: '#7B68EE',
} as const;

export const THEME_FONTS = {
  display: '"Playfair Display", Georgia, serif',
  serif: '"Noto Serif JP", "Noto Serif", serif',
  mono: '"JetBrains Mono", "Fira Code", monospace',
} as const;

export type ThemeColor = keyof typeof THEME_COLORS;
export type ThemeFont = keyof typeof THEME_FONTS;
