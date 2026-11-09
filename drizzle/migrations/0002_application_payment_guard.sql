CREATE OR REPLACE FUNCTION public.applications_payment_guard()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.fee_usd := CASE WHEN NEW.tier = 'review' THEN 12.50 ELSE 25.00 END;
  NEW.payment_status := 'unbilled';
  NEW.momo_reference := NULL;
  NEW.fee_local := NULL;
  NEW.fee_currency := NULL;
  NEW.payment_requested_at := NULL;
  NEW.paid_at := NULL;
  RETURN NEW;
END $$;
CREATE TRIGGER applications_payment_guard BEFORE INSERT ON public.applications
FOR EACH ROW EXECUTE FUNCTION public.applications_payment_guard();