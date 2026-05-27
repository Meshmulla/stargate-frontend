'use client';

import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export function InvoiceDetail({ invoice, onCancel }: { invoice: any; onCancel(): void }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-ink">Invoice {invoice.id}</h1>
        <Badge status={invoice.status} />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Amount</dt><dd>{invoice.amount_usdc} USDC</dd></div>
          <div><dt className="text-slate-500">Buyer pays</dt><dd>{invoice.gross_usdc} USDC</dd></div>
          <div><dt className="text-slate-500">Muxed address</dt><dd className="break-all font-mono text-xs">{invoice.muxed_address}</dd></div>
          <div><dt className="text-slate-500">Expires</dt><dd>{new Date(invoice.expires_at).toLocaleString()}</dd></div>
        </dl>
        {invoice.status === 'pending' && <Button onClick={onCancel}>Cancel invoice</Button>}
      </section>
      <aside className="rounded-md border border-slate-200 bg-white p-4">
        <QRCodeSVG value={invoice.payment_url} size={240} className="mx-auto max-w-full" />
        <Button className="mt-4 w-full" onClick={() => navigator.clipboard.writeText(invoice.payment_url)}>Copy payment URL</Button>
      </aside>
    </div>
  );
}
