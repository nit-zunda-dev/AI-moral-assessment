/**
 * ビルド後の JS バンドル gzip サイズを検証する（要件 7.4: 150KB 以内）
 * Usage: node scripts/check-bundle-size.mjs [maxKB]
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist', 'assets');
const maxGzipKB = Number(process.argv[2]) || 150;

if (!fs.existsSync(distDir)) {
  console.error('dist/assets が見つかりません。先に npm run build を実行してください。');
  process.exit(1);
}

const files = fs.readdirSync(distDir).filter((f) => f.endsWith('.js'));
let totalGzip = 0;

for (const file of files) {
  const buf = fs.readFileSync(path.join(distDir, file));
  const gzip = zlib.gzipSync(buf, { level: 9 });
  totalGzip += gzip.length;
}

const totalKB = Math.round((totalGzip / 1024) * 10) / 10;
const ok = totalGzip <= maxGzipKB * 1024;

console.log(`Bundle gzip total: ${totalKB} KB (limit: ${maxGzipKB} KB)`);
if (!ok) {
  console.error(`FAIL: ${totalKB} KB > ${maxGzipKB} KB`);
  process.exit(1);
}
console.log('PASS: バンドルサイズは目標以内です。');
