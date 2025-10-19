# Curry House Jar - Backend API

Backend API for Curry House Jar mobile application built with Node.js, Express, and MongoDB.

## 🚀 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ Menu Management with Categories
- ✅ Shopping Cart functionality
- ✅ Order Placement & Tracking
- ✅ User Profile Management
- ✅ Favorites System
- ✅ Search & Filter Menu Items

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create environment file:**

   ```bash
   copy .env.example .env
   ```

4. **Configure your .env file:**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/curryhousejar
   JWT_SECRET=your_secure_secret_key_here
   NODE_ENV=development
   ```

## 🗄️ Database Setup

1. **Make sure MongoDB is running:**

   - If using local MongoDB, start the service
   - If using MongoDB Atlas, use your connection string

2. **Seed the database with sample data:**

   ```bash
   npm run seed
   ```

   This will populate your database with:

   - 22+ Sample menu items
   - Various categories (Biryani, Kebab, Curry, Naan, Drinks, etc.)
   - Realistic pricing in Norwegian Kroner (kr)

## 🏃‍♂️ Running the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Menu

- `GET /api/menu` - Get all menu items (with filters)
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/:id` - Get single menu item
- `GET /api/menu/popular/items` - Get popular items

### Orders

- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders` - Get user's orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `PATCH /api/orders/:id/cancel` - Cancel order (Protected)

### User Profile

- `PUT /api/user/profile` - Update profile (Protected)
- `POST /api/user/favorites/:menuItemId` - Add to favorites (Protected)
- `DELETE /api/user/favorites/:menuItemId` - Remove from favorites (Protected)
- `GET /api/user/favorites` - Get favorites (Protected)

## 🧪 Testing the API

You can test the API using:

- Postman
- Thunder Client (VS Code extension)
- cURL commands

**Example Register Request:**

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "12345678",
  "password": "password123"
}
```

## 📦 Project Structure

```
backend/
├── models/          # Mongoose models
│   ├── User.js
│   ├── MenuItem.js
│   └── Order.js
├── routes/          # API routes
│   ├── auth.js
│   ├── menu.js
│   ├── orders.js
│   └── user.js
├── middleware/      # Custom middleware
│   └── auth.js
├── seed/           # Database seeding
│   └── seedData.js
├── .env.example    # Environment variables template
├── .gitignore
├── package.json
└── server.js       # Main server file
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## 🌍 Environment Variables

| Variable    | Description               | Example                                 |
| ----------- | ------------------------- | --------------------------------------- |
| PORT        | Server port               | 5000                                    |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/curryhousejar |
| JWT_SECRET  | Secret key for JWT        | your_secret_key                         |
| NODE_ENV    | Environment               | development/production                  |

## 📝 License

This project is for educational purposes.

## 👨‍💻 Developer Notes

- All passwords are hashed using bcrypt
- JWT tokens expire in 30 days
- Input validation using express-validator
- Error handling middleware included
- CORS enabled for cross-origin requests
