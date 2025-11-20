/*
  # Add Authentication Support for Student Order Tracking

  1. Changes to Tables
    - Add `user_id` column to `orders` table to link orders with authenticated users
    - Update existing tables to support user authentication

  2. Security
    - Update RLS policies to allow users to view only their own orders
    - Admin users can view all orders
    - Users can only update their own profile information

  3. Notes
    - Supabase Auth automatically creates auth.users table
    - We're linking orders to auth.users via user_id
    - Existing orders without user_id will still be visible to admins
*/

-- Add user_id column to orders table to link with auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Create index for better query performance on user_id
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anyone to insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow reading all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow updating orders" ON public.orders;

-- Create new RLS policies for orders table

-- Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow anyone to view orders (for admin dashboard)
-- In production, you'd want to restrict this to admin role
CREATE POLICY "Allow service role to view all orders"
  ON public.orders
  FOR SELECT
  TO service_role
  USING (true);

-- Allow service role to update any order (for admin status updates)
CREATE POLICY "Allow service role to update orders"
  ON public.orders
  FOR UPDATE
  TO service_role
  USING (true);

-- Update order_items policies to match parent order access
DROP POLICY IF EXISTS "Allow anyone to insert order items" ON public.order_items;
DROP POLICY IF EXISTS "Allow reading all order items" ON public.order_items;

-- Users can insert order items for their own orders
CREATE POLICY "Users can insert items for their orders"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Users can view order items for their own orders
CREATE POLICY "Users can view their order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Allow service role to view all order items
CREATE POLICY "Service role can view all order items"
  ON public.order_items
  FOR SELECT
  TO service_role
  USING (true);
