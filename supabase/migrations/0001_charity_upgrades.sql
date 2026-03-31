-- ====================================================
-- Upgrade 1: Augmenting Charities for Public Directory
-- ====================================================

-- Add categorization and static event blocks 
ALTER TABLE public.charities 
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS upcoming_events JSONB DEFAULT '[]'::jsonb;

-- Provide a quick seed to the categories of the mock charities previously added (if they exist)
UPDATE public.charities SET category = 'Youth & Education' WHERE name = 'The First Tee';
UPDATE public.charities SET category = 'Healthcare' WHERE name = 'Macmillan Cancer Support';
UPDATE public.charities SET category = 'Global Infrastructure' WHERE name = 'Clean Water Initiative';
