import { useMemo, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { clusterApiUrl } from "@solana/web3.js";

/**
 * Wallet provider — mounts client-only because @solana/wallet-adapter-* touches
 * window/localStorage. During SSR we render children inside a "bare" shell so
 * useWallet() returns the default disconnected state.
 */
export function NuminaWalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })],
    [network],
  );

  if (!mounted) return <>{children}</>;

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        {children}
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
}

/** Safe wrapper around useWallet that returns a default shape during SSR. */
export function useNuminaWallet() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // useWallet returns the default disconnected adapter state outside the provider
  // tree on the server; calling it conditionally would break Rules of Hooks.
  const w = useWallet();

  const connect = useCallback(async () => {
    try {
      // Prefer Phantom if available; else fall back to first installed adapter.
      const phantom = w.wallets.find((x) => x.adapter.name === "Phantom" && x.readyState !== "Unsupported");
      const target = phantom ?? w.wallets.find((x) => x.readyState !== "Unsupported");
      if (!target) {
        window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
        return;
      }
      w.select(target.adapter.name);
      await w.connect();
    } catch (err) {
      console.error("Wallet connect failed", err);
    }
  }, [w]);

  return {
    mounted,
    publicKey: w.publicKey ? w.publicKey.toBase58() : null,
    connecting: w.connecting,
    connected: w.connected,
    walletName: w.wallet?.adapter.name ?? null,
    connect,
    disconnect: w.disconnect,
  };
}

export function shortAddress(addr: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}