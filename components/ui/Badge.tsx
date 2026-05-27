const styles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-emerald-100 text-emerald-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  success: 'bg-emerald-100 text-emerald-800',
  processing: 'bg-amber-100 text-amber-800',
  failed: 'bg-coral text-white',
  declined: 'bg-coral text-white',
  refunded: 'bg-violet text-white',
  expired: 'bg-slate-200 text-slate-700',
  cancelled: 'bg-red-100 text-red-800',
  sandbox: 'bg-ocean/10 text-ocean',
  live: 'bg-emerald-100 text-emerald-800',
  active: 'bg-emerald-100 text-emerald-800',
  suspended: 'bg-red-100 text-red-800',
};

export function Badge({ status }: { status: string }) {
  return <span className={`rounded px-2 py-1 text-xs font-medium capitalize ${styles[status] ?? styles.expired}`}>{status}</span>;
}
