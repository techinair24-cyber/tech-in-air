ALTER TABLE public.review_edit_tokens
  ADD COLUMN IF NOT EXISTS expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS revoked_at timestamptz;

UPDATE public.review_edit_tokens
SET expires_at = now() + interval '90 days'
WHERE expires_at IS NULL;

ALTER TABLE public.review_edit_tokens
  ALTER COLUMN expires_at SET DEFAULT (now() + interval '90 days'),
  ALTER COLUMN expires_at SET NOT NULL;

CREATE OR REPLACE FUNCTION public.create_customer_review_with_edit_token(
  p_customer_name text,
  p_college_name text,
  p_education text,
  p_project_type text,
  p_rating integer,
  p_review_text text,
  p_edit_token_hash text
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
    OR length(btrim(coalesce(p_college_name, ''))) NOT BETWEEN 1 AND 120
    OR p_education IS NULL
    OR p_education NOT IN ('Engineering', 'Diploma')
    OR length(btrim(coalesce(p_project_type, ''))) NOT BETWEEN 1 AND 200
    OR p_rating IS NULL
    OR p_rating NOT BETWEEN 1 AND 5
    OR length(btrim(coalesce(p_review_text, ''))) NOT BETWEEN 10 AND 1000
    OR p_edit_token_hash IS NULL
    OR p_edit_token_hash !~ '^[0-9a-f]{64}$'
  THEN
    RAISE EXCEPTION 'Invalid customer review.';
  END IF;

  INSERT INTO public.reviews (
    customer_name,
    college_name,
    education,
    project_type,
    rating,
    review_text,
    status
  )
  VALUES (
    btrim(p_customer_name),
    btrim(p_college_name),
    p_education,
    btrim(p_project_type),
    p_rating,
    btrim(p_review_text),
    'pending'
  )
  RETURNING id::text INTO v_review_id;

  INSERT INTO public.review_edit_tokens (review_id, token_hash, expires_at)
  VALUES (v_review_id, p_edit_token_hash, now() + interval '90 days');

  RETURN v_review_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_review_with_edit_token(text, text, text, text, integer, text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_review_with_edit_token(text, text, text, text, integer, text, text)
  TO service_role;

CREATE OR REPLACE FUNCTION public.replace_review_edit_token(
  p_review_id text,
  p_token_hash text
)
RETURNS timestamptz
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_expires_at timestamptz := now() + interval '90 days';
BEGIN
  IF p_review_id IS NULL
    OR p_token_hash IS NULL
    OR p_token_hash !~ '^[0-9a-f]{64}$'
    OR NOT EXISTS (
      SELECT 1
      FROM public.reviews
      WHERE id::text = p_review_id
    )
  THEN
    RAISE EXCEPTION 'Unable to replace the review edit token.';
  END IF;

  INSERT INTO public.review_edit_tokens (review_id, token_hash, expires_at, revoked_at)
  VALUES (p_review_id, p_token_hash, v_expires_at, NULL)
  ON CONFLICT (review_id) DO UPDATE
  SET token_hash = EXCLUDED.token_hash,
      expires_at = EXCLUDED.expires_at,
      revoked_at = NULL
  RETURNING expires_at INTO v_expires_at;

  RETURN v_expires_at;
END;
$$;

REVOKE ALL ON FUNCTION public.replace_review_edit_token(text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.replace_review_edit_token(text, text)
  TO service_role;

CREATE TABLE IF NOT EXISTS public.review_management_rate_limits (
  key_hash text PRIMARY KEY,
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL CHECK (request_count > 0)
);

CREATE INDEX IF NOT EXISTS review_management_rate_limits_window_started_at_idx
  ON public.review_management_rate_limits (window_started_at);

ALTER TABLE public.review_management_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.review_management_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.review_management_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_review_management_rate_limit(
  p_key_hash text,
  p_max_requests integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_request_count integer;
  v_now timestamptz := clock_timestamp();
BEGIN
  IF p_key_hash IS NULL
    OR p_key_hash !~ '^[0-9a-f]{64}$'
    OR p_max_requests NOT BETWEEN 1 AND 1000
    OR p_window_seconds NOT BETWEEN 1 AND 86400
  THEN
    RAISE EXCEPTION 'Invalid review rate limit request.';
  END IF;

  IF mod(extract(epoch FROM v_now)::bigint, 100) = 0 THEN
    DELETE FROM public.review_management_rate_limits
    WHERE window_started_at < v_now - interval '1 day';
  END IF;

  INSERT INTO public.review_management_rate_limits AS rate_limit (
    key_hash,
    window_started_at,
    request_count
  )
  VALUES (p_key_hash, v_now, 1)
  ON CONFLICT (key_hash) DO UPDATE
  SET window_started_at = CASE
        WHEN rate_limit.window_started_at <= v_now - make_interval(secs => p_window_seconds)
          THEN v_now
        ELSE rate_limit.window_started_at
      END,
      request_count = CASE
        WHEN rate_limit.window_started_at <= v_now - make_interval(secs => p_window_seconds)
          THEN 1
        ELSE rate_limit.request_count + 1
      END
  RETURNING request_count
  INTO v_request_count;

  RETURN v_request_count <= p_max_requests;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_review_management_rate_limit(text, integer, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_review_management_rate_limit(text, integer, integer)
  TO service_role;

CREATE OR REPLACE FUNCTION public.reserve_review_management_photo_upload(
  p_review_id text,
  p_object_path text,
  p_keep_photo_count integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_photo_paths text[];
  v_reservation_count integer;
BEGIN
  IF p_review_id IS NULL
    OR p_object_path IS NULL
    OR p_keep_photo_count IS NULL
    OR p_keep_photo_count NOT BETWEEN 0 AND 5
    OR split_part(p_object_path, '/', 1) <> p_review_id
    OR array_length(string_to_array(p_object_path, '/'), 1) <> 2
    OR split_part(p_object_path, '/', 2) !~* '^[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'
  THEN
    RAISE EXCEPTION 'Invalid review photo reservation.';
  END IF;

  SELECT photo_paths INTO v_photo_paths
  FROM public.reviews
  WHERE id::text = p_review_id
  FOR UPDATE;

  IF NOT FOUND OR p_keep_photo_count > cardinality(coalesce(v_photo_paths, ARRAY[]::text[])) THEN
    RAISE EXCEPTION 'This review cannot accept photo uploads.';
  END IF;

  SELECT count(*) INTO v_reservation_count
  FROM public.review_photo_uploads
  WHERE review_id = p_review_id;

  IF p_keep_photo_count + v_reservation_count >= 5 THEN
    RETURN false;
  END IF;

  INSERT INTO public.review_photo_uploads (review_id, object_path)
  VALUES (p_review_id, p_object_path);

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.reserve_review_management_photo_upload(text, text, integer)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.reserve_review_management_photo_upload(text, text, integer)
  TO service_role;
