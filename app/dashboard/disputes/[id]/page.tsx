'use client';

import { DisputeResponse } from '@/components/disputes/DisputeResponse';
import { DisputeTimeline } from '@/components/disputes/DisputeTimeline';
import { EvidenceUpload } from '@/components/disputes/EvidenceUpload';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useDispute, useDisputeTimeline } from '@/hooks/useDisputes';
import { format } from 'date-fns';
import { ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const reasonLabels: Record<string, string> = {
  fraudulent: 'Fraudulent',
  duplicate: 'Duplicate Payment',
  product_not_received: 'Product Not Received',
  product_unacceptable: 'Product Unacceptable',
  other: 'Other',
};

export default function DisputeDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const { data: dispute, isLoading, error } = useDispute(id);
  const { data: timeline } = useDisputeTimeline(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="py-12 text-center">
          <p className="text-slate-500">Loading dispute details...</p>
        </Card>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="space-y-6">
        <Card className="py-12 text-center">
          <p className="text-red-600">Failed to load dispute. Please try again.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/disputes">
          <Button className="bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">
            <ArrowLeft size={16} />
            Back to Disputes
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-ink">Dispute Details</h1>
          <p className="mt-1 text-sm text-slate-600">ID: {dispute.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Dispute Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Amount</p>
                <p className="mt-1 text-xl font-bold text-ink">${parseFloat(dispute.amount_usdc).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <div className="mt-1">
                  <Badge status={dispute.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-600">Reason</p>
                <p className="mt-1 font-medium text-ink">{reasonLabels[dispute.reason] || dispute.reason}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Created</p>
                <p className="mt-1 font-medium text-ink">
                  {format(new Date(dispute.created_at), 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              {dispute.customer_email && (
                <div>
                  <p className="text-sm text-slate-600">Customer Email</p>
                  <p className="mt-1 font-medium text-ink">{dispute.customer_email}</p>
                </div>
              )}
              {dispute.resolved_at && (
                <div>
                  <p className="text-sm text-slate-600">Resolved</p>
                  <p className="mt-1 font-medium text-ink">
                    {format(new Date(dispute.resolved_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              )}
            </div>

            {dispute.invoice_id && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Related Invoice</p>
                <Link 
                  href={`/dashboard/invoices/${dispute.invoice_id}`}
                  className="mt-1 inline-flex items-center gap-1 font-mono text-sm text-violet hover:underline"
                >
                  {dispute.invoice_id}
                  <ExternalLink size={14} />
                </Link>
              </div>
            )}
          </Card>

          {dispute.customer_message && (
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-ink">Customer Message</h3>
              <div className="rounded-md bg-slate-50 p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{dispute.customer_message}</p>
              </div>
            </Card>
          )}

          {dispute.merchant_response && (
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-ink">Your Response</h3>
              <div className="rounded-md bg-violet/5 p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{dispute.merchant_response}</p>
              </div>
            </Card>
          )}

          {dispute.resolution_notes && (
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-ink">Resolution Notes</h3>
              <div className="rounded-md bg-emerald-50 p-4">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{dispute.resolution_notes}</p>
              </div>
            </Card>
          )}

          {dispute.evidence_files && dispute.evidence_files.length > 0 && (
            <Card>
              <h3 className="mb-3 text-lg font-semibold text-ink">Evidence Files</h3>
              <div className="space-y-2">
                {dispute.evidence_files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
                    <FileText size={16} className="text-slate-600" />
                    <span className="text-sm text-slate-700">{file}</span>
                    <a
                      href={`/api/disputes/${dispute.id}/evidence/${file}`}
                      download
                      className="ml-auto text-sm text-violet hover:underline"
                    >
                      Download
                    </a>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {timeline && timeline.length > 0 && (
            <DisputeTimeline events={timeline} />
          )}
        </div>

        <div className="space-y-6">
          {(dispute.status === 'open' || dispute.status === 'under_review') && (
            <>
              <DisputeResponse
                disputeId={dispute.id}
                currentResponse={dispute.merchant_response}
              />
              <EvidenceUpload disputeId={dispute.id} />
            </>
          )}

          <Card>
            <h3 className="mb-3 text-lg font-semibold text-ink">Need Help?</h3>
            <p className="text-sm text-slate-600 mb-4">
              Contact our support team if you need assistance with this dispute.
            </p>
            <Button className="w-full bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50">
              Contact Support
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
