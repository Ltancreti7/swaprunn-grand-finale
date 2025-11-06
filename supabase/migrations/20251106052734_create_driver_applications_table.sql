/*
  # Create Driver Applications Table

  1. New Tables
    - `driver_applications`
      - `id` (uuid, primary key) - Unique application identifier
      - `user_id` (uuid, nullable) - Reference to auth.users if user already exists
      - `dealer_id` (uuid, required) - Dealership being applied to
      - `full_name` (text, required) - Applicant's full name
      - `email` (text, required) - Contact email
      - `phone` (text, required) - Contact phone number
      - `dob` (date, required) - Date of birth
      - `address` (text, required) - Home address
      - `contact_method` (text, required) - Preferred contact method
      - `license_number` (text, required) - Driver's license number
      - `license_state` (text, required) - State of license issue
      - `license_expiration` (date, required) - License expiration date
      - `drive_radius` (integer, required) - Willing to drive in miles
      - `availability` (text, required) - Available hours/days
      - `status` (text, required) - Application status: pending, approved, rejected
      - `reviewed_by` (uuid, nullable) - Dealer who reviewed application
      - `reviewed_at` (timestamptz, nullable) - When application was reviewed
      - `rejection_reason` (text, nullable) - Reason for rejection
      - `created_at` (timestamptz) - Application submission timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on driver_applications table
    - Policy: Authenticated users can insert their own applications
    - Policy: Dealers can view applications for their dealership
    - Policy: Dealers can update application status for their dealership
    - Policy: Applicants can view their own applications

  3. Indexes
    - Index on dealer_id for efficient dealership queries
    - Index on status for filtering
    - Index on email for lookup
*/

-- Create driver_applications table
CREATE TABLE IF NOT EXISTS public.driver_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  dealer_id UUID REFERENCES public.dealers(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob DATE NOT NULL,
  address TEXT NOT NULL,
  contact_method TEXT NOT NULL DEFAULT 'email' CHECK (contact_method IN ('phone', 'text', 'email')),
  license_number TEXT NOT NULL,
  license_state TEXT NOT NULL,
  license_expiration DATE NOT NULL,
  drive_radius INTEGER NOT NULL,
  availability TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_driver_applications_dealer_id ON public.driver_applications(dealer_id);
CREATE INDEX IF NOT EXISTS idx_driver_applications_status ON public.driver_applications(status);
CREATE INDEX IF NOT EXISTS idx_driver_applications_email ON public.driver_applications(email);
CREATE INDEX IF NOT EXISTS idx_driver_applications_dealer_status ON public.driver_applications(dealer_id, status);

-- Add comments for documentation
COMMENT ON TABLE public.driver_applications IS 'Stores driver applications submitted to dealerships';
COMMENT ON COLUMN public.driver_applications.user_id IS 'Optional reference to auth user if applicant has account';
COMMENT ON COLUMN public.driver_applications.dealer_id IS 'Dealership this application is for';
COMMENT ON COLUMN public.driver_applications.status IS 'Application status: pending, approved, rejected';
COMMENT ON COLUMN public.driver_applications.contact_method IS 'Preferred contact method: phone, text, or email';

-- Enable Row Level Security
ALTER TABLE public.driver_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can insert applications (their own)
CREATE POLICY "Users can submit driver applications"
  ON public.driver_applications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id OR user_id IS NULL
  );

-- Policy: Applicants can view their own applications
CREATE POLICY "Users can view own applications"
  ON public.driver_applications
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
  );

-- Policy: Dealers can view applications for their dealership
CREATE POLICY "Dealers can view applications for their dealership"
  ON public.driver_applications
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'dealer'
      AND p.dealer_id = driver_applications.dealer_id
    )
  );

-- Policy: Dealers can update application status for their dealership
CREATE POLICY "Dealers can update applications for their dealership"
  ON public.driver_applications
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'dealer'
      AND p.dealer_id = driver_applications.dealer_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid()
      AND p.user_type = 'dealer'
      AND p.dealer_id = driver_applications.dealer_id
    )
  );

-- Policy: Allow anonymous users to insert applications (public form)
CREATE POLICY "Anyone can submit driver applications"
  ON public.driver_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT, INSERT ON public.driver_applications TO authenticated;
GRANT SELECT, INSERT ON public.driver_applications TO anon;
GRANT UPDATE ON public.driver_applications TO authenticated;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_driver_application_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_driver_application_updated_at ON public.driver_applications;
CREATE TRIGGER set_driver_application_updated_at
  BEFORE UPDATE ON public.driver_applications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_driver_application_updated_at();
