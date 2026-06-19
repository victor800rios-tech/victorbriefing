
-- Lock down SECURITY DEFINER helpers from being callable via the Data API
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_admin() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;

-- Storage policies for briefing-uploads bucket
CREATE POLICY "anyone upload briefing files"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'briefing-uploads');

CREATE POLICY "admins read briefing files storage"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'briefing-uploads' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "admins delete briefing files storage"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'briefing-uploads' AND public.has_role(auth.uid(), 'admin'));
