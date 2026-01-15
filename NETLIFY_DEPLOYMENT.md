# Netlify Deployment Guide

This guide will help you deploy your portfolio to Netlify for free.

## Prerequisites

1. A GitHub account (or GitLab/Bitbucket)
2. A Netlify account (sign up at https://netlify.com - it's free!)
3. A backend hosting service (see Backend Deployment section below)

## Step 1: Deploy Backend First

Since Netlify doesn't support long-running Node.js servers, you need to deploy your backend separately. Here are free options:

### Option A: Render.com (Recommended - Free Tier Available)

1. Go to https://render.com and sign up
2. Create a new "Web Service"
3. Connect your GitHub repository
4. Set the following:
   - **Name**: portfolio-backend (or any name)
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: (leave empty or `npm install`)
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Add Environment Variables in Render:
   - `PORT`: 10000 (or leave default)
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: production

6. Click "Create Web Service"
7. Wait for deployment and copy your backend URL (e.g., `https://portfolio-backend.onrender.com`)

### Option B: Railway.app (Free Tier Available)

1. Go to https://railway.app and sign up
2. Create a new project
3. Add a new service from GitHub
4. Select your repository
5. Set Root Directory to `server`
6. Add environment variables:
   - `MONGO_URI`: Your MongoDB connection string
   - `NODE_ENV`: production
7. Deploy and copy your backend URL

## Step 2: Prepare Your Code

1. Make sure your code is pushed to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

## Step 3: Deploy Frontend to Netlify

### Method 1: Deploy via Netlify Dashboard (Recommended)

1. Go to https://app.netlify.com
2. Click "Add new site" > "Import an existing project"
3. Choose your Git provider (GitHub, GitLab, or Bitbucket)
4. Select your repository
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Click "Show advanced" and add environment variables:
   - **Variable name**: `REACT_APP_API_URL`
   - **Value**: Your backend URL from Step 1 (e.g., `https://portfolio-backend.onrender.com`)
7. Click "Deploy site"
8. Wait for deployment to complete

### Method 2: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Navigate to your project root:
   ```bash
   cd /Users/smartasia/Desktop/portfo
   ```

4. Initialize and deploy:
   ```bash
   netlify init
   # Follow the prompts:
   # - Create & configure a new site
   # - Team: Your team
   # - Site name: (choose a name or press enter for random)
   # - Build command: npm run build (in client directory)
   # - Directory to deploy: client/build
   
   # Set environment variable
   netlify env:set REACT_APP_API_URL https://your-backend-url.onrender.com
   
   # Deploy
   netlify deploy --prod
   ```

## Step 4: Update CORS Settings (If Needed)

If you get CORS errors, update your backend `server/server.js`:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

Or for all origins (less secure, but easier for development):
```javascript
app.use(cors());
```

## Step 5: Custom Domain (Optional)

1. In Netlify dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Troubleshooting

### Build Fails
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Make sure Node version is compatible (Netlify uses Node 18 by default)

### API Calls Not Working
- Verify `REACT_APP_API_URL` is set correctly in Netlify environment variables
- Check browser console for errors
- Ensure backend is deployed and accessible
- Check CORS settings on backend

### Images Not Loading
- Ensure image paths are relative (starting with `/images/...`)
- Check that images are in `client/public/images/`
- Verify static file serving in backend

### 404 Errors on Refresh
- The `_redirects` file should handle this automatically
- If not, check that `netlify.toml` has the redirect rule

## Environment Variables Summary

### Frontend (Netlify)
- `REACT_APP_API_URL`: Your backend API URL

### Backend (Render/Railway)
- `PORT`: Server port (usually auto-set)
- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: production

## Free Tier Limits

### Netlify
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

### Render
- 750 hours/month (free tier)
- Spins down after 15 minutes of inactivity
- First request after spin-down may be slow (~30 seconds)

### Railway
- $5 free credit/month
- Pay-as-you-go after credit is used

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check browser console for errors
3. Verify environment variables are set correctly
4. Ensure backend is running and accessible
