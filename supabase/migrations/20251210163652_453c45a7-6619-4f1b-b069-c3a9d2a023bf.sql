-- Allow donors to delete their own pending medicines
CREATE POLICY "Donors can delete own pending medicines"
ON public.medicines
FOR DELETE
USING (auth.uid() = donor_id AND status = 'pending');