# Complete Deployment Guide - Everything Setup

## ✅ What's Already Configured

### Frontend (Vite + React)
- ✅ `vercel.json` configured for Vite
- ✅ Build scripts in `package.json`
- ✅ API service configured for environment variables
- ✅ All routes and components ready

### Backend (Node.js + Express)
- ✅ `server.js` with Express setup
- ✅ Health endpoints returning "OK"
- ✅ Uses `process.env.PORT`
- ✅ Database initialization non-blocking
- ✅ CORS configured
- ✅ All API routes ready

## 🚀 Step-by-Step Deployment

### PART 1: Deploy Backend to Railway

#### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### Step 2: Deploy on Railway

1. **Go to [railway.app](https://railway.app)**
2. **Sign up/Login** with GitHub
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**
5. **Click on the service** → **Settings**

#### Step 3: Configure Railway Settings

**Root Directory:**
```
server
```

**Build Command:**
```
npm install && npm run db:generate
```

**Start Command:**
```
npm start
```

**Healthcheck:**
- Path: `/health`
- Port: Auto

#### Step 4: Set Environment Variables in Railway

Go to **Variables** tab and add:

```
DATABASE_URL=postgresql://neondb_owner:npg_k2StvPZAsL8n@ep-empty-night-ahpf4c2a-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
DIRECT_URL=postgresql://neondb_owner:npg_k2StvPZAsL8n@ep-empty-night-ahpf4c2a.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

```
NODE_ENV=production
```

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```
*(Update this after you get your Vercel URL)*

#### Step 5: Get Backend URL

1. Railway will automatically deploy
2. Go to **Settings** → **Generate Domain**
3. Copy the URL (e.g., `https://your-app.up.railway.app`)
4. **Save this URL** - you'll need it for Vercel

#### Step 6: Test Backend

```bash
curl https://your-backend.up.railway.app/health
```

Should return: `OK`

---

### PART 2: Deploy Frontend to Vercel

#### Step 1: Deploy on Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure:**
   - Framework Preset: **Vite** (auto-detected)
   - Root Directory: `.` (root)
   - Build Command: `npm run build` (auto)
   - Output Directory: `dist` (auto)
   - Install Command: `npm install` (auto)
6. **Click "Deploy"**

#### Step 2: Set Environment Variable in Vercel

After deployment:

1. Go to **Project Settings** → **Environment Variables**
2. Click **Add New**
3. Enter:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.up.railway.app/api`
     *(Use the Railway URL you got in Part 1, Step 5)*
   - **Environment:** Production, Preview, Development (select all)
4. **Save**
5. **Redeploy** (go to Deployments → Latest → Redeploy)

#### Step 3: Update Backend CORS

Go back to Railway:

1. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
   *(Use your actual Vercel URL)*
2. **Redeploy** backend

---

## ✅ Verification Checklist

### Backend (Railway)
- [ ] Root Directory set to `server`
- [ ] Build Command: `npm install && npm run db:generate`
- [ ] Start Command: `npm start`
- [ ] All environment variables set
- [ ] Health endpoint returns "OK"
- [ ] Backend URL copied

### Frontend (Vercel)
- [ ] Project deployed
- [ ] `VITE_API_URL` environment variable set
- [ ] Value includes `/api` at the end
- [ ] Redeployed after setting variable
- [ ] Site is accessible

### Connection
- [ ] Backend health endpoint works
- [ ] Frontend can connect to backend
- [ ] No CORS errors
- [ ] Login/Registration works

---

## 🧪 Testing

### Test Backend
```bash
curl https://your-backend.up.railway.app/health
```
Expected: `OK`

### Test Frontend Connection

On your Vercel site, open browser console (F12):

```javascript
// Check API URL
console.log('API URL:', import.meta.env.VITE_API_URL);

// Test connection
fetch(`${import.meta.env.VITE_API_URL}/health`)
  .then(r => r.text())
  .then(data => {
    console.log('✅ Backend connected:', data);
  })
  .catch(err => {
    console.error('❌ Connection failed:', err);
  });
```

---

## 📋 Quick Reference

### Railway Settings
- **Root Directory:** `server`
- **Build Command:** `npm install && npm run db:generate`
- **Start Command:** `npm start`

### Vercel Settings
- **Framework:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_URL=https://your-backend.up.railway.app/api`

### Environment Variables

**Railway (Backend):**
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `NODE_ENV=production`
- `FRONTEND_URL`

**Vercel (Frontend):**
- `VITE_API_URL`

---

## 🎉 You're Done!

After completing these steps:

1. ✅ Backend running on Railway
2. ✅ Frontend running on Vercel
3. ✅ Frontend connected to backend
4. ✅ Everything working!

Your app is now live! 🚀

---

## 🆘 Troubleshooting

### Backend not starting
- Check Railway logs
- Verify Root Directory is `server`
- Check environment variables are set

### Frontend can't connect
- Verify `VITE_API_URL` is set in Vercel
- Check backend is running
- Verify CORS is configured

### 404 errors on routes
- Your `vercel.json` already has rewrites configured
- Should work automatically

---

## 📝 Files Summary

### Already Configured ✅
- `server/server.js` - Express server ready
- `server/package.json` - Has start script
- `vercel.json` - Vite configuration
- `package.json` - Build scripts
- `src/app/services/api.ts` - API service ready

### No Changes Needed ✅
Everything is already set up correctly!

---

## 🚀 Ready to Deploy!

Follow the steps above and your app will be live on:
- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.up.railway.app`

Good luck! 🎉
