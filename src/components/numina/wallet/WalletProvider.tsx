import { useMemo, useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
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

  if (!mounted) return <>{children}</>;

  // Wallet adapters are instantiated ONLY on the client.
  // PhantomWalletAdapter / SolflareWalletAdapter call window.addEventListener
  // at module-evaluation time, which crashes SSR in Node.js.
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);
  const wallets = useMemo(
    () => typeof window !== "undefined"
      ? [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })]
      : [],
    [],
  );

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

  const w = useWallet();

  const connect = useCallback(async () => {
    if (!mounted) return;
    try {
      // Prefer Phantom if available; else fall back to first installed adapter.
      const phantom = w.wallets.find((x) => x.adapter.name === "Phantom" && x.readyState !== "Unsupported");
      const target = phantom ?? w.wallets.find((x) => x.readyState !== "Unsupported");
      if (!target) {
        toast.error("No wallet detected", {
          description: "Install Phantom to bind a vessel.",
        });
        window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
        return;
      }
      w.select(target.adapter.name);
      await w.connect();
      toast.success("Vessel bound", {
        description: `Connected via ${target.adapter.name}.`,
      });
    } catch (err) {
      console.error("Wallet connect failed", err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("The gate refused", { description: msg });
    }
  }, [w, mounted]);

  // During SSR / before mount, the WalletContext is absent and reading any
  // property of `w` throws a "missing provider" error. Return safe defaults.
  if (!mounted) {
    return {
      mounted: false,
      publicKey: null,
      connecting: false,
      connected: false,
      walletName: null,
      connect,
      disconnect: async () => {},
    };
  }

  return {
    mounted,
    publicKey: w.publicKey ? w.publicKey.toBase58() : null,
    connecting: w.connecting,
    connected: w.connected,
    walletName: w.wallet?.adapter.name ?? null,
    connect,
    disconnect: async () => {
      try {
        await w.disconnect();
        toast("Binding severed");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        toast.error("Could not sever", { description: msg });
      }
    },
  };
}

export function shortAddress(addr: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}