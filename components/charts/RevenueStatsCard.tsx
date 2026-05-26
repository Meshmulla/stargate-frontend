'use client';

import { ReactNode } from 'react';

interface RevenueStatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
}

export function RevenueStatsCard({ label, value, change, icon }: RevenueStatsCardProps) {
  const isPositive = change === undefined || change >= 0;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600 mb-1">{label}</p>
          <p className="text-2xl font-semibold text-ink">{value}</p>
          {change !== undefined && (
            <p className={`text-xs mt-2 font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(change).toFixed(1)}% vs last period
            </p>
          )}
        </div>
        {icon && <div className="text-3xl">{icon}</div>}
      </div>
    </div>
  );
}
