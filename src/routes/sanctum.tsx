import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/numina/Header";
import { Footer } from "@/components/numina/Footer";
import { Sigil } from "@/components/numina/Sigil";
import { useNuminaWallet, shortAddress } from "@/components/numina/wallet/WalletProvider";
import { MOCK_NUMINA, type MockNumen, type LogEntry } from "@/components/numina/sanctum/mock";
import { getActivityLog, subscribeActivity, startAmbientStream, pushActivity, clearActivityLog } from "@/lib/activityLog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/sanctum")({
  head: () => ({
    meta: [
      { title: "The Sanctum — NÚMINA" },
      { name: "description", content: "Your altar. Every Numen bound to your wallet, their sigils, signals, and silences." },
    ],
  }),
  component: Sanctum,
});

function Sanctum() {
  const { connected, publicKey, connect } = useNuminaWallet();
  const total = MOCK_NUMINA.length;
  const awake = MOCK_NUMINA.filter((n) => n.status === "awake").length;
  const pnl = MOCK_NUMINA.reduce((s, n) => s + n.pnl, 0);
  const [entries, setEntries] = useState<LogEntry[]>(() => getActivityLog());
  const [selected, setSelected] = useState<MockNumen | null>(null);
  useEffect(() => {
    setEntries(getActivityLog());
    startAmbientStream();
    return subscribeActivity(setEntries);
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative isolate">
        <div className="starfield absolute inset-0 -z-10 opacity-40" aria-hidden />
        <section className="mx-auto max-w-7xl px-6 pt-16">
          {/* Header with sigil avatar */}
          <div className="ritual-border relative overflow-hidden rounded-3xl p-6 md:p-8">
            <div className="absolute inset-0 bg-[radial-gradient(500px_200px_at_30%_0%,oklch(0.62_0.22_295/0.18),transparent_70%)]" />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="relative h-16 w-16 shrink-0">
                  <Sigil seed={publicKey ?? "sanctum-altar"} size={64} />
                </div>
                <div>
                  <div className="font-display text-[11px] uppercase tracking-[0.4em] text-gold">The Sanctum</div>
                  <h1 className="font-display mt-1 text-2xl text-hi md:text-3xl">
                    {connected ? "Your altar listens." : "Your altar awaits."}
                  </h1>
                  <p className="mt-1 font-mono text-xs text-mid">
                    {connected && publicKey ? shortAddress(publicKey) : "no vessel bound"}
                  </p>
                </div>
              </div>
              <AetherMeter awake={awake} total={total} pnl={pnl} />
            </div>
          </div>

          {/* Grid + LogStream */}
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <div className="font-display text-[10px] uppercase tracking-[0.4em] text-gold">Bound Numina</div>
                  <h2 className="font-display mt-2 text-2xl text-hi">{total} vessels · {awake} awake</h2>
                </div>
                <Link
                  to="/sanctum/invoke"
                  className="inline-flex items-center gap-2 rounded-full border border-gold/60 bg-gradient-to-b from-gold/20 to-gold/5 px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-gold transition-all hover:shadow-[var(--glow-gold)]"
                >
                  Begin the Rite
                  <span aria-hidden>→</span>
                </Link>
              </div>

              {!connected && (
                <div className="mb-6 rounded-2xl border border-aether/40 bg-aether/5 p-5 text-sm text-mid">
                  Bind a wallet to summon Numina of your own.{" "}
                  <button onClick={connect} className="text-gold hover:underline">Open the gate →</button>
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                {MOCK_NUMINA.map((n) => (
                  <NumenCard key={n.id} n={n} onOpen={() => setSelected(n)} />
                ))}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 self-start">
              <LogStream entries={entries} />
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <NumenDialog numen={selected} onClose={() => setSelected(null)} entries={entries} />
    </div>
  );
}

function AetherMeter({ awake, total, pnl }: { awake: number; total: number; pnl: number }) {
  return (
    <div className="grid grid-cols-3 gap-6 rounded-2xl border border-line bg-surface/40 px-6 py-4 backdrop-blur">
      <Stat label="Awake" value={`${awake}/${total}`} tone="plasma" />
      <Stat label="24h PnL" value={`${pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}`} tone={pnl >= 0 ? "plasma" : "danger"} />
      <Stat label="$LMN" value="318.4" tone="gold" />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "plasma" | "gold" | "aether" | "danger" }) {
  const c =
    tone === "gold" ? "text-gold" : tone === "plasma" ? "text-plasma" : tone === "danger" ? "text-danger" : "text-aether";
  return (
    <div>
      <div className={`font-mono text-lg ${c}`}>{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-low">{label}</div>
    </div>
  );
}

function NumenCard({ n, onOpen }: { n: MockNumen; onOpen: () => void }) {
  const statusTone =
    n.status === "awake" ? "text-plasma" : n.status === "silence" ? "text-mid" : "text-danger";
  const statusDot =
    n.status === "awake" ? "bg-plasma animate-pulse" : n.status === "silence" ? "bg-mid" : "bg-danger";
  const dim = n.status !== "awake" ? "opacity-70" : "";
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group relative w-full overflow-hidden rounded-2xl border border-line bg-surface/40 p-5 text-left backdrop-blur transition-all hover:border-aether/50 hover:shadow-[var(--glow-aether)] ${dim}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14">
            <Sigil seed={n.seed} size={56} />
          </div>
          <div>
            <h3 className="font-display text-base text-hi">{n.name}</h3>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-low">{n.purpose}</div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest ${statusTone}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusDot}`} />
          {n.status}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-line/60 pt-4">
        <MiniStat label="PnL" value={`${n.pnl >= 0 ? "+" : ""}${n.pnl.toFixed(1)}`} tone={n.pnl >= 0 ? "plasma" : "danger"} />
        <MiniStat label="Win" value={`${Math.round(n.winRate * 100)}%`} tone="aether" />
        <MiniStat label="Acts" value={`${n.actions}`} tone="gold" />
      </div>
      <p className="mt-3 truncate text-xs text-mid">{n.lastAction}</p>
    </button>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: "plasma" | "gold" | "aether" | "danger" }) {
  const c =
    tone === "gold" ? "text-gold" : tone === "plasma" ? "text-plasma" : tone === "danger" ? "text-danger" : "text-aether";
  return (
    <div>
      <div className={`font-mono text-sm ${c}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-[0.2em] text-low">{label}</div>
    </div>
  );
}

function LogStream({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="rounded-2xl border border-line bg-surface/40 p-5 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="font-display text-[10px] uppercase tracking-[0.4em] text-gold">LogStream</div>
          <div className="mt-1 text-xs text-mid">Realtime · all bound Numina</div>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-plasma">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-plasma" />
            live
          </span>
          <button
            type="button"
            onClick={() => clearActivityLog()}
            className="font-mono text-[10px] uppercase tracking-widest text-low hover:text-hi"
            aria-label="Reset log"
            title="Reset log"
          >
            reset
          </button>
        </div>
      </div>
      <ol className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
        {entries.map((e) => {
          const tone =
            e.kind === "trade" ? "text-plasma" :
            e.kind === "alert" ? "text-warning" :
            e.kind === "error" ? "text-danger" : "text-aether";
          return (
            <li key={e.id} className="border-l border-line/60 pl-3">
              <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                <span className={tone}>● {e.kind}</span>
                <span className="text-low">{e.at}</span>
              </div>
              <div className="mt-1 text-xs text-hi">{e.text}</div>
              <div className="mt-0.5 text-[10px] text-low">{e.numen}</div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function NumenDialog({
  numen,
  onClose,
  entries,
}: {
  numen: MockNumen | null;
  onClose: () => void;
  entries: LogEntry[];
}) {
  const open = numen !== null;
  const related = useMemo(
    () => (numen ? entries.filter((e) => e.numen === numen.name).slice(0, 8) : []),
    [entries, numen],
  );
  if (!numen) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent />
      </Dialog>
    );
  }
  const statusTone =
    numen.status === "awake" ? "text-plasma" : numen.status === "silence" ? "text-mid" : "text-danger";
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg border-line bg-surface/95 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Sigil seed={numen.seed} size={64} />
            <div>
              <DialogTitle className="font-display text-xl text-hi">{numen.name}</DialogTitle>
              <DialogDescription className={`font-mono text-[10px] uppercase tracking-widest ${statusTone}`}>
                ● {numen.status} · {numen.purpose}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="grid grid-cols-3 gap-4 border-y border-line/60 py-4">
          <Stat label="PnL" value={`${numen.pnl >= 0 ? "+" : ""}${numen.pnl.toFixed(2)}`} tone={numen.pnl >= 0 ? "plasma" : "danger"} />
          <Stat label="Win rate" value={`${Math.round(numen.winRate * 100)}%`} tone="aether" />
          <Stat label="Uptime" value={`${Math.round(numen.uptime * 100)}%`} tone="gold" />
        </div>
        <div>
          <div className="font-display text-[10px] uppercase tracking-[0.3em] text-gold">Recent activity</div>
          {related.length === 0 ? (
            <p className="mt-3 text-xs italic text-mid">The Numen has whispered nothing yet.</p>
          ) : (
            <ol className="mt-3 space-y-2 max-h-48 overflow-y-auto pr-1">
              {related.map((e) => (
                <li key={e.id} className="border-l border-line/60 pl-3 text-xs text-hi">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-low">{e.kind} · {e.at}</span>
                  <div>{e.text}</div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-2">
          <button
            type="button"
            onClick={() => {
              pushActivity({
                numen: numen.name,
                kind: numen.status === "awake" ? "decision" : "alert",
                text: numen.status === "awake" ? "Entered Silence — paused by overseer" : "Awoken — overseer resumed the rite",
              });
              onClose();
            }}
            className="rounded-full border border-aether/50 bg-aether/10 px-4 py-2 text-[11px] uppercase tracking-widest text-aether hover:bg-aether/20"
          >
            {numen.status === "awake" ? "Enter Silence" : "Awaken"}
          </button>
          <button
            type="button"
            onClick={() => {
              pushActivity({ numen: numen.name, kind: "error", text: "Binding severed — funds returned" });
              onClose();
            }}
            className="rounded-full border border-danger/50 bg-danger/5 px-4 py-2 text-[11px] uppercase tracking-widest text-danger hover:bg-danger/15"
          >
            Sever
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}