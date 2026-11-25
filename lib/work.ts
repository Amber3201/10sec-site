import type { Concept } from '@/components/work';

/** Portfolio shown on the homepage and the Website Design page. Client work first. */
export const concepts: Concept[] = [
  { slug: 'hellonails', num: '01', name: 'Hello Nails', niche: 'Nail studio, Bhubaneswar', client: true, href: 'https://hellonails.shop', desc: 'A calm, scroll-choreographed website for a Bhubaneswar nail studio: a hero that folds into a photo collage, a pinned story, the full price menu and one-tap WhatsApp booking. Plus local SEO with schema, a dark mode, and print: loyalty cards, letterhead and envelopes.', tags: ['Website design + build', 'Local SEO + schema', 'Loyalty card + stationery'] },
  { slug: 'northfold', num: '01', name: 'Northfold', niche: 'Digital marketing agency', desc: 'A showreel that unfolds out of the hero, service cards that tilt into place and a statement that lights up as you read it.', tags: ['Scroll-driven motion', 'Editorial type', 'Showreel reveal'] },
  { slug: 'vernier', num: '02', name: 'VERNIER', niche: 'Independent watchmaker', desc: 'A 3D watch that turns into a blueprint as you scroll, comes apart and labels all nine of its parts, then clicks back together.', tags: ['Interactive 3D', 'Blueprint scroll', 'Engineering grid'] },
];
