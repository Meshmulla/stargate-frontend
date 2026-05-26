'use client';

interface TopPaymentLink {
  id: string;
  description?: string;
  total_amount: number;
  payment_count: number;
  conversion_rate: number;
}

interface TopPaymentLinksProps {
  links: TopPaymentLink[];
  currency?: string;
}

export function TopPaymentLinks({ links, currency = '$' }: TopPaymentLinksProps) {
  const maxAmount = Math.max(...links.map((l) => l.total_amount), 1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-ink mb-4">Top Payment Links</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {links.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No payment links yet</p>
        ) : (
          links.map((link, idx) => {
            const widthPercent = (link.total_amount / maxAmount) * 100;
            return (
              <div key={link.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 w-6 h-6 rounded flex items-center justify-center">
                        #{idx + 1}
                      </span>
                      <p className="text-sm font-medium text-slate-900 truncate">{link.description || `Link ${link.id.slice(0, 8)}`}</p>
                    </div>
                    <p className="text-xs text-slate-500">
                      {link.payment_count} payment{link.payment_count !== 1 ? 's' : ''} • {link.conversion_rate.toFixed(1)}% conversion
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {currency}
                      {link.total_amount.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
