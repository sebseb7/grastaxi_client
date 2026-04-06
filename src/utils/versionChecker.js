// Version checker - periodically checks for new versions and hard reloads if changed
const CHECK_INTERVAL = 10 * 60 * 1000; // 10 minutes in milliseconds

// Extract the webpack bundle hash from the script src in the head
function getBuildHashFromHead() {
  // Look for the main bundle script in the head section
  const scripts = document.head.querySelectorAll('script[src]');
  for (const script of scripts) {
    const src = script.getAttribute('src');
    // Match pattern like /main.06e75bf2d90cc22f0e75.js
    const match = src.match(/main\.([a-f0-9]+)\.js/);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Extract the webpack bundle hash from the fetched HTML
function getBuildHashFromHTML(html) {
  // Find the script tag in the head section
  const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
  if (headMatch) {
    const headContent = headMatch[1];
    const scriptMatch = headContent.match(/<script[^>]+src="[^"]*main\.([a-f0-9]+)\.js"[^>]*>/);
    if (scriptMatch) {
      return scriptMatch[1];
    }
  }
  return null;
}

// Store the initial hash when the app loads
let initialHash = null;

export function startVersionChecker() {
  // Get initial hash from the script src in the current head
  initialHash = getBuildHashFromHead();
  if (!initialHash) {
    console.log('[VersionChecker] No build hash found in head, version checking disabled');
    return;
  }
  console.log(`[VersionChecker] Initial page hash: ${initialHash}`);

  // Check periodically
  setInterval(async () => {
    try {
      // Add random query parameter to bypass cache
      const randomParam = Math.random().toString(36).substring(2, 15);
      const response = await fetch(`/?${randomParam}`, {
        method: 'GET',
        cache: 'no-cache'
      });

      if (!response.ok) {
        console.log('[VersionChecker] Failed to fetch index.html');
        return;
      }

      const html = await response.text();
      const newHash = getBuildHashFromHTML(html);

      if (!newHash) {
        console.log('[VersionChecker] Could not extract build hash from fetched HTML');
        return;
      }

      console.log(`[VersionChecker] Current hash: ${newHash}, Initial hash: ${initialHash}`);

      if (newHash !== initialHash) {
        console.log('[VersionChecker] Version change detected, reloading...');
        window.location.reload();
      }
    } catch (err) {
      console.error('[VersionChecker] Error checking version:', err);
    }
  }, CHECK_INTERVAL);
}
