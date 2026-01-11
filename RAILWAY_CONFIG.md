# Railway Configuration

## Required Settings

### Service Settings

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

**Healthcheck Path:**
```
/health
```

**Healthcheck Port:**
```
Auto (Railway sets this)
```

## Environment Variables

### Required

```
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
JWT_SECRET=your-secret-key-here
NODE_ENV=production
```

### Optional (Recommended)

```
FRONTEND_URL=https://your-vercel-app.vercel.app
```

## Verification

After deployment, test:

```bash
curl https://your-project.up.railway.app/health
```

Should return: `OK`

## What Was Fixed

1. ✅ Health endpoint now returns "OK" (not JSON)
2. ✅ Prisma generation in build command
3. ✅ Database init doesn't block server startup
4. ✅ Server uses `process.env.PORT`
5. ✅ Server listens on `0.0.0.0` (all interfaces)
6. ✅ Proper error handling for database failures
