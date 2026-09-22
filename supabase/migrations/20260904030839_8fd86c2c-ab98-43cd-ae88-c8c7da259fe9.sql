-- Lock down storage.objects: the database_export_03_09_26 bucket contains
-- sensitive database exports. RLS is already enabled on storage.objects but
-- there were no policies, leaving access unenforced. Add explicit policies
-- that grant access ONLY to the service_role (backend/edge functions).
-- anon and authenticated get no policy => default deny.

CREATE POLICY "service_role read storage objects"
ON storage.objects FOR SELECT
TO service_role
USING (true);

CREATE POLICY "service_role write storage objects"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "service_role update storage objects"
ON storage.objects FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "service_role delete storage objects"
ON storage.objects FOR DELETE
TO service_role
USING (true);