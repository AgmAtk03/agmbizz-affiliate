/** Canonical path helpers. Always trailing-slash for static export. */
export const paths = {
  home: '/',
  about: '/about/',
  contact: '/contact/',
  privacy: '/privacy/',
  disclosure: '/affiliate-disclosure/',
  guides: '/guides/',
  pillar: (slug: string) => `/guides/${slug}/`,
  article: (pillarSlug: string, articleSlug: string) =>
    `/guides/${pillarSlug}/${articleSlug}/`,
} as const;

export type Crumb = {
  name: string;
  href: string;
};

export function homeCrumb(): Crumb {
  return { name: 'Home', href: paths.home };
}

export function guidesCrumb(): Crumb {
  return { name: 'Guides', href: paths.guides };
}
