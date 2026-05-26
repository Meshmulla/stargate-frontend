'use client';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    percentage?: number;
  }>;
  title: string;
  currency?: string;
  maxValue?: number;
}

export function BarChart({ data, title, currency = '$', maxValue }: BarChartProps) {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const chartHeight = 200;
  const barWidth = 100 / data.length;

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-ink mb-4">{title}</h3>
      <div className="overflow-x-auto">
        <div className="flex items-end justify-between gap-2 min-w-max" style={{ height: `${chartHeight + 50}px` }}>
          {data.map((item, idx) => {
            const heightPercent = (item.value / max) * 100;
            const barHeight = (heightPercent / 100) * chartHeight;

            return (
              <div key={idx} className="flex flex-col items-center gap-2" style={{ width: `${barWidth}%`, minWidth: '60px' }}>
                <div className="relative w-full flex items-end justify-center">
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600 cursor-pointer group relative"
                    style={{ height: `${barHeight}px`, minHeight: '20px' }}
                  >
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {currency}
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 text-center truncate w-full">{item.label}</div>
                {item.percentage !== undefined && <div className="text-xs font-semibold text-slate-900">{item.percentage}%</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
