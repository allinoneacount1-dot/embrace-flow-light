
-- Profiles: one row per wallet
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet text UNIQUE NOT NULL,
  handle text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are publicly readable"
  ON public.profiles FOR SELECT
  USING (true);

-- Writes are gated until wallet-auth bridge is wired in; placeholder denies authenticated writes
CREATE POLICY "Profile writes via server only (placeholder)"
  ON public.profiles FOR INSERT
  TO authenticated WITH CHECK (false);

CREATE POLICY "Profile updates via server only (placeholder)"
  ON public.profiles FOR UPDATE
  TO authenticated USING (false) WITH CHECK (false);

CREATE POLICY "Profile deletes via server only (placeholder)"
  ON public.profiles FOR DELETE
  TO authenticated USING (false);

-- Numina: one row per agent
CREATE TABLE public.numina (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_wallet text NOT NULL REFERENCES public.profiles(wallet) ON DELETE CASCADE,
  name text NOT NULL,
  sigil_seed text NOT NULL,
  program_account text,
  nft_mint text,
  purpose text NOT NULL DEFAULT 'monitor',
  status text NOT NULL DEFAULT 'silence',
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT numina_status_check CHECK (status IN ('awake','silence','failed')),
  CONSTRAINT numina_purpose_check CHECK (purpose IN ('trading','monitor','task'))
);

CREATE INDEX numina_owner_wallet_idx ON public.numina (owner_wallet);
CREATE INDEX numina_status_idx ON public.numina (status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.numina TO authenticated;
GRANT ALL ON public.numina TO service_role;
ALTER TABLE public.numina ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Numina writes via server only (placeholder)"
  ON public.numina FOR ALL
  TO authenticated USING (false) WITH CHECK (false);

-- Actions: per-agent log
CREATE TABLE public.actions (
  id bigserial PRIMARY KEY,
  numen_id uuid NOT NULL REFERENCES public.numina(id) ON DELETE CASCADE,
  kind text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  tx_sig text,
  pnl numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT actions_kind_check CHECK (kind IN ('decision','trade','alert','error'))
);

CREATE INDEX actions_numen_id_created_idx ON public.actions (numen_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.actions TO authenticated;
GRANT ALL ON public.actions TO service_role;
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Actions writes via server only (placeholder)"
  ON public.actions FOR ALL
  TO authenticated USING (false) WITH CHECK (false);

-- Strategies: Pantheon marketplace
CREATE TABLE public.strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_wallet text REFERENCES public.profiles(wallet) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  rules jsonb NOT NULL DEFAULT '{}'::jsonb,
  risk_level text NOT NULL DEFAULT 'medium',
  clones integer NOT NULL DEFAULT 0,
  roi numeric,
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT strategies_risk_check CHECK (risk_level IN ('low','medium','high'))
);

CREATE INDEX strategies_public_idx ON public.strategies (is_public);
CREATE INDEX strategies_author_idx ON public.strategies (author_wallet);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.strategies TO authenticated;
GRANT SELECT ON public.strategies TO anon;
GRANT ALL ON public.strategies TO service_role;
ALTER TABLE public.strategies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public strategies are readable by anyone"
  ON public.strategies FOR SELECT
  USING (is_public = true);

CREATE POLICY "Strategy writes via server only (placeholder)"
  ON public.strategies FOR INSERT
  TO authenticated WITH CHECK (false);

CREATE POLICY "Strategy updates via server only (placeholder)"
  ON public.strategies FOR UPDATE
  TO authenticated USING (false) WITH CHECK (false);

CREATE POLICY "Strategy deletes via server only (placeholder)"
  ON public.strategies FOR DELETE
  TO authenticated USING (false);

-- Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_numina_updated_at
  BEFORE UPDATE ON public.numina
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER set_strategies_updated_at
  BEFORE UPDATE ON public.strategies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
