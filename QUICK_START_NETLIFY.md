# Quick Start: Deploy to Netlify

## 🚀 Fast Deployment Steps

### 1. Deploy Backend (5 minutes)

**Using Render.com (Free):**
1. Go to https://render.com → Sign up
2. Click "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - **Root Directory**: `server`
   - **Build Command**: (leave empty)
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Add Environment Variables:
   - `MONGO_URI`: (your MongoDB connection string)
   - `NODE_ENV`: `production`
6. Deploy → Copy your backend URL (e.g., `https://portfolio-backend.onrender.com`)

### 2. Deploy Frontend to Netlify (3 minutes)

1. Go to https://app.netlify.com → Sign up
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub → Select your repo
4. Build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
5. Click "Show advanced" → Add environment variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: Your backend URL from step 1
6. Click "Deploy site"
7. Done! Your site will be live at `https://your-site-name.netlify.app`

## ✅ That's it!

Your portfolio is now live on Netlify for free!

## 📝 Important Notes

- **Backend URL**: Make sure to update `REACT_APP_API_URL` in Netlify with your actual backend URL
- **MongoDB**: You need a MongoDB database (MongoDB Atlas has a free tier)
- **First Request**: Render free tier spins down after inactivity - first request may take ~30 seconds

## 🔧 Troubleshooting

**API not working?**
- Check `REACT_APP_API_URL` is set in Netlify environment variables
- Verify backend is deployed and accessible
- Check browser console for errors

**Build fails?**
- Check Netlify build logs
- Ensure all dependencies are in `package.json`

For detailed instructions, see `NETLIFY_DEPLOYMENT.md`
