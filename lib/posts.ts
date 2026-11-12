import { createClient } from '@supabase/supabase-js';
import { samplePosts } from './samplePosts';

export type Category = 'web' | 'social' | 'search';
export const CATEGORY_LABEL: Record<Category, string> = { web: 'Website Design', social: 'Social Media', search: 'SEO / AEO' };

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string; // markdown
  category: Category;
  cover_url: string | null;
  status: 'draft' | 'published';
  seo_title: string | null;
  meta_description: string | null;
  published_at: string | null;
  created_at?: string;
};

export const supabaseConfigured = () => !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

function publicClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
}

// Published posts, newest first. Falls back to sample posts until Supabase is connected.
export async function getPublishedPosts(): Promise<Post[]> {
  if (!supabaseConfigured()) return samplePosts;
  const { data, error } = await publicClient()
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });
  if (error) { console.error('[posts] list failed', error.message); return []; }
  return (data || []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabaseConfigured()) return samplePosts.find((p) => p.slug === slug) || null;
  const { data, error } = await publicClient().from('posts').select('*').eq('slug', slug).eq('status', 'published').maybeSingle();
  if (error) { console.error('[posts] get failed', error.message); return null; }
  return data as Post | null;
}

export function readTime(body: string) {
  const words = body.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 220))} min read`;
}

export function formatDate(iso: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
