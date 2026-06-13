DROP POLICY IF EXISTS "Profiles are publicly readable" ON public.profiles;
CREATE POLICY "Profile reads via server only (placeholder)"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (false);