import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve(import.meta.dirname, '../public');
const svgPath = path.join(publicDir, 'og-image.svg');
const pngPath = path.join(publicDir, 'og-image.png');

async function main() {
  const svg = await fs.readFile(svgPath);
  await sharp(svg, { density: 288 }).resize(1200, 630).png().toFile(pngPath);
  console.log(`Generated ${pngPath}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
