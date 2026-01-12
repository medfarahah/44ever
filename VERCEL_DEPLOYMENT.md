# Deploy Frontend to Vercel (Vite)

## Quick Deploy

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with GitHub
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Configure Project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
6. **Add Environment Variable:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api` (your backend URL)
   - **Environment:** Production, Preview, Development
7. **Click "Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## Vercel Configuration

Your `vercel.json` is already configured:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This handles:
- ✅ SPA routing (all routes → index.html)
- ✅ Vite build configuration
- ✅ Output directory

## Environment Variables

### Required in Vercel

**VITE_API_URL**
- **Value:** `https://your-backend-url.com/api`
- **Important:** Must include `/api` at the end
- **Set for:** Production, Preview, Development

### How to Set

1. Go to **Project Settings** → **Environment Variables**
2. Click **Add New**
3. Enter:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api`
   - **Environment:** Select all
4. **Save**
5. **Redeploy** after adding

## Build Configuration

### package.json Scripts

Your `package.json` already has:

```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}
```

Vercel will automatically:
- Run `npm install`
- Run `npm run build`
- Serve files from `dist` directory

## Important Notes

### 1. Backend Still Needed

Even though you're deploying frontend to Vercel, you still need a backend:

- **Option A:** Deploy backend to Railway/Render/Fly.io
- **Option B:** Use Vercel Serverless Functions (not recommended for your Express app)
- **Option C:** Use a backend-as-a-service

### 2. API URL Configuration

Make sure `VITE_API_URL` is set correctly:

```javascript
// In your code, this will be:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### 3. CORS Configuration

Your backend needs to allow your Vercel domain:

**In backend environment variables:**
```
FRONTEND_URL=https://your-app.vercel.app
```

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] `VITE_API_URL` environment variable set
- [ ] Backend deployed and accessible
- [ ] `FRONTEND_URL` set in backend
- [ ] Test deployment

## Testing After Deployment

### 1. Check Build

Vercel will show build logs. Look for:
```
✓ Built in X seconds
```

### 2. Test Health Endpoint

From browser console on your Vercel site:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);

fetch(`${import.meta.env.VITE_API_URL}/health`)
  .then(r => r.text())
  .then(console.log); // Should log "OK"
```

### 3. Test Frontend

- Visit your Vercel URL
- Check browser console for errors
- Test login/registration
- Test product loading

## Troubleshooting

### Build Fails

**Check:**
- All dependencies in `package.json`
- No TypeScript errors
- No import errors
- Build command is correct

### API Not Connecting

**Check:**
- `VITE_API_URL` is set in Vercel
- Value includes `/api` at the end
- Backend is running
- CORS is configured

### 404 on Routes

**Fix:** Your `vercel.json` already has rewrites configured. If still having issues, ensure:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Quick Start

1. **Push code to GitHub**
2. **Go to vercel.com**
3. **Import repository**
4. **Set Framework: Vite**
5. **Add `VITE_API_URL` environment variable**
6. **Deploy**

That's it! Your Vite app will be live on Vercel.
