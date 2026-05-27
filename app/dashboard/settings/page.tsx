'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TwoFactorManagement } from '@/components/auth/TwoFactorManagement';
import { TOTPSetupGuide } from '@/components/auth/TOTPSetupGuide';
import { CustomDomainConfig } from '@/components/settings/CustomDomainConfig';
import { StellarAddressQR } from '@/components/settings/StellarAddressQR';
import { api } from '@/lib/api';
import { useState } from 'react';

export default function SettingsPage() {
  const [showTOTPSetup, setShowTOTPSetup] = useState(false);
  const [stellarAddress, setStellarAddress] = useState('');

  async function save(formData: FormData) {
    await api.merchants.update({
      name: formData.get('name'),
      stellar_address: formData.get('stellar_address'),
      settlement_cadence: formData.get('settlement_cadence'),
      checkout_domain: formData.get('checkout_domain'),
    });
    setStellarAddress(formData.get('stellar_address') as string);
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Settings</h1>
      </div>

      <section className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">Merchant Settings</h2>
          <form action={save} className="space-y-3">
            <Input name="name" placeholder="Merchant name" />
            <Input name="stellar_address" placeholder="G... settlement address" />
            <select name="settlement_cadence" className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
            <Input name="checkout_domain" placeholder="example.com (optional custom checkout domain)" />
            <Button>Save settings</Button>
          </form>

          {stellarAddress && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-ink mb-3">Stellar Receiving Address QR</h3>
              <StellarAddressQR address={stellarAddress} label="Scan to send USDC to this address" />
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">API Key</h2>
          <Button>Generate API key</Button>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-ink mb-4">Checkout Domain</h2>
          <CustomDomainConfig />
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h2 className="text-lg font-semibold text-ink mb-4">Security</h2>
          {!showTOTPSetup ? (
            <div className="space-y-4">
              <TwoFactorManagement />
              <Button onClick={() => setShowTOTPSetup(true)} className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                Set Up Two-Factor Authentication
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <TOTPSetupGuide />
              <Button
                onClick={() => setShowTOTPSetup(false)}
                className="bg-slate-200 text-slate-700 hover:bg-slate-300"
              >
                Back to Settings
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
