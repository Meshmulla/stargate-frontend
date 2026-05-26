'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

interface TwoFactorStatus {
  enabled: boolean;
  last_verified?: string;
}

export function TwoFactorManagement() {
  const [status, setStatus] = useState<TwoFactorStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDisablePrompt, setShowDisablePrompt] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.auth.getTOTPStatus?.();
      if (response) {
        setStatus(response);
      }
    } catch (err) {
      console.error('Failed to load 2FA status:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const disableTOTP = async () => {
    if (!disableCode || disableCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await api.auth.disableTOTP?.({ code: disableCode });
      setStatus({ enabled: false });
      setShowDisablePrompt(false);
      setDisableCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disable 2FA');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && status === null) {
    return <div className="text-sm text-slate-500">Loading...</div>;
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-ink">Two-Factor Authentication</h3>
          <p className="text-sm text-slate-600 mt-1">
            {status?.enabled ? 'Enabled' : 'Not enabled'}
            {status?.last_verified && ` • Last verified: ${new Date(status.last_verified).toLocaleDateString()}`}
          </p>
        </div>
        {status?.enabled && (
          <Button
            onClick={() => setShowDisablePrompt(true)}
            className="bg-red-100 text-red-700 hover:bg-red-200"
            disabled={isLoading}
          >
            Disable
          </Button>
        )}
      </div>

      {showDisablePrompt && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-3">
          <p className="text-sm text-amber-900">
            Enter your 6-digit verification code to disable two-factor authentication:
          </p>
          <Input
            placeholder="Enter 6-digit code"
            value={disableCode}
            onChange={(e) => setDisableCode(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <Button
              onClick={disableTOTP}
              disabled={isLoading || disableCode.length !== 6}
              className="flex-1 bg-red-100 text-red-700 hover:bg-red-200"
            >
              {isLoading ? 'Disabling...' : 'Disable 2FA'}
            </Button>
            <Button
              onClick={() => {
                setShowDisablePrompt(false);
                setDisableCode('');
                setError(null);
              }}
              disabled={isLoading}
              className="flex-1 bg-slate-200 text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
