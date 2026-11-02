ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS photo_paths text[] NOT NULL DEFAULT '{}';

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

CREATE TABLE IF NOT EXISTS public.review_photo_uploads (
  review_id text NOT NULL,
  object_path text PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.review_photo_uploads ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.review_photo_uploads FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_customer_review(
  p_customer_name text,
  p_project_type text,
  p_rating integer,
  p_review_text text
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_review_id text;
BEGIN
  IF length(btrim(coalesce(p_customer_name, ''))) NOT BETWEEN 1 AND 120
    OR length(btrim(coalesce(p_project_type, ''))) = 0
    OR p_rating IS NULL
    OR p_rating NOT BETWEEN 1 AND 5
    OR length(btrim(coalesce(p_review_text, ''))) NOT BETWEEN 10 AND 1000
  THEN
    RAISE EXCEPTION 'Invalid customer review.';
  END IF;

  INSERT INTO public.reviews (customer_name, project_type, rating, review_text, status)
  VALUES (btrim(p_customer_name), btrim(p_project_type), p_rating, btrim(p_review_text), 'pending')
  RETURNING id::text INTO v_review_id;

  RETURN v_review_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.reserve_review_photo_upload(
  p_review_id text,
  p_object_path text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_photo_count integer;
BEGIN
  PERFORM 1
  FROM public.reviews
  WHERE id::text = p_review_id
    AND status = 'pending'
    AND cardinality(photo_paths) = 0
  FOR UPDATE;

  IF NOT FOUND
    OR split_part(p_object_path, '/', 1) <> p_review_id
    OR array_length(string_to_array(p_object_path, '/'), 1) <> 2
    OR split_part(p_object_path, '/', 2) !~* '^[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  THEN
    RAISE EXCEPTION 'This review cannot accept photo uploads.';
  END IF;

  SELECT count(*) INTO v_photo_count
  FROM public.review_photo_uploads
  WHERE review_id = p_review_id;

  IF v_photo_count >= 5 THEN
    RAISE EXCEPTION 'A review can include no more than five photos.';
  END IF;

  INSERT INTO public.review_photo_uploads (review_id, object_path)
  VALUES (p_review_id, p_object_path);
END;
$$;

CREATE OR REPLACE FUNCTION public.release_review_photo_upload(
  p_review_id text,
  p_object_path text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.review_photo_uploads AS reservation
  WHERE reservation.review_id = p_review_id
    AND reservation.object_path = p_object_path
    AND EXISTS (
      SELECT 1
      FROM public.reviews AS review
      WHERE review.id::text = p_review_id
        AND review.status = 'pending'
        AND cardinality(review.photo_paths) = 0
    )
    AND NOT EXISTS (
      SELECT 1
      FROM storage.objects AS object
      WHERE object.bucket_id = 'review-photos'
        AND object.name = p_object_path
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.attach_review_photos(
  p_review_id text,
  p_photo_paths text[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_photo_paths IS NULL
    OR cardinality(p_photo_paths) NOT BETWEEN 1 AND 5
    OR cardinality(p_photo_paths) <> (
      SELECT count(DISTINCT path)
      FROM unnest(p_photo_paths) AS requested(path)
    )
  THEN
    RAISE EXCEPTION 'A review must include between one and five unique photos.';
  END IF;

  PERFORM 1
  FROM public.reviews
  WHERE id::text = p_review_id
    AND status = 'pending'
    AND cardinality(photo_paths) = 0
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'This review cannot accept photos.';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM unnest(p_photo_paths) AS requested(path)
    LEFT JOIN public.review_photo_uploads AS reservation
      ON reservation.review_id = p_review_id
      AND reservation.object_path = requested.path
    LEFT JOIN storage.objects AS object
      ON object.bucket_id = 'review-photos'
      AND object.name = requested.path
    WHERE split_part(requested.path, '/', 1) <> p_review_id
      OR reservation.object_path IS NULL
      OR object.name IS NULL
      OR coalesce((object.metadata->>'size')::bigint, 0) > 5242880
      OR lower(coalesce(object.metadata->>'mimetype', '')) NOT IN (
        'image/jpeg',
        'image/png',
        'image/webp'
      )
  ) THEN
    RAISE EXCEPTION 'One or more uploaded photos failed validation.';
  END IF;

  UPDATE public.reviews
  SET photo_paths = p_photo_paths
  WHERE id::text = p_review_id
    AND status = 'pending';

  DELETE FROM public.review_photo_uploads
  WHERE review_id = p_review_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_upload_review_photo(p_object_path text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.review_photo_uploads AS reservation
    JOIN public.reviews AS review
      ON review.id::text = reservation.review_id
    WHERE reservation.object_path = p_object_path
      AND review.status = 'pending'
      AND cardinality(review.photo_paths) = 0
  );
$$;

REVOKE ALL ON FUNCTION public.create_customer_review(text, text, integer, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.reserve_review_photo_upload(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.release_review_photo_upload(text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.attach_review_photos(text, text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_upload_review_photo(text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_customer_review(text, text, integer, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_review_photo_upload(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.release_review_photo_upload(text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.attach_review_photos(text, text[]) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_upload_review_photo(text) TO anon, authenticated;

DROP POLICY IF EXISTS "Approved review photos are readable" ON storage.objects;
CREATE POLICY "Approved review photos are readable"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (
  bucket_id = 'review-photos'
  AND (
    (auth.jwt()->'app_metadata'->>'role') = 'admin'
    OR EXISTS (
      SELECT 1
      FROM public.reviews AS review
      WHERE review.id::text = split_part(storage.objects.name, '/', 1)
        AND review.status = 'approved'
        AND storage.objects.name = ANY(review.photo_paths)
    )
  )
);

DROP POLICY IF EXISTS "Reserved review photos can be uploaded" ON storage.objects;
CREATE POLICY "Reserved review photos can be uploaded"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'review-photos'
  AND public.can_upload_review_photo(storage.objects.name)
);

DROP POLICY IF EXISTS "Admins can delete review photos" ON storage.objects;
CREATE POLICY "Admins can delete review photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'review-photos'
  AND (auth.jwt()->'app_metadata'->>'role') = 'admin'
);
