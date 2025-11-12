# Render Deployment Configuration

## Your Deployment URL
**Production URL**: https://venue-booking-backend-kax5.onrender.com

## Environment Variables for Render

Go to your Render dashboard and set these environment variables:

### Required Variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | (Generate a secure secret) |
| `FRONTEND_URL` | `https://venue-booking-backend-kax5.onrender.com` |

## Quick Setup Steps

### 1. Update Environment Variables in Render

1. Go to: https://dashboard.render.com/
2. Select your service: `venue-booking-backend-kax5`
3. Go to **Environment** tab
4. Add/Update these variables:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=[click "Generate" button]
FRONTEND_URL=https://venue-booking-backend-kax5.onrender.com
```

### 2. Push Updated Code

```bash
git add .
git commit -m "Update configuration for Render deployment"
git push origin main
```

### 3. Redeploy on Render

After pushing:
- Render will automatically detect the changes
- It will rebuild and redeploy your application
- Wait for the build to complete (5-10 minutes)

### 4. Verify Deployment

Test these endpoints:

#### Health Check
```bash
curl https://venue-booking-backend-kax5.onrender.com/health
```
Expected: `{"status":"ok","message":"Study Room Booking API is running"}`

#### Get Rooms
```bash
curl https://venue-booking-backend-kax5.onrender.com/api/rooms
```
Expected: List of 4 rooms

#### Frontend
Visit: https://venue-booking-backend-kax5.onrender.com

Should load the React application.

## Troubleshooting

### If the app doesn't load after deployment:

1. **Check Build Logs**:
   - Go to Render dashboard
   - Click on your service
   - View the **Logs** tab
   - Look for errors during build or startup

2. **Verify Environment Variables**:
   - Ensure `NODE_ENV=production`
   - Ensure `PORT=10000`
   - Ensure `FRONTEND_URL` is set correctly

3. **Check Health Endpoint**:
   ```bash
   curl https://venue-booking-backend-kax5.onrender.com/health
   ```
   If this returns 404, the build may have failed.

4. **Force Rebuild**:
   - Go to Render dashboard
   - Click **Manual Deploy** → **Clear build cache & deploy**

## API Endpoints

Once deployed, your API will be available at:

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### Rooms
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/:id/availability?date=YYYY-MM-DD` - Get available slots

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/user` - Get user's bookings
- `DELETE /api/bookings/:id` - Cancel booking

### Admin
- `GET /api/admin/bookings` - Get all bookings (admin)
- `GET /api/admin/stats` - Get statistics (admin)
- `PATCH /api/admin/rooms/:id/status` - Update room status (admin)

## Default Credentials

Test with these credentials:

- **Admin**:
  - Email: `admin@nu.edu.om`
  - Password: `admin123`

- **Student**:
  - Email: `student@nu.edu.om`
  - Password: `student123`

## Build Commands (What Render Runs)

### Build Command:
```bash
cd client && npm install && npm run build && cd ../server && npm install && npm run build
```

### Start Command:
```bash
cd server && npm start
```

## Important Notes

1. **Free Tier**: Your service will spin down after 15 minutes of inactivity
2. **Cold Start**: First request may take 30-60 seconds after spin down
3. **In-Memory Storage**: Data is reset when service restarts
4. **HTTPS**: Automatically enabled by Render

## Next Steps

After successful deployment:

1. ✅ Test all features (login, rooms, bookings)
2. ✅ Verify no CORS errors in browser console
3. ✅ Check API endpoints are responding
4. ✅ Test booking creation and cancellation
5. ✅ Monitor logs for any errors

## Support

If you encounter issues:
- Check the **Logs** tab in Render dashboard
- Review the **Metrics** for CPU/memory usage
- Refer to [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting

---

**Your app URL**: https://venue-booking-backend-kax5.onrender.com
