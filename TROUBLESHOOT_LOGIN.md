# Troubleshooting Login & Registration Issues

## Common Issues and Solutions

### 1. Check if VITE_API_URL is Set Correctly

**In Vercel:**
1. Go to your project → Settings → Environment Variables
2. Verify `VITE_API_URL` exists and has the correct value
3. Format should be: `https://your-backend-url.com/api` (with `/api` at the end)
4. Make sure it's set for **Production, Preview, and Development**
5. **Redeploy** after adding/changing the variable

**To verify it's working:**
Open browser console on your Vercel site and run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

If it shows `undefined`, the environment variable is not set correctly.

### 2. Check CORS Settings in Backend

Your backend needs to allow requests from your Vercel domain.

**In your backend environment variables (Railway/Render/etc.), add:**
```
FRONTEND_URL=https://your-vercel-app.vercel.app,https://your-custom-domain.com
```

**Or if you have multiple domains:**
```
FRONTEND_URL=https://your-app.vercel.app,https://your-app-git-main.vercel.app,https://your-custom-domain.com
```

**Important:** After adding `FRONTEND_URL`, restart/redeploy your backend.

### 3. Check Backend is Running

Test your backend directly:
```bash
curl https://your-backend-url.com/api/health
```

Should return: `{"status":"ok","message":"Server is running"}`

### 4. Check Browser Console for Errors

Open browser console (F12) and look for:
- Network errors (CORS, connection refused, etc.)
- API URL errors
- Authentication errors

The updated code now logs errors to console, so check the console for detailed error messages.

### 5. Verify API URL Format

**Correct format:**
- ✅ `https://your-backend.railway.app/api`
- ✅ `https://your-backend.onrender.com/api`
- ✅ `https://your-backend.fly.dev/api`

**Wrong format:**
- ❌ `https://your-backend.railway.app` (missing `/api`)
- ❌ `http://your-backend.railway.app/api` (should be `https`)
- ❌ `your-backend.railway.app/api` (missing `https://`)

### 6. Test API Endpoints Directly

Test from browser console on your Vercel site:

```javascript
// Test health check
fetch('https://your-backend-url.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test registration
fetch('https://your-backend-url.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@example.com',
    password: 'test123456'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 7. Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try to login/register
4. Look for the API request
5. Check:
   - **Request URL** - Should be your backend URL
   - **Status Code** - 200 = success, 401 = unauthorized, 500 = server error
   - **Response** - Check the error message

### 8. Common Error Messages

**"Cannot connect to server"**
- Backend is not running
- Wrong API URL
- Network/firewall issue

**"CORS error" or "Not allowed by CORS"**
- Add your Vercel domain to `FRONTEND_URL` in backend
- Restart backend after adding

**"Invalid email or password"**
- Credentials are wrong
- User doesn't exist (for login)
- Check backend logs for more details

**"User with this email already exists"**
- Email is already registered
- Try a different email or login instead

**"API server is not configured"**
- `VITE_API_URL` is not set in Vercel
- Redeploy after setting the variable

## Quick Fix Checklist

- [ ] `VITE_API_URL` is set in Vercel (with `/api` at the end)
- [ ] Vercel app is redeployed after setting the variable
- [ ] `FRONTEND_URL` is set in backend environment variables
- [ ] Backend is running and accessible
- [ ] Backend URL uses `https://` (not `http://`)
- [ ] Check browser console for specific error messages
- [ ] Test backend health endpoint directly

## Still Not Working?

1. Check browser console for detailed error messages
2. Check backend logs for errors
3. Verify both frontend and backend are deployed
4. Test API endpoints directly using curl or browser console
5. Make sure you're testing on the deployed Vercel site (not localhost)
