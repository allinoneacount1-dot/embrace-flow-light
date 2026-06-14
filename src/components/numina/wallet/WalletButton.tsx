import { useNuminaWallet, shortAddress } from "./WalletProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function WalletButton() {
  const { mounted, connected, connecting, publicKey, walletName, connect, disconnect } = useNuminaWallet();

  // SSR/initial render: stable disconnected button so hydration is consistent.
  // Also covers the brief window before wallet adapters finish dynamic import.
  if (!mounted || !connected || !publicKey) {
    return (
      <button
        onClick={connect}
        disabled={connecting}
        className="group relative inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/5 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold/15 hover:shadow-[var(--glow-gold)] disabled:opacity-60"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        {connecting ? "Opening…" : "Open the Gate"}
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="inline-flex items-center gap-2 rounded-full border border-aether/50 bg-aether/10 px-4 py-2 font-mono text-xs text-aether transition-all hover:bg-aether/20 hover:shadow-[var(--glow-aether)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-plasma" />
          {shortAddress(publicKey)}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 border-line bg-surface/95 backdrop-blur"
      >
        <DropdownMenuLabel className="font-display text-[10px] uppercase tracking-[0.3em] text-low">
          Bound vessel
        </DropdownMenuLabel>
        <div className="px-2 pb-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-low">{walletName ?? "Wallet"}</div>
          <div className="mt-1 font-mono text-xs text-hi break-all">{publicKey}</div>
        </div>
        <DropdownMenuSeparator className="bg-line/60" />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            navigator.clipboard?.writeText(publicKey);
          }}
          className="cursor-pointer text-mid focus:bg-aether/10 focus:text-hi"
        >
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => disconnect()}
          className="cursor-pointer text-danger focus:bg-danger/10 focus:text-danger"
        >
          Sever the binding
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}