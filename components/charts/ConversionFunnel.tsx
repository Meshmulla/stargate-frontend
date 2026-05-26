'use client';

interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
  title?: string;
}

export function ConversionFunnel({ stages, title = 'Conversion Funnel' }: ConversionFunnelProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="text-lg font-semibold text-ink mb-6">{title}</h3>
      <div className="space-y-4">
        {stages.map((stage, idx) => {
          const widthPercent = (stage.count / maxCount) * 100;
          const colors = ['bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900'];
          const color = colors[idx % colors.length];

          return (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-700">{stage.name}</span>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900">{stage.count.toLocaleString()}</span>
                  <span className="text-xs text-slate-500 ml-2">({stage.percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-8 overflow-hidden">
                <div
                  className={`${color} h-full rounded-full transition-all flex items-center justify-end pr-3`}
                  style={{ width: `${widthPercent}%` }}
                >
                  {widthPercent > 15 && <span className="text-white text-xs font-semibold">{widthPercent.toFixed(0)}%</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stages.length > 1 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Conversion Rate</p>
              <p className="text-lg font-semibold text-blue-900">
                {stages.length > 1 ? ((stages[stages.length - 1].count / stages[0].count) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <p className="text-xs text-slate-600 mb-1">Drop-off</p>
              <p className="text-lg font-semibold text-red-900">
                {stages.length > 1 ? ((1 - stages[stages.length - 1].count / stages[0].count) * 100).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
