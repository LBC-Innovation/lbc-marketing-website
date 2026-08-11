/**
 * Derives every logo asset the site needs from the single source file in /logo.
 *
 * The source mark is a coral gradient with a dark plum "INNOVATION" wordmark,
 * which vanishes on a dark background. For the dark theme we recolor only the
 * plum pixels to bone, leaving the gradient untouched.
 *
 * Run: npm run assets
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "logo/lbci-logo.png";
const OUT = "public/logo";

// Wordmark plum is ~#5E4756: every channel well under 160.
// Gradient pixels are all >200 in red. A red threshold separates them cleanly.
const PLUM_RED_MAX = 170;
const BONE = [244, 237, 239];

await mkdir(OUT, { recursive: true });
await mkdir("public/brand", { recursive: true });

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

// --- Light-theme logo: source, trimmed of transparent margin ---
await sharp(SRC).trim({ threshold: 1 }).png().toFile(`${OUT}/lbci-logo.png`);

// --- Dark-theme logo: plum wordmark recolored to bone ---
const dark = Buffer.from(data);
for (let i = 0; i < dark.length; i += channels) {
  if (dark[i + 3] < 8) continue;
  if (dark[i] < PLUM_RED_MAX) {
    dark[i] = BONE[0];
    dark[i + 1] = BONE[1];
    dark[i + 2] = BONE[2];
  }
}
await sharp(dark, { raw: { width, height, channels } })
  .trim({ threshold: 1 })
  .png()
  .toFile(`${OUT}/lbci-logo-dark.png`);

// --- Icon: the "lbc" mark alone, no wordmark, padded into a square ---
// The wordmark occupies roughly the bottom 14% of the canvas.
// Crop and trim run as two passes: sharp reorders them within one pipeline.
const markHeight = Math.round(height * 0.84);
const cropped = await sharp(SRC)
  .extract({ left: 0, top: 0, width, height: markHeight })
  .png()
  .toBuffer();
const mark = await sharp(cropped).trim({ threshold: 1 }).png().toBuffer();

const markMeta = await sharp(mark).metadata();
const side = Math.max(markMeta.width, markMeta.height);
const pad = Math.round(side * 0.12);
const canvas = side + pad * 2;

const squareMark = await sharp({
  create: {
    width: canvas,
    height: canvas,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([{ input: mark, gravity: "center" }])
  .png()
  .toBuffer();

await sharp(squareMark).resize(512, 512).png().toFile("src/app/icon.png");
// The nav uses the mark alone: at nav scale the wordmark is illegible, so the
// full lockup is reserved for the footer where it has room to read.
await sharp(squareMark).resize(512, 512).png().toFile(`${OUT}/lbci-mark.png`);
await sharp(squareMark)
  .resize(180, 180)
  .flatten({ background: "#FBF7F4" })
  .png()
  .toFile("src/app/apple-icon.png");

// --- Open Graph card: dark plum field, bone wordmark, centered ---
const OG_W = 1200;
const OG_H = 630;
const ogLogo = await sharp(`${OUT}/lbci-logo-dark.png`)
  .resize({ width: 620, fit: "inside" })
  .toBuffer();

await sharp({
  create: {
    width: OG_W,
    height: OG_H,
    channels: 4,
    background: { r: 20, g: 15, b: 22, alpha: 1 },
  },
})
  .composite([{ input: ogLogo, gravity: "center" }])
  .png()
  .toFile("public/brand/og.png");

console.log("Generated:");
console.log("  public/logo/lbci-logo.png       (light theme)");
console.log("  public/logo/lbci-logo-dark.png  (dark theme, bone wordmark)");
console.log("  src/app/icon.png                (favicon, mark only)");
console.log("  src/app/apple-icon.png");
console.log("  public/brand/og.png             (1200x630 social card)");
