'use client';

import { AlertCircle, BarChart3, CreditCard, FileText, KeyRound, LogOut, Search, Settings, ShieldCheck, Users, Wallet, Webhook } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { Input } from '@/components/ui/Input';
import { useSession } from '@/lib/session';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard/revenue', label: 'Revenue', icon: BarChart3 },
  { href: '/dashboard/transactions', label: 'Transactions', icon: CreditCard },
  { href: '/dashboard/payment-links', label: 'Payment Links', icon: FileText },
  { href: '/dashboard/invoices', label: 'Invoices', icon: FileText },
  { href: '/dashboard/disputes', label: 'Disputes', icon: AlertCircle },
  { href: '/dashboard/wallets', label: 'Wallets', icon: Wallet },
  { href: '/dashboard/webhooks', label: 'Webhooks', icon: Webhook },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  { href: '/dashboard/developers', label: 'Developers', icon: KeyRound },
] as const;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = useSession();
  return (
    <div className="grid min-h-screen grid-cols-[260px_1fr] bg-surface">
      <CommandPalette />
      <aside className="flex min-h-screen flex-col border-r border-slate-200 bg-white p-4">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-lg font-semibold text-ink">Stargate</div>
          <Badge status="sandbox" />
        </div>
        <nav className="space-y-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href as any} className="flex h-10 items-center gap-3 rounded-md border-l-2 border-transparent px-3 text-sm text-slate-700 transition hover:border-violet hover:bg-violet/10 hover:text-ink">
              <item.icon size={18} /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-ink">
            <ShieldCheck size={16} className="text-mint" />
            {session.merchant?.name ?? 'Merchant'}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>{session.merchant?.tier ?? 'standard'} plan</span>
            <span className="font-medium text-violet">Upgrade</span>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-2.5 text-slate-400" size={16} />
            <Input className="w-full pl-9" placeholder="Search invoices, payments, webhooks" />
          </div>
          <Button className="h-9 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={() => { session.logout(); router.push('/login'); }}>
            <LogOut size={16} /> Logout
          </Button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
