import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/numina/Header";
import { Footer } from "@/components/numina/Footer";
import { Sigil } from "@/components/numina/Sigil";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NÚMINA — Summon intelligence. Bind it to the chain." },
      { name: "description", content: "Invoke autonomous on-chain AI agents on Solana. Non-custodial. Ritualistic. Sovereign." },
      { property: "og:title", content: "NÚMINA — The Gate" },
      { property: "og:description", content: "Summon intelligence. Bind it to the chain." },
    ],
  }),
  component: TheGate,
});

function TheGate() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Premise />
        <LiveChoir />
        <Rite />
        <Featured />
        <Safety />
      </main>
      <Footer />
    </div>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="starfield absolute inset-0 -z-10" aria-hidden />
      <div className="absolute inset-x-0 top-0 -z-10 h-[800px] bg-[radial-gradient(800px_500px_at_50%_20%,oklch(0.62_0.22_295/0.15),transparent_70%)]" aria-hidden />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-32 pt-20 lg:grid-cols-2 lg:pt-32">
        <div>
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-3 py-1.5 text-[11px] uppercase tracking-[0.25em] text-mid backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-plasma" />
            Protocol live on Solana devnet
          </div>

          <h1 className="font-display text-5xl font-semibold leading-[1.05] text-hi md:text-6xl lg:text-7xl">
            Summon
            <br />
            intelligence.
            <br />
            <span className="text-glow-gold text-gold">Bind it to the chain.</span>
          </h1>

          <p className="mt-8 max-w-lg text-base leading-relaxed text-mid md:text-lg">
            NÚMINA is the rite by which autonomous AI agents — Numina — are
            invoked, bound to your wallet, and set to act on-chain within
            ritual guardrails. They watch the markets. They interpret the
            signs. You sleep.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/sanctum"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-gold/60 bg-gradient-to-b from-gold/20 to-gold/5 px-7 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-gold transition-all hover:from-gold/30 hover:to-gold/10 hover:shadow-[var(--glow-gold)]"
            >
              Open the Gate
              <span aria-hidden>→</span>
            </Link>
            <Link
              to="/lore"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/40 px-7 py-3.5 text-sm uppercase tracking-[0.2em] text-mid backdrop-blur transition-colors hover:border-aether/50 hover:text-hi"
            >
              Read the Mythos
            </Link>
          </div>

          <dl className="mt-14 grid max-w-md grid-cols-3 gap-6 border-t border-line/60 pt-8">
            <Stat label="Numina awake" value="1,284" tone="plasma" />
            <Stat label="Rites today" value="319" tone="gold" />
            <Stat label="Choir signals" value="42.7K" tone="aether" />
          </dl>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,oklch(0.62_0.22_295/0.25),transparent_60%)] blur-2xl" />
          <div className="animate-pulse-glow">
            <Sigil seed="numina-genesis-001" size={560} className="max-w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "gold" | "plasma" | "aether" }) {
  const c = tone === "gold" ? "text-gold" : tone === "plasma" ? "text-plasma" : "text-aether";
  return (
    <div>
      <dd className={`font-mono text-2xl ${c}`}>{value}</dd>
      <dt className="mt-1 text-[10px] uppercase tracking-[0.2em] text-low">{label}</dt>
    </div>
  );
}

/* ───────────────────────── Premise ───────────────────────── */
function Premise() {
  const cards = [
    {
      step: "I.",
      title: "Invoke",
      body: "Name a Numen. Forge its sigil from the hash of your wallet. Six steps. One signature.",
    },
    {
      step: "II.",
      title: "Bind",
      body: "Delegate scoped authority to a PDA. Budget, max-per-tx, and revocation enforced on-chain.",
    },
    {
      step: "III.",
      title: "Awaken",
      body: "Your Numen reads price, oracle, and on-chain signal. It decides. It acts. It logs. You watch.",
    },
  ];
  return (
    <SectionShell eyebrow="The Premise" title="Three movements of the rite">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((c) => (
          <article
            key={c.step}
            className="ritual-border group relative overflow-hidden rounded-3xl p-8 transition-all hover:-translate-y-1 hover:shadow-[var(--glow-aether)]"
          >
            <div className="font-display text-xs tracking-[0.4em] text-gold">{c.step}</div>
            <h3 className="font-display mt-4 text-2xl text-hi">{c.title}</h3>
            <p className="mt-4 text-sm leading-relaxed text-mid">{c.body}</p>
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-aether/10 blur-3xl transition-opacity group-hover:bg-aether/20" />
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/* ───────────────────────── Live Choir ───────────────────────── */
function LiveChoir() {
  const counters = [
    { label: "Numina awake", value: "1,284", tone: "plasma" as const },
    { label: "Actions / 24h", value: "47,902", tone: "gold" as const },
    { label: "$LMN tithed", value: "318,440", tone: "aether" as const },
    { label: "Strategies in Pantheon", value: "612", tone: "plasma" as const },
  ];
  return (
    <section className="mx-auto mt-24 max-w-7xl px-6">
      <div className="ritual-border relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(600px_200px_at_50%_0%,oklch(0.62_0.22_295/0.18),transparent_70%)]" />
        <div className="relative grid grid-cols-2 gap-6 px-8 py-10 md:grid-cols-4 md:px-12">
          {counters.map((c) => (
            <div key={c.label} className="text-center md:text-left">
              <div className={`font-mono text-3xl md:text-4xl ${c.tone === "gold" ? "text-gold" : c.tone === "plasma" ? "text-plasma" : "text-aether"}`}>
                {c.value}
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.25em] text-low">{c.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── The Rite ───────────────────────── */
function Rite() {
  const steps = [
    { n: "01", t: "Naming", d: "Choose a name. The sigil emerges deterministic from its seed." },
    { n: "02", t: "Purpose", d: "Trader, monitor, or task runner — the Numen's reason for waking." },
    { n: "03", t: "Strategy", d: "Clone a Pantheon template, or author your own rule set." },
    { n: "04", t: "Bounds", d: "Budget, max-per-tx, and risk profile. Guardrails are on-chain." },
    { n: "05", t: "Tithe", d: "Stake $LMN to grant the Numen energy to act on your behalf." },
    { n: "06", t: "Seal", d: "Sign once. The PDA is forged. The Sigil is minted. The Numen awakens." },
  ];
  return (
    <SectionShell eyebrow="The Rite" title="Six steps from silence to awakening">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="group relative rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur transition-all hover:border-aether/50"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs text-low">{s.n}</span>
              <span className="font-display text-[10px] tracking-[0.3em] text-gold/60">
                {i === 5 ? "SEAL" : "STEP"}
              </span>
            </div>
            <h3 className="font-display mt-3 text-xl text-hi">{s.t}</h3>
            <p className="mt-3 text-sm leading-relaxed text-mid">{s.d}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ───────────────────────── Featured strategies ───────────────────────── */
function Featured() {
  const items = [
    { name: "Ember of Pyth", risk: "Low", asset: "SOL/USDC", roi: "+12.4%", followers: 412 },
    { name: "Choir of Mean Reversion", risk: "Med", asset: "JUP/USDC", roi: "+28.1%", followers: 1108 },
    { name: "Watcher in the Liquidity", risk: "Low", asset: "Multi", roi: "+8.7%", followers: 286 },
    { name: "Daemon of the Breakout", risk: "High", asset: "WIF/USDC", roi: "+61.2%", followers: 2204 },
  ];
  const riskTone = (r: string) => (r === "Low" ? "text-plasma" : r === "Med" ? "text-warning" : "text-danger");
  return (
    <SectionShell
      eyebrow="From the Pantheon"
      title="Featured strategies"
      action={<Link to="/pantheon" className="text-xs uppercase tracking-[0.25em] text-mid hover:text-hi">Enter the Pantheon →</Link>}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((s, idx) => (
          <article
            key={s.name}
            className="group relative overflow-hidden rounded-2xl border border-line bg-surface/40 p-6 backdrop-blur transition-all hover:border-aether/50 hover:shadow-[var(--glow-aether)]"
          >
            <div className="flex items-center justify-between">
              <div className="relative h-14 w-14">
                <Sigil seed={`pantheon-${idx}-${s.name}`} size={56} />
              </div>
              <span className={`font-mono text-xs uppercase tracking-widest ${riskTone(s.risk)}`}>
                ● {s.risk}
              </span>
            </div>
            <h3 className="font-display mt-5 text-base text-hi">{s.name}</h3>
            <div className="mt-1 font-mono text-xs text-low">{s.asset}</div>
            <div className="mt-6 flex items-end justify-between border-t border-line/60 pt-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-low">30d ROI</div>
                <div className="font-mono text-lg text-plasma">{s.roi}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-[0.2em] text-low">Bound</div>
                <div className="font-mono text-lg text-hi">{s.followers}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}

/* ───────────────────────── Safety ───────────────────────── */
function Safety() {
  const pillars = [
    {
      t: "Non-custodial by design",
      d: "Numina never hold your private key. Delegated authority is scoped and revocable.",
    },
    {
      t: "Guardrails on-chain",
      d: "Budget and max-per-tx are enforced inside the Anchor program — not in the backend.",
    },
    {
      t: "Revoke at any moment",
      d: "One signature returns delegated funds and silences the Numen. The rite is reversible.",
    },
  ];
  return (
    <SectionShell eyebrow="Safety & sovereignty" title="The chain is the final authority">
      <div className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line">
        {pillars.map((p) => (
          <div key={p.t} className="bg-surface/60 p-8 md:p-10">
            <h3 className="font-display text-lg text-hi">{p.t}</h3>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-mid">{p.d}</p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

/* ───────────────────────── Shell ───────────────────────── */
function SectionShell({
  eyebrow,
  title,
  action,
  children,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-32 max-w-7xl px-6">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="font-display text-[11px] uppercase tracking-[0.4em] text-gold">{eyebrow}</div>
          <h2 className="font-display mt-3 text-3xl text-hi md:text-4xl">{title}</h2>
        </div>
        {action}
      </div>
      <div className="glyph-divider mb-10" />
      {children}
    </section>
  );
}
// force rebuild: Sun Jun 14 14:04:48 WIB 2026
