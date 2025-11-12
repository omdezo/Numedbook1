# Deployment Checklist

Use this checklist before deploying to Render to ensure everything is configured correctly.

## Pre-Deployment Checklist

### ✅ Code Repository

- [ ] All code is committed to Git
- [ ] Code is pushed to GitHub
- [ ] Repository is accessible (public or connected to Render)
- [ ] Main/master branch is up to date

### ✅ Configuration Files

- [ ] `render.yaml` exists in root directory
- [ ] `server/.env.example` exists (template for environment variables)
- [ ] `.gitignore` is configured (no secrets committed)
- [ ] `.renderignore` exists (optional, for build optimization)

### ✅ Package Configuration

- [ ] Root `package.json` has build and start scripts
- [ ] Server `package.json` has all dependencies
- [ ] Client `package.json` has all dependencies
- [ ] TypeScript configurations are correct (`tsconfig.json`)

### ✅ Server Setup

- [ ] `server/src/server.ts` is configured for production
- [ ] Static file serving is configured
- [ ] CORS is configured with `FRONTEND_URL`
- [ ] Health check endpoint exists (`/health`)
- [ ] Environment variables are properly used

### ✅ Frontend Setup

- [ ] `client/vite.config.ts` is configured
- [ ] API calls use relative paths (`/api`)
- [ ] Build script works (`npm run build` in client folder)
- [ ] No hardcoded localhost URLs

### ✅ Build Commands

Test these locally before deploying:

```bash
# Test client build
cd client
npm install
npm run build
# Should create client/dist folder

# Test server build
cd ../server
npm install
npm run build
# Should create server/dist folder

# Test server start
npm start
# Should start without errors
```

### ✅ Environment Variables Ready

Prepare these values for Render:

- [ ] `NODE_ENV` → `production`
- [ ] `PORT` → `10000`
- [ ] `JWT_SECRET` → (will generate on Render)
- [ ] `FRONTEND_URL` → (will set after first deployment)

## Deployment Steps

### 1. Initial Deployment

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Configure build command:
  ```
  cd client && npm install && npm run build && cd ../server && npm install && npm run build
  ```
- [ ] Configure start command:
  ```
  cd server && npm start
  ```
- [ ] Add environment variables (except `FRONTEND_URL`)
- [ ] Set health check path: `/health`
- [ ] Deploy

### 2. After First Deployment

- [ ] Copy your app's URL from Render
- [ ] Add/Update `FRONTEND_URL` environment variable
- [ ] Wait for automatic redeployment
- [ ] Test the application

## Post-Deployment Verification

### ✅ Health Check

- [ ] Visit `https://your-app.onrender.com/health`
- [ ] Should return: `{"status":"ok","message":"Study Room Booking API is running"}`

### ✅ Frontend

- [ ] Visit `https://your-app.onrender.com`
- [ ] Frontend loads without errors
- [ ] Check browser console for errors
- [ ] Check Network tab for failed requests

### ✅ Authentication

- [ ] Login as Admin: `admin@nu.edu.om` / `admin123`
- [ ] Login as Student: `student@nu.edu.om` / `student123`

### ✅ Core Features

- [ ] View rooms (4 rooms should display)
- [ ] Click on a room (booking modal opens)
- [ ] Select a date (tomorrow or later)
- [ ] Select time slot (available slots are selectable)
- [ ] Create a booking (success message appears)
- [ ] View "My Bookings" (booking appears)
- [ ] Cancel a booking (booking is removed)

### ✅ API Endpoints

Test these with curl or Postman:

```bash
# Health check
curl https://your-app.onrender.com/health

# Get rooms
curl https://your-app.onrender.com/api/rooms

# Get room availability
curl "https://your-app.onrender.com/api/rooms/room-1/availability?date=2025-01-20"
```

## Common Issues and Solutions

### Build Fails

**Symptom**: Deployment fails during build phase

**Check**:
- [ ] Review build logs in Render dashboard
- [ ] Verify all dependencies are in package.json
- [ ] Test build locally first
- [ ] Check for TypeScript errors

### App Doesn't Load

**Symptom**: Deployment succeeds but app shows error

**Check**:
- [ ] Review runtime logs in Render dashboard
- [ ] Verify `NODE_ENV=production` is set
- [ ] Check health endpoint response
- [ ] Verify start command is correct

### CORS Errors

**Symptom**: Frontend can't communicate with backend

**Check**:
- [ ] `FRONTEND_URL` is set correctly
- [ ] `FRONTEND_URL` matches actual app URL
- [ ] Redeploy after setting `FRONTEND_URL`

### 404 Errors

**Symptom**: API or routes return 404

**Check**:
- [ ] Server build completed successfully
- [ ] `server/dist` folder was created
- [ ] Static files path is correct in server.ts
- [ ] Routes are properly registered

### Cold Start Delay

**Symptom**: First request takes 30-60 seconds

**This is normal** for Render's free tier:
- [ ] Service spins down after 15 minutes of inactivity
- [ ] First request "wakes up" the service
- [ ] Subsequent requests are fast
- [ ] Upgrade to paid plan for always-on service

## Monitoring Checklist

### Daily

- [ ] Check application is accessible
- [ ] Review error logs if issues occur

### Weekly

- [ ] Review Render metrics (CPU, memory, bandwidth)
- [ ] Check for failed deployments
- [ ] Verify automatic deployments from GitHub are working

### Monthly

- [ ] Review usage against free tier limits
- [ ] Consider upgrading if needed
- [ ] Check for dependency updates

## Security Checklist

### Before Going Live

- [ ] `JWT_SECRET` is strong and unique (auto-generated)
- [ ] No secrets in Git history
- [ ] CORS is properly configured
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Environment variables are not logged

### Regular Maintenance

- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Review access logs for suspicious activity
- [ ] Backup critical data (if database added)

## Rollback Plan

If deployment fails or introduces bugs:

1. **Immediate Rollback**:
   - [ ] Go to Render dashboard
   - [ ] Click "Manual Deploy"
   - [ ] Select previous successful commit
   - [ ] Deploy

2. **Fix and Redeploy**:
   - [ ] Identify the issue
   - [ ] Fix in local development
   - [ ] Test thoroughly locally
   - [ ] Commit and push fix
   - [ ] Monitor new deployment

## Performance Checklist

### Optimization

- [ ] Client build is optimized (Vite production mode)
- [ ] Server build is optimized (TypeScript compiled)
- [ ] Static files are served correctly
- [ ] Health check responds quickly

### Monitoring

- [ ] Response times are acceptable (<2s)
- [ ] No memory leaks (check Render metrics)
- [ ] CPU usage is reasonable
- [ ] Bandwidth usage is within limits

## Success Criteria

Your deployment is successful when:

- ✅ Health endpoint returns OK
- ✅ Frontend loads without errors
- ✅ Users can log in
- ✅ Users can view rooms
- ✅ Users can create bookings
- ✅ Users can cancel bookings
- ✅ No console errors
- ✅ No CORS errors
- ✅ API endpoints respond correctly

---

## Quick Reference

### Render Dashboard URLs
- Dashboard: https://dashboard.render.com
- Your Service: `https://dashboard.render.com/web/[service-id]`

### Build Commands
```bash
# Full build (what Render runs)
cd client && npm install && npm run build && cd ../server && npm install && npm run build

# Start (what Render runs after build)
cd server && npm start
```

### Environment Variables
```
NODE_ENV=production
PORT=10000
JWT_SECRET=[auto-generated]
FRONTEND_URL=[your-app-url]
```

### Default Credentials
- **Admin**: admin@nu.edu.om / admin123
- **Student**: student@nu.edu.om / student123

---

**Ready to deploy?** Follow the detailed steps in [DEPLOYMENT.md](./DEPLOYMENT.md)!
