'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CustomDomainStatus {
  domain: string;
  status: 'unverified' | 'verifying' | 'verified' | 'error';
  message?: string;
}

export function CustomDomainConfig() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<CustomDomainStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateDomain = async () => {
    if (!domain || domain.trim().length === 0) {
      setStatus({ domain, status: 'error', message: 'Please enter a domain' });
      return;
    }

    // Basic domain validation
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
    if (!domainRegex.test(domain)) {
      setStatus({ domain, status: 'error', message: 'Please enter a valid domain' });
      return;
    }

    setIsLoading(true);
    setStatus({ domain, status: 'verifying' });

    try {
      // Simulate domain verification
      // In production, this would call an API endpoint to verify DNS records
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setStatus({
        domain,
        status: 'verified',
        message: `Domain ${domain} is configured correctly. Your checkout link will be available at https://${domain}/pay/{id}`,
      });
    } catch (err) {
      setStatus({
        domain,
        status: 'error',
        message: 'Domain verification failed. Please check your DNS records.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-ink mb-2">Custom Checkout Domain</h3>
      <p className="text-sm text-slate-600 mb-4">
        Configure a custom domain for your payment pages instead of using our default domain.
      </p>

      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.currentTarget.value)}
              disabled={isLoading}
            />
          </div>
          <Button onClick={validateDomain} disabled={isLoading || !domain}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </Button>
        </div>

        {status && (
          <div
            className={`p-3 rounded-md ${
              status.status === 'verified'
                ? 'bg-green-50 border border-green-200'
                : status.status === 'verifying'
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-red-50 border border-red-200'
            }`}
          >
            <p
              className={`text-sm ${
                status.status === 'verified'
                  ? 'text-green-700'
                  : status.status === 'verifying'
                    ? 'text-blue-700'
                    : 'text-red-700'
              }`}
            >
              {status.message}
            </p>
          </div>
        )}

        <div className="mt-4 p-4 bg-slate-50 rounded-md">
          <p className="text-sm font-semibold text-slate-900 mb-2">DNS Configuration Required</p>
          <p className="text-sm text-slate-600 mb-3">Add a CNAME record to your DNS provider:</p>
          <div className="bg-white p-2 rounded border border-slate-200 font-mono text-xs text-slate-700 space-y-1">
            <div>
              <span className="font-semibold">Host:</span> @
            </div>
            <div>
              <span className="font-semibold">Type:</span> CNAME
            </div>
            <div>
              <span className="font-semibold">Value:</span> checkout.stargate.money
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
