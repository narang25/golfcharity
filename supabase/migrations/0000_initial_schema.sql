-- ====================================================
-- Golf Charity Subscription Platform - Initial Schema
-- ====================================================

-- 1. Custom Enums
-- ====================================================
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'lapsed', 'cancelled');
CREATE TYPE subscription_plan AS ENUM ('monthly', 'yearly');
CREATE TYPE draw_status AS ENUM ('scheduled', 'simulated', 'published');
CREATE TYPE draw_type AS ENUM ('random', 'algorithmic');
CREATE TYPE payout_status AS ENUM ('pending', 'verified', 'paid');

-- 2. Tables
-- ====================================================
CREATE TABLE public.charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  website_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_status subscription_status DEFAULT 'inactive',
  subscription_plan subscription_plan,
  mock_customer_id TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  subscription_start_date TIMESTAMPTZ,
  subscription_renewal_date TIMESTAMPTZ,
  charity_id UUID REFERENCES public.charities(id) ON DELETE SET NULL,
  charity_contribution_percent INTEGER DEFAULT 10 CHECK (charity_contribution_percent >= 10),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 45),
  played_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_date DATE NOT NULL,
  status draw_status DEFAULT 'scheduled' NOT NULL,
  draw_type draw_type DEFAULT 'random' NOT NULL,
  winning_numbers INTEGER[] CHECK (array_length(winning_numbers, 1) = 5),
  jackpot_amount NUMERIC DEFAULT 0,
  four_match_amount NUMERIC DEFAULT 0,
  three_match_amount NUMERIC DEFAULT 0,
  rolled_over_jackpot NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.draw_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id UUID NOT NULL REFERENCES public.draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_scores INTEGER[] CHECK (array_length(user_scores, 1) <= 5),
  match_count INTEGER CHECK (match_count IN (0, 3, 4, 5)),
  is_winner BOOLEAN DEFAULT false,
  UNIQUE(draw_id, user_id)
);

CREATE TABLE public.prize_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_entry_id UUID NOT NULL REFERENCES public.draw_entries(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  status payout_status DEFAULT 'pending' NOT NULL,
  proof_url TEXT,
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

CREATE TABLE public.charity_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE SET NULL,
  charity_id UUID NOT NULL REFERENCES public.charities(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  subscription_period TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Trigger: Enforce max 5 scores per user (Rolling Window)
-- ====================================================
CREATE OR REPLACE FUNCTION enforce_max_scores()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM public.scores
    WHERE id IN (
        SELECT id FROM public.scores
        WHERE user_id = NEW.user_id
        ORDER BY played_date DESC, created_at DESC
        OFFSET 5
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_user_scores_limit
AFTER INSERT ON public.scores
FOR EACH ROW
EXECUTE FUNCTION enforce_max_scores();

-- 4. Trigger: Handle new user creation automatically via Supabase Auth
-- ====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 5. Row Level Security Policies
-- ====================================================
ALTER TABLE public.charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.draw_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prize_payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.charity_contributions ENABLE ROW LEVEL SECURITY;

-- Charities
CREATE POLICY "Charities are viewable by everyone" 
  ON public.charities FOR SELECT USING (true);

-- Users
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Scores
CREATE POLICY "Users can view their own scores" 
  ON public.scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scores" 
  ON public.scores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own scores"
  ON public.scores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own scores" 
  ON public.scores FOR DELETE USING (auth.uid() = user_id);

-- Draws
CREATE POLICY "Everyone can view published draws" 
  ON public.draws FOR SELECT USING (status = 'published');

-- Draw Entries
CREATE POLICY "Users can view their own draw entries" 
  ON public.draw_entries FOR SELECT USING (auth.uid() = user_id);

-- Prize Payouts
CREATE POLICY "Users can view their own prize payouts" 
  ON public.prize_payouts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upload their own payout proof" 
  ON public.prize_payouts FOR UPDATE USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- Charity Contributions
CREATE POLICY "Users can view their own charity contributions" 
  ON public.charity_contributions FOR SELECT USING (auth.uid() = user_id);

-- 6. Performance Indexing
-- ====================================================
CREATE INDEX idx_users_charity_id ON public.users(charity_id);
CREATE INDEX idx_scores_user_id ON public.scores(user_id);
CREATE INDEX idx_draw_entries_user_id ON public.draw_entries(user_id);
CREATE INDEX idx_draw_entries_draw_id ON public.draw_entries(draw_id);
CREATE INDEX idx_prize_payouts_user_id ON public.prize_payouts(user_id);
CREATE INDEX idx_charity_contributions_user_id ON public.charity_contributions(user_id);
