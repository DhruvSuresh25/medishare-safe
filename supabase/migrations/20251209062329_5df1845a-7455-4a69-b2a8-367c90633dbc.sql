-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('donor', 'pharmacist', 'recipient', 'admin');

-- Create enum for medicine status
CREATE TYPE public.medicine_status AS ENUM ('pending', 'verified', 'rejected', 'claimed', 'picked_up', 'delivered', 'disposed');

-- Create enum for verification status
CREATE TYPE public.verification_status AS ENUM ('pending', 'approved', 'rejected', 'needs_info');

-- Create enum for pickup status
CREATE TYPE public.pickup_status AS ENUM ('scheduled', 'confirmed', 'in_transit', 'completed', 'cancelled');

-- Create enum for recipient type
CREATE TYPE public.recipient_type AS ENUM ('pharmacy', 'ngo', 'clinic', 'hospital', 'take_back_center');

-- Create enum for medicine schedule
CREATE TYPE public.medicine_schedule AS ENUM ('otc', 'schedule_h', 'schedule_h1', 'schedule_x', 'controlled');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  id_type TEXT,
  id_number TEXT,
  id_document_url TEXT,
  kyc_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Recipients (organizations)
CREATE TABLE public.recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  organization_name TEXT NOT NULL,
  organization_type recipient_type NOT NULL,
  license_number TEXT,
  license_document_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  service_areas TEXT[],
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pharmacist details
CREATE TABLE public.pharmacists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  license_number TEXT NOT NULL,
  license_document_url TEXT,
  pharmacy_name TEXT,
  pharmacy_address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medicines table
CREATE TABLE public.medicines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  drug_name TEXT NOT NULL,
  generic_name TEXT,
  manufacturer TEXT,
  batch_number TEXT,
  mrp DECIMAL(10,2),
  expiry_date DATE,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit TEXT DEFAULT 'units',
  schedule medicine_schedule DEFAULT 'otc',
  is_sealed BOOLEAN DEFAULT TRUE,
  is_original_packaging BOOLEAN DEFAULT TRUE,
  status medicine_status DEFAULT 'pending',
  rejection_reason TEXT,
  notes TEXT,
  ocr_raw_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medicine images
CREATE TABLE public.medicine_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  image_type TEXT DEFAULT 'package',
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verifications (pharmacist reviews)
CREATE TABLE public.verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  pharmacist_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status verification_status NOT NULL,
  checklist JSONB,
  notes TEXT,
  rejection_reason TEXT,
  additional_images_requested BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims (recipient claims on medicines)
CREATE TABLE public.claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE NOT NULL,
  recipient_id UUID REFERENCES public.recipients(id) ON DELETE CASCADE NOT NULL,
  quantity_claimed INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pickup requests
CREATE TABLE public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE CASCADE,
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES public.recipients(id),
  pickup_address TEXT NOT NULL,
  pickup_city TEXT NOT NULL,
  pickup_state TEXT NOT NULL,
  pickup_pincode TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  preferred_date DATE,
  preferred_time_slot TEXT,
  status pickup_status DEFAULT 'scheduled',
  qr_code TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pickup tracking (chain of custody)
CREATE TABLE public.pickup_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pickup_request_id UUID REFERENCES public.pickup_requests(id) ON DELETE CASCADE NOT NULL,
  event_type TEXT NOT NULL,
  event_description TEXT,
  location TEXT,
  scanned_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disposal records
CREATE TABLE public.disposal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE SET NULL,
  disposal_reason TEXT NOT NULL,
  disposal_method TEXT,
  disposal_partner TEXT,
  certificate_url TEXT,
  disposed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banned substances list
CREATE TABLE public.banned_substances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  substance_name TEXT NOT NULL UNIQUE,
  category TEXT,
  reason TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Donation receipts
CREATE TABLE public.donation_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  medicine_id UUID REFERENCES public.medicines(id) ON DELETE SET NULL,
  receipt_number TEXT UNIQUE NOT NULL,
  amount_equivalent DECIMAL(10,2),
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disposal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banned_substances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donation_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = TRUE
  )
$$;

-- Function to get user's roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS app_role[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ARRAY_AGG(role)
  FROM public.user_roles
  WHERE user_id = _user_id
    AND is_active = TRUE
$$;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_recipients_updated_at BEFORE UPDATE ON public.recipients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pharmacists_updated_at BEFORE UPDATE ON public.pharmacists FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON public.medicines FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_pickup_requests_updated_at BEFORE UPDATE ON public.pickup_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: Users can view/edit their own, admins can view all
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- User roles: Only admins can manage, users can view their own
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can request donor role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id AND role = 'donor');

-- Recipients: Own org or admin
CREATE POLICY "Recipients can view own org" ON public.recipients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Recipients can update own org" ON public.recipients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can register as recipient" ON public.recipients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all recipients" ON public.recipients FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update recipients" ON public.recipients FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Verified recipients visible to pharmacists" ON public.recipients FOR SELECT USING (is_verified = TRUE AND public.has_role(auth.uid(), 'pharmacist'));

-- Pharmacists: Own record or admin
CREATE POLICY "Pharmacists can view own record" ON public.pharmacists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Pharmacists can update own record" ON public.pharmacists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can register as pharmacist" ON public.pharmacists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all pharmacists" ON public.pharmacists FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pharmacists" ON public.pharmacists FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Medicines: Donors see own, pharmacists see pending, recipients see verified, admins see all
CREATE POLICY "Donors can view own medicines" ON public.medicines FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Donors can insert medicines" ON public.medicines FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update own pending medicines" ON public.medicines FOR UPDATE USING (auth.uid() = donor_id AND status = 'pending');
CREATE POLICY "Pharmacists can view medicines for verification" ON public.medicines FOR SELECT USING (public.has_role(auth.uid(), 'pharmacist'));
CREATE POLICY "Pharmacists can update medicine status" ON public.medicines FOR UPDATE USING (public.has_role(auth.uid(), 'pharmacist'));
CREATE POLICY "Recipients can view verified medicines" ON public.medicines FOR SELECT USING (status = 'verified' AND public.has_role(auth.uid(), 'recipient'));
CREATE POLICY "Admins can view all medicines" ON public.medicines FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all medicines" ON public.medicines FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Medicine images: Same as medicines
CREATE POLICY "View images of accessible medicines" ON public.medicine_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.medicines m WHERE m.id = medicine_id AND (
    m.donor_id = auth.uid() OR
    public.has_role(auth.uid(), 'pharmacist') OR
    public.has_role(auth.uid(), 'admin') OR
    (m.status = 'verified' AND public.has_role(auth.uid(), 'recipient'))
  ))
);
CREATE POLICY "Donors can insert images" ON public.medicine_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.medicines m WHERE m.id = medicine_id AND m.donor_id = auth.uid())
);

-- Verifications: Pharmacists can manage, donors can view own
CREATE POLICY "Pharmacists can view verifications" ON public.verifications FOR SELECT USING (public.has_role(auth.uid(), 'pharmacist'));
CREATE POLICY "Pharmacists can insert verifications" ON public.verifications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'pharmacist') AND pharmacist_id = auth.uid());
CREATE POLICY "Donors can view own medicine verifications" ON public.verifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.medicines m WHERE m.id = medicine_id AND m.donor_id = auth.uid())
);
CREATE POLICY "Admins can view all verifications" ON public.verifications FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Claims: Recipients manage own, admins see all
CREATE POLICY "Recipients can view own claims" ON public.claims FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.recipients r WHERE r.id = recipient_id AND r.user_id = auth.uid())
);
CREATE POLICY "Recipients can insert claims" ON public.claims FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.recipients r WHERE r.id = recipient_id AND r.user_id = auth.uid() AND r.is_verified = TRUE)
);
CREATE POLICY "Recipients can update own claims" ON public.claims FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.recipients r WHERE r.id = recipient_id AND r.user_id = auth.uid())
);
CREATE POLICY "Admins can view all claims" ON public.claims FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Pharmacists can view claims" ON public.claims FOR SELECT USING (public.has_role(auth.uid(), 'pharmacist'));

-- Pickup requests
CREATE POLICY "Donors can view own pickup requests" ON public.pickup_requests FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Donors can create pickup requests" ON public.pickup_requests FOR INSERT WITH CHECK (auth.uid() = donor_id);
CREATE POLICY "Donors can update own pickup requests" ON public.pickup_requests FOR UPDATE USING (auth.uid() = donor_id);
CREATE POLICY "Admins can view all pickup requests" ON public.pickup_requests FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update pickup requests" ON public.pickup_requests FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Recipients can view assigned pickups" ON public.pickup_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.recipients r WHERE r.id = recipient_id AND r.user_id = auth.uid())
);

-- Pickup tracking
CREATE POLICY "View tracking for accessible pickups" ON public.pickup_tracking FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.pickup_requests p WHERE p.id = pickup_request_id AND (
    p.donor_id = auth.uid() OR
    public.has_role(auth.uid(), 'admin') OR
    EXISTS (SELECT 1 FROM public.recipients r WHERE r.id = p.recipient_id AND r.user_id = auth.uid())
  ))
);
CREATE POLICY "Admins can insert tracking" ON public.pickup_tracking FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Disposal records
CREATE POLICY "Admins can manage disposal records" ON public.disposal_records FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Donors can view own disposal records" ON public.disposal_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.medicines m WHERE m.id = medicine_id AND m.donor_id = auth.uid())
);

-- Banned substances: Anyone can read, admins can write
CREATE POLICY "Anyone can view banned substances" ON public.banned_substances FOR SELECT USING (TRUE);
CREATE POLICY "Admins can manage banned substances" ON public.banned_substances FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs: Admins only
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "System can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (TRUE);

-- Donation receipts
CREATE POLICY "Donors can view own receipts" ON public.donation_receipts FOR SELECT USING (auth.uid() = donor_id);
CREATE POLICY "Admins can manage receipts" ON public.donation_receipts FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Notifications
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (TRUE);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('medicine-images', 'medicine-images', true);

-- Storage policies
CREATE POLICY "Users can upload own documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Admins can view all documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can upload medicine images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'medicine-images' AND auth.role() = 'authenticated');
CREATE POLICY "Anyone can view medicine images" ON storage.objects FOR SELECT USING (bucket_id = 'medicine-images');