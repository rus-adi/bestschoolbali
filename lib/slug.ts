export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .trim()
    .replace(/\s*\/\s*/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/(^-|-$)/g, "");
}
