-- Add selling_price column for purchase functionality
ALTER TABLE public.medicines
ADD COLUMN selling_price numeric DEFAULT NULL;

-- Add comment for clarity
COMMENT ON COLUMN public.medicines.selling_price IS 'Price at which the medicine can be purchased by recipients';