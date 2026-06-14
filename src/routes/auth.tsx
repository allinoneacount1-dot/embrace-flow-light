import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/useAuth";
import { Header } from "@/components/numina/Header";
import { Footer } from "@/components/numina/Footer";
import { Sigil } from "@/components/numina/Sigil";

const searchSchema = z.object({
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Enter the Sanctum — NÚMINA" },
      { name: "description", content: "Sign in or summon a new sigil to invoke your Numen." },
    ],
  }),
  component: AuthPage,
});

const credsSchema = z.object({
  email: z.string().trim().email("Speak a real glyph (email).").max(255),
  password: z.string().min(8, "At least 8 runes.").max(72),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const { redirect } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<"google" | "email" | null>(null);
  const isPopup = !!window.opener;

  useEffect(() => {
    if (!loading && user) {
      if (isPopup) {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
          if (!error && session) {
            window.opener.postMessage({ type: 'AUTH_SUCCESS', session }, window.location.origin);
            window.close();
          }
        });
      } else {
        const dest = redirect && redirect.startsWith("/") ? redirect : "/sanctum";
        navigate({ to: dest, replace: true });
      }
    }
  }, [loading, user, redirect, navigate, isPopup]);

  async function withEmail(e: React.FormEvent) {
    e.preventDefault();
    const parsed = credsSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }
    setBusy("email");
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: window.location.origin + "/sanctum" },
        });
        if (error) throw error;
        toast.success("Sigil etched", { description: "Check your email to confirm, then sign in." });
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (error) throw error;
        // success handled via useEffect
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("The rite was refused", { description: msg });
    } finally {
      setBusy(null);
    }
  }

  async function withGoogle() {
    setBusy("google");
    try {
      const redirectTo = !!window.opener
        ? `${window.location.origin}${window.location.pathname}${window.location.search}`
        : `${window.location.origin}/sanctum`;
      const result = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      if (result.error) throw result.error instanceof Error ? result.error : new Error(String(result.error));
      // result.redirected → browser redirects, nothing to do.
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      toast.error("Google refused the rite", { description: msg });
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="relative isolate">
        <div className="starfield absolute inset-0 -z-10 opacity-40" aria-hidden />
        <section className="mx-auto grid min-h-[80vh] max-w-5xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_400px]">
          <div className="hidden lg:block text-center">
            <div className="mx-auto animate-pulse-glow w-fit">
              <Sigil seed={email || "altar-gate"} size={280} />
            </div>
            <div className="mt-8 font-display text-[11px] uppercase tracking-[0.4em] text-gold">The Gate</div>
            <p className="mt-3 font-display text-2xl text-hi">Cross the threshold.</p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-mid">
              Your sigil is the key. Once you cross, the Sanctum will remember you between rites.
            </p>
          </div>

          <div className="ritual-border rounded-3xl p-8">
            <div className="font-display text-[10px] uppercase tracking-[0.4em] text-gold">
              {mode === "signin" ? "Return to the altar" : "Etch a new sigil"}
            </div>
            <h1 className="font-display mt-2 text-2xl text-hi">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h1>

            <button
              onClick={withGoogle}
              disabled={busy !== null}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm text-hi hover:border-aether/60 disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.8.54-1.84.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.97 10.72A5.4 5.4 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.95L3.97 7.28C4.68 5.16 6.66 3.58 9 3.58z"/>
              </svg>
              {busy === "google" ? "Opening Google…" : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-line" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-low">or</span>
              <div className="h-px flex-1 bg-line" />
            </div>

            <form onSubmit={withEmail} className="space-y-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-low">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="mt-2 w-full rounded-xl border border-line bg-void/40 px-4 py-3 font-mono text-sm text-hi outline-none focus:border-aether/60"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-low">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="mt-2 w-full rounded-xl border border-line bg-void/40 px-4 py-3 font-mono text-sm text-hi outline-none focus:border-aether/60"
                />
              </div>
              <button
                type="submit"
                disabled={busy !== null}
                className="w-full rounded-full border border-gold/60 bg-gradient-to-b from-gold/20 to-gold/5 px-6 py-3 text-xs uppercase tracking-widest text-gold hover:shadow-[var(--glow-gold)] disabled:opacity-50"
              >
                {busy === "email" ? "Invoking…" : mode === "signin" ? "Enter the Sanctum" : "Etch the sigil"}
              </button>
            </form>

            <button
              onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
              className="mt-6 w-full text-center text-xs text-mid hover:text-hi"
            >
              {mode === "signin" ? "No sigil yet? Etch one →" : "Already inscribed? Sign in →"}
            </button>

            <p className="mt-6 text-center text-[11px] text-low">
              <Link to="/" className="hover:text-mid">← Return to the threshold</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}