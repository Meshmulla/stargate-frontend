'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import { Send } from 'lucide-react';
import { useState } from 'react';
import { mutate } from 'swr';

interface DisputeResponseProps {
  disputeId: string;
  currentResponse?: string;
}

export function DisputeResponse({ disputeId, currentResponse }: DisputeResponseProps) {
  const [message, setMessage] = useState(currentResponse || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setSubmitting(true);
    try {
      await api.disputes.respond(disputeId, { message });
      
      // Refresh dispute data and timeline
      mutate(['dispute', disputeId]);
      mutate(['dispute-timeline', disputeId]);
      
      alert('Response submitted successfully!');
    } catch (error) {
      console.error('Failed to submit response:', error);
      alert('Failed to submit response. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <h3 className="mb-4 text-lg font-semibold text-ink">Your Response</h3>
      
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Message to dispute reviewer
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Explain your position on this dispute..."
            className="min-h-[120px] w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-violet focus:outline-none focus:ring-1 focus:ring-violet"
            rows={6}
          />
          <p className="mt-1 text-xs text-slate-500">
            Provide a clear explanation of why this dispute should be resolved in your favor.
          </p>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || submitting}
          className="w-full"
        >
          <Send size={16} />
          {submitting ? 'Submitting...' : 'Submit Response'}
        </Button>
      </div>
    </Card>
  );
}
