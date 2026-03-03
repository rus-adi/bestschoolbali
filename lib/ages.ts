import { getAllSchools, type School } from "./schools";

export type AgeBand = {
  name: string;
  slug: string;
  /** Inclusive lower bound */
  min: number;
  /** Inclusive upper bound */
  max: number;
  description: string;
};

/**
 * Age bands are intentionally broad to avoid thin "micro pages".
 * These ranges are used only as a browsing shortcut.
 */
export const AGE_BANDS: AgeBand[] = [
  {
    name: "Early years",
    slug: "early-years",
    min: 2,
    max: 6,
    description: "Preschool and kindergarten age range. Great for families prioritizing play-based learning and gentle transitions.",
  },
  {
    name: "Primary",
    slug: "primary",
    min: 5,
    max: 12,
    description: "Primary / elementary years. Useful if you need a consistent curriculum pathway and strong foundations in literacy and numeracy.",
  },
  {
    name: "Secondary",
    slug: "secondary",
    min: 11,
    max: 18,
    description: "Middle + high school years. Best for families thinking ahead about exams, university pathways, and subject depth.",
  },
];

function overlaps(aMin: number | null | undefined, aMax: number | null | undefined, bMin: number, bMax: number) {
  if (typeof aMin !== "number" || typeof aMax !== "number") return false;
  return aMin <= bMax && aMax >= bMin;
}

export function getAllAgeBands(): Array<AgeBand & { count: number }> {
  const schools = getAllSchools();
  return AGE_BANDS.map((b) => ({
    ...b,
    count: schools.filter((s) => overlaps(s.age_min, s.age_max, b.min, b.max)).length,
  }));
}

export function resolveAgeBandSlug(slug: string): AgeBand | null {
  return AGE_BANDS.find((b) => b.slug === slug) ?? null;
}

export function schoolsInAgeBand(band: AgeBand): School[] {
  const schools = getAllSchools();
  return schools
    .filter((s) => overlaps(s.age_min, s.age_max, band.min, band.max))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function schoolsInAgeBandSlug(slug: string): School[] {
  const band = resolveAgeBandSlug(slug);
  return band ? schoolsInAgeBand(band) : [];
}
