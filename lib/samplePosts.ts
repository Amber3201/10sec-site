import type { Post } from './posts';

// Shown only until Supabase is connected. Once it is, the blog reads from your database.
const p = (o: Partial<Post> & Pick<Post, 'slug' | 'title' | 'excerpt' | 'body' | 'category' | 'published_at'>): Post => ({
  id: o.slug, cover_url: null, status: 'published', seo_title: null, meta_description: null, ...o,
});

export const samplePosts: Post[] = [
  p({
    slug: 'what-is-aeo',
    meta_description: 'What answer engine optimization (AEO) is, how it differs from SEO, and four practical ways to get your brand cited by ChatGPT, Perplexity and AI Overviews.',
    title: 'What is AEO, and why your brand needs it now',
    excerpt: 'AI assistants now answer questions that used to start on Google. Here is how to become one of the sources they cite.',
    category: 'search',
    published_at: '2026-11-10T09:00:00Z',
    body: `More and more people skip the list of links. They open ChatGPT, Perplexity or Google's AI Overviews, ask a question in plain language and read a single written answer. That answer usually names a few businesses or sources. Answer engine optimization, or AEO, is the work of becoming one of them.

## SEO and AEO: same goal, different finish line

SEO competes for a position on a page of results. AEO competes for a mention inside one answer. They reward many of the same things: clear, trustworthy, well-structured content. The difference is emphasis. Answer engines favour content that answers a specific question directly, and brands that are described the same way everywhere they appear.

> SEO gets you on the list. AEO gets you into the answer.

## Four things that make a brand citable

1. **Answer questions directly.** Put a one- or two-sentence answer at the top of the page, then the detail. Assistants look for text they can quote.
2. **Use structured data.** [Schema markup](/blog/schema-markup-basics) tells machines what your business is, what it offers and where it operates, without guesswork.
3. **Be consistent everywhere.** Use the same name, description and list of services on your website, Google Business Profile, directories and social profiles.
4. **Earn mentions.** Reviews, press, partner pages and community posts all signal that real people trust you.

## Where to start this week

- Write down the ten questions customers ask you most often.
- Answer each one on your site, in plain language, near the top of a page.
- Add Organization and FAQ schema to those pages.
- Check that your business details match across every listing.
- Ask a few assistants about your field and note who they recommend today.

[AEO doesn't replace SEO](/seo-aeo). It's the next layer on top of it. The businesses that start now will be the ones assistants already know when everyone else catches up.`,
  }),
  p({
    slug: 'the-10-second-homepage-test',
    meta_description: 'Run the 10-second homepage test: four questions every homepage must answer before a visitor scrolls, and how to fix the headline when it fails.',
    title: 'The 10-second test: audit your homepage over one coffee',
    excerpt: 'Four questions every homepage should answer before a visitor scrolls, and how to check yours today.',
    category: 'web',
    published_at: '2026-11-03T09:00:00Z',
    body: `Open your [homepage](/website-design) on your phone, start a timer and look for ten seconds. Then close it and answer four questions.

## The four questions

1. **What do you do?** If the headline needs a second read, it is too clever.
2. **Who is it for?** Visitors should recognise themselves quickly.
3. **Why should I trust you?** Design quality, [page speed](/blog/core-web-vitals-plain-english), real details and proof all count.
4. **What should I do next?** One clear button beats five competing links.

If you could not answer all four, your visitors cannot either. Start with the headline: rewrite it until a stranger could repeat it back to you.`,
  }),
  p({
    slug: 'hooks-that-work',
    meta_description: 'The first second of a Reel decides your reach. Five opening hooks to test this month, and how to judge them by watch time instead of views.',
    title: 'Hooks that work: designing the first frame of a Reel',
    excerpt: 'Why the first second decides your reach, and five opening patterns worth testing this month.',
    category: 'social',
    published_at: '2026-10-27T09:00:00Z',
    body: `People decide whether to keep watching almost immediately, so the [first frame](/social-media) does most of the work.

## Five openings to test

- **The result first:** show the finished outcome, then how you got there.
- **The bold claim:** one surprising line on screen in large text.
- **The question:** ask the exact thing your audience is wondering.
- **The mistake:** name a common error your viewers are probably making.
- **The movement:** start mid-action, never on a still, empty frame.

Test one pattern at a time for a few weeks (a [simple content calendar](/blog/content-calendar-you-will-keep) helps) and compare how long people watch, not just how many view.`,
  }),
  p({
    slug: 'core-web-vitals-plain-english',
    meta_description: 'Core Web Vitals explained simply: what LCP, INP and CLS measure, why they matter for Google rankings, and the usual fixes for each score.',
    title: 'Core Web Vitals in plain English',
    excerpt: 'What LCP, INP and CLS measure, why they matter for rankings and how to fix the usual suspects.',
    category: 'web',
    published_at: '2026-10-20T09:00:00Z',
    body: `Core Web Vitals are Google's way of measuring how a page feels to use, and part of passing the [10-second homepage test](/blog/the-10-second-homepage-test).

## The three numbers

- **LCP (Largest Contentful Paint):** how fast the main content appears. Usually fixed by compressing large images and loading them early.
- **INP (Interaction to Next Paint):** how quickly the page responds when someone taps or clicks. Usually fixed by doing less JavaScript work.
- **CLS (Cumulative Layout Shift):** how much things jump around while loading. Usually fixed by giving images and embeds a set size.

Check yours for free with [PageSpeed Insights](https://pagespeed.web.dev/), and fix the biggest red item first.`,
  }),
  p({
    slug: 'schema-markup-basics',
    meta_description: 'Schema markup helps Google and AI assistants understand your business. The four structured data types to add first, and how to test them.',
    title: 'Schema markup: the small code that gets you cited',
    excerpt: 'Structured data helps search engines and AI understand your business. These are the types to add first.',
    category: 'search',
    published_at: '2026-10-13T09:00:00Z',
    body: `Schema markup is a small block of code that describes your page in a format machines understand, which is a big part of [AEO](/blog/what-is-aeo).

## Start with these

- **Organization** or **LocalBusiness:** your name, logo, contact details and location.
- **Service:** what you offer and where. (We add all of these as part of [SEO + AEO](/seo-aeo).)
- **FAQPage:** your most common questions and their answers.
- **Article:** for blog posts, with author and date.

Add them, then test each page with Google's [Rich Results Test](https://search.google.com/test/rich-results) before moving on.`,
  }),
  p({
    slug: 'content-calendar-you-will-keep',
    meta_description: 'A simple weekly social media content calendar for small teams: three posts a week, batch-created, so you stay consistent without burning out.',
    title: 'A content calendar you will actually stick to',
    excerpt: 'A simple weekly rhythm for small teams that keeps posting consistent without burning out.',
    category: 'social',
    published_at: '2026-10-06T09:00:00Z',
    body: `Most [social media](/social-media) calendars fail because they are too ambitious. Start with a rhythm you can keep for three months.

## A simple weekly rhythm

- **Monday:** a useful tip or how-to.
- **Wednesday:** behind the scenes or a short video ([hook the first second](/blog/hooks-that-work)).
- **Friday:** proof: a result, a review or a story.

Batch-create one week at a time, schedule everything on the weekend before and spend ten minutes a day replying to comments.`,
  }),
];
