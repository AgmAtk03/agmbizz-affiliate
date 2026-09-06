import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const heroSchema = z.object({
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
});

const faqSchema = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  }),
);

const pillars = defineCollection({
  loader: glob({ base: './src/content/pillars', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    publishDate: z.coerce.date(),
    draft: z.boolean().optional().default(false),
    kicker: z.string().optional(),
    hero: heroSchema.optional(),
    faq: faqSchema.optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    slug: z.string(),
    publishDate: z.coerce.date(),
    pillar: z.string(),
    draft: z.boolean().optional().default(false),
    commercial: z.boolean().optional().default(false),
    updatedDate: z.coerce.date().optional(),
    hero: heroSchema.optional(),
    faq: faqSchema.optional(),
  }),
});

export const collections = { pillars, articles };
