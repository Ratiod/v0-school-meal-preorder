-- Create orders table for storing meal preorders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name TEXT NOT NULL,
  student_id TEXT NOT NULL,
  email TEXT NOT NULL,
  order_date DATE NOT NULL,
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table for storing individual meal items in each order
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  meal_id TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security on both tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table - allow anyone to insert, admin can view all
CREATE POLICY "Allow anyone to insert orders"
  ON public.orders
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow reading all orders"
  ON public.orders
  FOR SELECT
  USING (true);

CREATE POLICY "Allow updating orders"
  ON public.orders
  FOR UPDATE
  USING (true);

-- Create policies for order_items table
CREATE POLICY "Allow anyone to insert order items"
  ON public.order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow reading all order items"
  ON public.order_items
  FOR SELECT
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_student_id ON public.orders(student_id);
CREATE INDEX IF NOT EXISTS idx_orders_order_date ON public.orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
