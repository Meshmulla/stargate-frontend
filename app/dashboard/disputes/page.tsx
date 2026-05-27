'use client';

import { DisputeFilters } from '@/components/disputes/DisputeFilters';
import { DisputeTable } from '@/components/disputes/DisputeTable';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDisputes } from '@/hooks/useDisputes';
import { DisputeStatus } from '@/types';
import { AlertCircle, Download } from 'lucide-react';
import { useState } from 'react';

export default function DisputesPage() {
  const [selectedStatus, setSelectedStatus] = useState<DisputeStatus | 'all'>('all');
  
  const query = selectedStatus !== 'all' ? `?status=${selectedStatus}` : '';
  const { data, isLoading, error } = useDisputes(query);
  
  const disputes = data?.items ?? [];
  const total = data?.total ?? 0;

  const handleExport = () => {
    // Export disputes to CSV
    const csv = [
      ['ID', 'Amount', 'Reason', 'Status', 'Customer Email', 'Created At'].join(','),
      ...disputes.map(d => [
        d.id,
        d.amount_usdc,
        d.reason,
        d.status,
        d.customer_email || 'N/A',
        d.created_at
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `disputes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink">Disputes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage and respond to payment disputes
          </p>
        </div>
        <Button onClick={handleExport} className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">
          <Download size={16} />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Disputes</p>
              <p className="mt-1 text-2xl font-bold text-ink">{total}</p>
            </div>
            <AlertCircle className="text-slate-400" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Open</p>
              <p className="mt-1 text-2xl font-bold text-red-600">
                {disputes.filter(d => d.status === 'open').length}
              </p>
            </div>
            <AlertCircle className="text-red-400" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Under Review</p>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {disputes.filter(d => d.status === 'under_review').length}
              </p>
            </div>
            <AlertCircle className="text-amber-400" size={32} />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Resolved</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {disputes.filter(d => d.status === 'resolved' || d.status === 'won').length}
              </p>
            </div>
            <AlertCircle className="text-emerald-400" size={32} />
          </div>
        </Card>
      </div>

      <DisputeFilters
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {isLoading ? (
        <Card className="py-12 text-center">
          <p className="text-slate-500">Loading disputes...</p>
        </Card>
      ) : error ? (
        <Card className="py-12 text-center">
          <p className="text-red-600">Failed to load disputes. Please try again.</p>
        </Card>
      ) : (
        <DisputeTable disputes={disputes} />
      )}
    </div>
  );
}
