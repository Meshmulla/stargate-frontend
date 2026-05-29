import type { Metadata } from 'next';
import { PayPageClient } from './_client';

export const metadata: Metadata = {
  title: 'Pay – Stargate',
  description: 'Complete your USDC payment on the Stellar network.',
};

export default function PayPage({ params }: { params: { id: string } }) {
  return <PayPageClient id={params.id} />;
}
