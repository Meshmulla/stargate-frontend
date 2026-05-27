'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useInvoices } from '@/hooks/useInvoices';

type Action = {
  id: string;
  label: string;
  description: string;
  href: string;
  category: 'page' | 'invoice' | 'payment-link';
};

const PAGES: Action[] = [
  { id: 'dashboard', label: 'Dashboard', description: 'Overview and stats', href: '/dashboard', category: 'page' },
  { id: 'revenue', label: 'Revenue', description: 'Revenue analytics', href: '/dashboard/revenue', category: 'page' },
  { id: 'transactions', label: 'Transactions', description: 'View all transactions', href: '/dashboard/transactions', category: 'page' },
  { id: 'payment-links', label: 'Payment Links', description: 'Manage payment links', href: '/dashboard/payment-links', category: 'page' },
  { id: 'invoices', label: 'Invoices', description: 'Manage invoices', href: '/dashboard/invoices', category: 'page' },
  { id: 'wallets', label: 'Wallets', description: 'Settlement balances and wallets', href: '/dashboard/wallets', category: 'page' },
  { id: 'webhooks', label: 'Webhooks', description: 'Manage webhook endpoints', href: '/dashboard/webhooks', category: 'page' },
  { id: 'team', label: 'Team', description: 'Manage team members', href: '/dashboard/team', category: 'page' },
  { id: 'settings', label: 'Settings', description: 'Merchant settings', href: '/dashboard/settings', category: 'page' },
  { id: 'developers', label: 'Developers', description: 'API keys and docs', href: '/dashboard/developers', category: 'page' },
];

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useInvoices('?limit=20');
  const invoices = data?.items ?? [];

  const recentInvoices: Action[] = useMemo(
    () =>
      invoices.slice(0, 5).map((inv: any) => ({
        id: `inv-${inv.id}`,
        label: inv.description || `Invoice #${inv.id?.slice(0, 8)}`,
        description: `${inv.gross_usdc ?? '0'} USDC · ${inv.status ?? 'pending'}`,
        href: `/dashboard/invoices/${inv.id}`,
        category: 'invoice' as const,
      })),
    [invoices],
  );

  const allActions = useMemo(() => [...PAGES, ...recentInvoices], [recentInvoices]);

  const filtered = useMemo(
    () =>
      query.trim() === ''
        ? allActions
        : allActions.filter(
            (a) =>
              a.label.toLowerCase().includes(query.toLowerCase()) ||
              a.description.toLowerCase().includes(query.toLowerCase()),
          ),
    [allActions, query],
  );

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  function navigate(action: Action) {
    setOpen(false);
    router.push(action.href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      navigate(filtered[selectedIndex]);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center border-b border-slate-200 px-4">
          <svg className="mr-2 h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            ref={inputRef}
            className="h-12 w-full bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
            placeholder="Search pages, invoices, payment links..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <kbd className="hidden shrink-0 rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5 text-xs text-slate-500 sm:inline-block">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="p-4 text-center text-sm text-slate-500">No results found.</p>
          )}
          {filtered.map((action, index) => (
            <button
              key={action.id}
              className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${
                index === selectedIndex ? 'bg-violet/10 text-ink' : 'text-slate-700 hover:bg-slate-100'
              }`}
              onClick={() => navigate(action)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-[10px] font-semibold uppercase ${
                  action.category === 'page'
                    ? 'bg-blue-100 text-blue-700'
                    : action.category === 'invoice'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-green-100 text-green-700'
                }`}
              >
                {action.category === 'page' ? 'P' : action.category === 'invoice' ? 'I' : 'L'}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-medium">{action.label}</div>
                <div className="text-xs text-slate-500 truncate">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-slate-200 px-4 py-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1">
            <kbd className="rounded border border-slate-300 bg-slate-50 px-1 py-0.5 text-[10px]">↑↓</kbd> Navigate
          </span>
          <span className="ml-3 inline-flex items-center gap-1">
            <kbd className="rounded border border-slate-300 bg-slate-50 px-1 py-0.5 text-[10px]">↵</kbd> Open
          </span>
          <span className="ml-3 inline-flex items-center gap-1">
            <kbd className="rounded border border-slate-300 bg-slate-50 px-1 py-0.5 text-[10px]">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
