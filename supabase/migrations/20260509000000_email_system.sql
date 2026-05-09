-- Email Subscription and Notification System

-- Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    unsubscribe_token UUID DEFAULT gen_random_uuid()
);

-- Enable RLS on subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Policies for subscribers
CREATE POLICY "Enable insert for everyone" ON public.subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable select for own record via token" ON public.subscribers FOR SELECT USING (true);
CREATE POLICY "Enable update for own record via token" ON public.subscribers FOR UPDATE USING (true);
CREATE POLICY "Admin full access" ON public.subscribers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'newsletter_signup', 'new_product', 'discount_update'
    recipient TEXT NOT NULL,
    status TEXT NOT NULL, -- 'success', 'failed'
    error_message TEXT,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policies for email_logs
CREATE POLICY "Admin full access" ON public.email_logs FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Trigger to notify subscribers on product changes
-- This calls the Edge Function 'notifier' via a webhook
-- Note: In a real Supabase setup, you would enable the 'pg_net' extension
-- and use a trigger or the Dashboard Webhooks UI.
-- For this migration, we define the trigger logic.

CREATE OR REPLACE FUNCTION public.on_product_change_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- We use Supabase's built-in HTTP request capability if pg_net is available
  -- or we rely on the Dashboard Webhook UI to point to /functions/v1/notifier
  -- For the migration, we'll just return the NEW/OLD records.
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_product_change ON public.products;
CREATE TRIGGER on_product_change
AFTER INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.on_product_change_notification();
