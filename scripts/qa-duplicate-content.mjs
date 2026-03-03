import fs from "fs";
import path from "path";

/**
 * Duplicate paragraph QA
 *
 * This script scans school profile markdown and flags paragraphs that
 * appear across multiple schools (a common source of "thin directory"
 * and duplicate-content risk).
 *
 * Run:
 *   npm run qa:content
 */

const MIN_LEN = 140; // ignore short paragraphs/headings
const MIN_SCHOOL_COUNT = 3; // show paragraphs that repeat across >= 3 schools

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function todayStamp() {
  const d = new Date();
  return d.toISOString().replace("T", " ").slice(0, 16);
}

function normalizeParagraph(p) {
  return String(p || "")
    .replace(/\r/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function splitParagraphs(md) {
  const raw = String(md || "").replace(/\r/g, "");
  return raw
    .split(/\n\s*\n+/g)
    .map((p) => normalizeParagraph(p))
    .filter(Boolean)
    .filter((p) => !p.startsWith("#"));
}

const root = process.cwd();
const dataPath = path.join(root, "data", "schools.json");
const outPath = path.join(root, "data", "qa_duplicates.md");

const parsed = readJson(dataPath);
const schools = Array.isArray(parsed) ? parsed : parsed?.schools ?? [];

/**
 * Map paragraph => {count, schools: Set<id>, examples: Set<name>}
 */
const index = new Map();
let totalParagraphs = 0;

for (const s of schools) {
  const id = s?.id;
  const name = s?.name;
  const md = s?.profile_md;
  if (!id || !name || !md) continue;
  const paras = splitParagraphs(md);
  for (const para of paras) {
    if (para.length < MIN_LEN) continue;
    totalParagraphs += 1;
    const entry = index.get(para) ?? { count: 0, schoolIds: new Set(), schoolNames: new Set() };
    entry.count += 1;
    entry.schoolIds.add(id);
    entry.schoolNames.add(name);
    index.set(para, entry);
  }
}

const duplicates = Array.from(index.entries())
  .map(([para, meta]) => ({ para, meta, schoolCount: meta.schoolIds.size }))
  .filter((d) => d.schoolCount >= MIN_SCHOOL_COUNT)
  .sort((a, b) => b.schoolCount - a.schoolCount || b.para.length - a.para.length);

const lines = [];
lines.push("# Duplicate paragraph report");
lines.push("");
lines.push(`Generated: ${todayStamp()}`);
lines.push("");
lines.push("## How to use this report");
lines.push("This report flags paragraphs that repeat across multiple school profiles.");
lines.push("If a paragraph appears in many schools, rewrite it once per school or replace it with school-specific facts.");
lines.push("");
lines.push("## Settings");
lines.push(`- Minimum paragraph length: **${MIN_LEN} characters**`);
lines.push(`- Included if it appears in: **${MIN_SCHOOL_COUNT}+ schools**`);
lines.push("");
lines.push("## Summary");
lines.push(`- Schools scanned: **${schools.length}**`);
lines.push(`- Paragraphs analyzed (after filters): **${totalParagraphs}**`);
lines.push(`- Duplicate paragraphs found: **${duplicates.length}**`);
lines.push("");

if (!duplicates.length) {
  lines.push("No repeated paragraphs matched the threshold.");
} else {
  const top = duplicates.slice(0, 25);
  lines.push("## Top duplicates");
  lines.push("(Showing up to 25)");
  lines.push("");

  let idx = 1;
  for (const d of top) {
    const schoolsList = Array.from(d.meta.schoolIds);
    lines.push(`### Duplicate #${idx} — appears in ${d.schoolCount} schools`);
    lines.push("");
    lines.push("> " + d.para.replace(/\n/g, " "));
    lines.push("");
    lines.push("Schools:");
    for (const sid of schoolsList) {
      lines.push(`- ${sid}`);
    }
    lines.push("");
    idx += 1;
  }
}

fs.writeFileSync(outPath, lines.join("\n") + "\n", "utf8");
console.log(`Wrote duplicate paragraph report → ${outPath}`);
