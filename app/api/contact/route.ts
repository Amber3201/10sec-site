import { NextResponse } from 'next/server';
import { formServices } from '@/lib/content';

// Contact form → email via Resend (https://resend.com).
// Needs RESEND_API_KEY and CONTACT_TO_EMAIL in your environment. See README.

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  const str = (k: string, max = 200) => (typeof body[k] === 'string' ? (body[k] as string).trim().slice(0, max) : '');
  const name = str('name'), email = str('email'), company = str('company'), serviceValue = str('service'), pkg = str('package');
  const message = str('message', 5000);

  // Spam trap: real people never fill this hidden field
  if (str('website')) return NextResponse.json({ ok: true });

  const service = formServices.find((s) => s.value === serviceValue);
  if (!name || !email || !service || !message) return NextResponse.json({ error: 'Please fill in your name, email, service and message.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  if (pkg && !service.packages.includes(pkg) && pkg !== 'Not sure yet') return NextResponse.json({ error: 'Please choose a package from the list.' }, { status: 400 });

  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) {
    console.error('[contact] RESEND_API_KEY or CONTACT_TO_EMAIL is not set');
    return NextResponse.json({ error: 'The form is not connected yet. Please email us directly.' }, { status: 500 });
  }

  const rows: [string, string][] = [
    ['Name', name], ['Email', email], ['Company', company || '—'],
    ['Service', service.label], ['Package', pkg || '—'],
  ];
  const html = `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0A0A0A">
<h2 style="margin:0 0 16px">New enquiry from the 10sec website</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows.map(([k, v]) => `<tr><td style="color:#5E5B55">${k}</td><td><strong>${esc(v)}</strong></td></tr>`).join('')}</table>
<p style="color:#5E5B55;margin:20px 0 6px">Message</p>
<p style="white-space:pre-wrap;margin:0">${esc(message)}</p>
</div>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n') + `\n\nMessage:\n${message}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || '10sec website <onboarding@resend.dev>',
      to: to.split(',').map((s) => s.trim()),
      reply_to: email,
      subject: `New enquiry: ${service.label}${pkg ? ` (${pkg})` : ''} from ${name}`,
      html,
      text,
    }),
  });

  if (!res.ok) {
    console.error('[contact] Resend error', res.status, await res.text());
    return NextResponse.json({ error: 'Something went wrong sending your message. Please try again.' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
