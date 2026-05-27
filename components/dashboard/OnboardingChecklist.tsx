'use client';

import { CheckCircle2, Circle, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'stargate_onboarding_dismissed';

const STEPS = [
  { id: 'invoice', label: 'Create your first invoice', href: '/dashboard/invoices/new' },
  { id: 'wallet', label: 'Connect a wallet', href: '/dashboard/wallets' },
  { id: 'webhook', label: 'Set up a webhook', href: '/dashboard/webhooks' },
  { id: 'payment_link', label: 'Share a payment link', href: '/dashboard/payment-links' },
  { id: 'team', label: 'Invite a team member', href: '/dashboard/team' },
] as const;

type StepId = (typeof STEPS)[number]['id'];

const COMPLETED_KEY = 'stargate_onboarding_completed';

export function OnboardingChecklist() {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [completed, setCompleted] = useState<Set<StepId>>(new Set());

  useEffect(() => {
    setDismissed(localStorage.getItem(STORAGE_KEY) === '1');
    try {
      const saved = JSON.parse(localStorage.getItem(COMPLETED_KEY) ?? '[]') as StepId[];
      setCompleted(new Set(saved));
    } catch {
      // ignore
    }
  }, []);

  if (dismissed) return null;

  const completedCount = completed.size;
  const total = STEPS.length;
  const allDone = completedCount === total;

  function toggle(id: StepId) {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(COMPLETED_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  }

  return (
    <div className="rounded-md border border-violet/30 bg-violet/5 p-4">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-ink">
            {allDone ? '🎉 You\'re all set!' : 'Get started with Stargate'}
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {allDone
              ? 'You\'ve completed all setup steps.'
              : `${completedCount} of ${total} steps completed`}
          </p>
        </div>
        <button
          onClick={dismiss}
          aria-label="Dismiss onboarding checklist"
          className="mt-0.5 rounded p-1 text-slate-400 transition hover:bg-slate-200 hover:text-ink"
        >
          <X size={16} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-violet transition-all duration-300"
          style={{ width: `${(completedCount / total) * 100}%` }}
        />
      </div>

      <ul className="space-y-2">
        {STEPS.map((step) => {
          const done = completed.has(step.id);
          return (
            <li key={step.id} className="flex items-center gap-3">
              <button
                onClick={() => toggle(step.id)}
                aria-label={done ? `Mark "${step.label}" as incomplete` : `Mark "${step.label}" as complete`}
                className="shrink-0 text-slate-400 transition hover:text-violet"
              >
                {done ? (
                  <CheckCircle2 size={18} className="text-violet" />
                ) : (
                  <Circle size={18} />
                )}
              </button>
              <Link
                href={step.href as any}
                className={`text-sm transition hover:text-violet ${done ? 'text-slate-400 line-through' : 'text-ink'}`}
              >
                {step.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
