import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { paths } from './paths';

export type PillarEntry = CollectionEntry<'pillars'>;
export type ArticleEntry = CollectionEntry<'articles'>;

export function isLive<T extends { data: { draft?: boolean } }>(entry: T): boolean {
  if (import.meta.env.DEV) return true;
  return entry.data.draft !== true;
}

export async function getPublishedPillars(): Promise<PillarEntry[]> {
  const pillars = await getCollection('pillars', isLive);
  return pillars.sort(
    (a, b) => a.data.publishDate.getTime() - b.data.publishDate.getTime(),
  );
}

export async function getPublishedArticles(): Promise<ArticleEntry[]> {
  const articles = await getCollection('articles', isLive);
  return articles.sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
  );
}

export async function getArticlesForPillar(pillarSlug: string): Promise<ArticleEntry[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.data.pillar === pillarSlug);
}

export async function getPillarBySlug(slug: string): Promise<PillarEntry | undefined> {
  const pillars = await getPublishedPillars();
  return pillars.find((pillar) => pillar.data.slug === slug);
}

export async function getArticleBySlugs(
  pillarSlug: string,
  articleSlug: string,
): Promise<ArticleEntry | undefined> {
  const articles = await getPublishedArticles();
  return articles.find(
    (article) =>
      article.data.slug === articleSlug && article.data.pillar === pillarSlug,
  );
}

export async function getRelatedArticles(
  article: ArticleEntry,
  limit = 3,
): Promise<ArticleEntry[]> {
  const siblings = await getArticlesForPillar(article.data.pillar);
  return siblings.filter((entry) => entry.id !== article.id).slice(0, limit);
}

export function pillarHref(pillar: PillarEntry | string): string {
  const slug = typeof pillar === 'string' ? pillar : pillar.data.slug;
  return paths.pillar(slug);
}

export function articleHref(article: ArticleEntry): string {
  return paths.article(article.data.pillar, article.data.slug);
}

export async function getPillarForArticle(
  article: ArticleEntry,
): Promise<PillarEntry | undefined> {
  return getPillarBySlug(article.data.pillar);
}

/** Resolve a pillar entry used as a collection reference, or throw a build-time error. */
export async function requirePillar(slug: string): Promise<PillarEntry> {
  const pillar = await getPillarBySlug(slug);
  if (!pillar) {
    throw new Error(`Unknown pillar slug "${slug}". Add it under src/content/pillars/.`);
  }
  return pillar;
}

export { getEntry };
