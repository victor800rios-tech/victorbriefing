GRANT INSERT ON public.briefings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.briefings TO authenticated;
GRANT ALL ON public.briefings TO service_role;

GRANT INSERT ON public.briefing_files TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.briefing_files TO authenticated;
GRANT ALL ON public.briefing_files TO service_role;

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;