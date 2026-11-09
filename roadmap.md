# ElScholarship roadmap

## Current request: finish scholarship sync
- [x] Persist URL scans and preserve all six extracted detail topics.
- [x] Report failed reads and saves; correct progress/stop and prevent overlapping actions.
- [x] Verify authenticated scan, review, and feature flow (real Chevening scan, refresh, feature, and signed-out slug page).
- Full-catalog run remains unverified: it requires a long, credit-consuming scan with the page kept open.

## Earlier platform scope (not part of the current sync request)
- [x] Neumorphic design tokens + utilities (src/styles.css)
- [x] Buttons / inputs / header / scholarship card / auth page
- [ ] Footer, scholarship detail page, dashboard + admin shells

## Requested next (from full-platform spec)
Note: stack is TanStack Start (React + Vite), not Next.js. `head()` route metadata
replaces `generateMetadata`; server functions replace API routes.
- [ ] Storage buckets `scholarship-covers`, `article-covers` + uploads
- [ ] Admin: overview metrics, article CMS tab (markdown editor + cover upload)
- [ ] Admin: scholarship table with search/filter/pagination + slide-over Sheet add/edit form
- [ ] User dashboard: saved scholarships, applications with status badges, document vault
- [ ] RBAC redirect after login (admin -> /admin, user -> /dashboard)
- [ ] Detail page: single "Apply Now" CTA -> modal with Managed / Direct / Guidance options
- [ ] Dynamic OG tags using scholarship image_url
