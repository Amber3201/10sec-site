// All editable site copy for services, packages and FAQs lives here.

export const site = {
  name: '10sec',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://10sec.example',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'X', href: 'https://x.com' },
  ],
};

export type ServiceKey = 'web' | 'social' | 'search';

export type Package = { id: string; tier: string; name: string; desc: string; features: string[]; hot?: boolean };

export const services: Record<ServiceKey, { name: string; href: string; packages: Package[] }> = {
  web: {
    name: 'Website Design',
    href: '/website-design',
    packages: [
      { id: 'landing', tier: 'Launch', name: 'Landing page', desc: 'One focused, high-converting page for a product, launch or campaign.', features: ['1 page, fully responsive', 'Copywriting included', 'Lead or contact form', 'Live in about 1–2 weeks'] },
      { id: 'business', tier: 'Most chosen', name: 'Business website', hot: true, desc: 'A complete site that explains, convinces and converts, and that you can update yourself.', features: ['Up to 6 pages', 'CMS for blog and updates', 'SEO foundations and analytics', 'Live in about 3–4 weeks'] },
      { id: 'custom', tier: 'Custom', name: 'Custom build', desc: 'Larger sites, online stores, booking flows or custom features.', features: ['Unlimited pages and templates', 'E-commerce or integrations', 'Advanced performance work', 'Timeline set together'] },
    ],
  },
  social: {
    name: 'Social Media Marketing',
    href: '/social-media',
    packages: [
      { id: 'starter', tier: 'Starter', name: 'Show up', desc: 'A steady, professional presence on one platform.', features: ['1 platform', 'Around 12 posts a month', 'Captions and scheduling', 'Monthly report'] },
      { id: 'grow', tier: 'Most chosen', name: 'Grow', hot: true, desc: 'Regular short-form video and an engaged community.', features: ['2 platforms', 'Posts and Reels every week', 'Community management', 'Monthly strategy call'] },
      { id: 'lead', tier: 'Full service', name: 'Lead', desc: 'Organic content plus paid campaigns, run as one system.', features: ['3 or more platforms', 'Content, video and stories', 'Paid social management', 'Bi-weekly reporting'] },
    ],
  },
  search: {
    name: 'SEO / AEO',
    href: '/seo-aeo',
    packages: [
      { id: 'local', tier: 'Local', name: 'Local SEO', desc: 'For businesses that win customers nearby.', features: ['Google Business Profile', 'Local listings and reviews', 'On-page fixes', 'Monthly report'] },
      { id: 'seo-aeo', tier: 'Most chosen', name: 'SEO + AEO', hot: true, desc: 'Rank in search and get cited in AI answers.', features: ['Technical SEO and schema', 'Optimized articles every month', 'AI visibility tracking', 'Monthly strategy call'] },
      { id: 'authority', tier: 'Authority', name: 'Content + PR', desc: 'For competitive markets that need more authority.', features: ['Everything in SEO + AEO', 'More articles each month', 'Digital PR and link building', 'Bi-weekly reporting'] },
    ],
  },
};

// Options for the contact form: each service shows its own packages
export const formServices: { value: string; label: string; packages: string[] }[] = [
  { value: 'web', label: 'Website Design', packages: services.web.packages.map((p) => p.name) },
  { value: 'social', label: 'Social Media Marketing', packages: services.social.packages.map((p) => (p.tier === 'Most chosen' ? p.name : `${p.tier}: ${p.name}`)) },
  { value: 'search', label: 'SEO / AEO', packages: services.search.packages.map((p) => p.name) },
  { value: 'multiple', label: 'More than one service', packages: [] },
];

export type Faq = { q: string; a: string };

export const faqs: Record<'home' | ServiceKey, Faq[]> = {
  home: [
    { q: 'What does 10sec actually do?', a: 'We design and build websites, run social media and handle SEO and AEO. Pick one service or bundle all three into a single growth plan.' },
    { q: 'What is AEO?', a: 'Answer engine optimization: structuring your site and content so AI assistants like ChatGPT, Perplexity and Google AI Overviews can find, trust and cite your brand in their answers.' },
    { q: 'How is pricing set?', a: 'Every project is quoted after a short call, based on what you need. You get a fixed quote before any work begins, with no surprises later.' },
    { q: 'Can I start with just one service?', a: 'Yes. Most clients start with one, usually a website, and add social or search once the foundations are in place.' },
    { q: 'Do you work with businesses anywhere?', a: 'Yes. We work remotely with brands in any city. Calls, reviews and handover all happen online.' },
  ],
  web: [
    { q: 'Can I edit the website myself?', a: 'Yes. Every site comes with a simple CMS and a recorded walkthrough, so you can update text, images and blog posts without a developer.' },
    { q: 'Which platform will you build on?', a: 'Next.js for maximum speed and flexibility, Webflow or Framer if you want visual editing. We recommend one on the first call based on how you will use the site.' },
    { q: 'Do you handle hosting and domains?', a: 'We set up hosting, domain and email records for you, and can look after the site every month if you want us to.' },
    { q: 'What do you need from me to start?', a: 'Your goals, any brand assets you have and access to your domain. If you do not have copy or photos yet, we can create them.' },
  ],
  social: [
    { q: 'Do I need to be on camera?', a: 'No. Plenty of strong accounts are built on product shots, screen recordings, voiceovers and design-led posts. If you are happy on camera, we will script and guide you.' },
    { q: 'Which platforms should I be on?', a: 'The ones your customers already use. For most businesses that means Instagram plus one of LinkedIn or YouTube Shorts. We decide together in the strategy call.' },
    { q: 'How soon will I see results?', a: 'Engagement usually improves within the first couple of months of consistent posting. Follower and lead growth build steadily after that.' },
    { q: 'Do I approve posts before they go live?', a: 'Always. You approve the monthly calendar up front and can review every post before it is scheduled.' },
  ],
  search: [
    { q: 'How long does SEO take?', a: 'Technical fixes can show results within weeks. Rankings for competitive terms usually take three to six months of steady work, and keep compounding after that.' },
    { q: 'Can you guarantee a #1 ranking?', a: 'No one can honestly guarantee that. We commit to the work that moves rankings, and we report exactly what changed every month.' },
    { q: 'How do you measure AEO?', a: 'Each month we ask a fixed set of real customer questions across major AI assistants and record whether, and how, your brand is mentioned or cited.' },
    { q: 'Do I need a new website first?', a: 'Not always. We start with an audit. If the site is holding you back, we will say so, and our website team can help.' },
  ],
};
