'use client';

import { QRCodeSVG } from 'qrcode.react';

interface StellarAddressQRProps {
  address: string;
  label?: string;
}

export function StellarAddressQR({ address, label }: StellarAddressQRProps) {
  if (!address) return null;

  const stellarUri = `web+stellar:pay?destination=${encodeURIComponent(address)}`;

  return (
    <div className="inline-flex flex-col items-center gap-3 rounded-md border border-slate-200 bg-white p-4">
      <QRCodeSVG
        value={stellarUri}
        size={180}
        level="M"
        includeMargin
        imageSettings={{
          src: '/stellar-icon.png',
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
      {label && <p className="text-xs text-slate-500">{label}</p>}
      <p className="max-w-[200px] truncate text-xs font-mono text-slate-600" title={address}>
        {address}
      </p>
    </div>
  );
}
