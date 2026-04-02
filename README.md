# Chronos — Premium Watches E-Commerce

A full-stack MERN e-commerce application for luxury watches with premium animations and UX.

## Setup

### 1. Configure MongoDB

Edit `.env` and replace the `MONGO_URI` with your MongoDB Atlas connection string:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/chronos_watches?retryWrites=true&w=majority
JWT_SECRET=chronos_super_secret_jwt_key_2026
PORT=5000
```

### 2. Seed the Database

```bash
npm run seed
```

This creates 18 watch products and 2 users:
- Admin: `admin@chronos.com` / `admin123`
- User: `john@example.com` / `password123`

### 3. Start the Backend

```bash
npm run dev
```

Server runs on http://localhost:5000

### 4. Start the Frontend

```bash
cd client
npm run dev
```

App runs on http://localhost:5173

## Project Structure

```
├── server/
│   ├── models/         # Mongoose models (Product, User, Order)
│   ├── routes/         # Express routes
│   ├── middleware/      # Auth middleware
│   ├── index.js        # Express server
│   └── seed.js         # Database seeder
├── client/
│   └── src/
│       ├── components/ # Navbar, Footer, ProductCard, CartDrawer
│       ├── context/    # Auth & Cart context
│       ├── hooks/      # useApi hooks
│       └── pages/      # All page components
└── .env
```

## Features

- Animated hero with parallax scroll
- Product catalog with filter/sort/search
- Product detail with image gallery
- Animated cart drawer
- Multi-step checkout
- JWT authentication
- User profile & order history
- Fully responsive
