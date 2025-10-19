# 🚀 Quick Setup Guide - Curry House Jar App

Follow these steps to get the complete restaurant app running on your machine!

## ⚡ Prerequisites Check

Before starting, make sure you have:

- ✅ Node.js installed (v14+) - Check: `node --version`
- ✅ npm or yarn installed - Check: `npm --version`
- ✅ MongoDB installed and running - Check: `mongod --version`
- ✅ A code editor (VS Code recommended)

## 📋 Step-by-Step Setup

### Step 1: Start MongoDB

**Windows:**

```powershell
# Start MongoDB service
net start MongoDB
```

**Mac/Linux:**

```bash
# Start MongoDB
sudo systemctl start mongod
# OR
brew services start mongodb-community
```

---

### Step 2: Setup Backend (5 minutes)

```powershell
# Navigate to backend folder
cd "c:\Users\sahal\Desktop\tess app\backend"

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
```

✅ Backend should now be running on **http://localhost:5000**

You should see:

```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
🏠 Curry House Jar API: http://localhost:5000
```

---

### Step 3: Setup Mobile App (5 minutes)

**Open a NEW terminal/PowerShell window**

```powershell
# Navigate to mobile app folder
cd "c:\Users\sahal\Desktop\tess app\mobile-app"

# Install dependencies
npm install

# Start Expo development server
npm start
```

✅ Expo Dev Tools will open in your browser

You should see a QR code and options to run the app

---

### Step 4: Run the App

Choose one of these options:

**Option A: Android Emulator**

1. Make sure Android Studio is installed with an emulator
2. Press `a` in the terminal
3. App will launch in emulator

**Option B: iOS Simulator (Mac only)**

1. Make sure Xcode is installed
2. Press `i` in the terminal
3. App will launch in simulator

**Option C: Physical Device (Recommended for testing)**

1. Install **Expo Go** app from App Store/Google Play
2. Scan the QR code shown in terminal
3. App will load on your phone

**For physical device, update the API URL:**

1. Find your computer's IP address:

   ```powershell
   ipconfig
   ```

   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Edit `mobile-app\config\config.js`:

   ```javascript
   const API_URL = "http://192.168.1.100:5000/api";
   ```

3. Restart Expo: Press `r` in terminal

---

## 🧪 Test the App

### 1. Create an Account

- Open the app
- Click "Sign Up"
- Fill in the form:
  - Name: Test User
  - Email: test@example.com
  - Phone: 12345678
  - Password: password123
- Click "Sign Up"

### 2. Browse Menu

- Tap "Menu" tab
- Browse 22+ authentic Indian dishes
- Use search and category filters
- Add items to cart

### 3. Place an Order

- Add items to cart
- Tap "Cart" tab
- Review your order
- Click "Place Order"
- Check order in "Orders" tab

---

## 🎉 You're All Set!

The app is now running with:

- ✅ Backend API on port 5000
- ✅ MongoDB with 22+ menu items
- ✅ Mobile app connected and working
- ✅ Full authentication system
- ✅ Cart and order functionality

---

## 🐛 Common Issues & Solutions

### Issue: "Cannot connect to backend"

**Solution:**

- Check if backend is running (terminal should show "Server running")
- Verify MongoDB is running
- For physical devices, update API URL with your computer's IP

### Issue: "MongoDB connection failed"

**Solution:**

```powershell
# Windows - Start MongoDB service
net start MongoDB

# Check if MongoDB is running
# Open MongoDB Compass or check services
```

### Issue: "Port 5000 already in use"

**Solution:**
Edit `backend\.env` and change PORT to another number (e.g., 5001)

### Issue: Expo not working

**Solution:**

```powershell
# Clear cache and restart
cd mobile-app
npx expo start -c
```

---

## 📱 Test Accounts

**Test User (if you don't want to register):**

```
Email: test@example.com
Password: password123
```

---

## 🔧 Useful Commands

### Backend

```powershell
npm run dev        # Start development server
npm run seed       # Re-seed database
npm start          # Start production server
```

### Mobile App

```powershell
npm start          # Start Expo
npm run android    # Run on Android
npm run ios        # Run on iOS
```

---

## 📞 Need Help?

1. Check the main README.md
2. Check backend/README.md
3. Check mobile-app/README.md
4. Verify all prerequisites are installed
5. Make sure both servers are running

---

## 🎨 Features to Try

- 🔐 Login/Register
- 🍛 Browse authentic Indian menu
- 🔍 Search for dishes
- 🏷️ Filter by category
- 🛒 Add to cart
- ➕➖ Adjust quantities
- 📦 Place orders
- 📋 View order history
- 👤 Check profile
- 🚪 Logout

---

**Enjoy your Curry House Jar app! 🍛**

Based on the real restaurant: http://curryhousejar.no
