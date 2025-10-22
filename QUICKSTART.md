# 🚀 Quick Start Guide

## Get the Study Room Hub Running in Minutes!

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

---

## 📦 Installation

### Step 1: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## ▶️ Running the Application

### Terminal 1: Start Backend Server
```bash
cd server
npm run dev
```

**✅ Backend will run on:** `http://localhost:3000`

You should see:
```
🚀 Server running on http://localhost:3000
📚 API endpoints:
   - GET    /api/rooms
   - GET    /api/rooms/:id
   ...
```

### Terminal 2: Start Frontend App
```bash
cd client
npm run dev
```

**✅ Frontend will run on:** `http://localhost:5173`

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🌐 Open in Browser

Navigate to: **http://localhost:5173**

---

## ✨ What to Expect

### Beautiful Landing Page
- **Gradient hero header** with animated background
- **4 interactive room cards** with hover effects
- **Real-time stats** showing available rooms and active bookings

### Booking a Room
1. Click on any **available room card**
2. Beautiful modal opens with:
   - **Date picker** (tomorrow onwards)
   - **Duration selector** (1 or 2 hours)
   - **Time slot grid** (7 AM - 9 PM)
3. Select your slot and click **"Confirm Booking"**
4. Watch the **success animation** ✓

### My Bookings
- Switch to **"My Bookings"** tab
- View beautifully designed **booking cards**
- **Cancel** bookings with one click

---

## 🎨 UI Highlights

### Animations You'll See
- ✨ **Fade-in** animations on page load
- 🎯 **Slide-up** animations for cards
- 💫 **Scale** effects on hover
- 🌊 **SVG wave** decorations
- ⚡ **Skeleton loaders** while fetching data
- 🎊 **Success/Error** toast notifications

### Color Scheme
- **Primary**: Blue to Indigo gradients
- **Available**: Green gradients
- **Occupied**: Red gradients
- **Maintenance**: Yellow/Orange gradients

---

## 🔧 Troubleshooting

### Port Already in Use?

**Backend (3000):**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

**Frontend (5173):**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Dependencies Not Installing?
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

### Frontend Not Connecting to Backend?
- Make sure backend is running on port 3000
- Check `vite.config.ts` proxy settings
- Both servers must be running simultaneously

---

## 📱 Mobile Testing

The UI is fully responsive! Test on:
- iPhone/Android phones
- Tablets
- Desktop (1920px+)

Open in browser DevTools and toggle device emulation.

---

## 🎯 Test the Full Flow

1. **View Rooms** - See all 4 rooms with status badges
2. **Book Room A** - Tomorrow at 10 AM for 1 hour
3. **Check "My Bookings"** - See your active booking
4. **Try Booking Same Slot** - Should show error
5. **Cancel Booking** - Watch the smooth animation
6. **Book Again** - Different time slot

---

## 🎪 Pro Tips

### See Real-time Updates
1. Open app in **two browser tabs**
2. Book a room in **Tab 1**
3. Switch to **Tab 2** and refresh
4. See the slot now marked as **occupied**

### Test Validation
- Try booking **today** (should fail - must be 1 day advance)
- Try booking at **11 PM** (should fail - out of operating hours)
- Try making **3 bookings** (should fail - max 2 active)
- Try booking **3 hours** (should fail - max 2 hours)

---

## 🏆 Success!

You should now have a **stunning, production-ready study room booking system** running locally!

**Enjoy the modern UI with:**
- ✨ Beautiful gradients
- 🎯 Smooth animations
- 💫 Interactive components
- 🎨 Premium design

---

## 📞 Need Help?

Check `CLAUDE.md` for complete architecture documentation or `README.md` for detailed system info.

Happy booking! 📚✨
