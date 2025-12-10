-- Allow any authenticated user to view verified medicines (for searching/buying)
CREATE POLICY "Authenticated users can view verified medicines for purchase"
ON public.medicines
FOR SELECT
USING (status = 'verified' AND auth.uid() IS NOT NULL);