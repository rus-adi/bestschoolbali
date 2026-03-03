import fs from "fs";
import path from "path";

export type FeeStatus = "estimate" | "listed";

export type Fees = {
  display: string;
  currency?: "IDR";
  unit?: "year" | "month";
  min?: number;
  max?: number;
  status?: FeeStatus;
};

export type School = {
  id: string;
  name: string;
  area: string;
  areas?: string[];
  type?: string;

  website?: string;
  map_query?: string;

  curriculum_tags?: string[];
  age_min?: number | null;
  age_max?: number | null;

  fees?: Fees;
  budget_category?: string;

  summary?: string;
  highlights?: string[];

  /** Long-form narrative profile in Markdown */
  profile_md?: string;

  details?: {
    curriculum?: string;
    address?: string;
    phone?: string;
    email?: string;
  };

  /** Short, anonymized notes collected from families (optional). */
  parent_perspectives?: Array<{
    quote: string;
    label: string;
    is_example?: boolean;
  }>;

  /** Optional verification/paid placement fields (for future monetization). */
  verification?: {
    status: "unverified" | "verified";
    last_verified?: string;
  };
  sponsorship?: {
    sponsored?: boolean;
    featured_rank?: number;
  };
};

type SchoolsFile = {
  site?: {
    name?: string;
    domain?: string;
    generated?: string;
    notes?: string;
    author?: string;
  };
  schools: School[];
};

const SCHOOLS_PATH = path.join(process.cwd(), "data", "schools.json");

export function getAllSchools(): School[] {
  const raw = fs.readFileSync(SCHOOLS_PATH, "utf8");
  const parsed = JSON.parse(raw) as SchoolsFile;
  const schools = Array.isArray(parsed) ? (parsed as unknown as School[]) : (parsed.schools ?? []);
  return schools.slice().sort((a, b) => a.name.localeCompare(b.name));
}

export function getSchoolBySlug(slug: string): School | null {
  const all = getAllSchools();
  return all.find((s) => s.id === slug) ?? null;
}

export function getFeaturedSchool(): School | null {
  // Keep this stable for marketing; change the ID whenever you want a new featured school.
  return getSchoolBySlug("green-school-bali") ?? (getAllSchools()[0] ?? null);
}
