import { getAllSchools, type School } from "./schools";
import { slugify } from "./slug";

export type AreaEntry = {
  name: string;
  slug: string;
  count: number;
};

export type CurriculumEntry = {
  tag: string;
  slug: string;
  count: number;
};

export type BudgetEntry = {
  name: string;
  slug: string;
  count: number;
};

export type TypeEntry = {
  name: string;
  slug: string;
  count: number;
};

function uniqSorted(items: string[]) {
  return Array.from(new Set(items.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}

export function getAllAreas(): AreaEntry[] {
  const schools = getAllSchools();

  // Prefer explicit "areas" array when present; fall back to "area".
  const allAreas = schools.flatMap((s) => (s.areas?.length ? s.areas : [s.area])).filter(Boolean);
  const areas = uniqSorted(allAreas);

  const counts = new Map<string, number>();
  for (const s of schools) {
    const list = s.areas?.length ? s.areas : [s.area];
    for (const a of list) {
      counts.set(a, (counts.get(a) ?? 0) + 1);
    }
  }

  return areas.map((name) => ({ name, slug: slugify(name), count: counts.get(name) ?? 0 }));
}

export function resolveAreaSlug(slug: string): string | null {
  const match = getAllAreas().find((a) => a.slug === slug);
  return match?.name ?? null;
}

export function schoolsInArea(areaName: string): School[] {
  const schools = getAllSchools();
  return schools.filter((s) => {
    const list = s.areas?.length ? s.areas : [s.area];
    return list.some((a) => a === areaName);
  });
}

export function getAllCurriculums(): CurriculumEntry[] {
  const schools = getAllSchools();

  // Normalize by slug so we don't accidentally create duplicate pages
  // (e.g., "Nature-Based" vs "Nature-based").
  const buckets = new Map<
    string,
    {
      count: number;
      variants: Map<string, number>;
    }
  >();

  for (const s of schools) {
    for (const raw of s.curriculum_tags ?? []) {
      const tag = String(raw ?? "").trim();
      if (!tag) continue;
      const slug = slugify(tag);
      const bucket = buckets.get(slug) ?? { count: 0, variants: new Map<string, number>() };
      bucket.count += 1;
      bucket.variants.set(tag, (bucket.variants.get(tag) ?? 0) + 1);
      buckets.set(slug, bucket);
    }
  }

  const entries: CurriculumEntry[] = Array.from(buckets.entries()).map(([slug, b]) => {
    // Pick the most common display variant for the slug.
    let display = slug;
    let best = -1;
    for (const [variant, c] of b.variants.entries()) {
      if (c > best || (c === best && variant.length < display.length)) {
        best = c;
        display = variant;
      }
    }
    return { tag: display, slug, count: b.count };
  });

  // Keep the UI stable and easy to scan: alphabetical by display tag.
  return entries.sort((a, b) => a.tag.localeCompare(b.tag));
}

export function resolveCurriculumSlug(slug: string): string | null {
  const match = getAllCurriculums().find((t) => t.slug === slug);
  return match?.tag ?? null;
}

export function schoolsWithCurriculum(tag: string): School[] {
  const schools = getAllSchools();
  const tagSlug = slugify(tag);
  return schools.filter((s) => (s.curriculum_tags ?? []).some((t) => slugify(t) === tagSlug));
}

export function schoolsWithCurriculumSlug(slug: string): School[] {
  const schools = getAllSchools();
  return schools.filter((s) => (s.curriculum_tags ?? []).some((t) => slugify(t) === slug));
}

export function getAllBudgets(): BudgetEntry[] {
  const schools = getAllSchools();
  const counts = new Map<string, number>();
  for (const s of schools) {
    const b = String(s.budget_category ?? "").trim();
    if (!b) continue;
    counts.set(b, (counts.get(b) ?? 0) + 1);
  }

  const preferredOrder = ["Budget", "Mid-range", "Premium", "Luxury"];
  const names = Array.from(counts.keys()).sort((a, b) => {
    const ai = preferredOrder.indexOf(a);
    const bi = preferredOrder.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return names.map((name) => ({ name, slug: slugify(name), count: counts.get(name) ?? 0 }));
}

export function resolveBudgetSlug(slug: string): string | null {
  const match = getAllBudgets().find((b) => b.slug === slug);
  return match?.name ?? null;
}

export function schoolsInBudget(budgetName: string): School[] {
  const schools = getAllSchools();
  return schools.filter((s) => String(s.budget_category ?? "") === budgetName);
}

export function schoolsInBudgetSlug(slug: string): School[] {
  const name = resolveBudgetSlug(slug);
  return name ? schoolsInBudget(name) : [];
}

export function getAllTypes(): TypeEntry[] {
  const schools = getAllSchools();

  // Normalize by slug so we don't accidentally create duplicate pages
  // (e.g., "International school" vs "International School").
  const buckets = new Map<
    string,
    {
      count: number;
      variants: Map<string, number>;
    }
  >();

  for (const s of schools) {
    const raw = String(s.type ?? "").trim();
    if (!raw) continue;
    const slug = slugify(raw);
    const bucket = buckets.get(slug) ?? { count: 0, variants: new Map<string, number>() };
    bucket.count += 1;
    bucket.variants.set(raw, (bucket.variants.get(raw) ?? 0) + 1);
    buckets.set(slug, bucket);
  }

  const entries: TypeEntry[] = Array.from(buckets.entries()).map(([slug, b]) => {
    let display = slug;
    let best = -1;
    for (const [variant, c] of b.variants.entries()) {
      if (c > best || (c === best && variant.length < display.length)) {
        best = c;
        display = variant;
      }
    }
    return { name: display, slug, count: b.count };
  });

  // Most common types first (parents tend to browse this way).
  return entries.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function resolveTypeSlug(slug: string): string | null {
  const match = getAllTypes().find((t) => t.slug === slug);
  return match?.name ?? null;
}

export function schoolsInType(typeName: string): School[] {
  const schools = getAllSchools();
  return schools.filter((s) => String(s.type ?? "") === typeName);
}

export function schoolsInTypeSlug(slug: string): School[] {
  const schools = getAllSchools();
  return schools.filter((s) => slugify(String(s.type ?? "")) === slug);
}
