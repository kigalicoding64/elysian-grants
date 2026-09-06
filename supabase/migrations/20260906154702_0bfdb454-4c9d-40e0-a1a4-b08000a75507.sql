ALTER TABLE public.scholarships ADD COLUMN IF NOT EXISTS slug text;

CREATE OR REPLACE FUNCTION public.slugify(v text)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT trim(both '-' from regexp_replace(lower(coalesce(v,'')), '[^a-z0-9]+', '-', 'g'))
$$;

WITH numbered AS (
  SELECT id,
         public.slugify(title) AS base,
         row_number() OVER (PARTITION BY public.slugify(title) ORDER BY created_at, id) AS rn
  FROM public.scholarships
)
UPDATE public.scholarships s
SET slug = CASE WHEN n.rn = 1 THEN NULLIF(n.base,'') ELSE NULLIF(n.base,'') || '-' || n.rn END
FROM numbered n
WHERE s.id = n.id AND (s.slug IS NULL OR s.slug = '');

UPDATE public.scholarships SET slug = 'scholarship-' || left(id::text, 8) WHERE slug IS NULL OR slug = '';

CREATE UNIQUE INDEX IF NOT EXISTS scholarships_slug_key ON public.scholarships (slug);

CREATE OR REPLACE FUNCTION public.scholarships_set_slug()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE base text; candidate text; i int := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base := NULLIF(public.slugify(NEW.title), '');
    IF base IS NULL THEN base := 'scholarship'; END IF;
    candidate := base;
    WHILE EXISTS (SELECT 1 FROM public.scholarships WHERE slug = candidate AND id <> NEW.id) LOOP
      i := i + 1;
      candidate := base || '-' || i;
    END LOOP;
    NEW.slug := candidate;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS scholarships_set_slug_trg ON public.scholarships;
CREATE TRIGGER scholarships_set_slug_trg
BEFORE INSERT OR UPDATE OF title, slug ON public.scholarships
FOR EACH ROW EXECUTE FUNCTION public.scholarships_set_slug();

UPDATE public.scholarships
SET image_url = '/covers/cover-' || ((abs(hashtext(id::text)) % 6) + 1) || '.jpg'
WHERE image_url IS NULL OR image_url = '';