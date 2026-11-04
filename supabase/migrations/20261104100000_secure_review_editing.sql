CREATE TABLE IF NOT EXISTS public.review_edit_tokens (
  review_id text PRIMARY KEY,
  token_hash text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.review_edit_tokens ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.review_edit_tokens FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.review_edit_tokens TO service_role;
REVOKE INSERT, UPDATE, DELETE ON public.reviews FROM PUBLIC, anon, authenticated;

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

  INSERT INTO public.review_edit_tokens (review_id, token_hash)
  VALUES (v_review_id, p_edit_token_hash);

  RETURN v_review_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_review_with_edit_token(text, text, text, text, integer, text, text)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_customer_review_with_edit_token(text, text, text, text, integer, text, text)
  TO service_role;

REVOKE ALL ON FUNCTION public.create_customer_review(text, text, integer, text)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.create_customer_review(text, text, text, text, integer, text)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.reserve_review_photo_upload(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.release_review_photo_upload(text, text)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.attach_review_photos(text, text[])
  FROM PUBLIC, anon, authenticated;
