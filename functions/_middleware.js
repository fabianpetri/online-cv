// Cloudflare Pages Functions middleware for language routing
export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const hostname = url.hostname;
  
  // Only redirect root paths
  if (url.pathname === '/' || url.pathname === '/index.html') {
    let targetPath;
    
    // Route based on domain
    if (hostname === 'cv.fabianpetri.com') {
      targetPath = '/en.html';
    } else if (hostname === 'cv.fabianpetri.de') {
      targetPath = '/de.html';
    } else {
      // Default to German for any other domain
      targetPath = '/de.html';
    }
    
    // Create redirect response
    return new Response(null, {
      status: 302,
      headers: {
        'Location': targetPath
      }
    });
  }
  
  // For all other paths, continue to the next handler
  return next();
}
