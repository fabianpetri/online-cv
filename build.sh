#!/bin/bash

echo "Building Jekyll site..."

# Clean previous build
rm -rf _site

# Build the Jekyll site
bundle exec jekyll build

echo "Build complete! Site generated in _site/ directory"
echo ""
echo "To deploy to Cloudflare Workers, run:"
echo "  npx wrangler deploy"
