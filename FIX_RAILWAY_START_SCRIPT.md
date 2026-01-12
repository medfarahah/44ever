# Fix Railway "Missing script: start" Error

## Problem

Railway error:
```
npm error Missing script: "start"
```

This means Railway is looking for `package.json` in the wrong directory.

## Solution

### Option 1: Set Root Directory in Railway (RECOMMENDED)

**In Railway Dashboard:**

1. Go to your service
2. Click **Settings**
3. Find **Root Directory**
4. Set it to: `server`
5. Save
6. Redeploy

**Then Railway will:**
- Look for `package.json` in `server/` directory
- Find the `start` script
- Run `npm start` from `server/` directory

### Option 2: Add Start Script to Root package.json

If you can't set Root Directory, add this to root `package.json`:

```json
{
  "scripts": {
    "start": "cd server && npm start"
  }
}
```

**But Option 1 is better!**

## Verification

After setting Root Directory to `server`, Railway should:

1. Find `server/package.json`
2. See the `start` script: `"start": "node server.js"`
3. Run `npm start` successfully
4. Start your server

## Railway Settings Checklist

- [ ] **Root Directory:** `server` ✅
- [ ] **Build Command:** `npm install && npm run db:generate`
- [ ] **Start Command:** `npm start`
- [ ] **Healthcheck Path:** `/health`
- [ ] **Healthcheck Port:** Auto

## Expected Logs After Fix

You should see:
```
npm install
npm run db:generate
npm start
═══════════════════════════════════════
🔧 Starting Server...
═══════════════════════════════════════
🚀 Server Started Successfully!
```

Instead of:
```
npm error Missing script: "start"
```
