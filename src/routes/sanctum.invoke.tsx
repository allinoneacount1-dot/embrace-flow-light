import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Header } from "@/components/numina/Header";
import { Footer } from "@/components/numina/Footer";
import { Sigil } from "@/components/numina/Sigil";
import { useNuminaWallet } from "@/components/numina/wallet/WalletProvider";

export const Route = createFileRoute("/sanctum/invoke")({
  head: () => ({
    meta: [
      { title: "The Rite — NÚMINA" },
      { name: "description", content: "Six steps to summon a Numen and bind it to your wallet." },
    ],
  }),
  component: Rite,
});

type Form = {
  name: string;
  purpose: "trading" | "monitor" | "task" | "";
  strategy: string;
  budget: number;
  maxPerTx: number;
  riskLevel: "low" | "medium" | "high";
  tithe: number;
};

const STEPS = [
  { n: "01", t: "Naming", lore: "Speak the true name. From its seed the sigil is forged." },
  { n: "02", t: "Purpose", lore: "Why does the Numen wake? Trader, watcher, or hand of tasks." },
  { n: "03", t: "Strategy", lore: "Inscribe the rules by which it will read the signs." },
  { n: "04", t: "Bounds", lore: "Budget and ceiling. The chain enforces what the rite declares." },
  { n: "05", t: "Tithe", lore: "Offer $LMN. Energy is what permits action." },
  { n: "06", t: "Seal", lore: "Sign once. The PDA is forged. The Sigil is minted." },
] as const;

function Rite() {
  const { connected, connect } = useNuminaWallet();
  const [step, setStep] = useState(0);
  const [sealed, setSealed] = useState(false);
  const [form, setForm] = useState<Form>({
    name: "",
    purpose: "",
    strategy: "",
    budget: 1,
    maxPerTx: 0.2,
    riskLevel: "low",
    tithe: 10,
  });

  const errors = useMemo(() => validate(form, step), [form, step]);
  const canAdvance = errors.length === 0;

  function update<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  if (sealed) return <SealedScene name={form.name} />;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative isolate">
        <div className="starfield absolute inset-0 -z-10 opacity-40" aria-hidden />
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="font-display text-[11px] uppercase tracking-[0.4em] text-gold">The Rite</div>
              <h1 className="font-display mt-2 text-3xl text-hi md:text-4xl">Summon a Numen</h1>
            </div>
            <Link to="/sanctum" className="text-xs uppercase tracking-[0.25em] text-mid hover:text-hi">
              ← Return to the Sanctum
            </Link>
          </div>

          {/* Stepper */}
          <ol className="mb-10 grid grid-cols-6 gap-2">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <li key={s.n} className="flex flex-col items-start gap-2">
                  <div className={`h-1 w-full rounded-full ${done ? "bg-gold" : active ? "bg-aether" : "bg-line"}`} />
                  <div className={`font-mono text-[10px] uppercase tracking-widest ${active ? "text-hi" : done ? "text-gold" : "text-low"}`}>
                    {s.n} · {s.t}
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="ritual-border rounded-3xl p-8">
              <div className="font-display text-[10px] uppercase tracking-[0.4em] text-gold">Step {STEPS[step].n}</div>
              <h2 className="font-display mt-2 text-2xl text-hi">{STEPS[step].t}</h2>
              <p className="mt-2 max-w-md text-sm italic text-mid">{STEPS[step].lore}</p>

              <div className="mt-8">
                {step === 0 && (
                  <Field label="True name" hint="Letters, numbers, spaces. 2–32 characters.">
                    <input
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="Ember of Pyth"
                      className="w-full rounded-xl border border-line bg-void/40 px-4 py-3 font-mono text-sm text-hi outline-none focus:border-aether/60"
                    />
                  </Field>
                )}
                {step === 1 && (
                  <Field label="Purpose">
                    <div className="grid gap-3 sm:grid-cols-3">
                      {(["trading", "monitor", "task"] as const).map((p) => (
                        <button
                          key={p}
                          onClick={() => update("purpose", p)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            form.purpose === p ? "border-gold/60 bg-gold/10 shadow-[var(--glow-gold)]" : "border-line bg-surface/40 hover:border-aether/50"
                          }`}
                        >
                          <div className="font-display text-sm capitalize text-hi">{p}</div>
                          <div className="mt-1 text-xs text-mid">
                            {p === "trading" ? "Reads price, takes positions." : p === "monitor" ? "Watches signal, raises alerts." : "Runs scheduled tasks."}
                          </div>
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
                {step === 2 && (
                  <Field label="Strategy" hint="Plain language for now. Templates will arrive from the Pantheon.">
                    <textarea
                      rows={5}
                      value={form.strategy}
                      onChange={(e) => update("strategy", e.target.value)}
                      placeholder="When SOL/USDC crosses 5m MA upward and oracle confidence > 0.6, buy 0.5 SOL. Sell on −1% drawdown."
                      className="w-full rounded-xl border border-line bg-void/40 px-4 py-3 font-mono text-xs text-hi outline-none focus:border-aether/60"
                    />
                  </Field>
                )}
                {step === 3 && (
                  <div className="space-y-6">
                    <Field label={`Budget · ${form.budget} SOL`} hint="Total scoped to the program PDA. Enforced on-chain.">
                      <input type="range" min={0.1} max={20} step={0.1} value={form.budget}
                        onChange={(e) => update("budget", Number(e.target.value))} className="w-full accent-aether" />
                    </Field>
                    <Field label={`Max per transaction · ${form.maxPerTx} SOL`} hint="Per-action ceiling. Cannot exceed budget.">
                      <input type="range" min={0.05} max={form.budget} step={0.05} value={form.maxPerTx}
                        onChange={(e) => update("maxPerTx", Number(e.target.value))} className="w-full accent-aether" />
                    </Field>
                    <Field label="Risk">
                      <div className="grid grid-cols-3 gap-2">
                        {(["low", "medium", "high"] as const).map((r) => (
                          <button key={r} onClick={() => update("riskLevel", r)}
                            className={`rounded-xl border px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                              form.riskLevel === r ? "border-aether/60 bg-aether/10 text-hi" : "border-line bg-surface/40 text-mid hover:text-hi"
                            }`}>
                            {r}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </div>
                )}
                {step === 4 && (
                  <Field label={`Tithe · ${form.tithe} $LMN`} hint="Energy fuels every action. Higher tithe = longer awakening.">
                    <input type="range" min={1} max={500} step={1} value={form.tithe}
                      onChange={(e) => update("tithe", Number(e.target.value))} className="w-full accent-gold" />
                    <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[10px] uppercase tracking-widest text-low">
                      <div>Est. uptime<br /><span className="text-plasma text-xs normal-case tracking-normal">~{Math.round(form.tithe * 12)}h</span></div>
                      <div>Actions left<br /><span className="text-aether text-xs normal-case tracking-normal">~{form.tithe * 50}</span></div>
                      <div>Refundable<br /><span className="text-gold text-xs normal-case tracking-normal">on revoke</span></div>
                    </div>
                  </Field>
                )}
                {step === 5 && (
                  <div className="space-y-4">
                    <Summary form={form} />
                    {!connected && (
                      <div className="rounded-2xl border border-aether/40 bg-aether/5 p-4 text-sm text-mid">
                        Bind a wallet to seal the rite.{" "}
                        <button onClick={connect} className="text-gold hover:underline">Open the gate →</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {errors.length > 0 && (
                <ul className="mt-6 space-y-1 text-xs text-danger">
                  {errors.map((e) => <li key={e}>· {e}</li>)}
                </ul>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-line/60 pt-6">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="rounded-full border border-line bg-surface/40 px-5 py-2 text-xs uppercase tracking-widest text-mid hover:text-hi disabled:opacity-40"
                >
                  ← Back
                </button>
                {step < 5 ? (
                  <button
                    onClick={() => canAdvance && setStep((s) => s + 1)}
                    disabled={!canAdvance}
                    className="rounded-full border border-aether/60 bg-aether/10 px-6 py-2.5 text-xs uppercase tracking-widest text-aether hover:bg-aether/20 disabled:opacity-40"
                  >
                    Continue →
                  </button>
                ) : (
                  <button
                    onClick={() => canAdvance && connected && setSealed(true)}
                    disabled={!canAdvance || !connected}
                    className="rounded-full border border-gold/60 bg-gradient-to-b from-gold/20 to-gold/5 px-6 py-2.5 text-xs uppercase tracking-widest text-gold hover:shadow-[var(--glow-gold)] disabled:opacity-40"
                  >
                    Seal the binding
                  </button>
                )}
              </div>
            </div>

            <aside className="lg:sticky lg:top-24 self-start">
              <div className="rounded-2xl border border-line bg-surface/40 p-6 text-center backdrop-blur">
                <div className="font-display text-[10px] uppercase tracking-[0.4em] text-gold">Sigil preview</div>
                <div className="mx-auto mt-4 flex h-56 w-56 items-center justify-center">
                  <div className={form.name ? "animate-pulse-glow" : "opacity-50"}>
                    <Sigil seed={form.name || "untitled"} size={220} />
                  </div>
                </div>
                <div className="mt-4 font-display text-lg text-hi">{form.name || "—"}</div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-low">
                  {form.purpose || "no purpose"} · {form.riskLevel}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-widest text-low">{label}</div>
      <div className="mt-2">{children}</div>
      {hint && <div className="mt-2 text-[11px] text-mid">{hint}</div>}
    </div>
  );
}

function Summary({ form }: { form: Form }) {
  const rows: [string, string][] = [
    ["Name", form.name || "—"],
    ["Purpose", form.purpose || "—"],
    ["Strategy", form.strategy ? `${form.strategy.slice(0, 60)}${form.strategy.length > 60 ? "…" : ""}` : "—"],
    ["Budget", `${form.budget} SOL`],
    ["Max / tx", `${form.maxPerTx} SOL`],
    ["Risk", form.riskLevel],
    ["Tithe", `${form.tithe} $LMN`],
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      {rows.map(([k, v], i) => (
        <div key={k} className={`flex items-center justify-between px-4 py-3 ${i % 2 ? "bg-surface/30" : "bg-surface/60"}`}>
          <span className="font-mono text-[10px] uppercase tracking-widest text-low">{k}</span>
          <span className="font-mono text-xs text-hi text-right max-w-[60%] truncate">{v}</span>
        </div>
      ))}
    </div>
  );
}

function SealedScene({ name }: { name: string }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative isolate">
        <div className="starfield absolute inset-0 -z-10" aria-hidden />
        <section className="mx-auto flex min-h-[80vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
          <div className="animate-pulse-glow">
            <Sigil seed={name} size={360} />
          </div>
          <div className="mt-10 font-display text-[11px] uppercase tracking-[0.4em] text-gold">The seal holds.</div>
          <h1 className="font-display mt-3 text-4xl text-hi md:text-5xl text-glow-gold">Your Numen is awake.</h1>
          <p className="mt-4 max-w-md text-sm text-mid">
            <span className="font-display text-hi">{name}</span> walks the chain in your name. Return to the Sanctum to watch it work.
          </p>
          <Link to="/sanctum" className="mt-10 inline-flex items-center gap-2 rounded-full border border-aether/60 bg-aether/10 px-6 py-3 text-xs uppercase tracking-widest text-aether hover:shadow-[var(--glow-aether)]">
            Return to the Sanctum →
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function validate(f: Form, step: number): string[] {
  const errs: string[] = [];
  if (step >= 0 && (f.name.trim().length < 2 || f.name.trim().length > 32))
    if (step === 0) errs.push("Name must be 2–32 characters.");
  if (step === 1 && !f.purpose) errs.push("Choose a purpose.");
  if (step === 2 && f.strategy.trim().length < 10) errs.push("Strategy needs at least 10 characters.");
  if (step === 3 && f.maxPerTx > f.budget) errs.push("Max per tx cannot exceed budget.");
  if (step === 4 && f.tithe < 1) errs.push("Tithe must be at least 1 $LMN.");
  if (step === 5) {
    if (f.name.trim().length < 2) errs.push("Name required.");
    if (!f.purpose) errs.push("Purpose required.");
    if (f.strategy.trim().length < 10) errs.push("Strategy required.");
  }
  return errs;
}