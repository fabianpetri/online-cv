# Cloudflare Pages Deployment Guide

This guide will help you deploy your CV website to Cloudflare Pages with domain-based language routing:
- **cv.fabianpetri.com** → English version
- **cv.fabianpetri.de** → German version

## Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/sign-up
2. **GitHub Account**: Your repository should be on GitHub
3. **Domains**: Ensure both domains are added to your Cloudflare account
   - fabianpetri.com
   - fabianpetri.de

## Deployment Method: Cloudflare Pages (Recommended)

Cloudflare Pages automatically builds and deploys your Jekyll site directly from your GitHub repository.

### Step 1: Connect Your Repository to Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers & Pages**
3. Click **Create application**
4. Select the **Pages** tab
5. Click **Connect to Git**
6. Authorize Cloudflare to access your GitHub account
7. Select your `online-cv` repository

### Step 2: Configure Build Settings

In the build configuration:

- **Project name**: `online-cv` (or your preferred name)
- **Production branch**: `main` (or your default branch)
- **Framework preset**: Select **Jekyll**
- **Build command**: `bundle exec jekyll build`
- **Build output directory**: `_site`
- **Root directory**: `/` (leave empty)

Environment variables:
- **JEKYLL_ENV**: `production`

Click **Save and Deploy**

### Step 3: Wait for Initial Build

Cloudflare Pages will:
1. Clone your repository
2. Install Ruby and dependencies
3. Build your Jekyll site
4. Deploy to a `*.pages.dev` URL

The first build takes 2-3 minutes.

### Step 4: Configure Custom Domains

#### For cv.fabianpetri.com:

1. In your Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter: `cv.fabianpetri.com`
4. Cloudflare will automatically:
   - Create DNS records (if domains are in Cloudflare)
   - Provision SSL certificate
   - Configure routing

#### For cv.fabianpetri.de:

1. Click **Set up a custom domain** again
2. Enter: `cv.fabianpetri.de`
3. Same automatic configuration applies

### Step 5: Verify Deployment

Visit your domains:
- https://cv.fabianpetri.com (should redirect to English version)
- https://cv.fabianpetri.de (should redirect to German version)

## How It Works

The routing is handled by **Cloudflare Pages Functions** (`functions/_middleware.js`):

1. Intercepts requests to the root path (`/`)
2. Checks the hostname
3. Redirects to `/en.html` for cv.fabianpetri.com
4. Redirects to `/de.html` for cv.fabianpetri.de
5. All other assets (CSS, images, etc.) are served normally

## Automatic Deployments

Cloudflare Pages automatically deploys when you push to your repository:

- **Push to main branch** → Production deployment (cv.fabianpetri.com, cv.fabianpetri.de)
- **Push to other branches** → Preview deployment (unique preview URL)

### Preview Deployments

Every pull request gets a unique preview URL:
- Format: `<branch>.<project>.pages.dev`
- Perfect for testing changes before merging

## Updating Your CV

To update your CV:

1. Edit `_data/en.yml` or `_data/de.yml`
2. Commit and push to GitHub
3. Cloudflare Pages automatically rebuilds and deploys

No manual deployment needed!

## Build Configuration

If you need to customize the build, create a `_headers` or `_redirects` file in your project root.

### Example: Custom Headers

Create `_headers`:

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### Example: Additional Redirects

Create `_redirects`:

```
/cv       /en.html    302
/lebenslauf    /de.html    302
```

## Alternative: Manual Deployment via Wrangler CLI

If you prefer manual control:

1. Install Wrangler: `npm install -g wrangler`
2. Login: `wrangler login`
3. Build site: `bundle exec jekyll build`
4. Deploy: `wrangler pages deploy _site --project-name=online-cv`

## Troubleshooting

### Issue: Build Fails

**Check Build Logs:**
1. Go to your Pages project
2. Click **View build** on the failed deployment
3. Check the error message

**Common Issues:**
- Missing Gemfile.lock: Commit it to your repository
- Ruby version mismatch: Ensure Ruby 3.3+ is specified
- Bundle install fails: Check Gemfile for issues

### Issue: Wrong Language Showing

**Clear Cache:**
- Browser cache: Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- Cloudflare cache: Go to project → **Deployments** → **Clear cache**

**Check Functions:**
- Verify `functions/_middleware.js` exists in repository
- Check deployment logs for Functions errors

### Issue: Custom Domain Not Working

**Verify DNS:**
- Go to your domain in Cloudflare Dashboard
- Check DNS records for `cv` subdomain
- Should show CNAME to `<project>.pages.dev`

**Wait for Propagation:**
- DNS changes take 1-5 minutes
- SSL certificates provision in 1-2 minutes

### Issue: Assets Not Loading (CSS, images)

**Check Build:**
- Ensure `baseurl` is empty in `_config.yml`
- Verify `_site/` directory contains all assets
- Check browser console for 404 errors

## Cost

- **Cloudflare Pages**: Free tier includes:
  - Unlimited sites
  - Unlimited requests
  - 500 builds/month
  - 1 concurrent build
- **Cloudflare DNS**: Free
- **SSL Certificates**: Free

Your CV site will stay within the free tier.

## Advanced Configuration

### Environment Variables

Set in Pages project settings:

- `JEKYLL_ENV=production`
- `RUBY_VERSION=3.3.0` (if needed)

### Branch Deployments

Configure which branches trigger deployments:

1. Go to Pages project → **Settings**
2. **Builds & deployments** → **Branch deployments**
3. Add branch patterns

### Build Watch Paths

Only rebuild when specific files change:

1. Go to **Settings** → **Builds & deployments**
2. **Build watch paths** → Add patterns
3. Example: `_data/**`, `_includes/**`, `_layouts/**`

## Monitoring

### Analytics

Cloudflare provides free analytics:
- **Pages** → Your project → **Analytics**
- View requests, bandwidth, errors

### Build Notifications

Get notified of build success/failure:
1. Go to **Notifications** in Cloudflare Dashboard
2. Add notification for **Pages deploy**
3. Choose email, Discord, or webhooks

## Comparison: Pages vs Workers

| Feature | Cloudflare Pages | Workers |
|---------|-----------------|---------|
| Setup | Automatic from Git | Manual deployment |
| SSL | Automatic | Manual configuration |
| Build | Automatic | Manual build |
| Cost | Free (generous) | Free (limited) |
| Best For | Static sites | Dynamic applications |

**Recommendation**: Use Cloudflare Pages (current setup) for your CV site.

## Support

- Cloudflare Pages Documentation: https://developers.cloudflare.com/pages/
- Pages Functions: https://developers.cloudflare.com/pages/functions/
- Community Forum: https://community.cloudflare.com/

## Summary

Your CV is now deployed on Cloudflare Pages with:
- ✅ Automatic deployments from GitHub
- ✅ Domain-based language routing
- ✅ Free SSL certificates
- ✅ Global CDN (275+ cities)
- ✅ Preview deployments for PRs
- ✅ DDoS protection
- ✅ 100% uptime SLA

Enjoy your new CV site! 🚀
