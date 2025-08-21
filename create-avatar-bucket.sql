-- Create storage bucket for avatar images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies for avatars
CREATE POLICY "Anyone can view avatar images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatar images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own avatar images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own avatar images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'avatars' AND auth.uid() = owner);