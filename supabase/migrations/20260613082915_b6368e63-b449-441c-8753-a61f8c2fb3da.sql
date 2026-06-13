-- handle_new_user is a trigger fn only — no one should RPC it
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies; authenticated must keep EXECUTE,
-- but anon (and the public pseudo-role) should not be able to call it.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;