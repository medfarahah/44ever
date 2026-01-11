# Deployment Troubleshooting Guide

## Server Logs Analysis

Based on your server logs, the reverse proxy (Caddy) is running, but we need to verify the Node.js backend is actually starting.

### What the Logs Show

✅ **Good signs:**
- "server running" - Reverse proxy is active
- "serving initial configuration" - Configuration loaded

⚠️ **Potential issues:**
- "automatic HTTPS is completely disabled" - Using HTTP (might be fine for development)
- "HTTP/2 skipped because it requires TLS" - Normal if HTTPS is disabled
- "admin endpoint disabled" - This is about Caddy admin, not your app

### Missing: Node.js Server Logs

You should see logs like:
```
🚀 Server Started Successfully!
📍 Listening on: 0.0.0.0:5000
💚 Health: http://localhost:5000/health
```

If you don't see these, the Node.js server isn't starting.

## Diagnostic Steps

### 1. Check if Node.js Server is Running

**In your deployment platform (Railway/Render/etc.):**

Look for logs that show:
- `🚀 Server Started Successfully!`
- `Listening on: 0.0.0.0:5000`
- Any error messages

**If you don't see these logs:**
- The server isn't starting
- Check for startup errors
- Verify the start command is correct

### 2. Verify Start Command

**Railway/Render should use:**
```json
"start": "node server.js"
```

**Or:**
```json
"start": "npm start"
```

**Check your deployment platform settings:**
- Root Directory: `server`
- Start Command: `npm start` or `node server.js`
- Build Command: `npm install && npm run db:generate`

### 3. Check Environment Variables

**Required:**
- `DATABASE_URL` - Your Neon database connection string
- `PORT` - Usually set automatically by platform

**Optional but recommended:**
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Your Vercel domain (for CORS)
- `NODE_ENV` - Set to `production`

### 4. Test Health Endpoint

**From your deployment platform's logs or terminal:**

```bash
curl http://localhost:5000/health
```

**Or from your local machine:**

```bash
curl https://your-backend-url.com/health
curl https://your-backend-url.com/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

### 5. Run Startup Check

**Locally (to verify everything works):**

```bash
cd server
npm run startup-check
```

This will verify:
- Environment variables are set
- Database connection works
- Port configuration

### 6. Common Issues

#### Issue: Server Not Starting

**Symptoms:**
- No Node.js logs in deployment
- Health endpoint returns nothing
- 502 Bad Gateway error

**Solutions:**
1. Check deployment logs for errors
2. Verify `package.json` has `"start": "node server.js"`
3. Check if `server.js` exists in root directory
4. Verify all dependencies are installed
5. Check for syntax errors in code

#### Issue: Database Connection Fails

**Symptoms:**
- Server starts but crashes
- Error: "Failed to initialize database"
- Health endpoint works but API endpoints fail

**Solutions:**
1. Verify `DATABASE_URL` is set correctly
2. Check database is accessible
3. Run `npm run db:generate` to generate Prisma Client
4. Test database connection: `npm run startup-check`

#### Issue: Port Already in Use

**Symptoms:**
- Error: `EADDRINUSE`
- Server fails to start

**Solutions:**
1. Let the platform set PORT automatically
2. Don't hardcode PORT in your code
3. Use `process.env.PORT || 5000`

#### Issue: CORS Errors

**Symptoms:**
- Health endpoint works with curl
- Frontend can't connect
- Browser shows CORS error

**Solutions:**
1. Set `FRONTEND_URL` in backend environment variables
2. Format: `https://your-app.vercel.app`
3. Restart backend after adding

## Platform-Specific Checks

### Railway

1. **Check Service Status:**
   - Dashboard → Your service → Should show "Active"
   
2. **Check Logs:**
   - Click on service → "Deployments" → View logs
   - Look for Node.js startup messages

3. **Verify Settings:**
   - Root Directory: `server`
   - Start Command: `npm start`
   - Environment Variables: All set

### Render

1. **Check Service Status:**
   - Dashboard → Your service → Should show "Live"

2. **Check Logs:**
   - Click "Logs" tab
   - Look for Node.js startup messages

3. **Verify Settings:**
   - Root Directory: `server`
   - Build Command: `npm install && npm run db:generate`
   - Start Command: `npm start`

### Fly.io

1. **Check App Status:**
   ```bash
   flyctl status
   ```

2. **Check Logs:**
   ```bash
   flyctl logs
   ```

3. **Verify Configuration:**
   - Check `fly.toml` exists
   - Verify start command

## Quick Test Commands

```bash
# 1. Test health endpoint
curl https://your-backend-url.com/health

# 2. Test API health
curl https://your-backend-url.com/api/health

# 3. Test products (should work without auth)
curl https://your-backend-url.com/api/products

# 4. Test from browser console
fetch('https://your-backend-url.com/health')
  .then(r => r.json())
  .then(console.log)
```

## Next Steps

1. **Check deployment logs** for Node.js startup messages
2. **Run startup check** locally: `npm run startup-check`
3. **Test health endpoint** from your deployment URL
4. **Verify environment variables** are set correctly
5. **Check for errors** in deployment logs

## Still Not Working?

1. Share the **full deployment logs** (especially any errors)
2. Verify the **start command** in your deployment platform
3. Check if **server.js** is in the correct location
4. Test **locally first** to ensure code works
5. Verify **all dependencies** are installed
