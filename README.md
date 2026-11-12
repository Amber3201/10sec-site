# 10sec — website

Next.js site for 10sec: home, three service pages, blog with a team admin, and a contact form that emails you.

## What's inside

| Page | Path |
|---|---|
| Home | `/` |
| Website Design | `/website-design` |
| Social Media Marketing | `/social-media` |
| SEO + AEO | `/seo-aeo` |
| Blog / article | `/blog`, `/blog/[slug]` |
| Blog admin (sign-in + editor) | `/admin` |
| Contact form endpoint | `/api/contact` |

- All copy for services, packages and FAQs is in `lib/content.ts`.
- The pixel / dither effects are in `lib/dither.ts` and `components/effects.tsx`. They only redraw when you scroll and respect "reduce motion".
- SEO is built in: page titles and descriptions, Organization / FAQ / BlogPosting schema, `sitemap.xml` and `robots.txt`.

## 1. Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev                  # http://localhost:3000
```

The site works without any keys: the blog shows 6 sample posts and the form tells visitors it isn't connected yet.

## 2. Contact form → your inbox (Resend, free tier)

1. Create an account at resend.com and make an API key.
2. In `.env.local` set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` (the address that should receive enquiries).
3. With the default sender (`onboarding@resend.dev`), Resend only delivers to the email address you signed up with, so sign up with the inbox you want enquiries in. To send from your own domain, verify it in Resend → Domains and change `CONTACT_FROM_EMAIL`.

Each email includes name, email, company, service, package and message. Hitting **Reply** answers the visitor directly.

## 3. Blog with sign-in and image uploads (Supabase, free tier)

1. Create a project at supabase.com.
2. Open **SQL Editor**, paste `supabase/schema.sql`, run it. This creates the `posts` table, security rules and a public `covers` image bucket.
3. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up".
4. **Authentication → Users → Add user**: create your login (email + password). Add one per team member.
5. **Project Settings → API**: copy the URL and the `anon` public key into `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
6. Go to `/admin`, sign in, and write your first post. Covers can be auto-converted to the yellow-on-black dither style. The **Image** button in the toolbar uploads pictures inside the article.

Once Supabase is connected, the sample posts disappear and the blog shows only your published posts. New posts appear within a minute.

## 4. Deploy (Vercel, free)

1. Push this folder to a GitHub repository.
2. Import it at vercel.com → New Project.
3. Add the same environment variables in **Settings → Environment Variables**.
4. Deploy, then add your domain in **Settings → Domains** and update `NEXT_PUBLIC_SITE_URL`.
