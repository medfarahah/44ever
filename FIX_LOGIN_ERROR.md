# Fix "Invalid email or password" Error

## Common Causes

### 1. User Doesn't Exist in Database

**Solution:** Register first, then login.

1. Go to `/register` page on your site
2. Create an account
3. Then try logging in

### 2. Wrong Email or Password

**Check:**
- Email is case-insensitive (will be converted to lowercase)
- Make sure you're using the exact email you registered with
- Password must match exactly (case-sensitive)

### 3. Database Connection Issue

**Check backend logs** for database errors.

## Quick Fixes

### Option 1: Register a New Account

1. Visit your Vercel site
2. Go to `/register`
3. Fill in the form:
   - Name
   - Email
   - Password (min 6 characters)
   - Phone (optional)
4. Submit
5. Then try logging in

### Option 2: Check Existing Users

If you have backend access, check what users exist:

```bash
cd server
npm run check-users
```

This will show all users in the database.

### Option 3: Create Admin User

To create an admin user directly:

```bash
cd server
npm run create-admin your-email@example.com your-password
```

Then login with that email and password.

## Testing

### Test Registration

1. Go to your site → `/register`
2. Fill in the form
3. Submit
4. Should redirect to home page if successful

### Test Login

1. Go to your site → `/login`
2. Enter the email and password you registered with
3. Should redirect to home page if successful

## Debugging

### Check Browser Console

Open browser console (F12) and look for:
- `[Auth] Login request to: ...` - Shows the API URL being used
- `[Auth] Login error: ...` - Shows the error from backend
- Network errors - Connection issues

### Check Backend Logs

Look for:
- `[Login] User not found: ...` - User doesn't exist
- `[Login] Invalid password for user: ...` - Wrong password
- `[Login] Successful login for user: ...` - Login worked

### Test API Directly

From browser console on your Vercel site:

```javascript
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

// Test login
fetch('https://your-backend-url.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'test123456'
  })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

## Important Notes

1. **Email is case-insensitive** - `Test@Example.com` = `test@example.com`
2. **Password is case-sensitive** - Must match exactly
3. **Minimum password length** - 6 characters
4. **User must exist** - Register before logging in (unless using hardcoded admin)

## Hardcoded Admin (Legacy)

If you need to use the hardcoded admin:
- Email: `admin`
- Password: `admin123`

This only works if you haven't changed the environment variables.

## Still Not Working?

1. Check browser console for specific error messages
2. Check backend logs for database/connection errors
3. Verify `VITE_API_URL` is set correctly in Vercel
4. Verify `FRONTEND_URL` is set in backend for CORS
5. Test the API endpoints directly using the browser console
