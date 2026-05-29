'use client';

import useSWR from 'swr';
import { InvoiceDetail, InvoiceDetailSkeleton } from '@/components/invoices/InvoiceDetail';
import { api } from '@/lib/api';

export default function InvoicePage({ params }: { params: { id: string } }) {
  const { data, mutate } = useSWR(['invoice', params.id], () => api.invoices.get(params.id));
  if (!data) return <InvoiceDetailSkeleton />;
  return <InvoiceDetail invoice={data} onCancel={async () => { await api.invoices.cancel(params.id); mutate(); }} />;
}
