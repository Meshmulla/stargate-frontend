import type { Metadata } from 'next';
import { InvoicesPageClient } from './_client';

export const metadata: Metadata = {
  title: 'Invoices – Stargate',
  description: 'Create and manage USDC invoices for your customers.',
};

export default function InvoicesPage() {
  return <InvoicesPageClient />;
}
