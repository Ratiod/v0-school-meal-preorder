# School Meal Preorder System

A modern web application for students and parents to browse daily school meals, manage their shopping cart, and preorder meals. Includes an admin dashboard for staff to manage orders and track meal inventory.

## Features

### For Students & Parents
- 🍽️ **Browse Daily Menus** - View available meals organized by category with nutritional information
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities, and manage your order
- 📝 **Easy Checkout** - Simple form to enter student information and delivery preferences
- 📱 **Mobile Friendly** - Fully responsive design optimized for phones, tablets, and desktops
- 💾 **Cart Persistence** - Your cart is saved and restored when you return
- ⏰ **Pickup Time Selection** - Choose between break time or lunch time pickup slots at checkout
- ❤️ **Favorite Meals** - Mark your favorite meals and reorder them with one click
- 📜 **Order History** - View all past orders and download receipts
- 🔔 **Food Ready Notifications** - Receive alerts when your order is ready for pickup

### For Administrators
- 📊 **Order Dashboard** - View all orders with real-time statistics
- 🔍 **Search & Filter** - Find orders by student name, ID, email, or status
- ✅ **Order Management** - Update order status (Pending, Confirmed, Completed, Cancelled)
- 📈 **Analytics** - Track total orders, pending orders, completed orders, and revenue
- 🔔 **Send Notifications** - Notify students when their order is ready for pickup

## Tech Stack

- **Frontend**: Next.js 16 with React 19.2
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Backend**: Next.js API Routes
- **Authentication**: Ready for Supabase Auth integration
- **Type Safety**: TypeScript

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account (free tier available)
- Git

## Installation

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/school-meal-preorder.git
cd school-meal-preorder
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory with your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

Get these values from your Supabase project settings:
- Go to https://supabase.com and create a new project
- Navigate to Project Settings → API
- Copy the URL and anon key to your `.env.local`

### 4. Set Up Database

Run the database migration script to create the necessary tables:

\`\`\`bash
npm run dev
\`\`\`

Then in another terminal, navigate to the project and check the `scripts` folder. The migration will run automatically via the Supabase integration.

Or manually run the SQL from `scripts/001_create_orders_table.sql` and `scripts/002_add_features_tables.sql` in your Supabase SQL Editor.

### 5. Start the Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## Usage

### For Users
1. **Browse Meals** - Click on meal categories to see available options
2. **Add to Cart** - Click "Add to Cart" on any meal
3. **View Cart** - Click the cart icon in the header
4. **Checkout** - Click "Proceed to Checkout" to enter your information
5. **Submit Order** - Fill in your details and click "Confirm Order"

### For Admins
1. Navigate to `http://localhost:3000/admin`
2. View dashboard statistics at the top
3. Use search and filters to find specific orders
4. Click on any order to view full details
5. Update order status as needed

## Project Structure

\`\`\`
school-meal-preorder/
├── app/
│   ├── page.tsx                 # Main meal browsing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── checkout/
│   │   └── page.tsx             # Checkout page with pickup time selection
│   ├── order-history/
│   │   └── page.tsx             # Student order history and receipts
│   ├── admin/
│   │   └── page.tsx             # Admin dashboard
│   └── api/
│       ├── meals/
│       │   ├── route.ts         # Get all meals
│       │   └── [id]/route.ts    # Get single meal
│       ├── orders/
│       │   └── route.ts         # Create/get orders
│       ├── favorites/
│       │   └── route.ts         # Manage favorite meals
│       └── notifications/
│           └── route.ts         # Send/get food ready notifications
├── components/
│   ├── header.tsx               # App header with cart and notifications
│   ├── menu-browser.tsx         # Meal browsing interface
│   ├── meal-card.tsx            # Individual meal card with favorite button
│   ├── cart.tsx                 # Shopping cart
│   ├── cart-item.tsx            # Cart item component
│   ├── checkout-form.tsx        # Order checkout form with pickup time
│   ├── notifications-bell.tsx   # Notifications bell icon
│   ├── admin-stats.tsx          # Dashboard statistics
│   ├── admin-orders-table.tsx   # Orders table
│   └── admin-order-details.tsx  # Order details with notification button
├── lib/
│   ├── meal-data.ts             # Meal data with Malaysian pricing
│   └── supabase/
│       ├── client.ts            # Supabase client (browser)
│       └── server.ts            # Supabase client (server)
├── scripts/
│   ├── 001_create_orders_table.sql      # Database migration
│   └── 002_add_features_tables.sql      # Favorites and notifications tables
└── public/                      # Static assets

\`\`\`

## Database Schema

### Orders Table
\`\`\`sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  student_name VARCHAR NOT NULL,
  student_id VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR,
  pickup_time VARCHAR NOT NULL,  -- 'break' or 'lunch'
  status VARCHAR DEFAULT 'pending',
  total_amount DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
\`\`\`

### Order Items Table
\`\`\`sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  meal_id VARCHAR NOT NULL,
  meal_name VARCHAR NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
\`\`\`

### New Favorites Table
\`\`\`sql
CREATE TABLE favorites (
  id UUID PRIMARY KEY,
  email VARCHAR NOT NULL,
  meal_id VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
\`\`\`

### New Notifications Table
\`\`\`sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  email VARCHAR NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
)
\`\`\`

## API Endpoints

### Meals
- `GET /api/meals` - Get all available meals
- `GET /api/meals/[id]` - Get a specific meal

### Orders
- `GET /api/orders` - Get all orders (admin only)
- `POST /api/orders` - Create a new order
- `GET /api/orders/[id]` - Get order details

### Favorites
- `GET /api/favorites` - Get user's favorite meals
- `POST /api/favorites` - Add meal to favorites
- `DELETE /api/favorites` - Remove meal from favorites

### Notifications
- `GET /api/notifications` - Get user's notifications
- `POST /api/notifications` - Send food ready notification (admin)
- `PUT /api/notifications` - Mark notification as read

## Future Enhancements

- Payment integration (Stripe, TNG for Malaysia)
- Student authentication via school system
- Recurring meal plans
- Nutritional information display
- Mobile app
- Inventory management
- Email notifications for food ready alerts

## Development

### Running Locally
\`\`\`bash
npm run dev
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## Deployment

### Deploy to Vercel (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Connect your GitHub repository
4. Add environment variables from your `.env.local`
5. Click Deploy

The app will be live on a Vercel URL automatically.

### Deploy to Other Platforms
- AWS, Azure, DigitalOcean, Heroku all support Node.js deployments
- Make sure to set environment variables in your hosting platform

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions, please open an GitHub issue or contact the project maintainer.

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI Components from [shadcn/ui](https://ui.shadcn.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- Database by [Supabase](https://supabase.com)
