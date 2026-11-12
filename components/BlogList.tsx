'use client';

import { useState } from 'react';
import type { Category, Post } from '@/lib/posts';
import { PostCard } from './blocks';

const CATS: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All posts' }, { id: 'web', label: 'Website Design' }, { id: 'social', label: 'Social Media' }, { id: 'search', label: 'SEO / AEO' },
];

export function BlogList({ posts }: { posts: Post[] }) {
  const [cat, setCat] = useState<'all' | Category>('all');
  const list = posts.filter((p) => cat === 'all' || p.category === cat);
  return (
    <>
      <div className="pills" role="group" aria-label="Filter posts by topic">
        {CATS.map((c) => (
          <button key={c.id} type="button" className={c.id === cat ? 'pill on' : 'pill'} aria-pressed={c.id === cat} onClick={() => setCat(c.id)}>{c.label}</button>
        ))}
      </div>
      {list.length === 0 && <p className="lede">No posts in this topic yet.</p>}
      {list[0] && <PostCard post={list[0]} index={0} featured />}
      <div className="posts">{list.slice(1).map((p) => <PostCard key={p.id} post={p} index={posts.indexOf(p)} />)}</div>
    </>
  );
}
