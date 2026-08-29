CREATE TYPE public.app_role AS ENUM ('student','admin');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'student',
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'), NEW.email)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student') ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.scholarships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  university TEXT NOT NULL,
  country TEXT NOT NULL,
  degree_levels TEXT[] NOT NULL DEFAULT '{}',
  funding_type TEXT NOT NULL DEFAULT 'full' CHECK (funding_type IN ('full','partial')),
  coverage_details TEXT,
  official_link TEXT,
  deadline DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published','draft')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.scholarships TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scholarships TO authenticated;
GRANT ALL ON public.scholarships TO service_role;
ALTER TABLE public.scholarships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published readable" ON public.scholarships FOR SELECT TO anon, authenticated USING (status = 'published' OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage scholarships" ON public.scholarships FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scholarship_id UUID REFERENCES public.scholarships(id) ON DELETE SET NULL,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  app_type TEXT NOT NULL DEFAULT 'managed' CHECK (app_type IN ('managed','direct')),
  status TEXT NOT NULL DEFAULT 'DOC_REVIEW' CHECK (status IN ('DOC_REVIEW','DOC_APPROVED','PREP_IN_PROGRESS','SUBMITTED','ACCEPTED','REJECTED')),
  official_app_id TEXT,
  proof_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.applications TO authenticated;
GRANT ALL ON public.applications TO service_role;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own applications read" ON public.applications FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own applications insert" ON public.applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admins update applications" ON public.applications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins delete applications" ON public.applications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_type TEXT,
  file_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','revision_required')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own documents read" ON public.documents FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own documents insert" ON public.documents FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own documents update" ON public.documents FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin')) WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "own documents delete" ON public.documents FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

INSERT INTO public.scholarships (title, university, country, degree_levels, funding_type, coverage_details, official_link, deadline, status) VALUES
('Erasmus Mundus MARIHE Master Scholarship 2027','Consortium of 7 Universities (Austria, Finland, Germany, Hungary, Portugal, China, India)','Global / Multi-Country Europe & Asia',ARRAY['Master''s'],'full','100% Tuition waiver, €1,400 monthly living stipend, full airfare travel allowance, and comprehensive health insurance.','https://www.marihe.eu/','2026-12-01','published'),
('Ministry of Health (MoH) Nursing & Midwifery Scholarships','Kibogora Polytechnic (KP)','Rwanda',ARRAY['Undergraduate'],'partial','Government-sponsored tuition funding under the Rwanda Ministry of Health 4x4 Healthcare Workforce Development Strategy.','https://kp.ac.rw/','2026-09-15','published'),
('Ministry of Health 54 Sponsored Health Scholarships','Adventist University of Central Africa (AUCA)','Rwanda',ARRAY['Undergraduate'],'full','54 Full tuition scholarships (36 for Midwifery, 18 for Nursing) funded directly by the Ministry of Health.','https://auca.ac.rw/','2026-09-15','published'),
('ALU Full Mastercard Foundation & Mandela Scholarships 2027','African Leadership University (ALU)','Rwanda',ARRAY['Undergraduate'],'full','Full tuition coverage, monthly living stipend, laptop computer, flight tickets, and leadership mentorship (Mastercard Track) OR $3,000-$4,000/yr tuition grant (Mandela Track).','https://www.alueducation.com/apply-now/','2026-11-30','published');