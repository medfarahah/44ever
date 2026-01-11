# How to Set VITE_API_URL in Vercel

## What is VITE_API_URL?

`VITE_API_URL` is the URL of your **deployed backend server**. It tells your frontend where to send API requests.

**Format:** `https://your-backend-url.com/api`

## Step 1: Get Your Backend URL

### If you deployed to Railway:

1. Go to https://railway.app
2. Open your project
3. Click on your backend service
4. Go to **Settings** tab
5. Click **Generate Domain** (if you haven't already)
6. Copy the URL (e.g., `https://your-app.railway.app`)
7. Add `/api` at the end: `https://your-app.railway.app/api`

### If you deployed to Render:

1. Go to https://render.com
2. Open your dashboard
3. Click on your web service
4. Copy the URL from the top (e.g., `https://your-app.onrender.com`)
5. Add `/api` at the end: `https://your-app.onrender.com/api`

### If you deployed to Fly.io:

1. Run: `flyctl status` in your terminal
2. Or check your Fly.io dashboard
3. Copy the URL (e.g., `https://your-app.fly.dev`)
4. Add `/api` at the end: `https://your-app.fly.dev/api`

### If you deployed to another platform:

- Check your hosting platform's dashboard
- Look for the service URL or domain
- Add `/api` at the end

## Step 2: Set it in Vercel

1. Go to https://vercel.com
2. Open your project dashboard
3. Click on **Settings** (top menu)
4. Click on **Environment Variables** (left sidebar)
5. Click **Add New** button
6. Fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.com/api` (use your actual backend URL)
   - **Environment:** Select all (Production, Preview, Development)
7. Click **Save**
8. **Important:** Go to **Deployments** tab and click **Redeploy** on your latest deployment

## Example

If your backend is at `https://44ever-backend.railway.app`, then:

**VITE_API_URL** = `https://44ever-backend.railway.app/api`

## Verify It's Working

After setting the environment variable and redeploying:

1. Visit your Vercel site
2. Open browser console (F12)
3. Run:
```javascript
console.log(import.meta.env.VITE_API_URL);
```
You should see your backend URL.

4. Test the API:
```javascript
fetch(`${import.meta.env.VITE_API_URL}/health`)
  .then(r => r.json())
  .then(console.log);
```

## Troubleshooting

### "Cannot connect to server" error:
- Check if backend URL is correct
- Make sure you added `/api` at the end
- Verify backend is running
- Check CORS settings in backend

### Environment variable not working:
- Make sure you **redeployed** after adding the variable
- Check the variable name is exactly `VITE_API_URL` (case-sensitive)
- Verify it's set for the correct environment (Production/Preview/Development)

### Still can't find your backend URL?
- Check your deployment platform's logs
- Look for "Server running on..." or "Deployed to..." messages
- Check your deployment platform's documentation
