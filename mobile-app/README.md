# Curry House Jar Mobile App

A complete React Native Expo mobile application for **Curry House Jar** - an authentic Indian takeaway restaurant in Bærum, Norway.

## 📱 Features

- ✅ User Authentication (Login/Register)
- ✅ Browse Menu with Categories
- ✅ Search & Filter Menu Items
- ✅ Shopping Cart Management
- ✅ Order Placement & Tracking
- ✅ Order History
- ✅ User Profile Management
- ✅ Zustand State Management
- ✅ Beautiful UI matching website design

## 🛠️ Tech Stack

- **React Native** - Mobile framework
- **Expo** - Development platform
- **Expo Router** - File-based navigation
- **Zustand** - State management
- **Axios** - API calls
- **AsyncStorage** - Local storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (will be installed automatically)
- Backend API running on http://localhost:5000

## 🚀 Installation

1. **Navigate to mobile-app directory:**

   ```bash
   cd mobile-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Update API URL (if backend is not on localhost):**
   Edit `config/config.js` and update the `API_URL`:
   ```javascript
   const API_URL = "http://YOUR_IP_ADDRESS:5000/api";
   ```

## 🏃‍♂️ Running the App

**Start the development server:**

```bash
npm start
```

This will open Expo Developer Tools in your browser.

**Run on different platforms:**

- **iOS Simulator:** Press `i` in terminal or click "Run on iOS simulator" in Expo Dev Tools
- **Android Emulator:** Press `a` in terminal or click "Run on Android device/emulator"
- **Physical Device:**
  1. Install **Expo Go** app from App Store/Play Store
  2. Scan the QR code shown in terminal/browser

## 📱 Testing on Physical Device

1. Make sure your phone and computer are on the same Wi-Fi network
2. Update the API URL in `config/config.js` to use your computer's IP address instead of localhost
3. Open Expo Go app and scan the QR code

**Example:**

```javascript
const API_URL = "http://192.168.1.100:5000/api"; // Use your computer's IP
```

## 🧪 Test Accounts

You can register a new account or use these test credentials:

```
Email: test@example.com
Password: password123
```

## 📁 Project Structure

```
mobile-app/
├── app/                    # App screens (Expo Router)
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.js       # Home screen
│   │   ├── menu.js        # Menu screen
│   │   ├── cart.js        # Cart screen
│   │   ├── orders.js      # Orders screen
│   │   └── profile.js     # Profile screen
│   ├── _layout.js         # Root layout
│   ├── index.js           # Entry point
│   ├── login.js           # Login screen
│   └── register.js        # Register screen
├── store/                 # Zustand stores
│   ├── authStore.js       # Authentication state
│   ├── cartStore.js       # Cart state
│   ├── menuStore.js       # Menu state
│   └── orderStore.js      # Orders state
├── services/              # API services
│   └── api.js             # API client & methods
├── config/                # Configuration
│   └── config.js          # App config & constants
├── assets/                # Images & fonts
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## 🎨 Design Colors

Based on Curry House Jar branding:

- **Primary:** #FF6B35 (Orange)
- **Secondary:** #F7931E (Light Orange)
- **Accent:** #C1272D (Red)
- **Background:** #FFFFFF (White)
- **Surface:** #F5F5F5 (Light Gray)

## 🔧 Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web browser
```

## 📡 API Integration

The app connects to the backend API for:

- User authentication
- Menu data
- Order management
- User profile

Make sure the backend server is running before testing the app.

## 🚨 Important Notes

1. **Backend Required:** The backend API must be running for the app to function
2. **Network Configuration:** Update API URL for physical device testing
3. **iOS Development:** Requires macOS and Xcode for iOS builds
4. **Android Development:** Requires Android Studio for Android builds

## 🔐 State Management

The app uses **Zustand** for global state management:

- **authStore:** User authentication & profile
- **cartStore:** Shopping cart items
- **menuStore:** Menu items & categories
- **orderStore:** Order history & tracking

## 📝 Features Breakdown

### Home Screen

- Restaurant banner carousel
- Contact information
- Feature highlights
- Chef's special items

### Menu Screen

- Search functionality
- Category filtering
- Item details with tags
- Add to cart with quantity

### Cart Screen

- Cart item management
- Quantity adjustment
- Remove items
- Order checkout

### Orders Screen

- Order history
- Order status tracking
- Order details
- Real-time updates

### Profile Screen

- User information
- Settings & preferences
- Contact information
- Logout functionality

## 🐛 Troubleshooting

**App can't connect to backend:**

- Check if backend is running
- Verify API URL in `config/config.js`
- Ensure devices are on same network (for physical devices)

**Expo Go not working:**

- Update Expo Go app to latest version
- Clear Expo cache: `expo start -c`

**Build errors:**

- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear watchman: `watchman watch-del-all`

## 📄 License

This project is for educational purposes.

## 👨‍💻 Developer

Created for Curry House Jar restaurant app project.

## 🙏 Acknowledgments

- Curry House Jar website: http://curryhousejar.no
- Expo Documentation
- React Native Documentation
- Zustand Documentation
