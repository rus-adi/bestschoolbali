import fs from "fs";
import path from "path";

const SITE_URL = "https://bestschoolbali.com";

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/\s*\/\s*/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniq(arr) {
  return Array.from(new Set(arr.filter(Boolean)));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listPostSlugs(postsDir) {
  if (!fs.existsSync(postsDir)) return [];
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
  return files.map((f) => f.replace(/\.md$/, ""));
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlset(urls, lastmod) {
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ];
  for (const u of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${xmlEscape(u)}</loc>`);
    lines.push(`    <lastmod>${lastmod}</lastmod>`);
    lines.push("  </url>");
  }
  lines.push("</urlset>");
  return lines.join("\n") + "\n";
}

const root = process.cwd();
const dataPath = path.join(root, "data", "schools.json");
const postsDir = path.join(root, "posts");
const publicDir = path.join(root, "public");
const outPath = path.join(publicDir, "sitemap.xml");

const parsed = readJson(dataPath);
const schools = Array.isArray(parsed) ? parsed : parsed?.schools ?? [];

const schoolIds = uniq(schools.map((s) => s?.id).filter(Boolean));

// Areas: prefer explicit areas[] when present; fall back to area.
const allAreas = [];
for (const s of schools) {
  if (Array.isArray(s?.areas) && s.areas.length) {
    for (const a of s.areas) allAreas.push(a);
  } else if (s?.area) {
    allAreas.push(s.area);
  }
}
const areaSlugs = uniq(allAreas).map(slugify);

const curriculumSlugs = uniq(schools.flatMap((s) => s?.curriculum_tags ?? [])).map(slugify);
const budgetSlugs = uniq(schools.map((s) => s?.budget_category ?? "")).map(slugify).filter(Boolean);
const typeSlugs = uniq(schools.map((s) => s?.type ?? "")).map(slugify).filter(Boolean);

const blogSlugs = listPostSlugs(postsDir);

// Curated compare pages (keep in sync with lib/areaComparisons.ts).
const areaComparePairs = [
  "canggu-vs-ubud",
  "canggu-vs-sanur",
  "ubud-vs-sanur",
  "canggu-vs-bukit-region",
  "sanur-vs-bukit-region",
  "ubud-vs-bukit-region",
];

const ageBands = ["early-years", "primary", "secondary"];

const staticRoutes = [
  "/",
  "/schools",
  "/areas",
  "/curriculums",
  "/types",
  "/budget",
  "/fees",
  "/fees/estimate",
  "/methodology",
  "/for-schools",
  "/for-schools/pricing",
  "/compare",
  "/compare/areas",
  "/ages",
  "/guides",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
];

const urls = [];
for (const r of staticRoutes) urls.push(`${SITE_URL}${r}`);

for (const id of schoolIds) urls.push(`${SITE_URL}/schools/${id}`);
for (const a of areaSlugs) urls.push(`${SITE_URL}/areas/${a}`);
for (const t of curriculumSlugs) urls.push(`${SITE_URL}/curriculums/${t}`);
for (const b of budgetSlugs) urls.push(`${SITE_URL}/budget/${b}`);
for (const b of ageBands) urls.push(`${SITE_URL}/ages/${b}`);
for (const t of typeSlugs) urls.push(`${SITE_URL}/types/${t}`);
for (const p of areaComparePairs) urls.push(`${SITE_URL}/compare/areas/${p}`);
for (const s of blogSlugs) urls.push(`${SITE_URL}/blog/${s}`);

// Guides topic pages (keep in sync with lib/guideTopics.ts).
const guideTopics = [
  "getting-started",
  "fees-and-budgets",
  "admissions",
  "curriculum",
  "areas-and-lifestyle",
  "relocation",
];
for (const t of guideTopics) urls.push(`${SITE_URL}/guides/${t}`);

const uniqueUrls = uniq(urls).sort();

if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
const xml = buildUrlset(uniqueUrls, todayISO());
fs.writeFileSync(outPath, xml, "utf8");

console.log(`Generated sitemap with ${uniqueUrls.length} URLs → ${outPath}`);
