'use client';

import { Card } from '@/components/ui/Card';
import { DisputeTimelineEvent } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, CheckCircle, FileText, MessageSquare, RefreshCw } from 'lucide-react';

interface DisputeTimelineProps {
  events: DisputeTimelineEvent[];
}

const eventIcons: Record<string, React.ReactNode> = {
  created: <AlertCircle size={16} className="text-red-600" />,
  evidence_submitted: <FileText size={16} className="text-blue-600" />,
  status_changed: <RefreshCw size={16} className="text-amber-600" />,
  message_added: <MessageSquare size={16} className="text-violet" />,
  resolved: <CheckCircle size={16} className="text-emerald-600" />,
};

export function DisputeTimeline({ events }: DisputeTimelineProps) {
  if (events.length === 0) {
    return (
      <Card className="py-8 text-center">
        <p className="text-slate-500">No timeline events yet</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-ink">Timeline</h3>
      <div className="space-y-4">
        {events.map((event, index) => (
          <div key={event.id} className="flex gap-3">
            <div className="relative flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                {eventIcons[event.event_type] || <AlertCircle size={16} className="text-slate-600" />}
              </div>
              {index < events.length - 1 && (
                <div className="h-full w-0.5 flex-1 bg-slate-200" style={{ minHeight: '24px' }} />
              )}
            </div>
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-ink">{event.description}</p>
                  {event.metadata && Object.keys(event.metadata).length > 0 && (
                    <div className="mt-1 text-sm text-slate-600">
                      {Object.entries(event.metadata).map(([key, value]) => (
                        <div key={key}>
                          <span className="font-medium">{key}:</span> {String(value)}
                        </div>
                      ))}
                    </div>
                  )}
                  {event.created_by && (
                    <p className="mt-1 text-xs text-slate-500">by {event.created_by}</p>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  {format(new Date(event.created_at), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
