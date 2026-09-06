export const site = {
  name: 'AgmBizz',
  publication: 'Dristi Astra',
  niche: 'Your Niche',
  tagline: 'Clear-eyed guides for Your Niche',
  description:
    'AgmBizz is a Dristi Astra editorial site with placeholder Your Niche guides. Swap the content collections when the real niche is chosen — the SEO scaffolding stays.',
  locale: 'en_US',
  language: 'en',
} as const;

export function getSiteUrl(): string {
  const fromEnv = import.meta.env.PUBLIC_SITE_URL as string | undefined;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return 'https://example.com';
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function getFormAction(): string | undefined {
  const action = import.meta.env.PUBLIC_FORM_ACTION as string | undefined;
  return action && action.length > 0 ? action : undefined;
}
