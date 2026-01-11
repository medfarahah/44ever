# Fix "Cannot connect to server" Error

## The Error

```
Cannot connect to server. Please check if the backend is running and VITE_API_URL is set correctly.
```

This means your frontend cannot reach your backend API.

## Quick Checklist

- [ ] Backend is deployed and running
- [ ] `VITE_API_URL` is set in Vercel
- [ ] `VITE_API_URL` includes `/api` at the end
- [ ] Vercel app is redeployed after setting the variable
- [ ] Backend health endpoint is accessible
- [ ] CORS is configured correctly

## Step-by-Step Fix

### 1. Verify Backend is Running

**Test the health endpoint:**

```bash
curl https://your-backend-url.com/health
```

**Or in browser:**
```
https://your-backend-url.com/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

**If this fails:**
- Backend is not running
- Check deployment logs
- Verify backend is deployed correctly

### 2. Check VITE_API_URL in Vercel

**In Vercel Dashboard:**

1. Go to your project
2. **Settings** → **Environment Variables**
3. Look for `VITE_API_URL`
4. Verify the value:
   - ✅ Correct: `https://your-backend-url.com/api`
   - ❌ Wrong: `https://your-backend-url.com` (missing `/api`)
   - ❌ Wrong: `http://your-backend-url.com/api` (should be `https`)

**If not set or wrong:**
1. Add/Edit the variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api`
   - **Environment:** Select all (Production, Preview, Development)
2. **Save**
3. **Redeploy** your Vercel app

### 3. Verify VITE_API_URL is Loaded

**On your deployed Vercel site:**

1. Open browser console (F12)
2. Run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

**Expected:** Should show your backend URL with `/api`

**If shows `undefined`:**
- Environment variable not set correctly
- App not redeployed after setting variable
- Variable name is wrong (must be exactly `VITE_API_URL`)

### 4. Test API Connection

**From browser console on your Vercel site:**

```javascript
// Test health endpoint
const apiUrl = import.meta.env.VITE_API_URL;
console.log('Testing:', apiUrl);

fetch(`${apiUrl}/health`)
  .then(r => {
    console.log('Status:', r.status);
    return r.json();
  })
  .then(data => {
    console.log('✅ Success:', data);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

**Check the Network tab:**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try to login/register
4. Look for the API request
5. Check:
   - **Request URL** - Should be your backend URL
   - **Status Code** - 200 = success, others = error
   - **Error message** - Shows what went wrong

### 5. Check CORS Settings

**If you see CORS errors in console:**

Add your Vercel domain to backend environment variables:

**In your backend platform (Railway/Render/etc.):**

Add environment variable:
- **Name:** `FRONTEND_URL`
- **Value:** `https://your-vercel-app.vercel.app`

**Or multiple domains:**
```
https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-custom-domain.com
```

**Then restart/redeploy your backend.**

### 6. Common Issues

#### Issue: VITE_API_URL is undefined

**Symptoms:**
- Console shows `undefined` for `import.meta.env.VITE_API_URL`
- API requests fail

**Fix:**
1. Set `VITE_API_URL` in Vercel
2. Make sure name is exactly `VITE_API_URL` (case-sensitive)
3. Redeploy Vercel app
4. Clear browser cache

#### Issue: Wrong URL Format

**Symptoms:**
- URL doesn't include `/api`
- Requests go to wrong endpoint

**Fix:**
- Set `VITE_API_URL` to: `https://your-backend-url.com/api`
- Must include `/api` at the end

#### Issue: HTTP vs HTTPS

**Symptoms:**
- Mixed content errors
- Connection refused

**Fix:**
- Use `https://` not `http://` in production
- Both frontend and backend should use HTTPS

#### Issue: Backend Not Accessible

**Symptoms:**
- Health endpoint doesn't respond
- Connection timeout

**Fix:**
1. Check backend is deployed
2. Check backend logs for errors
3. Verify backend URL is correct
4. Test backend directly with curl

#### Issue: CORS Error

**Symptoms:**
- Browser console shows CORS error
- Network tab shows CORS error

**Fix:**
1. Add `FRONTEND_URL` to backend environment variables
2. Format: `https://your-vercel-app.vercel.app`
3. Restart backend
4. Test again

## Debugging Steps

### Step 1: Check Environment Variable

```javascript
// In browser console on Vercel site
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
```

### Step 2: Test Backend Directly

```bash
# Test health endpoint
curl https://your-backend-url.com/health

# Test API health
curl https://your-backend-url.com/api/health
```

### Step 3: Test from Frontend

```javascript
// In browser console
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log('API URL:', apiUrl);

fetch(`${apiUrl}/health`)
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### Step 4: Check Network Tab

1. Open DevTools → Network tab
2. Try to login/register
3. Find the failed request
4. Check:
   - Request URL
   - Status code
   - Error message
   - Response body

## Quick Fix Summary

1. **Set VITE_API_URL in Vercel:**
   - Value: `https://your-backend-url.com/api`
   - Include `/api` at the end
   - Use `https://` not `http://`

2. **Redeploy Vercel app:**
   - After setting environment variable
   - Wait for deployment to complete

3. **Verify backend is running:**
   - Test: `curl https://your-backend-url.com/health`
   - Should return JSON response

4. **Set FRONTEND_URL in backend:**
   - Value: `https://your-vercel-app.vercel.app`
   - Restart backend after setting

5. **Test connection:**
   - Open browser console
   - Run the test code above
   - Check for errors

## Still Not Working?

1. **Share these details:**
   - What does `import.meta.env.VITE_API_URL` show in console?
   - What error appears in Network tab?
   - Does `curl https://your-backend-url.com/health` work?

2. **Check:**
   - Backend deployment logs
   - Vercel deployment logs
   - Browser console errors
   - Network tab errors

3. **Verify:**
   - Backend URL is correct
   - Backend is actually running
   - Environment variables are set correctly
   - Both apps are redeployed
