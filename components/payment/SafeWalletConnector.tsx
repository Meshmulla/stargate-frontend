'use client';

import { useEffect, useState, ReactNode } from 'react';

interface SafeWalletConnectorProps {
  children: ReactNode;
}

interface ErrorState {
  hasError: boolean;
  message: string;
  code?: string;
}

/**
 * Error boundary component that handles wallet deep-link errors on iOS Safari
 * Prevents NavigationError from unmounting the entire checkout React tree
 */
export function SafeWalletConnector({ children }: SafeWalletConnectorProps) {
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '' });

  useEffect(() => {
    // Handle unhandled promise rejections from wallet deep-links
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.name === 'NavigationError' || event.reason?.message?.includes('Navigation')) {
        event.preventDefault();
        setError({
          hasError: true,
          message: 'Wallet connection interrupted. Please try again.',
          code: 'NAVIGATION_ERROR',
        });
      }
    };

    // Handle navigation errors that might occur during wallet redirect
    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes('Navigation') || event.error?.name === 'NavigationError') {
        event.preventDefault();
        setError({
          hasError: true,
          message: 'Wallet connection interrupted. Please try again.',
          code: 'NAVIGATION_ERROR',
        });
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error.hasError) {
    return (
      <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
        <p className="text-sm font-semibold text-amber-900">Connection Issue</p>
        <p className="text-sm text-amber-700 mt-1">{error.message}</p>
        <button
          onClick={() => setError({ hasError: false, message: '' })}
          className="mt-3 px-3 py-1 text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-md transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
