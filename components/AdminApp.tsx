'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import { ditherImageData } from '@/lib/dither';
import { CATEGORY_LABEL, formatDate, type Category, type Post } from '@/lib/posts';
import { PixelLogo } from './chrome';

let client: SupabaseClient | null = null;
function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  if (!client) client = createClient(url, key);
  return client;
}

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 80);

type Draft = Omit<Post, 'id' | 'created_at'> & { id?: string };
const emptyDraft = (): Draft => ({
  slug: '', title: '', excerpt: '', body: '', category: 'web', cover_url: null, status: 'draft',
  seo_title: '', meta_description: '', published_at: new Date().toISOString(),
});

// Load a picked file into an <img>
const loadImage = (file: File) => new Promise<HTMLImageElement>((res, rej) => {
  const img = new Image();
  img.onload = () => res(img);
  img.onerror = rej;
  img.src = URL.createObjectURL(file);
});

// Brand dither: render at low resolution, dither, then scale up with hard pixel edges
function ditheredBlob(img: HTMLImageElement, outW = 1200, outH = 675, cell = 3): Promise<Blob> {
  const cols = Math.round(outW / cell), rows = Math.round(outH / cell);
  const small = document.createElement('canvas'); small.width = cols; small.height = rows;
  const sx = small.getContext('2d')!;
  const s = Math.max(cols / img.width, rows / img.height);
  sx.drawImage(img, (cols - img.width * s) / 2, (rows - img.height * s) / 2, img.width * s, img.height * s);
  sx.putImageData(ditherImageData(sx.getImageData(0, 0, cols, rows)), 0, 0);
  const big = document.createElement('canvas'); big.width = outW; big.height = outH;
  const bx = big.getContext('2d')!;
  bx.imageSmoothingEnabled = false;
  bx.drawImage(small, 0, 0, outW, outH);
  return new Promise((res) => big.toBlob((b) => res(b!), 'image/png'));
}

// Original photo, resized for the web
function resizedBlob(img: HTMLImageElement, max = 1600): Promise<Blob> {
  const s = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas'); c.width = Math.round(img.width * s); c.height = Math.round(img.height * s);
  c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob((b) => res(b!), 'image/jpeg', 0.86));
}

async function upload(blob: Blob, ext: string) {
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const { error } = await sb()!.storage.from('covers').upload(path, blob, { contentType: blob.type, upsert: false });
  if (error) throw error;
  return sb()!.storage.from('covers').getPublicUrl(path).data.publicUrl;
}

export function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [toast, setToast] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    const c = sb();
    if (!c) { setReady(true); return; }
    c.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = c.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data, error } = await sb()!.from('posts').select('*').order('created_at', { ascending: false });
    if (error) setErr(error.message); else setPosts(data as Post[]);
  }, []);
  useEffect(() => { if (session) load(); }, [session, load]);

  if (!ready) return <div className="site app-loading" />;

  if (!sb()) {
    return (
      <div className="site login-wrap">
        <div className="login">
          <PixelLogo className="login-logo" />
          <h1 className="app-h1">Connect Supabase first</h1>
          <p className="app-sub">Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment, run supabase/schema.sql, then reload. The README walks through it.</p>
          <Link href="/" className="btn btn-o btn-lg"><span>Back to site</span></Link>
        </div>
      </div>
    );
  }

  if (!session) return <Login />;

  return (
    <div className="site">
      <header className="app-bar">
        <div className="app-bar-in">
          <Link href="/" className="brand" aria-label="10sec home"><PixelLogo /></Link>
          <span className="label app-tag">Blog admin</span>
          <div className="app-actions">
            <Link href="/blog" className="btn btn-o" target="_blank"><span>View blog</span></Link>
            <button type="button" className="btn btn-o" onClick={() => sb()!.auth.signOut()}><span>Sign out</span></button>
          </div>
        </div>
      </header>
      {draft ? (
        <Editor
          initial={draft}
          onCancel={() => setDraft(null)}
          onSaved={(msg) => { setDraft(null); setToast(msg); load(); }}
        />
      ) : (
        <main className="app-main">
          <div className="app-head">
            <div><h1 className="app-h1">Posts</h1><p className="app-sub">{posts.filter((p) => p.status === 'published').length} published · {posts.filter((p) => p.status === 'draft').length} draft</p></div>
            <button type="button" className="btn btn-y btn-lg" onClick={() => { setToast(''); setDraft(emptyDraft()); }}><span>+ New post</span></button>
          </div>
          {toast && <p className="toast" role="status">{toast}</p>}
          {err && <p className="ferr" role="alert">{err}</p>}
          {posts.length === 0 ? <p className="app-sub">No posts yet. Write your first one.</p> : (
            <>
              <div className="tr th label" aria-hidden="true"><span>Title</span><span className="hs">Category</span><span className="hs">Date</span><span className="hs">Status</span><span /></div>
              <ul className="rows">
                {posts.map((p) => (
                  <Row key={p.id} post={p} onEdit={() => { setToast(''); setDraft({ ...p }); }} onDeleted={() => { setToast('Post deleted.'); load(); }} />
                ))}
              </ul>
            </>
          )}
        </main>
      )}
    </div>
  );
}

function Row({ post, onEdit, onDeleted }: { post: Post; onEdit: () => void; onDeleted: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <li className="tr">
      <span className="t-title">{post.title || 'Untitled'}</span>
      <span className="hs">{CATEGORY_LABEL[post.category]}</span>
      <span className="hs">{post.status === 'published' ? formatDate(post.published_at) : '—'}</span>
      <span className="hs"><span className={post.status === 'published' ? 'st pub' : 'st draft'}>{post.status}</span></span>
      <span className="row-act">
        {confirm ? (
          <>
            <button type="button" className="lnk danger" onClick={async () => { await sb()!.from('posts').delete().eq('id', post.id); onDeleted(); }}>Delete</button>
            <button type="button" className="lnk" onClick={() => setConfirm(false)}>Keep</button>
          </>
        ) : (
          <>
            <button type="button" className="lnk" onClick={onEdit}>Edit</button>
            <button type="button" className="lnk muted" onClick={() => setConfirm(true)} aria-label={`Delete ${post.title}`}>Delete</button>
          </>
        )}
      </span>
    </li>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr('');
    const { error } = await sb()!.auth.signInWithPassword({ email, password });
    if (error) setErr('That email and password did not match.');
    setBusy(false);
  }
  return (
    <div className="site login-wrap">
      <form className="login" onSubmit={submit}>
        <PixelLogo className="login-logo" />
        <h1 className="app-h1">Sign in to the blog</h1>
        <p className="app-sub">Write, edit and publish posts for 10sec.</p>
        <div className="fld"><label className="label" htmlFor="a-email">Email</label><input id="a-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="fld"><label className="label" htmlFor="a-pass">Password</label><input id="a-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        {err && <p className="ferr" role="alert">{err}</p>}
        <button type="submit" className="btn btn-y btn-lg" disabled={busy}><span>{busy ? 'Signing in…' : 'Sign in →'}</span></button>
      </form>
    </div>
  );
}

function Editor({ initial, onCancel, onSaved }: { initial: Draft; onCancel: () => void; onSaved: (msg: string) => void }) {
  const [d, setD] = useState<Draft>(initial);
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [dither, setDither] = useState(true);
  const [busy, setBusy] = useState('');
  const [err, setErr] = useState('');
  const fileRef = useRef<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial.cover_url);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const set = (patch: Partial<Draft>) => setD((p) => ({ ...p, ...patch }));

  // Live preview of the cover in the chosen style
  const renderPreview = useCallback(async (file: File, on: boolean) => {
    const img = await loadImage(file);
    const blob = on ? await ditheredBlob(img) : await resizedBlob(img);
    setPreview(URL.createObjectURL(blob));
  }, []);

  async function pickCover(file: File | undefined) {
    if (!file) return;
    fileRef.current = file;
    await renderPreview(file, dither);
  }

  // Toolbar: wraps the selection in markdown
  function wrap(before: string, after = '', placeholder = 'text') {
    const ta = bodyRef.current; if (!ta) return;
    const { selectionStart: a, selectionEnd: b, value } = ta;
    const sel = value.slice(a, b) || placeholder;
    const next = value.slice(0, a) + before + sel + after + value.slice(b);
    set({ body: next });
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(a + before.length, a + before.length + sel.length); });
  }

  async function insertImage(file: File | undefined) {
    if (!file) return;
    try {
      setBusy('Uploading image…');
      const url = await upload(await resizedBlob(await loadImage(file)), 'jpg');
      const ta = bodyRef.current, at = ta ? ta.selectionStart : d.body.length;
      set({ body: d.body.slice(0, at) + `\n\n![${file.name.replace(/\.[^.]+$/, '')}](${url})\n\n` + d.body.slice(at) });
    } catch (e) { setErr((e as Error).message); } finally { setBusy(''); }
  }

  async function save(status: 'draft' | 'published') {
    setErr('');
    if (!d.title.trim()) { setErr('Add a title first.'); return; }
    const slug = slugify(d.slug || d.title);
    if (!slug) { setErr('Add a URL slug.'); return; }
    try {
      setBusy(status === 'published' ? 'Publishing…' : 'Saving…');
      let cover_url = d.cover_url;
      if (fileRef.current) {
        const img = await loadImage(fileRef.current);
        cover_url = dither ? await upload(await ditheredBlob(img), 'png') : await upload(await resizedBlob(img), 'jpg');
      }
      const row = {
        slug, title: d.title.trim(), excerpt: d.excerpt.trim(), body: d.body, category: d.category, cover_url, status,
        seo_title: d.seo_title || null, meta_description: d.meta_description || null,
        published_at: status === 'published' ? (d.published_at || new Date().toISOString()) : d.published_at,
      };
      const q = d.id ? sb()!.from('posts').update(row).eq('id', d.id) : sb()!.from('posts').insert(row);
      const { error } = await q;
      if (error) throw new Error(error.code === '23505' ? 'Another post already uses that URL slug.' : error.message);
      onSaved(status === 'published' ? 'Post published. It appears on the blog within a minute.' : 'Draft saved.');
    } catch (e) { setErr((e as Error).message); } finally { setBusy(''); }
  }

  const dateValue = d.published_at ? d.published_at.slice(0, 10) : '';

  return (
    <main className="app-main ed">
      <div className="ed-main">
        <div><button type="button" className="lnk" onClick={onCancel}>← All posts</button></div>
        <label className="sr" htmlFor="e-title">Post title</label>
        <input id="e-title" className="ed-title" type="text" placeholder="Post title" value={d.title}
          onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })} />

        <div className="drop">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {preview ? <img src={preview} alt="Cover preview" className="cover-img" /> : (
            <div className="drop-empty"><p className="drop-h">Add a cover image</p><p className="app-sub">JPG or PNG. It can be converted to the 10sec dither style automatically.</p></div>
          )}
          <label className="btn btn-y drop-btn"><span>{preview ? 'Replace image' : 'Upload image'}</span><input type="file" accept="image/*" className="file" onChange={(e) => pickCover(e.target.files?.[0])} /></label>
        </div>
        <label className="tog"><input type="checkbox" checked={dither} onChange={(e) => { setDither(e.target.checked); if (fileRef.current) renderPreview(fileRef.current, e.target.checked); }} />Convert new cover to brand dither (yellow on black)</label>

        <div className="fld"><label className="label" htmlFor="e-ex">Excerpt</label><textarea id="e-ex" value={d.excerpt} onChange={(e) => set({ excerpt: e.target.value })} placeholder="One or two sentences shown on the blog page." /></div>
        <div className="fld"><label className="label" htmlFor="e-body">Body (Markdown)</label>
          <div className="tools" role="toolbar" aria-label="Formatting">
            <button type="button" className="tool" aria-label="Bold" onClick={() => wrap('**', '**')}>B</button>
            <button type="button" className="tool" aria-label="Italic" onClick={() => wrap('_', '_')}>I</button>
            <button type="button" className="tool" aria-label="Heading" onClick={() => wrap('\n## ', '\n', 'Heading')}>H2</button>
            <button type="button" className="tool" aria-label="Bulleted list" onClick={() => wrap('\n- ', '', 'List item')}>• List</button>
            <button type="button" className="tool" aria-label="Quote" onClick={() => wrap('\n> ', '\n', 'Quote')}>Quote</button>
            <button type="button" className="tool" aria-label="Link" onClick={() => wrap('[', '](https://)', 'link text')}>Link</button>
            <label className="tool tool-file">Image<input type="file" accept="image/*" className="file" onChange={(e) => insertImage(e.target.files?.[0])} /></label>
          </div>
          <textarea id="e-body" ref={bodyRef} className="ed-body" value={d.body} onChange={(e) => set({ body: e.target.value })} placeholder="Start writing…" />
        </div>
      </div>

      <aside className="side-card" aria-label="Publish settings">
        <p className="label side-k" style={{ margin: 0 }}>Publish</p>
        <p className="app-sub">Status: <strong>{d.status === 'published' ? 'Published' : 'Draft'}</strong></p>
        <div className="fld"><label className="label" htmlFor="e-cat">Category</label>
          <select id="e-cat" value={d.category} onChange={(e) => set({ category: e.target.value as Category })}>
            {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
          </select></div>
        <div className="fld"><label className="label" htmlFor="e-date">Publish date</label><input id="e-date" type="date" value={dateValue} onChange={(e) => set({ published_at: e.target.value ? new Date(e.target.value + 'T09:00:00').toISOString() : null })} /></div>
        <div className="fld"><label className="label" htmlFor="e-slug">URL slug</label><input id="e-slug" type="text" value={d.slug} placeholder="what-is-aeo" onChange={(e) => { setSlugTouched(true); set({ slug: e.target.value }); }} /></div>
        <p className="label side-k">Search preview</p>
        <div className="fld"><label className="label" htmlFor="e-seo">SEO title <span className="count">{(d.seo_title || '').length}/60</span></label><input id="e-seo" type="text" value={d.seo_title || ''} onChange={(e) => set({ seo_title: e.target.value })} placeholder="Defaults to the post title" /></div>
        <div className="fld"><label className="label" htmlFor="e-meta">Meta description <span className="count">{(d.meta_description || '').length}/155</span></label><textarea id="e-meta" value={d.meta_description || ''} onChange={(e) => set({ meta_description: e.target.value })} placeholder="Defaults to the excerpt. Write it like an answer." /></div>
        {err && <p className="ferr" role="alert">{err}</p>}
        {busy && <p className="app-sub" role="status">{busy}</p>}
        <button type="button" className="btn btn-y btn-lg" disabled={!!busy} onClick={() => save('published')}><span>{d.status === 'published' ? 'Update post' : 'Publish'}</span></button>
        <button type="button" className="btn btn-o btn-lg" disabled={!!busy} onClick={() => save('draft')}><span>{d.status === 'published' ? 'Unpublish (save as draft)' : 'Save draft'}</span></button>
      </aside>
    </main>
  );
}
