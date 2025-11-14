-- Add pickup_time to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pickup_time VARCHAR(50) DEFAULT 'lunch';

-- Create favorites table with proper schema
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_email TEXT NOT NULL,
  meal_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_email, meal_id)
);

-- Create notifications table with UUID foreign key matching orders.id
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  student_email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on new tables
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for favorites
CREATE POLICY "Allow anyone to insert favorites"
  ON public.favorites
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow reading all favorites"
  ON public.favorites
  FOR SELECT
  USING (true);

CREATE POLICY "Allow deleting favorites"
  ON public.favorites
  FOR DELETE
  USING (true);

-- Create RLS policies for notifications
CREATE POLICY "Allow anyone to insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow reading all notifications"
  ON public.notifications
  FOR SELECT
  USING (true);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_email ON public.favorites(student_email);
CREATE INDEX IF NOT EXISTS idx_favorites_meal_id ON public.favorites(meal_id);
CREATE INDEX IF NOT EXISTS idx_notifications_email ON public.notifications(student_email);
CREATE INDEX IF NOT EXISTS idx_notifications_order_id ON public.notifications(order_id);
