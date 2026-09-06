# AgmBizz

White-hat SEO affiliate **content infrastructure** for AgmBizz / Dristi Astra.

The niche is **not chosen**. Every guide uses explicit placeholder copy (“Your Niche”, Sample Brand A, Sample Niche Kit) so the team can swap research later without rebuilding the stack.

This is a statically generated Astro site. Google can index real HTML. It is not a client-fetched JavaScript content shell.

## Stack

- **Astro** (`output: 'static'`) + **Content Collections** (Markdown / MDX)
- **Tailwind CSS**
- **`@astrojs/sitemap`** + generated `robots.txt`
- Deployable on **Vercel**, or any host that can serve the `dist/` folder (including raw static / githack-style hosts)

Client JavaScript is limited to the email-capture island. Navigation, disclosure, and sponsored links are plain HTML.

## Local preview

```bash
cp .env.example .env
# optional for local canonicals:
# PUBLIC_SITE_URL=http://127.0.0.1:43147

npm install
npm run dev
```

Dev server: [http://127.0.0.1:43147](http://127.0.0.1:43147)

```bash
npm run build    # static HTML in dist/
npm run preview  # serve the build on the same port
```

`npm run build` must succeed before you treat a change as shippable. Confirm `dist/guides/` contains pillar and article `index.html` files — not an empty app shell.

## Information architecture

| URL | Source |
| --- | --- |
| `/` | Home — pillars + latest articles |
| `/guides/` | Guide index |
| `/guides/{pillar}/` | Pillar page (lists child articles) |
| `/guides/{pillar}/{article}/` | Article page (links up to its pillar) |
| `/about/` `/contact/` `/affiliate-disclosure/` `/privacy/` | Policy / desk pages |

There are **3 placeholder pillars** and **8 published sample articles**, plus one `draft: true` template that is omitted from production routes. That is enough to prove the cluster; keep the same URL scheme when you grow toward 20 posts.

## Content model

Collections are defined in `src/content.config.ts`.

**Pillars** (`src/content/pillars/*.md`)

```yaml
title: string
description: string
slug: string          # becomes /guides/{slug}/
publishDate: date
draft?: boolean
kicker?: string
hero?: { src, alt, width, height }
faq?: [{ question, answer }]
```

**Articles** (`src/content/articles/*.{md,mdx}`)

```yaml
title: string
description: string
slug: string          # becomes /guides/{pillar}/{slug}/
publishDate: date
pillar: string        # must match a pillar slug
draft?: boolean       # omitted from production HTML + sitemap
commercial?: boolean  # stronger disclosure styling
updatedDate?: date
hero?: { src, alt, width, height }
faq?: [{ question, answer }]
```

Internal linking helpers live in `src/lib/paths.ts` and `src/lib/collections.ts`:

- `paths.pillar(slug)` / `paths.article(pillar, slug)`
- `getArticlesForPillar(slug)`
- `getRelatedArticles(article)`
- `articleHref` / `pillarHref`

Every article frontmatter `pillar` must match a live pillar slug or the build throws.

### Add a pillar

1. Create `src/content/pillars/{slug}.md` with the frontmatter above.
2. Point new articles at that slug.
3. Run `npm run build` and open `dist/guides/{slug}/index.html`.

### Add an article

1. Duplicate `src/content/articles/draft-template.md` (or any sibling).
2. Set `draft: false`, unique `slug`, and an existing `pillar`.
3. Link up to the pillar in the body (`[Title](/guides/{pillar}/)`).
4. For commercial outbound links in MDX, import `SponsoredLink` — see `buying-criteria.mdx`.
5. Optional `faq` array emits visible FAQ copy **and** `FAQPage` JSON-LD.

### Swap the niche later

Replace the markdown in `src/content/pillars/` and `src/content/articles/`. Keep the frontmatter keys. Update the display strings in `src/lib/site.ts` (`niche`, `tagline`, `description`). Do not replace the layouts, SEO components, or `SponsoredLink` unless the compliance rules change.

## SEO plumbing

Shipped on every page unless noted:

- Unique `<title>` and meta description from frontmatter (or the static page props)
- Open Graph + Twitter tags
- Canonical URL from `PUBLIC_SITE_URL` + path
- `BreadcrumbList` JSON-LD sitewide
- `Article` JSON-LD on posts
- `FAQPage` JSON-LD when a stub FAQ exists
- One `h1` per page
- `sitemap-index.xml` via `@astrojs/sitemap`
- `robots.txt` that points at that sitemap
- Images use `loading="lazy"` (heroes use `eager`) with `width` and `height` when a `hero` is present

Set the site origin **before** a production build:

```bash
PUBLIC_SITE_URL=https://www.example.com npm run build
```

On Vercel, add `PUBLIC_SITE_URL` for Production and Preview (no trailing slash). Preview can use the `*.vercel.app` URL until a custom domain exists.

## Affiliate compliance

- Persistent, above-the-fold disclosure banner on every page
- Stronger (accent) banner when `commercial: true`
- Dedicated [`/affiliate-disclosure/`](src/pages/affiliate-disclosure.astro)
- `SponsoredLink` always emits `rel="sponsored nofollow noopener"` and `target="_blank"` — there is no `rel` override

Do not add cloakers, JS URL swaps, doorway clones, or invented reviews.

## Email capture

`EmailCapture` is the only client island. It `POST`s to `PUBLIC_FORM_ACTION` when set (Formspree-style). If the env var is empty, the form stays on-page and tells the reader it is a placeholder. The contact page uses the same action, or `mailto:editors@example.com`.

No database ships with this repo.

## Public repo and shareable preview

- Source: [https://github.com/AgmAtk03/agmbizz-affiliate](https://github.com/AgmAtk03/agmbizz-affiliate) (`main`)
- Static preview branch: `live-demo` (built `dist/` + `.nojekyll`, paths rewritten so the tree works off githack)
- Githack home: `https://rawcdn.githack.com/AgmAtk03/agmbizz-affiliate/live-demo/index.html`

`npm run build` is the Vercel/static-host build (absolute `/` paths). `npm run githack` builds and rewrites those paths for the `live-demo` branch.

## Deploy to Vercel

1. Import [AgmAtk03/agmbizz-affiliate](https://github.com/AgmAtk03/agmbizz-affiliate) on [Vercel](https://vercel.com/new). Framework preset: **Astro**. Output directory: `dist`.
2. Add environment variable `PUBLIC_SITE_URL` = `https://your-domain.com` (or the `*.vercel.app` URL for the first preview).
3. Optional: `PUBLIC_FORM_ACTION` = your Formspree (or similar) endpoint.
4. Deploy. Confirm View Source on a guide URL shows the article HTML, not a spinner.

If GitHub is not yet connected on the Dristi Astra Vercel team, use the githack URL above until the import succeeds.

Static export: upload `dist/` to any static host. Directory format (`…/index.html`) is what Astro emits.

## Search Console — day one

Do this after `PUBLIC_SITE_URL` is a real HTTPS origin:

1. Add the property (URL-prefix is fine for a first site).
2. Verify with the HTML file or DNS record Vercel/your DNS host can serve.
3. Submit `https://YOUR-DOMAIN/sitemap-index.xml`.
4. Inspect the home URL, one pillar, and one article. Confirm “Google-selected canonical” matches yours.
5. Request indexing only on those representative URLs — not every stub.
6. Check `robots.txt` (`Allow: /` and the sitemap line).
7. Turn on email for coverage spikes. Do not add Search Console while the copy is still “Your Niche” if you are not ready for those URLs to be the public ones.

## Out of scope

Real niche research, affiliate-network accounts, a CMS, auth, a database, cloaking, doorway spam, and fake reviews.

## License

Internal scaffold for AgmBizz / Dristi Astra.
