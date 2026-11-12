'use client';

import { useEffect, useState } from 'react';
import { formServices } from '@/lib/content';

// Contact form: picking a service shows that service's packages. Sends to /api/contact, which emails you.
export function ContactSection({ kicker, title, sub, service = 'web' }: { kicker: string; title: string; sub: string; service?: string }) {
  const [svc, setSvc] = useState(service);
  const [pkg, setPkg] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState('');
  const current = formServices.find((s) => s.value === svc)!;

  // "Choose …" buttons on package cards preselect the service and package
  useEffect(() => {
    const on = (e: Event) => { const d = (e as CustomEvent<{ service: string; pkg: string }>).detail; setSvc(d.service); setPkg(d.pkg); };
    window.addEventListener('pick-package', on);
    return () => window.removeEventListener('pick-package', on);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState('sending'); setErr('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(fd)) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
      setState('sent');
    } catch (e2) {
      setErr((e2 as Error).message); setState('error');
    }
  }

  return (
    <section className="cta" id="contact">
      <div className="wrap cta-in">
        <div>
          <p className="kicker label">{kicker}</p>
          <h2 className="h2"><span className="pxw" data-rv="1">{title}</span></h2>
          <p className="cta-sub">{sub}</p>
        </div>
        <div className="formbox">
          {state === 'sent' ? (
            <p className="sent" role="status">Got it. That took less than 10 seconds. We&apos;ll reply within one business day.</p>
          ) : (
            <form className="fgrid" onSubmit={submit}>
              <div className="fld"><label className="label" htmlFor="f-name">Name</label><input id="f-name" name="name" type="text" autoComplete="name" required /></div>
              <div className="fld"><label className="label" htmlFor="f-email">Email</label><input id="f-email" name="email" type="email" autoComplete="email" required /></div>
              <div className="fld"><label className="label" htmlFor="f-co">Company <span style={{ textTransform: 'none' }}>(optional)</span></label><input id="f-co" name="company" type="text" autoComplete="organization" /></div>
              <div className="frow">
                <div className="fld"><label className="label" htmlFor="f-svc">Service</label>
                  <select id="f-svc" name="service" value={svc} onChange={(e) => { setSvc(e.target.value); setPkg(''); }}>
                    {formServices.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                {current.packages.length > 0 && (
                  <div className="fld"><label className="label" htmlFor="f-pkg">Package</label>
                    <select id="f-pkg" name="package" value={pkg} onChange={(e) => setPkg(e.target.value)}>
                      <option value="">Not sure yet</option>
                      {current.packages.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="fld"><label className="label" htmlFor="f-msg">Your idea</label><textarea id="f-msg" name="message" required placeholder="What are you working on, and what should it achieve? A few sentences is plenty." /></div>
              <div className="hp" aria-hidden="true"><label htmlFor="f-web">Website</label><input id="f-web" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
              {state === 'error' && <p className="ferr" role="alert">{err}</p>}
              <button type="submit" className="btn btn-y btn-lg" disabled={state === 'sending'}><span>{state === 'sending' ? 'Sending…' : 'Send it →'}</span></button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Package card button: preselects service + package in the form, then scrolls to it
export function ChoosePackage({ service, pkg, label, className }: { service: string; pkg: string; label: string; className: string }) {
  return (
    <a href="#contact" className={className} onClick={() => window.dispatchEvent(new CustomEvent('pick-package', { detail: { service, pkg } }))}>
      <span>{label}</span>
    </a>
  );
}
