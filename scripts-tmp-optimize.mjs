import sharp from "sharp";
import fs from "fs";
import path from "path";

const ASSETS = "/Users/Yashu/tminus0-website/tmineone/public/assets";

const team = [
  ["yashasree.jpg", "yashasree.webp", 1000],
  ["julian.jpg", "julian.webp", 1000],
  ["bergan.jpg", "bergan.webp", 1000],
  ["pam.jpg", "pam.webp", 1000],
  ["shom.jpg", "shom.webp", 1000],
  ["sara.jpg", "sara.webp", 1000],
  ["mallory.png", "mallory.webp", 1000],
  ["amelia.jpeg", "amelia.webp", 1000],
  ["ishani.JPG", "ishani.webp", 1000],
  ["amyy.jpg", "amyy.webp", 1000],
  ["ryan.jpeg", "ryan.webp", 1000],
];

const other = [
  ["t-0 team photo.JPG", "community-photo.webp", 2200],
];

async function run() {
  for (const [src, dest, maxDim] of [...team, ...other]) {
    const srcPath = path.join(ASSETS, src);
    const destPath = path.join(ASSETS, dest);
    const before = fs.statSync(srcPath).size;
    await sharp(srcPath)
      .resize({ width: maxDim, height: maxDim, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(destPath);
    const after = fs.statSync(destPath).size;
    console.log(`${src} -> ${dest}: ${(before/1024).toFixed(0)}KB -> ${(after/1024).toFixed(0)}KB`);
  }
}

run().catch((e) => { console.error(e); process.exit(1); });
