# Quick API Test After Deployment

Your backend server is running! Here's how to quickly test it:

## 1. Health Check (First Test)

Open your browser or use curl:

```bash
curl https://your-backend-url.com/api/health
```

Or in browser:
```
https://your-backend-url.com/api/health
```

**Expected Response:**
```json
{"status":"ok","message":"Server is running"}
```

## 2. Test Products Endpoint

```bash
curl https://your-backend-url.com/api/products
```

Or in browser:
```
https://your-backend-url.com/api/products
```

**Expected:** Array of products

## 3. Test from Your Vercel Frontend

1. Make sure `VITE_API_URL` is set in Vercel to your backend URL
2. Visit your Vercel site
3. Open browser console (F12)
4. Run:

```javascript
// Test health
fetch('https://your-backend-url.com/api/health')
  .then(r => r.json())
  .then(console.log);

// Test products
fetch('https://your-backend-url.com/api/products')
  .then(r => r.json())
  .then(console.log);
```

## 4. Run Automated Tests

```bash
cd server
npm run test-api https://your-backend-url.com/api
```

## Server Status from Logs

✅ Server is running
✅ Container started successfully
✅ Configuration loaded
⚠️ HTTPS is disabled (might need to enable for production)
⚠️ HTTP/2 and HTTP/3 skipped (requires TLS/HTTPS)

## Next Steps

1. **Test the health endpoint** - Verify server is responding
2. **Test products endpoint** - Verify database connection
3. **Update Vercel environment variable** - Set `VITE_API_URL` to your backend URL
4. **Test from frontend** - Visit your Vercel site and test functionality
5. **Enable HTTPS** (optional) - For production, consider enabling HTTPS

## Common Issues

### If health check fails:
- Check if backend URL is correct
- Verify server is actually running
- Check firewall/network settings

### If products endpoint fails:
- Check database connection
- Verify `DATABASE_URL` is set correctly
- Check Prisma Client is generated

### If frontend can't connect:
- Verify `VITE_API_URL` is set in Vercel
- Check CORS settings in backend
- Make sure backend allows your Vercel domain
