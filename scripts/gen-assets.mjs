/**
 * Derives every logo asset the site needs from the single source file in /logo.
 *
 * The source is a transparent full lockup: a gradient mark stacked over a
 * gradient "INNOVATION" wordmark. Both halves keep their original color on
 * light and dark — the wordmark is already visible on either field.
 *
 * The mark/wordmark boundary is measured from ink (non-transparent rows),
 * not from a specific palette, so a future color shift does not silently
 * crop the wrong half.
 *
 * Run: npm run assets
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "logo/lbci-logo.png";
const OUT = "public/logo";

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

const bands = [];
let run = null;
for (let y = 0; y < height; y++) {
  let ink = 0;
  for (let x = 0; x < width; x++) {
    const [, , , a] = at(x, y);
    if (a > 16) ink++;
  }
  if (ink > 3) {
    if (!run) run = { start: y, end: y };
    else run.end = y;
  } else if (run) {
    bands.push(run);
    run = null;
  }
}
if (run) bands.push(run);

if (bands.length < 2) {
  throw new Error(
    `Could not locate mark and wordmark in ${SRC} ` +
      `(found ${bands.length} ink band${bands.length === 1 ? "" : "s"}). ` +
      `Expected a stacked lockup with a gap between the mark and the wordmark.`,
  );
}

const markBand = bands[0];
const wordBand = bands[bands.length - 1];
if (wordBand.start <= markBand.end) {
  throw new Error(
    `Wordmark (from row ${wordBand.start}) overlaps the mark (ends row ${markBand.end}). ` +
      `Splitting them by row no longer works for this file.`,
  );
}

// Split through the middle of the empty gap between the two.
const cutRow = Math.round((markBand.end + wordBand.start) / 2);

// --- Full lockup: trim only. Light and dark share the same graphic. ----------

const lockup = await sharp(SRC).trim({ threshold: 1 }).png().toBuffer();

await sharp(lockup).toFile(`${OUT}/lbci-logo.png`);
await sharp(lockup).toFile(`${OUT}/lbci-logo-dark.png`);

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

// --- Open Graph card: dark plum field, centered lockup -----------------------

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

const lockupMeta = await sharp(lockup).metadata();

console.log(`Source: ${SRC} (${width}x${height})`);
console.log(
  `  mark rows ${markBand.start}..${markBand.end}, wordmark rows ${wordBand.start}..${wordBand.end}`,
);
console.log(
  `  split at row ${cutRow} (gap of ${wordBand.start - markBand.end}px)`,
);
console.log(`  lockup ${lockupMeta.width}x${lockupMeta.height}`);
console.log("Generated:");
console.log("  public/logo/lbci-logo.png       (light theme)");
console.log("  public/logo/lbci-logo-dark.png  (dark theme)");
console.log("  public/logo/lbci-mark.png       (nav)");
console.log("  src/app/icon.png, src/app/apple-icon.png");
console.log("  public/brand/og.png             (1200x630 social card)");
