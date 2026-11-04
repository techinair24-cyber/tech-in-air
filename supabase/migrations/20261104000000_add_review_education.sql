ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS college_name text,
  ADD COLUMN IF NOT EXISTS education text;

CREATE OR REPLACE FUNCTION public.create_customer_review(
  p_customer_name text,
  p_college_name text,
  p_education text,
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
    OR length(btrim(coalesce(p_college_name, ''))) NOT BETWEEN 1 AND 120
    OR p_education IS NULL
    OR p_education NOT IN ('Engineering', 'Diploma')
    OR length(btrim(coalesce(p_project_type, ''))) = 0
    OR p_rating IS NULL
    OR p_rating NOT BETWEEN 1 AND 5
    OR length(btrim(coalesce(p_review_text, ''))) NOT BETWEEN 10 AND 1000
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

  RETURN v_review_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_customer_review(text, text, text, text, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_customer_review(text, text, text, text, integer, text) TO anon, authenticated;
