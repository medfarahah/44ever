# Railway Deployment Fix

## Problem: Node.js Server Not Starting

Your Railway logs show:
- ✅ Container starting
- ✅ Caddy (reverse proxy) running
- ❌ **No Node.js server startup logs**
- ❌ Server keeps restarting

## What's Missing

You should see logs like:
```
🚀 Server Started Successfully!
📍 Listening on: 0.0.0.0:5000
💚 Health: http://localhost:5000/health
```

**If you don't see these, the Node.js server isn't starting.**

## Fix Steps

### 1. Verify Railway Configuration

**In Railway Dashboard:**

1. Go to your service
2. Click **Settings**
3. Check:

   **Root Directory:**
   - Should be: `server`
   - NOT: `.` or empty

   **Start Command:**
   - Should be: `npm start`
   - Or: `node server.js`
   - NOT: `npm run dev` (that's for development)

   **Build Command (if needed):**
   - `npm install && npm run db:generate`

### 2. Check Environment Variables

**Required variables in Railway:**

- `DATABASE_URL` - Your Neon database connection string
- `DIRECT_URL` - Your Neon direct connection string
- `JWT_SECRET` - A random secret key
- `NODE_ENV` - Set to `production`
- `PORT` - Railway sets this automatically (don't override)

**Optional but recommended:**
- `FRONTEND_URL` - Your Vercel domain (for CORS)

### 3. Check Build Logs

**In Railway:**

1. Go to **Deployments** tab
2. Click on latest deployment
3. Check **Build Logs** for:
   - `npm install` completing successfully
   - `npm run db:generate` completing (if in build command)
   - Any errors during build

### 4. Check Runtime Logs

**In Railway:**

1. Go to **Deployments** tab
2. Click on latest deployment
3. Check **Runtime Logs** for:
   - Node.js startup messages
   - Error messages
   - Database connection errors

### 5. Common Issues

#### Issue: Server Crashes Immediately

**Symptoms:**
- Container starts then stops
- No Node.js logs
- "Stopping Container" appears quickly

**Possible causes:**
- Missing environment variables
- Database connection fails
- Code error on startup
- Port conflict

**Fix:**
1. Check runtime logs for errors
2. Verify `DATABASE_URL` is set
3. Test locally: `npm start`
4. Check for syntax errors

#### Issue: Build Fails

**Symptoms:**
- Deployment fails during build
- Error in build logs

**Fix:**
1. Check build logs
2. Verify `package.json` is correct
3. Ensure all dependencies are listed
4. Check if `npm install` completes

#### Issue: Dependencies Not Installed

**Symptoms:**
- "Cannot find module" errors
- Server crashes on import

**Fix:**
1. Verify `package.json` has all dependencies
2. Check build logs show `npm install` completed
3. Ensure `node_modules` is not in `.gitignore` (or let Railway install)

#### Issue: Prisma Client Not Generated

**Symptoms:**
- "Prisma Client not generated" error
- Database connection fails

**Fix:**
1. Add to build command: `npm run db:generate`
2. Or run manually after deployment
3. Check `DATABASE_URL` is set

### 6. Test Locally First

**Before deploying, test locally:**

```bash
cd server
npm install
npm run db:generate
npm start
```

**Expected output:**
```
═══════════════════════════════════════
🚀 Server Started Successfully!
═══════════════════════════════════════
📍 Listening on: 0.0.0.0:5000
💚 Health: http://localhost:5000/health
```

**If this doesn't work locally, fix it before deploying.**

### 7. Railway-Specific Settings

**In Railway Service Settings:**

1. **Root Directory:** `server`
2. **Start Command:** `npm start`
3. **Build Command:** `npm install && npm run db:generate`
4. **Healthcheck Path:** `/health` or `/api/health`
5. **Healthcheck Port:** Auto (Railway sets this)

### 8. Debugging Steps

**Step 1: Check Build Logs**
- Look for `npm install` completion
- Check for any build errors
- Verify Prisma Client generation

**Step 2: Check Runtime Logs**
- Look for Node.js startup messages
- Check for error messages
- Verify server is listening

**Step 3: Test Health Endpoint**
```bash
curl https://your-railway-url.com/health
```

**Step 4: Check Environment Variables**
- Verify all required vars are set
- Check values are correct (no placeholders)

**Step 5: Check Service Status**
- Is service "Active"?
- Are there any warnings?
- Check resource usage

### 9. Quick Fix Checklist

- [ ] Root Directory set to `server`
- [ ] Start Command is `npm start`
- [ ] Build Command includes `npm run db:generate`
- [ ] `DATABASE_URL` is set correctly
- [ ] `JWT_SECRET` is set
- [ ] `NODE_ENV` is `production`
- [ ] Tested locally with `npm start`
- [ ] No errors in build logs
- [ ] No errors in runtime logs
- [ ] Health endpoint responds

### 10. What to Look For in Logs

**Good signs:**
- `npm install` completes
- `npm run db:generate` completes
- `🚀 Server Started Successfully!`
- `📍 Listening on: 0.0.0.0:PORT`
- `handled request` (means server is responding)

**Bad signs:**
- `Cannot find module`
- `Prisma Client not generated`
- `Failed to initialize database`
- `EADDRINUSE` (port conflict)
- Container keeps restarting
- No Node.js logs at all

## Still Not Working?

1. **Share your Railway logs** (especially runtime logs)
2. **Check if `npm start` works locally**
3. **Verify all environment variables are set**
4. **Check Railway service settings**
5. **Test health endpoint directly**

## Expected Logs

**When working correctly, you should see:**

```
Building...
npm install
npm run db:generate
Starting...
═══════════════════════════════════════
🚀 Server Started Successfully!
═══════════════════════════════════════
📍 Listening on: 0.0.0.0:5000
💚 Health: http://localhost:5000/health
handled request
handled request
```

If you don't see the Node.js startup messages, the server isn't starting.
