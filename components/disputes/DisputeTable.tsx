'use client';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Dispute } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface DisputeTableProps {
  disputes: Dispute[];
}

const reasonLabels: Record<string, string> = {
  fraudulent: 'Fraudulent',
  duplicate: 'Duplicate Payment',
  product_not_received: 'Product Not Received',
  product_unacceptable: 'Product Unacceptable',
  other: 'Other',
};

export function DisputeTable({ disputes }: DisputeTableProps) {
  if (disputes.length === 0) {
    return (
      <Card className="py-12 text-center">
        <p className="text-slate-500">No disputes found</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Reason</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {disputes.map((dispute) => (
              <tr key={dispute.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <Link href={`/dashboard/disputes/${dispute.id}`} className="font-mono text-sm text-violet hover:underline">
                    {dispute.id.slice(0, 8)}...
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-ink">${parseFloat(dispute.amount_usdc).toFixed(2)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-700">{reasonLabels[dispute.reason] || dispute.reason}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge status={dispute.status} />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-700">{dispute.customer_email || 'N/A'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{formatDistanceToNow(new Date(dispute.created_at), { addSuffix: true })}</span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/dashboard/disputes/${dispute.id}`} className="inline-flex items-center gap-1 text-sm text-violet hover:underline">
                    View <ExternalLink size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
