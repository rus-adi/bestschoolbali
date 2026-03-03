# QA report

Generated: 2026-02-22 04:38

## Dataset checks
- Schools in database: **72**
- Blog posts in /posts: **2**

### Required fields
- Missing required fields (id/name/area): **0**
- Missing map_query: **0**
- Missing fees.display: **0**
- Fees not IDR-formatted: **0**

### Content
- Schools missing profile_md: **0**
- Shortest profile word count: **800**
- Average profile word count: **906**

## Build notes
- App Router Next.js project with static export enabled in `next.config.js` (`output: 'export'`).
- On your machine/CI: run `npm install` then `npm run build`.
- Remote thumbnails (website/maps/google preview) load as normal `<img>` tags; the site remains static.
