# 🍛 Curry House Jar - Quick Reference Card

## 📦 What You Have

✅ **Complete Full-Stack Restaurant App**

- Backend API (Node.js + Express + MongoDB)
- Mobile App (React Native + Expo + Zustand)
- 22+ Menu Items Pre-loaded
- Full Authentication System
- Cart & Order Management
- Beautiful UI matching Curry House Jar website

---

## ⚡ Quick Start (3 Commands)

### Option 1: Automatic (Recommended)

```powershell
# 1. Install everything
.\install.ps1

# 2. Seed database
cd backend
npm run seed

# 3. Start everything
cd ..
.\start.ps1
```

### Option 2: Manual

```powershell
# Terminal 1 - Backend
cd backend
npm install
npm run seed
npm run dev

# Terminal 2 - Mobile App
cd mobile-app
npm install
npm start
```

---

## 🔑 Important URLs

- **Backend API:** http://localhost:5000
- **API Health:** http://localhost:5000/api/health
- **Expo Dev Tools:** Opens automatically in browser

---

## 📱 Test Account

```
Email: test@example.com
Password: password123
```

Or register a new account in the app!

---

## 🎯 Main Features

### Backend API Endpoints

```
POST   /api/auth/register      - Register user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
GET    /api/menu               - Get all menu items
GET    /api/menu/categories    - Get categories
POST   /api/orders             - Create order
GET    /api/orders             - Get user orders
```

### Mobile App Screens

```
✅ Login / Register
✅ Home (Banner, Featured Items)
✅ Menu (Search, Categories, Filters)
✅ Cart (Manage Items, Checkout)
✅ Orders (History, Tracking)
✅ Profile (User Info, Settings)
```

---

## 🛠️ Common Commands

### Backend

```powershell
npm run dev        # Start development server
npm run seed       # Populate database
npm start          # Start production server
```

### Mobile App

```powershell
npm start          # Start Expo
npm run android    # Launch Android
npm run ios        # Launch iOS (Mac only)
```

### Database

```powershell
net start MongoDB      # Start MongoDB (Windows)
net stop MongoDB       # Stop MongoDB (Windows)
mongosh               # Open MongoDB shell
```

---

## 🎨 Restaurant Info

**Curry House Jar**

- Phone: +47 67155555
- Email: order@curryhousejar.no
- Location: Jar, Bærum, Norway
- Website: http://curryhousejar.no
- Hours: 14:00 - 22:00 (Daily)

---

## 🏗️ Project Structure

```
tess app/
├── backend/              # API Server
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   └── seed/            # Sample data
│
└── mobile-app/          # React Native App
    ├── app/             # Screens
    ├── store/           # Zustand stores
    └── services/        # API calls
```

---

## 📊 Sample Menu Categories

1. **Biryani** - Rice dishes
2. **Kebab** - Grilled meats
3. **Curry** - Traditional curries
4. **Naan** - Indian breads
5. **Drinks** - Beverages
6. **Appetizers** - Starters
7. **Desserts** - Sweets
8. **Combo Meals** - Meal deals

---

## 🐛 Troubleshooting

**Can't connect to backend?**

```powershell
# Check if backend is running
# Look for: "Server running on port 5000"
```

**MongoDB not running?**

```powershell
net start MongoDB
```

**Expo not working?**

```powershell
cd mobile-app
npx expo start -c    # Clear cache
```

**Physical device can't connect?**

1. Get your computer's IP: `ipconfig`
2. Edit `mobile-app/config/config.js`
3. Change: `http://192.168.X.X:5000/api`

---

## 📚 Documentation Files

1. **README.md** - Main overview
2. **SETUP_GUIDE.md** - Detailed setup
3. **PROJECT_SUMMARY.md** - Complete summary
4. **QUICK_REFERENCE.md** - This file
5. **backend/README.md** - Backend docs
6. **mobile-app/README.md** - App docs

---

## 🎓 Technologies Used

**Backend:**

- Node.js, Express, MongoDB, Mongoose
- JWT, bcryptjs, CORS

**Mobile:**

- React Native, Expo, Expo Router
- Zustand, Axios, AsyncStorage

---

## ✨ Key Highlights

🔐 Secure JWT Authentication  
🛒 Persistent Shopping Cart  
📱 Cross-platform (iOS + Android)  
🎨 Beautiful Orange-themed UI  
🍛 22+ Authentic Indian Dishes  
💰 Norwegian Kroner (kr) Pricing  
📦 Complete Order System  
🚀 Production-ready Code

---

## 🎯 Next Actions

1. ✅ Install dependencies: `.\install.ps1`
2. ✅ Seed database: `cd backend && npm run seed`
3. ✅ Start servers: `.\start.ps1`
4. ✅ Open app on device
5. ✅ Create account
6. ✅ Browse menu
7. ✅ Place order
8. ✅ Enjoy! 🎉

---

## 💡 Tips

- Use **Expo Go** app for easiest testing
- Keep both terminals open while developing
- Check browser for Expo Dev Tools
- Press 'r' to reload app
- Press 'd' for developer menu

---

## 📞 Support

Check documentation files for detailed help:

- Setup issues → SETUP_GUIDE.md
- API questions → backend/README.md
- App questions → mobile-app/README.md

---

**Happy Coding! 🍛**

Made with ❤️ for Curry House Jar
Based on: http://curryhousejar.no
