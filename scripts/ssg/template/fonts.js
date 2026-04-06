/**
 * scripts/ssg/template/fonts.js
 *
 * Font optimization: identify and preload critical fonts.
 */

import fs from 'fs';
import path from 'path';
import { DIST_DIR } from '../config.js';

export function optimizeFonts() {
    const fontsDir = path.join(DIST_DIR, 'fonts');
    let fontStyles = '';
    let fontPreloads = '';

    if (fs.existsSync(fontsDir)) {
        const fontFiles = fs.readdirSync(fontsDir);
        // Find the most likely candidates for the main variable fonts based on file patterns/sizes
        // Standard outfit-latin-wght-normal is typically around 30KB.
        const mainFont = fontFiles.find(f => f.endsWith('.woff2') && fs.statSync(path.join(fontsDir, f)).size > 20000);
        const extFont = fontFiles.find(f => f.endsWith('.woff2') && f !== mainFont);

        if (mainFont) {
            console.log(`   Optimizing fonts: Found primary font ${mainFont}`);
            // Only preload the primary font to minimize initial requests.
            // The extended font will still be available via the @font-face below if needed.
            fontPreloads += `<link rel="preload" href="/fonts/${mainFont}" as="font" type="font/woff2" crossorigin>\n`;

            fontStyles = `
<style>
/* Critical font-face inlining to prevent FOUT */
@font-face {
  font-family: 'Outfit Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(/fonts/${mainFont}) format('woff2-variations');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
${extFont ? `
@font-face {
  font-family: 'Outfit Variable';
  font-style: normal;
  font-display: swap;
  font-weight: 100 900;
  src: url(/fonts/${extFont}) format('woff2-variations');
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}` : ''}
</style>`;
        }
    }

    return { fontStyles, fontPreloads };
}

export function cleanTemplate(template) {
    // Clean the base template of all boilerplate SEO tags to ensure routes can
    // provide their own fresh ones without leftovers.
    // Also remove any previously injected __INITIAL_DATA__ or styles to ensure idempotency.
    return template
        .replace(/<title>[\s\S]*?<\/title>/i, '')
        .replace(/<meta[^>]*name=["']description["'][^>]*>/i, '')
        .replace(/<meta[^>]*property=["']og:[^"']+["'][^>]*>/gi, '')
        .replace(/<meta[^>]*name=["']twitter:[^"']+["'][^>]*>/gi, '')
        .replace(/<script>window\.__INITIAL_DATA__ = [\s\S]*?<\/script>/gi, '')
        .replace(/<style data-emotion=[\s\S]*?<\/style>/gi, '')
        .replace(/<link rel="preload" href="\/fonts\/[\s\S]*? crossorigin>/gi, '')
        .replace(/<style>\/\* Critical font-face [\s\S]*?<\/style>/gi, '');
}

export function injectFontOptimizations(template, { fontPreloads, fontStyles }) {
    return template.replace(/<\/head>/i, `${fontPreloads}${fontStyles}\n</head>`);
}
