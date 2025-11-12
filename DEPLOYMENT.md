# Deployment Guide - Study Room Booking System

This guide will help you deploy the Study Room Booking System to Render from GitHub.

## Prerequisites

- GitHub account
- Render account (free tier works fine)
- Your code pushed to a GitHub repository

## Deployment Architecture

The application is deployed as a single web service on Render that:
1. Builds the React frontend and compiles it to static files
2. Builds the Node.js/TypeScript backend
3. Serves the frontend static files from the backend server in production
4. Handles all API requests through the same server

## Step-by-Step Deployment on Render

### 1. Push Your Code to GitHub

Make sure your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** button
3. Select **"Web Service"**
4. Connect your GitHub repository
5. Select the repository containing this project

### 3. Configure the Web Service

Use the following configuration:

#### Basic Settings
- **Name**: `study-room-booking` (or your preferred name)
- **Region**: Choose the closest region to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (or `.` for root)
- **Environment**: `Node`
- **Build Command**:
  ```bash
  cd client && npm install && npm run build && cd ../server && npm install && npm run build
  ```
- **Start Command**:
  ```bash
  cd server && npm start
  ```

#### Advanced Settings

##### Environment Variables
Add the following environment variables:

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | Required |
| `PORT` | `10000` | Render's default port |
| `JWT_SECRET` | (Click "Generate") | Let Render auto-generate a secure secret |
| `FRONTEND_URL` | (Leave empty initially) | Will be set after first deployment |

##### Health Check
- **Health Check Path**: `/health`

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will automatically start building and deploying your application
3. Wait for the build to complete (this may take 5-10 minutes for the first deployment)
4. Once deployed, you'll see a URL like: `https://study-room-booking.onrender.com`

### 5. Update FRONTEND_URL (Important!)

After your first deployment:

1. Copy your app's URL (e.g., `https://study-room-booking.onrender.com`)
2. Go to the **Environment** tab in your Render service
3. Update the `FRONTEND_URL` environment variable with your app's URL
4. This will trigger an automatic redeployment
5. Wait for the redeployment to complete

### 6. Test Your Deployment

Visit your app's URL and test:

1. **Health Check**: `https://your-app.onrender.com/health`
   - Should return: `{"status":"ok","message":"Study Room Booking API is running"}`

2. **Frontend**: `https://your-app.onrender.com`
   - Should load the React application

3. **Login**:
   - Admin: `admin@nu.edu.om` / `admin123`
   - Student: `student@nu.edu.om` / `student123`

## Alternative: Deploy Using render.yaml

For easier deployment, you can use the included `render.yaml` file:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Review the configuration
6. Click **"Apply"**
7. Remember to update `FRONTEND_URL` after the first deployment (see Step 5 above)

## Environment Variables Explained

### Required Variables

- **`NODE_ENV`**: Set to `production` to enable production optimizations
  - Enables serving of static frontend files
  - Configures CORS for production domain
  - Optimizes logging and error handling

- **`PORT`**: The port the server listens on
  - Render assigns port `10000` by default
  - The server will use this port automatically

- **`JWT_SECRET`**: Secret key for signing JWT tokens
  - **CRITICAL**: Must be a strong, random string
  - Used for user authentication
  - Let Render generate this for security

### Optional Variables

- **`FRONTEND_URL`**: Your app's public URL
  - Used for CORS configuration
  - Format: `https://your-app.onrender.com`
  - Leave empty initially, then update after first deployment

## Troubleshooting

### Build Fails

**Issue**: Build command fails with npm errors

**Solutions**:
1. Ensure all dependencies are in `package.json`
2. Check that both `client` and `server` folders have `package.json`
3. Review build logs for specific error messages

### App Doesn't Load

**Issue**: Deployment succeeds but app doesn't load

**Solutions**:
1. Check the **Logs** tab in Render dashboard
2. Verify the **Health Check** is passing
3. Ensure `NODE_ENV=production` is set
4. Check that the build command completed successfully

### CORS Errors

**Issue**: Frontend can't communicate with backend (CORS errors in browser console)

**Solutions**:
1. Verify `FRONTEND_URL` environment variable is set correctly
2. Make sure `FRONTEND_URL` matches your actual app URL exactly
3. Redeploy after updating `FRONTEND_URL`

### API 404 Errors

**Issue**: API routes return 404 errors

**Solutions**:
1. Check that the build completed successfully
2. Verify server logs show "Server running" message
3. Test the health endpoint: `/health`
4. Ensure `server/dist` folder was created during build

### Free Tier Limitations

**Note**: Render's free tier has some limitations:

- Services spin down after 15 minutes of inactivity
- First request after spin-down may take 30-60 seconds (cold start)
- 750 hours/month of runtime (sufficient for one service)
- This is normal behavior for the free tier

**Solutions**:
- Upgrade to a paid plan for always-on service
- Implement a keep-alive ping service (not recommended due to environmental impact)
- Accept the cold start delay as a trade-off for free hosting

## Continuous Deployment

Render automatically redeploys your app when you push to your connected GitHub branch:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Render will automatically detect the push and redeploy
4. Monitor the deployment in the Render dashboard

## Manual Redeployment

To manually trigger a redeployment:

1. Go to your service in Render dashboard
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Or click **"Clear build cache & deploy"** if you need a fresh build

## Monitoring and Logs

### View Logs
1. Go to your service in Render dashboard
2. Click the **"Logs"** tab
3. View real-time logs of your application

### View Metrics
1. Click the **"Metrics"** tab
2. View CPU, memory, and bandwidth usage
3. Monitor response times and error rates

## Custom Domain (Optional)

To use your own domain:

1. Go to the **"Settings"** tab in your Render service
2. Scroll to **"Custom Domain"**
3. Click **"Add Custom Domain"**
4. Enter your domain (e.g., `booking.yourdomain.com`)
5. Follow Render's instructions to configure DNS
6. Update `FRONTEND_URL` to your custom domain
7. Redeploy

## Security Considerations

### In Production:

1. **JWT_SECRET**: Always use a strong, randomly generated secret
   - Never commit secrets to version control
   - Use Render's "Generate" button for secure random values

2. **HTTPS**: Render provides free SSL certificates automatically
   - All traffic is encrypted by default
   - No additional configuration needed

3. **Environment Variables**: Store all secrets in Render's environment variables
   - Never hardcode secrets in your code
   - Use `.env.example` as a template, not `.env`

4. **CORS**: Properly configured to only allow requests from your domain
   - `FRONTEND_URL` restricts API access
   - Update if you change domains

## Backup and Data Persistence

**Important Note**: This application uses in-memory storage, which means:
- All data is reset when the service restarts
- No persistent database is configured
- Suitable for demo/testing purposes only

For production use with persistent data:
1. Add a PostgreSQL database (see CLAUDE.md for Prisma setup)
2. Configure database connection in environment variables
3. Run migrations on deployment

## Cost Estimate

**Free Tier**:
- Web Service: Free (with limitations)
- SSL Certificate: Free
- Custom Domain: Free (domain registration separate)

**Paid Options**:
- Starter Plan ($7/month):
  - Always-on service (no spin down)
  - Better performance
  - Recommended for production use

## Support and Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Project Issues**: Check your GitHub repository's issues page
- **Application Documentation**: See `CLAUDE.md` and `README.md`

## Next Steps After Deployment

1. **Test thoroughly**: Try all features of your application
2. **Monitor logs**: Keep an eye on the logs for errors
3. **Set up custom domain** (optional): For a professional appearance
4. **Add database**: If you need persistent data (see CLAUDE.md)
5. **Set up monitoring**: Use Render's metrics or external services
6. **Plan for scaling**: Consider upgrading as your user base grows

## Quick Reference

### Important URLs
- Render Dashboard: https://dashboard.render.com
- Your App: `https://your-service-name.onrender.com`
- Health Check: `https://your-service-name.onrender.com/health`
- API Docs: `https://your-service-name.onrender.com/api` (see server logs for endpoints)

### Default Credentials
- **Admin**: `admin@nu.edu.om` / `admin123`
- **Student**: `student@nu.edu.om` / `student123`

### Important Commands
```bash
# Build frontend and backend
npm run build

# Start production server
npm start

# View logs in Render
# (Use the Render dashboard)
```

---

**Congratulations!** Your Study Room Booking System is now deployed and accessible worldwide! 🎉
