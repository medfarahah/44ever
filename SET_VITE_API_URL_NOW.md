# Set VITE_API_URL in Vercel - Quick Fix

## The Error

```
API server is not configured. Please set VITE_API_URL environment variable.
```

This means `VITE_API_URL` is not set in your Vercel project.

## Quick Fix (3 Steps)

### Step 1: Get Your Backend URL

**If you deployed backend to Railway:**
1. Go to Railway dashboard
2. Open your service
3. Go to **Settings** → **Generate Domain** (if not already done)
4. Copy the URL (e.g., `https://your-app.up.railway.app`)

**If backend is not deployed yet:**
- Deploy backend first (see `COMPLETE_DEPLOYMENT_GUIDE.md`)
- Then come back here

### Step 2: Set Environment Variable in Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Open your project**
3. **Click "Settings"** (top menu)
4. **Click "Environment Variables"** (left sidebar)
5. **Click "Add New"**
6. **Fill in:**
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.up.railway.app/api`
     - ⚠️ **IMPORTANT:** Must include `/api` at the end!
     - Example: `https://my-app.up.railway.app/api`
   - **Environment:** 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - (Select all three)
7. **Click "Save"**

### Step 3: Redeploy

**After adding the environment variable:**

1. Go to **Deployments** tab
2. Click on the **latest deployment**
3. Click **"Redeploy"** button
4. Wait for deployment to complete

**OR** push a new commit to trigger redeploy:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push
```

## Verify It's Working

### Method 1: Check in Browser Console

1. Visit your Vercel site
2. Open browser console (F12)
3. Run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Expected:** Should show your backend URL with `/api`

**If shows `undefined`:**
- Environment variable not set correctly
- App not redeployed after setting variable
- Variable name is wrong (must be exactly `VITE_API_URL`)

### Method 2: Test Connection

In browser console:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
if (apiUrl) {
  fetch(`${apiUrl}/health`)
    .then(r => r.text())
    .then(data => {
      console.log('✅ Backend connected:', data);
    })
    .catch(err => {
      console.error('❌ Connection failed:', err);
    });
} else {
  console.error('❌ VITE_API_URL is not set!');
}
```

## Common Mistakes

### ❌ Wrong Format
```
VITE_API_URL=https://my-app.up.railway.app
```
Missing `/api` at the end!

### ✅ Correct Format
```
VITE_API_URL=https://my-app.up.railway.app/api
```
Includes `/api` at the end!

### ❌ Not Redeployed
After adding environment variable, you **MUST** redeploy!

### ❌ Wrong Variable Name
Must be exactly: `VITE_API_URL` (case-sensitive)

## Quick Checklist

- [ ] Backend is deployed and running
- [ ] Backend URL copied (e.g., `https://my-app.up.railway.app`)
- [ ] `VITE_API_URL` added in Vercel
- [ ] Value includes `/api` at the end
- [ ] Set for all environments (Production, Preview, Development)
- [ ] Vercel app redeployed after adding variable
- [ ] Tested in browser console

## Still Not Working?

1. **Check variable name:** Must be exactly `VITE_API_URL`
2. **Check value format:** Must end with `/api`
3. **Redeploy:** Must redeploy after adding variable
4. **Check backend:** Make sure backend is running
5. **Test backend directly:**
   ```bash
   curl https://your-backend-url.up.railway.app/health
   ```
   Should return: `OK`

## Example

**If your Railway backend URL is:**
```
https://laudable-quietude.up.railway.app
```

**Then set `VITE_API_URL` to:**
```
https://laudable-quietude.up.railway.app/api
```

Notice the `/api` at the end!

---

## After Setting

Once you've set `VITE_API_URL` and redeployed:

1. ✅ Error will disappear
2. ✅ Frontend can connect to backend
3. ✅ Login/Registration will work
4. ✅ Products will load
5. ✅ Everything will work!

Good luck! 🚀
