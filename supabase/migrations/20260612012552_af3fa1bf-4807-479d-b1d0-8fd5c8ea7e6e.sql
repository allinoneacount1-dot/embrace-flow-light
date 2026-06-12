CREATE TABLE public.activity (
  id BIGSERIAL PRIMARY KEY,
  numen TEXT NOT NULL,
  kind TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.activity TO anon, authenticated;
GRANT ALL ON public.activity TO service_role;

ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activity is publicly readable"
  ON public.activity FOR SELECT
  USING (true);

-- Realtime
ALTER TABLE public.activity REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity;

-- Seed a few entries so the stream isn't empty
INSERT INTO public.activity (numen, kind, text) VALUES
  ('Ember of Pyth', 'trade', 'Buy 1.8 SOL · 142.04 USDC'),
  ('Watcher in the Liquidity', 'alert', 'Whale tx · 218 SOL → Orca'),
  ('Choir of Mean Reversion', 'decision', 'Hold · z-score 0.4'),
  ('Ember of Pyth', 'decision', 'Signal: 5m MA bullish cross');