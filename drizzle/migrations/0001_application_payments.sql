ALTER TABLE public.applications
  ADD COLUMN IF NOT EXISTS tier text NOT NULL DEFAULT 'managed',
  ADD COLUMN IF NOT EXISTS fee_usd numeric(10,2) NOT NULL DEFAULT 25.00,
  ADD COLUMN IF NOT EXISTS fee_local numeric(12,2),
  ADD COLUMN IF NOT EXISTS fee_currency text,
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unbilled',
  ADD COLUMN IF NOT EXISTS momo_reference text,
  ADD COLUMN IF NOT EXISTS payment_phone text,
  ADD COLUMN IF NOT EXISTS payment_requested_at timestamptz,
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;
ALTER TABLE public.applications ADD CONSTRAINT applications_tier_check CHECK (tier IN ('review','managed'));
ALTER TABLE public.applications ADD CONSTRAINT applications_payment_status_check CHECK (payment_status IN ('unbilled','pending','paid','failed','waived'));