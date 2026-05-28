'use client';

import useSWR from 'swr';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CopyField } from '@/components/ui/CopyField';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function WebhooksPage() {
  const { data, mutate } = useSWR('webhooks', api.webhooks.list);
  async function create(formData: FormData) {
    await api.webhooks.create({ url: formData.get('url'), events: ['invoice.paid', 'invoice.expired'] });
    mutate();
  }
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Webhooks</h1>
          <p className="text-sm text-slate-500">Endpoint delivery, event subscriptions, HMAC signatures, and retries.</p>
        </div>
      </div>
      <form action={create} className="flex gap-2 rounded-md border border-slate-200 bg-white p-3">
        <Input name="url" placeholder="https://example.com/stargate" />
        <Button>Register</Button>
      </form>
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="rounded-md border border-slate-200 bg-white">
        {(data ?? []).map((webhook: any) => (
          <div key={webhook.id} className="flex items-start justify-between border-b border-slate-100 p-4 text-sm">
            <div className="min-w-0 flex-1 space-y-2 pr-4">
              <div className="font-medium text-ink">{webhook.url}</div>
              <div className="text-xs text-slate-500">{webhook.events?.join(', ')}</div>
              {webhook.secret && (
                <CopyField value={webhook.secret} label="Signing secret" masked />
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <Button className="bg-white text-ink ring-1 ring-slate-300" onClick={() => api.webhooks.deliveries(webhook.id)}>Deliveries</Button>
              <Button className="bg-red-700" onClick={async () => { await api.webhooks.remove(webhook.id); mutate(); }}>Delete</Button>
            </div>
          </div>
        ))}
        {!(data ?? []).length && <div className="p-6 text-sm text-slate-500">No webhook endpoints yet.</div>}
        </div>
        <Card className="space-y-3">
          <h2 className="font-semibold text-ink">Event simulator</h2>
          <select className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm">
            <option>invoice.paid</option>
            <option>invoice.expired</option>
            <option>invoice.cancelled</option>
            <option>settlement.completed</option>
          </select>
          <pre className="max-h-52 overflow-auto rounded-md bg-slate-950 p-3 text-xs text-slate-100">{JSON.stringify({ event: 'invoice.paid', invoice_id: 'inv_demo', amount: '49.00', currency: 'USDC' }, null, 2)}</pre>
          <Button className="w-full">Send test event</Button>
        </Card>
      </div>
    </div>
  );
}
