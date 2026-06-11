import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="relative mt-32 border-t border-line/60">
      <div className="glyph-divider absolute inset-x-0 top-0" />
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-xl tracking-[0.3em] text-hi">NÚMINA</div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-mid">
            Summon intelligence. Bind it to the chain. A non-custodial protocol for autonomous on-chain agents on Solana.
          </p>
          <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-low">
            Devnet · v0.1 · not financial advice
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-low">Protocol</h4>
          <ul className="space-y-3 text-sm text-mid">
            <li><Link to="/sanctum" className="hover:text-hi">Sanctum</Link></li>
            <li><Link to="/pantheon" className="hover:text-hi">Pantheon</Link></li>
            <li><Link to="/choir" className="hover:text-hi">Choir</Link></li>
            <li><Link to="/aether" className="hover:text-hi">Aether</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-[11px] uppercase tracking-[0.25em] text-low">Mythos</h4>
          <ul className="space-y-3 text-sm text-mid">
            <li><Link to="/lore" className="hover:text-hi">Docs</Link></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer noopener" className="hover:text-hi">GitHub</a></li>
            <li><a href="https://x.com" target="_blank" rel="noreferrer noopener" className="hover:text-hi">X / Twitter</a></li>
            <li><a href="https://discord.com" target="_blank" rel="noreferrer noopener" className="hover:text-hi">Discord</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/40 px-6 py-6">
        <p className="mx-auto max-w-7xl text-center text-[11px] text-low">
          The signal flows through the Silence. Trade at your own risk. Numina holds no custody.
        </p>
      </div>
    </footer>
  );
}