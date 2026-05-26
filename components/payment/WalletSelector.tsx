import { Button } from '@/components/ui/Button';
import { WalletSigner } from '@/lib/stellar';

export function WalletSelector({ wallets, onConnect, isLoading }: { wallets: WalletSigner[]; onConnect(wallet: WalletSigner): void; isLoading?: boolean }) {
  return (
    <div className="flex gap-2">
      {wallets.map((wallet) => (
        <Button key={wallet.name} onClick={() => onConnect(wallet)} disabled={isLoading}>
          {isLoading ? 'Connecting...' : wallet.name}
        </Button>
      ))}
    </div>
  );
}
