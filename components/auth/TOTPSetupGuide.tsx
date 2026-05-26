'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

interface TOTPSetupStep {
  stage: 'init' | 'qrcode' | 'verify' | 'complete';
  secret?: string;
  qrCode?: string;
  backupCodes?: string[];
}

export function TOTPSetupGuide() {
  const [step, setStep] = useState<TOTPSetupStep>({ stage: 'init' });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const initTOTPSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.initTOTP?.();
      if (response) {
        setStep({
          stage: 'qrcode',
          secret: response.secret,
          qrCode: response.qr_code_url,
        });
        setQrCodeUrl(response.qr_code_url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize TOTP setup');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyTOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await api.auth.verifyTOTP?.({ code: verificationCode });
      if (response?.backup_codes) {
        setStep({
          stage: 'verify',
          backupCodes: response.backup_codes,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmSetup = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await api.auth.confirmTOTP?.();
      setStep({ stage: 'complete' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete setup');
    } finally {
      setIsLoading(false);
    }
  };

  if (step.stage === 'init') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-md">
        <h2 className="text-xl font-semibold text-ink mb-4">Enable Two-Factor Authentication</h2>
        <p className="text-sm text-slate-600 mb-6">
          Secure your account with two-factor authentication. You'll need an authenticator app like Google Authenticator, Microsoft Authenticator, or Authy.
        </p>
        <Button onClick={initTOTPSetup} disabled={isLoading} className="w-full">
          {isLoading ? 'Setting up...' : 'Get Started'}
        </Button>
      </div>
    );
  }

  if (step.stage === 'qrcode') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-md">
        <h2 className="text-xl font-semibold text-ink mb-4">Scan QR Code</h2>
        <p className="text-sm text-slate-600 mb-6">
          Scan this QR code with your authenticator app:
        </p>
        <div className="flex justify-center mb-6">
          {qrCodeUrl ? (
            <img src={qrCodeUrl} alt="TOTP QR Code" className="w-40 h-40" />
          ) : (
            <div className="w-40 h-40 bg-slate-100 rounded flex items-center justify-center">
              <span className="text-sm text-slate-500">Loading...</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Can't scan? Enter this key manually: <code className="bg-slate-100 px-2 py-1 rounded text-xs">{step.secret}</code>
        </p>
        <div className="space-y-3">
          <Input
            placeholder="Enter 6-digit code from your app"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.currentTarget.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6}
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={verifyTOTP} disabled={isLoading || verificationCode.length !== 6} className="w-full">
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </Button>
        </div>
      </div>
    );
  }

  if (step.stage === 'verify') {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 max-w-md">
        <h2 className="text-xl font-semibold text-ink mb-4">Save Backup Codes</h2>
        <p className="text-sm text-slate-600 mb-4">
          Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app.
        </p>
        <div className="bg-slate-50 rounded-lg p-4 mb-6 space-y-2">
          {step.backupCodes?.map((code, idx) => (
            <div key={idx} className="font-mono text-sm text-slate-700 flex justify-between">
              <span>{code}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(code);
                }}
                className="text-blue-600 hover:text-blue-700 text-xs"
              >
                Copy
              </button>
            </div>
          ))}
        </div>
        <Button
          onClick={() => {
            const allCodes = step.backupCodes?.join('\n');
            navigator.clipboard.writeText(allCodes || '');
          }}
          className="w-full mb-3 bg-slate-200 text-slate-800 hover:bg-slate-300"
        >
          Copy All Codes
        </Button>
        <Button onClick={confirmSetup} disabled={isLoading} className="w-full">
          {isLoading ? 'Confirming...' : 'I Have Saved the Codes'}
        </Button>
      </div>
    );
  }

  if (step.stage === 'complete') {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 max-w-md">
        <h2 className="text-xl font-semibold text-green-900 mb-4">✓ Two-Factor Authentication Enabled</h2>
        <p className="text-sm text-green-800">
          Your account is now protected with two-factor authentication. You'll be asked to enter a verification code each time you log in from a new device.
        </p>
      </div>
    );
  }

  return null;
}
