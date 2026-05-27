'use client';

import { useEffect, useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Check, Copy, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ShareModalProps {
  url: string;
  label: string;
  onClose: () => void;
}

export function ShareModal({ url, label, onClose }: ShareModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function copyLink() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadPNG() {
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${label}-qr.png`;
    a.click();
  }

  function downloadSVG() {
    const svg = document.getElementById('share-qr-svg');
    if (!svg) return;
    const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${label}-qr.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-sm rounded-xl border border-slate-200 bg-white p-6 shadow-lift">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-ink"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <h2 className="mb-1 text-base font-semibold text-ink">Share payment link</h2>
        <p className="mb-5 truncate text-xs text-slate-500">{label}</p>

        <div ref={canvasRef} className="flex justify-center">
          <QRCodeCanvas value={url} size={180} />
        </div>
        <div className="hidden">
          <QRCodeSVG id="share-qr-svg" value={url} size={180} />
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={copyLink}
            className="flex w-full items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-left hover:bg-slate-50"
          >
            <span className="flex-1 truncate font-mono text-xs text-slate-500">{url}</span>
            {copied ? <Check size={15} className="text-mint" /> : <Copy size={15} />}
          </button>

          <div className="flex gap-2">
            <Button className="flex-1 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={downloadPNG}>
              <Download size={15} /> PNG
            </Button>
            <Button className="flex-1 bg-white text-ink ring-1 ring-slate-300 hover:bg-slate-50" onClick={downloadSVG}>
              <Download size={15} /> SVG
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
