import type { School } from "./schools";

function isNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

export function isSponsored(s: School): boolean {
  return Boolean(s.sponsorship?.sponsored);
}

export function featuredRank(s: School): number {
  const r = s.sponsorship?.featured_rank;
  return isNumber(r) ? r : 9999;
}

export function isVerified(s: School): boolean {
  return s.verification?.status === "verified";
}

/**
 * Marketplace-friendly ordering:
 * - Sponsored first (ranked by featured_rank)
 * - Verified next
 * - Then alphabetical
 */
export function sortSchoolsForMarketplace(schools: School[]): School[] {
  return schools
    .slice()
    .sort((a, b) => {
      const as = isSponsored(a);
      const bs = isSponsored(b);
      if (as !== bs) return as ? -1 : 1;

      const ar = featuredRank(a);
      const br = featuredRank(b);
      if (ar !== br) return ar - br;

      const av = isVerified(a);
      const bv = isVerified(b);
      if (av !== bv) return av ? -1 : 1;

      return a.name.localeCompare(b.name);
    });
}

export function getSponsoredSchools(schools: School[]): School[] {
  return sortSchoolsForMarketplace(schools.filter((s) => isSponsored(s)));
}
