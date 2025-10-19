# Curry House Jar - Complete Restaurant App

A full-stack restaurant mobile application for **Curry House Jar** - an authentic Indian takeaway in Bærum, Norway.

## 🎯 Project Overview

This project consists of two main parts:

1. **Backend API** - Node.js/Express + MongoDB
2. **Mobile App** - React Native Expo + Zustand

## 🚀 Quick Start

### 1. Setup Backend

```bash
cd backend
npm install
copy .env.example .env
# Configure .env file with your MongoDB URI
npm run seed     # Populate database with sample data
npm run dev      # Start backend server
```

Backend will run on `http://localhost:5000`

### 2. Setup Mobile App

```bash
cd mobile-app
npm install
npm start        # Start Expo development server
```

## 📂 Project Structure

```
tess app/
├── backend/              # Node.js/Express API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── seed/            # Database seeding
│   └── server.js        # Entry point
│
└── mobile-app/          # React Native Expo app
    ├── app/             # Screens (Expo Router)
    ├── store/           # Zustand stores
    ├── services/        # API services
    └── config/          # Configuration
```

## ✨ Features

### Backend

- ✅ JWT Authentication
- ✅ User Management
- ✅ Menu Management
- ✅ Order Processing
- ✅ Cart Functionality
- ✅ Favorites System

### Mobile App

- ✅ User Login/Register
- ✅ Browse Menu
- ✅ Search & Filter
- ✅ Shopping Cart
- ✅ Order Placement
- ✅ Order History
- ✅ User Profile

## 🛠️ Technologies

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs
- express-validator

### Mobile App

- React Native
- Expo
- Expo Router
- Zustand
- Axios
- AsyncStorage

## 📱 Screenshots & Design

The app design is based on **Curry House Jar** website (http://curryhousejar.no) with:

- Orange primary color (#FF6B35)
- Indian cuisine themed UI
- Norwegian Kroner (kr) pricing
- Authentic menu items

## 🗄️ Database Schema

### User

- Name, Email, Phone, Password
- Address, Avatar
- Favorites (menu items)

### MenuItem

- Name, Description, Price
- Category, Tags, Image
- Spice Level, Preparation Time
- Availability, Rating

### Order

- User, Order Number
- Items, Total Amount
- Delivery Address & Type
- Status, Payment Method

## 🔐 Authentication

- JWT-based authentication
- Password hashing with bcrypt
- Token stored in AsyncStorage
- Protected API routes

## 📡 API Endpoints

### Auth

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Menu

- `GET /api/menu` - Get all items
- `GET /api/menu/:id` - Get single item
- `GET /api/menu/categories` - Get categories
- `GET /api/menu/popular/items` - Get popular

### Orders

- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PATCH /api/orders/:id/cancel` - Cancel order

### User

- `PUT /api/user/profile` - Update profile
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/favorites/:id` - Add favorite
- `DELETE /api/user/favorites/:id` - Remove favorite

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm run dev
```

Use Postman/Thunder Client to test API endpoints

### Mobile App Testing

```bash
cd mobile-app
npm start
```

Test on iOS Simulator, Android Emulator, or physical device via Expo Go

## 📝 Sample Data

The seed script includes:

- 22+ menu items
- 8 categories (Biryani, Kebab, Curry, Naan, Drinks, etc.)
- Realistic Norwegian pricing
- Dummy images from Unsplash

## 🚨 Important Notes

1. **MongoDB:** Make sure MongoDB is running before starting backend
2. **Environment:** Configure `.env` file in backend
3. **Network:** For physical device testing, update API URL with your IP
4. **Dependencies:** Run `npm install` in both directories

## 📖 Documentation

Each folder has its own detailed README:

- `backend/README.md` - Backend API documentation
- `mobile-app/README.md` - Mobile app documentation

## 🔧 Configuration

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/curryhousejar
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Mobile App (config/config.js)

```javascript
const API_URL = "http://localhost:5000/api";
// Change to your IP for physical device testing
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**

- Ensure MongoDB is running
- Check connection string in `.env`

**API Connection Failed:**

- Verify backend is running on port 5000
- Update API URL in mobile app config
- Check firewall settings

**Expo Issues:**

- Clear cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 🎨 Branding

**Restaurant Info:**

- Name: Curry House Jar
- Location: Jar, Bærum, Norway
- Phone: +47 67155555
- Email: order@curryhousejar.no
- Website: http://curryhousejar.no

**Colors:**

- Primary: #FF6B35 (Orange)
- Secondary: #F7931E
- Accent: #C1272D (Red)

## 📄 License

This project is for educational purposes.

## 👨‍💻 Development

To add new features:

1. Update backend models/routes as needed
2. Create/update Zustand stores in mobile app
3. Add API calls in `services/api.js`
4. Create/update screens in `app/` directory

## 🙏 Credits

- Design inspiration: Curry House Jar official website
- Images: Unsplash
- Icons: Expo Vector Icons (Ionicons)

## 📞 Support

For issues or questions:

1. Check the individual README files
2. Review the documentation
3. Test with sample data first

---

Made with ❤️ for Curry House Jar
