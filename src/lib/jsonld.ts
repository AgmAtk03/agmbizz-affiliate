import { absoluteUrl, site } from './site';
import type { Crumb } from './paths';
import type { ArticleEntry, PillarEntry } from './collections';

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    alternateName: site.publication,
    url: absoluteUrl('/'),
    description: site.description,
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: `${site.name} · ${site.niche}`,
    url: absoluteUrl('/'),
    description: site.description,
    publisher: {
      '@type': 'Organization',
      name: site.name,
    },
  };
}

export function articleJsonLd(article: ArticleEntry, pillar: PillarEntry) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.data.title,
    description: article.data.description,
    datePublished: article.data.publishDate.toISOString(),
    dateModified: (article.data.updatedDate ?? article.data.publishDate).toISOString(),
    mainEntityOfPage: absoluteUrl(
      `/guides/${pillar.data.slug}/${article.data.slug}/`,
    ),
    author: {
      '@type': 'Organization',
      name: site.publication,
    },
    publisher: {
      '@type': 'Organization',
      name: site.name,
    },
    about: site.niche,
    isPartOf: {
      '@type': 'CreativeWork',
      name: pillar.data.title,
      url: absoluteUrl(`/guides/${pillar.data.slug}/`),
    },
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
