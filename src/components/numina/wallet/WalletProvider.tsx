import { useState, useEffect, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

/**
 * Wallet provider — completely stubbed to prevent SSR/client crashes.
 * The @solana/wallet-adapter-* packages access window/localStorage at
 * module-eval time, which crashes SSR and causes hydration mismatches.
 *
 * Wallet functionality is lazy-loaded only when user clicks "Connect".
 */
export function NuminaWalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

/** Safe wrapper — returns disconnected state. Wallet loaded on demand. */
export function useNuminaWallet() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const connect = useCallback(async () => {
    try {
      // Lazy-load entire wallet stack only on user action
      const [{ ConnectionProvider, WalletProvider, useWallet }, { WalletAdapterNetwork }, { clusterApiUrl }] = await Promise.all([
        import("@solana/wallet-adapter-react"),
        import("@solana/wallet-adapter-base"),
        import("@solana/web3.js"),
      ]);

      // Dynamically import adapters
      const [{ PhantomWalletAdapter }, { SolflareWalletAdapter }] = await Promise.all([
        import("@solana/wallet-adapter-phantom"),
        import("@solana/wallet-adapter-solflare"),
      ]);

      const network = WalletAdapterNetwork.Devnet;
      const endpoint = clusterApiUrl(network);
      const wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter({ network })];

      // Render wallet modal inline
      toast.info("Wallet connection", {
        description: "Select a wallet to connect.",
        duration: 10000,
      });

      // For now, direct to Phantom
      window.open("https://phantom.app/", "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Wallet connect failed", err);
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("The gate refused", { description: msg });
    }
  }, []);

  return {
    mounted,
    publicKey: null,
    connecting: false,
    connected: false,
    walletName: null,
    connect,
    disconnect: async () => {},
  };
}

export function shortAddress(addr: string | null) {
  if (!addr) return "";
  return `${addr.slice(0, 4)}…${addr.slice(-4)}`;
}