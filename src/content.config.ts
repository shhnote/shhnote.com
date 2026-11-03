import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// One Markdown file per page per locale: `src/content/<locale>/<slug>.md` → `/<locale>/<slug>/`.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    intro: z.string().optional(),
    // Full-width container for pages built from layout blocks rather than prose.
    wide: z.boolean().default(false),
    // The Simple / Detailed switch shared by `how-it-works` and `security`.
    depth: z.enum(['simple', 'detailed']).optional(),
    updated: z.string().optional(),
  }),
});

export const collections = { pages };
