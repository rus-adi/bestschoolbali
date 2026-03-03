import { getAllPosts, type PostMeta } from "./posts";
import { slugify } from "./slug";

export type GuideTopic = {
  slug: string;
  name: string;
  description: string;
  /** Keywords to match against category/tags/title. */
  match: string[];
};

export const GUIDE_TOPICS: GuideTopic[] = [
  {
    slug: "getting-started",
    name: "Getting started",
    description: "Shortlists, tour checklists, and the fastest way to narrow options without missing anything important.",
    match: ["getting started", "choose", "shortlist", "tour", "questions"],
  },
  {
    slug: "fees-and-budgets",
    name: "Fees and budgets",
    description: "How fees work, what’s included, and how to estimate total first-year cost before you commit.",
    match: ["fees", "budget", "cost", "pricing"],
  },
  {
    slug: "admissions",
    name: "Admissions",
    description: "Timelines, documents, trial days, and what to ask so you get clear answers early.",
    match: ["admissions", "documents", "timeline", "trial", "enrollment"],
  },
  {
    slug: "curriculum",
    name: "Curriculum",
    description: "IB, British, Cambridge, American, Montessori — what families mean when they say “the right fit”.",
    match: ["ib", "british", "cambridge", "american", "montessori", "curriculum"],
  },
  {
    slug: "areas-and-lifestyle",
    name: "Areas and lifestyle",
    description: "Commute realities, family neighbourhoods, and how location changes your school shortlist.",
    match: ["canggu", "ubud", "sanur", "bukit", "area", "commute", "lifestyle"],
  },
  {
    slug: "relocation",
    name: "Relocation",
    description: "Practical considerations for families moving to Bali — scheduling, settling in, and school transitions.",
    match: ["relocation", "moving", "visa", "settling", "transition", "new to bali"],
  },
];

function postMatchesTopic(post: PostMeta, topic: GuideTopic) {
  const haystack = [post.title, post.category ?? "", ...(post.tags ?? [])].join(" ").toLowerCase();
  return topic.match.some((m) => haystack.includes(m.toLowerCase()));
}

export function getGuideTopicsWithCounts() {
  const posts = getAllPosts();
  return GUIDE_TOPICS.map((t) => ({
    ...t,
    count: posts.filter((p) => postMatchesTopic(p, t)).length,
  })).filter((t) => t.count > 0);
}

export function getPostsForTopic(topicSlug: string): PostMeta[] {
  const topic = GUIDE_TOPICS.find((t) => t.slug === slugify(topicSlug));
  if (!topic) return [];
  const posts = getAllPosts();
  return posts.filter((p) => postMatchesTopic(p, topic));
}
