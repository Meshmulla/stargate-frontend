'use client';

import { useEffect, useState, useCallback } from 'react';
import { AmountDisplay } from './AmountDisplay';
import { PaymentStatus } from './PaymentStatus';
import { WalletSelector } from './WalletSelector';
import { useInvoiceStatus } from '@/hooks/useInvoiceStatus';
import { useWallet } from '@/hooks/useWallet';
import { api } from '@/lib/api';

export function PaymentWidget({ invoiceId, onSuccess, onError, theme = 'light' }: { invoiceId: string; onSuccess?(invoice: any): void; onError?(error: Error): void; theme?: 'light' | 'dark' }) {
  const [invoice, setInvoice] = useState<any>(null);
  const [blocked, setBlocked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { status } = useInvoiceStatus(invoiceId);
  const wallet = useWallet();

  useEffect(() => {
    api.invoices.public(invoiceId).then(setInvoice).catch((err) => {
      onError?.(err);
      window.parent?.postMessage({ type: 'STARGATE_ERROR', invoiceId, code: 'UNKNOWN', message: err.message }, '*');
    });
  }, [invoiceId, onError]);

  useEffect(() => {
    if (invoice) {
      window.parent?.postMessage({ type: 'STARGATE_LOADED', invoiceId }, '*');
    }
  }, [invoice, invoiceId]);

  useEffect(() => {
    if (status === 'paid' && invoice) {
      onSuccess?.(invoice);
      window.parent?.postMessage({ type: 'STARGATE_PAID', invoiceId, txHash: invoice.tx_hash }, '*');
    }
  }, [status, invoice, invoiceId, onSuccess]);

  const connectAndScreen = useCallback(async (nextWallet: any) => {
    try {
      setPaymentError(null);
      const publicKey = await wallet.connect(nextWallet);
      
      if (!publicKey) {
        if (wallet.error) {
          setPaymentError(wallet.error.message);
          window.parent?.postMessage({ type: 'STARGATE_ERROR', invoiceId, code: 'WALLET_CONNECTION_FAILED', message: wallet.error.message }, '*');
        }
        return;
      }

      const result = await api.compliance.screen(publicKey);
      setBlocked(result.result === 'blocked');
      if (result.result === 'blocked') {
        window.parent?.postMessage({ type: 'STARGATE_ERROR', invoiceId, code: 'COMPLIANCE_BLOCKED', message: 'Wallet address was blocked by compliance screening' }, '*');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPaymentError(`Connection failed: ${message}`);
      window.parent?.postMessage({ type: 'STARGATE_ERROR', invoiceId, code: 'WALLET_CONNECTION_FAILED', message }, '*');
      console.error('Wallet connection error:', err);
    }
  }, [wallet, invoiceId]);

  const pay = useCallback(async () => {
    try {
      setPaymentError(null);
      if (!wallet.wallet || !wallet.publicKey) return;
      
      const prepared = await api.payments.prepareTx(invoiceId, wallet.publicKey);
      const signedXdr = await wallet.wallet.signTransaction(prepared.xdr, prepared.network);
      const horizon = prepared.network === 'mainnet' ? 'https://horizon.stellar.org' : 'https://horizon-testnet.stellar.org';
      
      await fetch(`${horizon}/transactions`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ tx: signedXdr }),
      });
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setPaymentError(`Payment failed: ${message}`);
      window.parent?.postMessage({ type: 'STARGATE_ERROR', invoiceId, code: 'TX_SUBMISSION_FAILED', message }, '*');
      console.error('Payment error:', err);
      setSubmitted(false);
    }
  }, [wallet.wallet, wallet.publicKey, invoiceId]);

  if (!invoice) return null;

  return (
    <div className={theme === 'dark' ? 'bg-ink text-white' : 'bg-white text-ink'}>
      <div className="space-y-5 rounded-md border border-slate-200 p-5">
        <div>
          <div className="text-sm text-slate-500">{invoice.merchant_name}</div>
          <AmountDisplay amount={invoice.gross_usdc} />
          <p className="mt-2 text-sm text-slate-600">{invoice.description}</p>
        </div>
        
        {paymentError && (
          <div className="rounded-md bg-red-50 p-3 border border-red-200">
            <p className="text-sm text-red-700">{paymentError}</p>
            <button
              onClick={() => setPaymentError(null)}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {wallet.error && (
          <div className="rounded-md bg-amber-50 p-3 border border-amber-200">
            <p className="text-sm text-amber-700">{wallet.error.message}</p>
            <button
              onClick={() => wallet.clearError()}
              className="mt-2 text-sm text-amber-600 hover:text-amber-800 underline"
            >
              Dismiss
            </button>
          </div>
        )}
        
        <WalletSelector wallets={wallet.wallets} onConnect={connectAndScreen} isLoading={wallet.isConnecting} />
        {blocked && <div className="rounded-md bg-red-100 p-3 text-sm text-red-800">This wallet cannot be used for this payment.</div>}
        {wallet.publicKey && !blocked && (
          <button
            className="h-10 rounded-md bg-ink px-4 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={pay}
            disabled={wallet.isConnecting}
          >
            Sign and pay
          </button>
        )}
        {submitted && <PaymentStatus status={status} />}
      </div>
    </div>
  );
}
