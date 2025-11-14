export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostname = url.hostname;
    
    // Determine language based on domain
    let targetPath = url.pathname;
    
    // Route based on domain
    if (hostname === 'cv.fabianpetri.com') {
      // English version for .com domain
      if (targetPath === '/' || targetPath === '/index.html') {
        targetPath = '/en.html';
      }
    } else if (hostname === 'cv.fabianpetri.de') {
      // German version for .de domain
      if (targetPath === '/' || targetPath === '/index.html') {
        targetPath = '/de.html';
      }
    }
    
    // Create new request with modified path
    const newUrl = new URL(targetPath, url.origin);
    newUrl.search = url.search;
    
    // Fetch the asset from the Workers Site
    return env.ASSETS.fetch(new Request(newUrl, request));
  }
}
