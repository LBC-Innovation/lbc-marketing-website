/**
 * Derives every logo asset the site needs from the single source file in /logo.
 *
 * Two properties of the source make this more than a resize:
 *
 *   1. The plum "INNOVATION" wordmark is invisible on a dark background, so the
 *      dark theme needs it recolored to bone.
 *   2. The counters of the O and the A are filled with opaque WHITE rather than
 *      being transparent. Left alone those read as light blobs on any surface
 *      that is not pure white — including the dark theme and the footer's
 *      tinted panel.
 *
 * Both are handled by rebuilding the wordmark as ink-on-transparent: luminance
 * becomes alpha, so plum goes fully opaque, white goes fully transparent, and
 * the blended pixels along the counter edges become partial alpha instead of a
 * pale fringe. The mark itself is never touched.
 *
 * Every boundary below is measured from the pixels rather than hardcoded, so
 * moving the wordmark or changing the canvas does not silently corrupt output.
 *
 * Run: npm run assets
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "logo/lbci-logo.png";
const OUT = "public/logo";

const PLUM = [104, 76, 99]; // #684C63 — measured wordmark color
const BONE = [244, 237, 239]; // #F4EDEF — --ink in the dark theme

const isCoral = (r, _g, b) => r > 190 && r - b > 45;
const isPlum = (r, _g, b) => r < 170 && b < 170;
const luminance = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

await mkdir(OUT, { recursive: true });
await mkdir("public/brand", { recursive: true });

const { data, info } = await sharp(SRC)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;

const at = (x, y) => {
  const i = (y * width + x) * channels;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

// --- Measure where the mark ends and the wordmark begins ---------------------

let markBottom = -1;
let wordTop = -1;
let wordBottom = -1;

for (let y = 0; y < height; y++) {
  let coral = 0;
  let plum = 0;
  for (let x = 0; x < width; x++) {
    const [r, g, b, a] = at(x, y);
    if (a < 128) continue;
    if (isCoral(r, g, b)) coral++;
    else if (isPlum(r, g, b)) plum++;
  }
  if (coral > 3) markBottom = y;
  if (plum > 3) {
    if (wordTop === -1) wordTop = y;
    wordBottom = y;
  }
}

if (markBottom === -1 || wordTop === -1) {
  throw new Error(
    `Could not locate mark and wordmark in ${SRC} ` +
      `(markBottom=${markBottom}, wordTop=${wordTop}). ` +
      `The color classification needs revisiting for this file.`,
  );
}
if (wordTop <= markBottom) {
  throw new Error(
    `Wordmark (from row ${wordTop}) overlaps the mark (ends row ${markBottom}). ` +
      `Splitting them by row no longer works for this file.`,
  );
}

// Split through the middle of the empty gap between the two.
const cutRow = Math.round((markBottom + wordTop) / 2);

// --- Rebuild the wordmark as ink on transparent ------------------------------

// Normalize against the actual range present so the mapping holds even if the
// exact plum or white values shift.
let lMin = 1;
let lMax = 0;
for (let y = cutRow; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const [r, g, b, a] = at(x, y);
    if (a < 200) continue;
    const l = luminance(r, g, b);
    if (l < lMin) lMin = l;
    if (l > lMax) lMax = l;
  }
}
const lRange = Math.max(lMax - lMin, 0.001);

function withWordmark([tr, tg, tb]) {
  const out = Buffer.from(data);
  for (let y = cutRow; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const a = out[i + 3];
      if (a === 0) continue;
      const coverage = Math.min(
        1,
        Math.max(0, (lMax - luminance(out[i], out[i + 1], out[i + 2])) / lRange),
      );
      out[i] = tr;
      out[i + 1] = tg;
      out[i + 2] = tb;
      out[i + 3] = Math.round(a * coverage);
    }
  }
  return out;
}

const raw = { width, height, channels };

await sharp(withWordmark(PLUM), { raw })
  .trim({ threshold: 1 })
  .png()
  .toFile(`${OUT}/lbci-logo.png`);

await sharp(withWordmark(BONE), { raw })
  .trim({ threshold: 1 })
  .png()
  .toFile(`${OUT}/lbci-logo-dark.png`);

// --- Mark alone, squared, for the nav and favicons ---------------------------
// Crop and trim run as two passes: sharp reorders them within one pipeline.

const cropped = await sharp(SRC)
  .extract({ left: 0, top: 0, width, height: cutRow })
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
await sharp(squareMark).resize(512, 512).png().toFile(`${OUT}/lbci-mark.png`);
await sharp(squareMark)
  .resize(180, 180)
  .flatten({ background: "#FBF7F4" })
  .png()
  .toFile("src/app/apple-icon.png");

// --- Open Graph card: dark plum field, bone wordmark, centered ---------------

const ogLogo = await sharp(`${OUT}/lbci-logo-dark.png`)
  .resize({ width: 620, fit: "inside" })
  .toBuffer();

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: { r: 20, g: 15, b: 22, alpha: 1 },
  },
})
  .composite([{ input: ogLogo, gravity: "center" }])
  .png()
  .toFile("public/brand/og.png");

console.log(`Source: ${SRC} (${width}x${height})`);
console.log(`  mark rows ..${markBottom}, wordmark rows ${wordTop}..${wordBottom}`);
console.log(`  split at row ${cutRow} (gap of ${wordTop - markBottom}px)`);
console.log(`  wordmark luminance ${lMin.toFixed(3)}..${lMax.toFixed(3)} -> alpha`);
console.log("Generated:");
console.log("  public/logo/lbci-logo.png       (light theme)");
console.log("  public/logo/lbci-logo-dark.png  (dark theme, bone wordmark)");
console.log("  public/logo/lbci-mark.png       (nav)");
console.log("  src/app/icon.png, src/app/apple-icon.png");
console.log("  public/brand/og.png             (1200x630 social card)");
