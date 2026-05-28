'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RefundModal } from '@/components/invoices/RefundModal';
import { api } from '@/lib/api';

export function InvoiceDetail({ invoice, onCancel, onRefund }: { invoice: any; onCancel(): void; onRefund?(): void }) {
  const [refundOpen, setRefundOpen] = useState(false);
  const [refundStatus, setRefundStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const handleRefund = async () => {
    try {
      setRefundStatus('pending');
      await api.invoices.refund(invoice.id);
      setRefundStatus('success');
      onRefund?.();
    } catch (err) {
      setRefundStatus('error');
      throw err;
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold text-ink">Invoice {invoice.id}</h1>
        <Badge status={invoice.status} />
        {refundStatus === 'success' && <p className="text-sm text-green-600">Refund initiated successfully</p>}
        {refundStatus === 'error' && <p className="text-sm text-red-600">Refund failed</p>}
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-500">Amount</dt><dd>{invoice.amount_usdc} USDC</dd></div>
          <div><dt className="text-slate-500">Buyer pays</dt><dd>{invoice.gross_usdc} USDC</dd></div>
          <div><dt className="text-slate-500">Muxed address</dt><dd className="break-all font-mono text-xs">{invoice.muxed_address}</dd></div>
          <div><dt className="text-slate-500">Expires</dt><dd>{new Date(invoice.expires_at).toLocaleString()}</dd></div>
        </dl>
        <div className="flex gap-2">
          {invoice.status === 'pending' && <Button onClick={onCancel}>Cancel invoice</Button>}
          {invoice.status === 'paid' && <Button onClick={() => setRefundOpen(true)}>Refund</Button>}
        </div>
      </section>
      <aside className="rounded-md border border-slate-200 bg-white p-4">
        <QRCodeSVG value={invoice.payment_url} size={240} className="mx-auto max-w-full" />
        <Button className="mt-4 w-full" onClick={() => navigator.clipboard.writeText(invoice.payment_url)}>Copy payment URL</Button>
      </aside>
      <RefundModal
        open={refundOpen}
        onClose={() => setRefundOpen(false)}
        invoiceId={invoice.id}
        amount={invoice.amount_usdc}
        onConfirm={handleRefund}
      />
    </div>
  );
}
