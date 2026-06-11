import { Link } from "@tanstack/react-router";
import { WalletButton } from "./wallet/WalletButton";

const nav = [
  { to: "/sanctum", label: "Sanctum" },
  { to: "/pantheon", label: "Pantheon" },
  { to: "/choir", label: "Choir" },
  { to: "/aether", label: "Aether" },
  { to: "/lore", label: "Mythos" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 backdrop-blur-xl bg-[color:var(--void)]/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="relative inline-flex h-7 w-7 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-aether/30 blur-md" />
            <svg viewBox="0 0 24 24" className="relative h-7 w-7">
              <circle cx="12" cy="12" r="9" fill="none" stroke="oklch(0.83 0.13 85)" strokeWidth="0.8" />
              <path d="M12 4 L20 18 L4 18 Z" fill="none" stroke="oklch(0.62 0.22 295)" strokeWidth="1" />
              <circle cx="12" cy="13" r="2" fill="oklch(0.83 0.13 85)" />
            </svg>
          </span>
          <span className="font-display text-lg font-semibold tracking-[0.25em] text-hi">
            NÚMINA
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-xs uppercase tracking-[0.2em] text-mid transition-colors hover:text-hi"
              activeProps={{ className: "text-hi" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <WalletButton />
      </div>
    </header>
  );
}