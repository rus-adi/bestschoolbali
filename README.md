# Best School Bali (Next.js)

Configured for static export (`output: 'export'`) so you can deploy without a server.

## Run locally
```bash
npm i
npm run dev
```

## Build static site
```bash
npm run build
```
Output will be in `out/`.

## Blog
Add markdown files in `/posts` with required frontmatter:
- `title`
- `date` (YYYY-MM-DD)
- `excerpt`

## Schools data
Single source of truth: `/data/schools.json`

Each school includes:
- `fees` (IDR per year; many are estimates — confirm with the school)
- `budget_category`
- `profile_md` (long-form narrative profile in Markdown)

## QA
See `/data/qa_report.md` for a quick dataset sanity-check summary.

Additional QA:
- `npm run qa:content` generates `/data/qa_duplicates.md` (repeated-paragraph report for school profiles).
