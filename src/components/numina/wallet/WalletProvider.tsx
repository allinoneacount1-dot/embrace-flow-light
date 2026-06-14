import { useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";
import {
  ConnectionProvider,
  WalletProvider as SolanaWalletProvider,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork, type WalletAdapter } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";

/**
 * Wallet provider — mounts client-only because @solana/wallet-adapter-*
 * touches window/localStorage. During SSR and before hydration we render
 * children inside a "bare" shell so useWallet() returns the default
 * disconnected state.
 *
 * Wallet adapters are lazy-instantiated to avoid module-eval crashes
 * (PhantomWalletAdapter / SolflareWalletAdapter call window.addEventListener
 * at import time, which crashes SSR / causes hydration mismatches).
 */
export function NuminaWalletProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [wallets, setWallets] = useState<WalletAdapter[]>([]);

  useEffect(() => {
    setMounted(true);
    // Dynamic import happens ONLY in browser, after mount.
    // This prevents module-eval SSR crashes.
    import("@solana/wallet-adapter-phantom").then(({ PhantomWalletAdapter }) => {
      import("@solana/wallet-adapter-solflare").then(({ SolflareWalletAdapter }) => {
        const network = WalletAdapterNetwork.Devnet;
        setWallets([
          new PhantomWalletAdapter(),
          new SolflareWalletAdapter({ network }),
        ]);
      });
    });
  }, []);

  // Don't render wallet context until adapters are loaded.
  // Prevents useWallet() from being called with empty wallets array.
  if (!mounted || wallets.length === 0) return <>{children}</>;

  const network = WalletAdapterNetwork.Devnet;
  const endpoint = clusterApiUrl(network);

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

  // During SSR / before mount, the WalletContext is absent and calling
  // useWallet() throws a "missing provider" error. Skip it entirely.
  if (!mounted) {
    return {
      mounted: false,
      publicKey: null,
      connecting: false,
      connected: false,
      walletName: null,
      connect: async () => {},
      disconnect: async () => {},
    };
  }

  const w = useWallet();

  const connect = useCallback(async () => {
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
  }, [w]);

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