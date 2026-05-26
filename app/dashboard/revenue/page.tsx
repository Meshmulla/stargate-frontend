'use client';

import { useEffect, useState } from 'react';
import { BarChart } from '@/components/charts/BarChart';
import { ConversionFunnel } from '@/components/charts/ConversionFunnel';
import { TopPaymentLinks } from '@/components/charts/TopPaymentLinks';
import { RevenueStatsCard } from '@/components/charts/RevenueStatsCard';
import { api } from '@/lib/api';

type Period = 'daily' | 'weekly' | 'monthly';

interface RevenueData {
  date: string;
  amount: number;
}

export default function RevenuePage() {
  const [period, setPeriod] = useState<Period>('daily');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [topLinks, setTopLinks] = useState<any[]>([]);
  const [funnel, setFunnel] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [period]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [revenueRes, linksRes, funnelRes, statsRes] = await Promise.all([
        api.analytics.revenueByPeriod(period),
        api.analytics.topPaymentLinks(5),
        api.analytics.conversionFunnel(),
        api.analytics.summaryStats(),
      ]);

      setRevenueData(revenueRes);
      setTopLinks(linksRes);
      setFunnel(funnelRes);
      setStats(statsRes);
    } catch (err) {
      console.error('Failed to load analytics:', err);
      setError('Failed to load analytics data');
      // Set mock data for demo purposes
      setMockData();
    } finally {
      setIsLoading(false);
    }
  };

  const setMockData = () => {
    // Mock revenue data
    const today = new Date();
    const mockRevenue: RevenueData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      mockRevenue.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        amount: Math.random() * 5000 + 2000,
      });
    }
    setRevenueData(mockRevenue);

    // Mock top links
    setTopLinks([
      { id: '1', description: 'Basic Plan', total_amount: 15000, payment_count: 30, conversion_rate: 12.5 },
      { id: '2', description: 'Pro Plan', total_amount: 24000, payment_count: 24, conversion_rate: 9.6 },
      { id: '3', description: 'Enterprise', total_amount: 18000, payment_count: 6, conversion_rate: 2.4 },
      { id: '4', description: 'One-time Purchase', total_amount: 8500, payment_count: 17, conversion_rate: 6.8 },
      { id: '5', description: 'Donation', total_amount: 2300, payment_count: 23, conversion_rate: 9.2 },
    ]);

    // Mock funnel
    setFunnel({
      stages: [
        { name: 'Page Views', count: 2500, percentage: 100 },
        { name: 'Started Checkout', count: 850, percentage: 34 },
        { name: 'Wallet Connected', count: 420, percentage: 16.8 },
        { name: 'Payment Completed', count: 250, percentage: 10 },
      ],
    });

    // Mock stats
    setStats({
      total_revenue: 68000,
      total_revenue_change: 12.5,
      total_transactions: 100,
      total_transactions_change: 8.3,
      avg_order_value: 680,
      avg_order_value_change: 3.5,
      conversion_rate: 10,
      conversion_rate_change: -2.1,
    });
  };

  const chartData =
    revenueData.length > 0
      ? revenueData.map((item) => ({
          label: item.date,
          value: Math.round(item.amount),
          percentage: Math.round((item.amount / Math.max(...revenueData.map((d) => d.amount))) * 100),
        }))
      : [];

  const funnelData =
    funnel?.stages.map((stage: any) => ({
      name: stage.name,
      count: stage.count,
      percentage: stage.percentage,
    })) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Revenue Analytics</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'daily' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'weekly' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'monthly' ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-700">{error} (showing demo data)</p>
        </div>
      )}

      {isLoading && revenueData.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-slate-500">Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats && (
              <>
                <RevenueStatsCard
                  label="Total Revenue"
                  value={`$${(stats.total_revenue || 0).toLocaleString()}`}
                  change={stats.total_revenue_change}
                  icon="💰"
                />
                <RevenueStatsCard
                  label="Total Transactions"
                  value={stats.total_transactions || 0}
                  change={stats.total_transactions_change}
                  icon="🔄"
                />
                <RevenueStatsCard
                  label="Avg. Order Value"
                  value={`$${(stats.avg_order_value || 0).toLocaleString()}`}
                  change={stats.avg_order_value_change}
                  icon="📊"
                />
                <RevenueStatsCard
                  label="Conversion Rate"
                  value={`${stats.conversion_rate || 0}%`}
                  change={stats.conversion_rate_change}
                  icon="📈"
                />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {chartData.length > 0 && (
                <BarChart
                  data={chartData}
                  title={`Revenue (${period.charAt(0).toUpperCase() + period.slice(1)})`}
                  currency="$"
                />
              )}
            </div>
            <div>{topLinks.length > 0 && <TopPaymentLinks links={topLinks} currency="$" />}</div>
          </div>

          {funnelData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ConversionFunnel stages={funnelData} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
