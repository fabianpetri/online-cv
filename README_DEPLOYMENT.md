# IMPORTANT: Cloudflare Pages Deployment Fix

## Current Issue

The deployment is failing because a deploy command is configured. For Cloudflare Pages, **no deploy command should be set**.

## Fix the Deployment Settings

Go to your Cloudflare Pages project and update the build configuration:

### 1. Access Build Settings

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click on your **online-cv** project
4. Go to **Settings** → **Builds & deployments**

### 2. Configure Build Settings Correctly

Update to these exact settings:

**Build Configuration:**
- ✅ **Build command**: `bundle exec jekyll build`
- ✅ **Build output directory**: `_site`
- ❌ **Deploy command**: **(LEAVE EMPTY - DO NOT SET ANY DEPLOY COMMAND)**

**Environment variables:**
- `JEKYLL_ENV` = `production`

### 3. Trigger a New Deployment

After updating settings:
1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest failed deployment

OR

1. Make a small commit to your repository
2. Push to trigger automatic deployment

## Why This Fix Works

- **Cloudflare Pages** automatically deploys the `_site` directory after Jekyll builds
- The `wrangler versions upload` command is for **Workers**, not Pages
- Pages doesn't need (and shouldn't have) a separate deploy command

## Expected Build Log

After the fix, you should see:

```
✓ Installing dependencies
✓ Running build command: bundle exec jekyll build
✓ Build complete
✓ Deploying to Cloudflare's global network
✓ Deployment complete
```

## Alternative: Delete and Recreate Project

If the setting is stuck or you can't find it:

1. Delete the current Pages project
2. Create a new one:
   - Go to **Workers & Pages** → **Create application** → **Pages**
   - Connect your GitHub repository
   - Set **Framework preset**: Jekyll
   - Set **Build command**: `bundle exec jekyll build`
   - Set **Build output**: `_site`
   - **DO NOT** set any deploy command
   - Click **Save and Deploy**

## Verification

Once deployed successfully:
- Visit your `*.pages.dev` URL
- Add custom domains: `cv.fabianpetri.com` and `cv.fabianpetri.de`
- Test both domains

## Need Help?

If deployment still fails, check the **build logs** in your Pages project for specific errors.
