# Cloudflare Workers Deployment Guide

This guide will help you deploy your CV website to Cloudflare Workers with domain-based language routing:
- **cv.fabianpetri.com** → English version
- **cv.fabianpetri.de** → German version

## Prerequisites

1. **Cloudflare Account**: Sign up at https://dash.cloudflare.com/sign-up
2. **Node.js and npm**: Install from https://nodejs.org/
3. **Domains**: Ensure both domains are added to your Cloudflare account
   - fabianpetri.com
   - fabianpetri.de

## Step 1: Install Wrangler CLI

Install Cloudflare's Wrangler CLI globally:

```bash
npm install -g wrangler
```

Verify installation:

```bash
wrangler --version
```

## Step 2: Authenticate with Cloudflare

Login to your Cloudflare account:

```bash
wrangler login
```

This will open a browser window for authentication.

## Step 3: Configure Your Account ID

1. Log in to the Cloudflare Dashboard
2. Navigate to any domain in your account
3. Copy your Account ID from the right sidebar
4. Edit `wrangler.toml` and add your account ID:

```toml
account_id = "your-account-id-here"
```

## Step 4: Build the Jekyll Site

Install Ruby dependencies (if not already done):

```bash
bundle install
```

Build the static site:

```bash
./build.sh
```

Or manually:

```bash
bundle exec jekyll build
```

This creates the `_site/` directory with your static files.

## Step 5: Deploy to Cloudflare Workers

Deploy your site:

```bash
wrangler deploy
```

On first deployment, Wrangler will:
- Create a new Worker in your Cloudflare account
- Upload your static files
- Configure the worker routes

## Step 6: Configure DNS Records

### For cv.fabianpetri.com:

1. Go to Cloudflare Dashboard → fabianpetri.com → DNS
2. Add a DNS record:
   - Type: `CNAME`
   - Name: `cv`
   - Target: `your-worker-name.workers.dev` (or use `@` and let Cloudflare handle it)
   - Proxy status: **Proxied** (orange cloud)

### For cv.fabianpetri.de:

1. Go to Cloudflare Dashboard → fabianpetri.de → DNS
2. Add a DNS record:
   - Type: `CNAME`
   - Name: `cv`
   - Target: `your-worker-name.workers.dev` (or use `@` and let Cloudflare handle it)
   - Proxy status: **Proxied** (orange cloud)

## Step 7: Configure Worker Routes

In the Cloudflare Dashboard:

1. Go to **Workers & Pages** → Your Worker → **Settings** → **Triggers**
2. Add Routes:
   - Route: `cv.fabianpetri.com/*` → Zone: `fabianpetri.com`
   - Route: `cv.fabianpetri.de/*` → Zone: `fabianpetri.de`

Or these should already be configured from `wrangler.toml`.

## Step 8: Test Your Deployment

Visit your domains:
- https://cv.fabianpetri.com (should show English version)
- https://cv.fabianpetri.de (should show German version)

## How It Works

The Worker script (`_worker.js`) handles routing:

1. Checks the incoming request's hostname
2. For `cv.fabianpetri.com`: Serves `/en.html` at the root
3. For `cv.fabianpetri.de`: Serves `/de.html` at the root
4. All other paths are served normally

## Updating the Site

To update your CV:

1. Make changes to your data files (`_data/en.yml`, `_data/de.yml`)
2. Rebuild the site: `./build.sh`
3. Redeploy: `wrangler deploy`

## Alternative: Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main  # or your production branch

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.3'
        bundler-cache: true
    
    - name: Build Jekyll site
      run: bundle exec jekyll build
    
    - name: Deploy to Cloudflare Workers
      uses: cloudflare/wrangler-action@v3
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

To set this up:
1. Create a Cloudflare API Token with "Edit Cloudflare Workers" permissions
2. Add secrets to your GitHub repository:
   - `CLOUDFLARE_API_TOKEN`: Your API token
   - `CLOUDFLARE_ACCOUNT_ID`: Your account ID

## Troubleshooting

### Issue: Site not loading

- Check DNS propagation: https://dnschecker.org/
- Verify Worker routes are configured correctly
- Check Cloudflare Dashboard → Workers & Pages → Your Worker → Logs

### Issue: Wrong language showing

- Clear your browser cache
- Check the Worker script is deployed correctly
- Verify hostname detection in `_worker.js`

### Issue: Assets not loading (CSS, images)

- Ensure `baseurl` is empty in `_config.yml`
- Rebuild the site: `./build.sh`
- Redeploy: `wrangler deploy`

## Cost

- **Cloudflare Workers Free Tier**: 100,000 requests/day
- **Cloudflare DNS**: Free
- **Workers KV (if needed)**: First 100,000 reads/day are free

For a CV site, you'll likely stay within the free tier.

## Support

- Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/
- Wrangler Documentation: https://developers.cloudflare.com/workers/wrangler/
- Jekyll Documentation: https://jekyllrb.com/docs/

## Summary

Your CV is now hosted on Cloudflare's global network with:
- ✅ Fast CDN delivery worldwide
- ✅ Automatic language routing by domain
- ✅ HTTPS included
- ✅ DDoS protection
- ✅ 99.99% uptime SLA

Enjoy your new CV site!
