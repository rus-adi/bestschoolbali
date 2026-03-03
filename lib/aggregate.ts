import type { School } from "./schools";
import { slugify } from "./slug";

export type CountItem = { name: string; slug: string; count: number };

function clean(v: unknown) {
  return String(v ?? "").trim();
}

function inc(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

/**
 * Count string values and return the top items.
 * Deterministic ordering: highest count → alphabetical.
 */
export function topCounts(values: Array<string | null | undefined>, limit = 6): Array<{ name: string; count: number }> {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const v = clean(raw);
    if (!v) continue;
    inc(counts, v);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

/**
 * Build a list of unique curriculum tags (de-duped by slug).
 * The displayed name is the most common variant.
 */
export function topCurriculumTagsFromSchools(schools: School[], limit = 8): CountItem[] {
  const buckets = new Map<string, { count: number; variants: Map<string, number> }>();
  for (const s of schools) {
    for (const raw of s.curriculum_tags ?? []) {
      const tag = clean(raw);
      if (!tag) continue;
      const slug = slugify(tag);
      const b = buckets.get(slug) ?? { count: 0, variants: new Map<string, number>() };
      b.count += 1;
      b.variants.set(tag, (b.variants.get(tag) ?? 0) + 1);
      buckets.set(slug, b);
    }
  }

  const items: CountItem[] = Array.from(buckets.entries()).map(([slug, b]) => {
    let bestName = slug;
    let best = -1;
    for (const [variant, c] of b.variants.entries()) {
      if (c > best || (c === best && variant.length < bestName.length)) {
        best = c;
        bestName = variant;
      }
    }
    return { name: bestName, slug, count: b.count };
  });

  return items.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, limit);
}

/** Count areas using `areas[]` when present; fall back to `area`. */
export function topAreasFromSchools(schools: School[], limit = 6): CountItem[] {
  const counts = new Map<string, number>();
  for (const s of schools) {
    const list = s.areas?.length ? s.areas : [s.area];
    for (const raw of list) {
      const name = clean(raw);
      if (!name) continue;
      inc(counts, name);
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, limit);
}

export function topTypesFromSchools(schools: School[], limit = 6): CountItem[] {
  const buckets = new Map<string, { count: number; variants: Map<string, number> }>();
  for (const s of schools) {
    const t = clean(s.type);
    if (!t) continue;
    const slug = slugify(t);
    const b = buckets.get(slug) ?? { count: 0, variants: new Map<string, number>() };
    b.count += 1;
    b.variants.set(t, (b.variants.get(t) ?? 0) + 1);
    buckets.set(slug, b);
  }

  const items: CountItem[] = Array.from(buckets.entries()).map(([slug, b]) => {
    let bestName = slug;
    let best = -1;
    for (const [variant, c] of b.variants.entries()) {
      if (c > best || (c === best && variant.length < bestName.length)) {
        best = c;
        bestName = variant;
      }
    }
    return { name: bestName, slug, count: b.count };
  });

  return items.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)).slice(0, limit);
}

export function topBudgetsFromSchools(schools: School[], limit = 4): CountItem[] {
  const counts = new Map<string, number>();
  for (const s of schools) {
    const b = clean(s.budget_category);
    if (!b) continue;
    inc(counts, b);
  }

  const preferredOrder = ["Budget", "Mid-range", "Premium", "Luxury"];
  const items = Array.from(counts.entries()).map(([name, count]) => ({ name, slug: slugify(name), count }));

  return items
    .sort((a, b) => {
      const ai = preferredOrder.indexOf(a.name);
      const bi = preferredOrder.indexOf(b.name);
      if (ai === -1 && bi === -1) return b.count - a.count || a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    })
    .slice(0, limit);
}
