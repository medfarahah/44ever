# Deployment Guide

## Overview

This application consists of two parts:
1. **Frontend** (React/Vite) - Deployed on Vercel
2. **Backend** (Node.js/Express) - Needs to be deployed separately

## Frontend Deployment (Vercel)

The frontend is already deployed on Vercel. However, you need to configure the backend API URL.

### Step 1: Set Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api` (replace with your actual backend URL)
   - **Environment:** Production, Preview, Development (select all)

4. **Redeploy** your application after adding the environment variable

## Backend Deployment Options

You need to deploy your backend separately. Here are the recommended options:

### Option 1: Railway (Recommended - Easy Setup)

1. Go to [Railway.app](https://railway.app)
2. Sign up/login
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway will detect it's a Node.js project
6. Set the **Root Directory** to `server`
7. Add environment variables:
   - `DATABASE_URL` - Your Neon database connection string
   - `DIRECT_URL` - Your Neon direct connection string
   - `JWT_SECRET` - A random secret key (generate one)
   - `PORT` - Railway will set this automatically
   - `NODE_ENV` - `production`
8. Railway will automatically deploy and give you a URL like `https://your-app.railway.app`
9. Use this URL in your Vercel `VITE_API_URL` environment variable

### Option 2: Render

1. Go to [Render.com](https://render.com)
2. Sign up/login
3. Click **"New"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name:** `44ever-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables (same as Railway)
7. Render will give you a URL like `https://your-app.onrender.com`
8. Use this URL in your Vercel `VITE_API_URL` environment variable

### Option 3: Fly.io

1. Install Fly CLI: `npm install -g flyctl`
2. In the `server` directory, run: `fly launch`
3. Follow the prompts
4. Add environment variables using: `fly secrets set KEY=value`
5. Deploy: `fly deploy`

## Environment Variables for Backend

Make sure to set these in your backend hosting platform:

```env
DATABASE_URL=postgresql://neondb_owner:npg_k2StvPZAsL8n@ep-empty-night-ahpf4c2a-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
DIRECT_URL=postgresql://neondb_owner:npg_k2StvPZAsL8n@ep-empty-night-ahpf4c2a.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
PORT=5000
```

## Quick Setup Checklist

- [ ] Deploy backend to Railway/Render/Fly.io
- [ ] Get backend URL (e.g., `https://your-backend.railway.app`)
- [ ] Add `VITE_API_URL` environment variable in Vercel
- [ ] Set value to `https://your-backend.railway.app/api`
- [ ] Redeploy frontend on Vercel
- [ ] Test the application

## Testing After Deployment

1. Check if backend is running: Visit `https://your-backend-url.com/api/health`
2. Check frontend: Visit your Vercel URL
3. Try logging in with admin credentials
4. Test product loading
5. Test registration

## Troubleshooting

### "Cannot connect to server" error
- Check if backend is deployed and running
- Verify `VITE_API_URL` is set correctly in Vercel
- Make sure the backend URL includes `/api` at the end
- Check backend logs for errors

### CORS errors
- Make sure backend CORS is configured to allow your Vercel domain
- Check `server/server.js` CORS settings

### Database connection errors
- Verify `DATABASE_URL` is set correctly in backend environment
- Check if Neon database is accessible
- Verify Prisma Client is generated (`npm run db:generate`)
