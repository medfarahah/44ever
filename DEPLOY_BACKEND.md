# Backend Deployment Guide

## Quick Deploy to Railway (Recommended)

### Step 1: Prepare for Deployment

1. Make sure your `server/.env` has all required variables
2. Commit and push your code to GitHub

### Step 2: Deploy on Railway

1. Go to https://railway.app and sign up/login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Click **"Add Service"** → **"GitHub Repo"**
5. In the service settings:
   - Set **Root Directory** to `server`
   - Railway will auto-detect Node.js
6. Go to **Variables** tab and add:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_k2StvPZAsL8n@ep-empty-night-ahpf4c2a-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   DIRECT_URL=postgresql://neondb_owner:npg_k2StvPZAsL8n@ep-empty-night-ahpf4c2a.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   ```
7. Railway will automatically deploy
8. Once deployed, click on the service → **Settings** → **Generate Domain**
9. Copy the URL (e.g., `https://your-app.railway.app`)

### Step 3: Update Frontend

1. Go to Vercel dashboard
2. **Settings** → **Environment Variables**
3. Add: `VITE_API_URL` = `https://your-app.railway.app/api`
4. Redeploy your frontend

## Alternative: Deploy to Render

1. Go to https://render.com
2. **New** → **Web Service**
3. Connect GitHub repo
4. Settings:
   - **Name:** `44ever-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install && npm run db:generate`
   - **Start Command:** `npm start`
5. Add environment variables (same as Railway)
6. Deploy and get URL
7. Update Vercel `VITE_API_URL`

## Testing

After deployment, test:
- `https://your-backend-url.com/api/health` - Should return `{"status":"ok"}`
- Try admin login from your Vercel frontend
