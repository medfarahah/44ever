# Fix Health Endpoint Not Working

## The Problem

If `/health` or `/api/health` shows no result, one of these is true:

1. **The server is not running**
2. **The server is not listening correctly**
3. **The route is blocked by middleware**
4. **Port is already in use**

## Solutions

### 1. Check if Server is Running

**Locally:**
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server running on http://0.0.0.0:5000
📡 API available at http://0.0.0.0:5000/api
💚 Health check: http://0.0.0.0:5000/health
```

**On deployed backend (Railway/Render/etc.):**
- Check deployment logs
- Verify the service is running
- Check if there are any startup errors

### 2. Test Health Endpoint

**Locally:**
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/health
```

**On deployed backend:**
```bash
curl https://your-backend-url.com/health
curl https://your-backend-url.com/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-01-11T..."
}
```

### 3. Check Port Configuration

The server listens on:
- `PORT` environment variable (if set)
- Default: `5000`
- Host: `0.0.0.0` (all interfaces)

**Check if port is in use:**
```bash
# Windows
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :5000
```

### 4. Check Server Logs

Look for:
- ✅ `Server running on...` - Server started successfully
- ❌ `Port X is already in use` - Port conflict
- ❌ `Uncaught Exception` - Code error preventing startup
- ❌ `Failed to initialize database` - Database connection issue

### 5. Common Issues

#### Issue: Port Already in Use
**Error:** `EADDRINUSE`

**Solution:**
```bash
# Kill process using port 5000 (Windows)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use a different port
PORT=5001 npm run dev
```

#### Issue: Database Connection Fails
**Error:** `Failed to initialize database`

**Solution:**
- Check `DATABASE_URL` in `.env`
- Verify database is accessible
- Check Prisma Client is generated: `npm run db:generate`

#### Issue: Server Crashes on Startup
**Error:** `Uncaught Exception` or `Unhandled Rejection`

**Solution:**
- Check server logs for the specific error
- Verify all dependencies are installed: `npm install`
- Check environment variables are set correctly

### 6. Test from Browser

Open in browser:
- `http://localhost:5000/health` (local)
- `https://your-backend-url.com/health` (deployed)

Should show JSON response.

### 7. Test from Frontend

In browser console on your Vercel site:

```javascript
// Test health endpoint
fetch('https://your-backend-url.com/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);

// Test API health endpoint
fetch('https://your-backend-url.com/api/health')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
```

### 8. Check CORS Settings

If health endpoint works with `curl` but not from browser, it might be CORS.

**Fix:** Add your frontend URL to `FRONTEND_URL` in backend environment variables.

### 9. Deployment-Specific Issues

#### Railway
- Check deployment logs
- Verify service is running (green status)
- Check environment variables are set
- Verify root directory is set to `server`

#### Render
- Check service logs
- Verify build completed successfully
- Check if service is "Live"
- Verify start command is correct: `npm start`

#### Fly.io
- Check app status: `flyctl status`
- Check logs: `flyctl logs`
- Verify app is running: `flyctl ps`

## Quick Diagnostic

Run this to check everything:

```bash
# 1. Check if server is running
curl http://localhost:5000/health

# 2. Check server logs
# Look for startup messages

# 3. Check port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# 4. Check environment
echo $PORT  # Should show port number or nothing (defaults to 5000)
```

## Still Not Working?

1. **Check server logs** - Look for error messages
2. **Verify server file** - Make sure `server.js` exists and is correct
3. **Check dependencies** - Run `npm install` in server directory
4. **Test locally first** - Make sure it works locally before deploying
5. **Check deployment platform** - Verify the platform is actually running your server

## What I Fixed

1. ✅ Added `/health` endpoint (in addition to `/api/health`)
2. ✅ Server now listens on `0.0.0.0` (all interfaces) instead of just `localhost`
3. ✅ Added better error handling for port conflicts
4. ✅ Added startup logging to show health check URLs
5. ✅ Added error handlers for uncaught exceptions
