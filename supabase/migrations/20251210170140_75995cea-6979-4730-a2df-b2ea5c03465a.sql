-- Add 'individual' to recipient_type enum
ALTER TYPE public.recipient_type ADD VALUE IF NOT EXISTS 'individual';