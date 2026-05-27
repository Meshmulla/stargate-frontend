export default function DevelopersPage() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://your-domain.com';

  const oneLineSnippet = `<!-- One-line install: auto-mounts a Pay Now button after the script tag -->
<script
  src="${appUrl}/dist/stargate-widget.js"
  data-invoice-id="inv_xxx"
></script>`;

  const programmaticSnippet = `<!-- Programmatic usage: mount into any element -->
<div id="pay-btn"></div>
<script src="${appUrl}/dist/stargate-widget.js"></script>
<script>
  StargateWidget.mount(document.getElementById('pay-btn'), {
    invoiceId: 'inv_xxx',
    label: 'Pay Now',          // optional
    origin: '${appUrl}',  // optional, defaults to same origin
  });
</script>`;

  const verify = `const expected = 'sha256=' + crypto
  .createHmac('sha256', secret)
  .update(JSON.stringify(payload))
  .digest('hex');
crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-ink">Developers</h1>

      <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="mb-1 text-lg font-semibold">One-line install</h2>
            <p className="mb-3 text-sm text-slate-500">
              Drop a single <code className="rounded bg-slate-100 px-1">&lt;script&gt;</code> tag anywhere on your page.
              A styled <strong>Pay Now</strong> button is injected automatically — no iframe, no extra markup.
            </p>
            <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{oneLineSnippet}</pre>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-4">
            <h2 className="mb-1 text-lg font-semibold">Programmatic usage</h2>
            <p className="mb-3 text-sm text-slate-500">
              Call <code className="rounded bg-slate-100 px-1">StargateWidget.mount(el, opts)</code> to control placement yourself.
            </p>
            <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{programmaticSnippet}</pre>
          </div>
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold">Button preview</h2>
          <div className="rounded-md border border-slate-200 bg-surface p-4">
            <a
              href="#"
              style={{ pointerEvents: 'none' }}
              className="inline-flex items-center gap-2 rounded-md bg-violet px-5 py-2.5 text-sm font-semibold text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <line x1="1" y1="10" x2="23" y2="10" />
              </svg>
              Pay Now
            </a>
            <p className="mt-3 text-xs text-slate-400">No iframe · pure DOM injection · ~2 KB</p>
          </div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Webhook signature verification</h2>
        <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{verify}</pre>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-lg font-semibold">Build prompt kit</h2>
        <p className="text-sm text-slate-600">
          Copy-paste prompts for rebuilding the Stargate product from scratch are in{' '}
          <code>docs/stargate-product-build-prompts.md</code>.
        </p>
      </section>
    </div>
  );
}
