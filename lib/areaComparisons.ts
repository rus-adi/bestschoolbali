import { slugify } from "./slug";

export type AreaPair = {
  a: string;
  b: string;
  slug: string;
};

/**
 * Curated comparisons (intentionally limited to avoid thin/doorway patterns).
 * Add/remove pairs based on what families ask most.
 */
export const AREA_COMPARISONS: AreaPair[] = [
  { a: "Canggu", b: "Ubud", slug: "canggu-vs-ubud" },
  { a: "Canggu", b: "Sanur", slug: "canggu-vs-sanur" },
  { a: "Ubud", b: "Sanur", slug: "ubud-vs-sanur" },
  { a: "Canggu", b: "Bukit Region", slug: "canggu-vs-bukit-region" },
  { a: "Sanur", b: "Bukit Region", slug: "sanur-vs-bukit-region" },
  { a: "Ubud", b: "Bukit Region", slug: "ubud-vs-bukit-region" },
];

export function getAreaComparisonPairs() {
  return AREA_COMPARISONS;
}

export function resolveAreaPairSlug(slug: string): AreaPair | null {
  return AREA_COMPARISONS.find((p) => p.slug === slug) ?? null;
}

export function areaThumbFor(name: string) {
  // Try to re-use your existing area thumbs when possible.
  const s = slugify(name);
  const known = new Set([
    "amed",
    "bukit-region",
    "canggu",
    "canggu-sanur",
    "denpasar",
    "sanur",
    "ubud",
  ]);
  return known.has(s) ? `/img/areas/${s}.webp` : "/img/banners/hero.webp";
}
