CREATE POLICY "docs own read" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "docs own insert" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "docs own update" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));
CREATE POLICY "docs own delete" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));