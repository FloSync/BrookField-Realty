import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public/hero/hero-slide-city.png");
const dest = path.join(root, "public/hero/hero-slide-city.jpg");

await sharp(src)
  .resize(2560, null, { kernel: sharp.kernel.lanczos3, withoutEnlargement: false })
  .sharpen({ sigma: 0.8, m1: 0.5, m2: 0.3 })
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(dest);

const meta = await sharp(dest).metadata();
console.log(`Wrote ${dest} (${meta.width}x${meta.height})`);
