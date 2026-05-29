import type { Metadata } from 'next';
import { DashboardPageClient } from './_client';

export const metadata: Metadata = {
  title: 'Dashboard – Stargate',
  description: 'Overview of your Stargate merchant account: revenue, recent invoices, and onboarding status.',
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
