# AGENTS.md

This repo is the Astro site for `adityasasidhar.github.io`. The working directory `/home/arctic/projects/website/` only contains this project (no monorepo siblings here), but the actual npm/git project lives one level down in `the-deep-field/`. Run every command below from there.

## Stack

- Astro 7, TypeScript (`astro/tsconfigs/strict` + `strictNullChecks`)
- Content collections via `glob` loader, MDX via `@astrojs/mdx`
- Pagefind for client-side search (build-time index)
- `@astrojs/rss` + `@astrojs/sitemap` (sitemap auto-generated, depends on `site` URL)
- `sharp` for image processing
- Node engine pinned to `>=22.12.0` (CI uses 22)

## Commands

Run from `the-deep-field/`:

- `npm run dev` — Astro dev server
- `npm run build` — `astro build && pagefind --site dist`. Pagefind generates `dist/pagefind/` from the built HTML; do not skip it or search will be empty in production.
- `npm run preview` — serve the built `dist/` locally
- `npm run astro -- <args>` — passthrough for any `astro` CLI command

There are no test, lint, or format scripts defined. If you need a type check, use `npx astro check` (not in `package.json` scripts) — note that CI does not run it, so TS errors will ship to prod unless you run it locally. No ESLint / Prettier config exists; do not invent one.

## Layout

- `astro.config.mjs` — single source for integrations (`mdx()`, `sitemap()`) and `site` URL. **Changing `site` will change every canonical, RSS, and sitemap URL**, so it is the GitHub Pages deploy domain, not localhost.
- `tsconfig.json` — extends `astro/tsconfigs/strict`, plus an extra `strictNullChecks: true`.
- `src/consts.ts` — `SITE_TITLE`, `SITE_DESCRIPTION`, `AUTHOR_NAME`, and all social URLs. Update here, not in pages.
- `src/content.config.ts` — defines the `blog` collection. Frontmatter is schema-validated (see Adding content below).
- `src/content/blog/` — markdown/MDX posts only. Images referenced from frontmatter `heroImage` live in `src/assets/`.
- `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, `src/assets/`, `src/public/` — standard Astro layout. `pages/` includes `index`, `portfolio`, `projects`, `research`, `search`, `404`, `rss.xml.js`, and `blog/[...slug].astro` + `blog/index.astro`.
- `public/` — static assets served as-is (favicons, fonts).
- `.astro/` — generated Astro types; gitignored, do not edit.
- `dist/` — build output; gitignored. Created by `npm run build`.

## Adding content (blog)

Drop a `src/content/blog/<slug>.md` or `.mdx` file. Required frontmatter, validated by Zod in `src/content.config.ts`:

```
title: string
description: string
pubDate: ISO date string (z.coerce.date())
updatedDate: optional ISO date string
heroImage: optional, relative path to an image under src/assets/
```

If the file is invalid against the schema, the build fails at `getCollection('blog')` calls. Pages that use the collection: `src/pages/index.astro` (latest 4) and `src/pages/blog/`.

## Deploy

GitHub Actions workflow at `.github/workflows/deploy.yml`. Triggers: push to `main` or manual dispatch. Builds with Node 22, then uploads `./dist` to GitHub Pages. The remote is `https://github.com/adityasasidhar/adityasasidhar.github.io.git`. Do not run a separate deploy from the agent — push to `main` and let CI handle it.

## Conventions

- `.astro`/`.ts`/`.mjs` files use **tabs** for indentation (Astro default). Match it; do not reformat to spaces.
- No README, CHANGELOG, or contributing doc exists; do not create one unless asked.
- No `.env` file is required to build — if you add one, do not commit it (`.gitignore` already excludes `.env` / `.env.production`).
- The `.claude/settings.local.json` at the workspace root is the user's Claude Code permission allowlist for this workspace; leave it alone.

## Gotchas

- **Pagefind has no index in dev.** `astro dev` does not generate `dist/pagefind/`, so `/search` renders its built-in "search after build" notice. Use `npm run build && npm run preview` to test search locally.
- **`site` is hardcoded to the Pages domain.** Canonicals, RSS, and sitemap URLs resolve against `https://adityasasidhar.github.io` even when running `astro dev`/`preview` on `localhost`. Don't read those URLs and assume they reflect the local server.
</content>
</invoke>