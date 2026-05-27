'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { DisputeStatus } from '@/types';
import { Filter } from 'lucide-react';

interface DisputeFiltersProps {
  selectedStatus: DisputeStatus | 'all';
  onStatusChange: (status: DisputeStatus | 'all') => void;
}

const statusOptions: Array<{ value: DisputeStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All Disputes' },
  { value: 'open', label: 'Open' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'closed', label: 'Closed' },
];

export function DisputeFilters({ selectedStatus, onStatusChange }: DisputeFiltersProps) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <Filter size={18} className="text-slate-600" />
        <span className="text-sm font-medium text-slate-700">Filter by status:</span>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onStatusChange(option.value)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                selectedStatus === option.value
                  ? 'bg-violet text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
