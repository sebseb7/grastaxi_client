/**
 * scripts/generate-static-routes.js
 *
 * Static site generator orchestrator. Run after `npm run build` (which also runs `npm run server:build`).
 *
 * For each public route:
 *   1. Fetch the data needed to render that route.
 *   2. Server-render the React tree via dist/server-bundle.cjs.
 *   3. Inject Emotion critical CSS, the rendered HTML, and a safe serialized
 *      window.__INITIAL_DATA__ script tag into the base dist/index.html template.
 *   4. Write the result to dist/<route>/index.html.
 *
 * Fails fast (process.exit(1)) if any API request fails during generation so we
 * never ship empty shell files.
 */

import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

import { DIST_DIR, SERVER_BUNDLE } from './ssg/config.js';
import {
    optimizeFonts,
    cleanTemplate,
    injectFontOptimizations
} from './ssg/template/fonts.js';

import { generateHomeRoute } from './ssg/routes/home.js';
import { generateSitemap } from './ssg/sitemap.js';

async function generate() {
    console.log('🚀 Generating static routes…');

    // Pre-flight checks
    if (!fs.existsSync(DIST_DIR)) {
        console.error('❌  dist/ not found — run `npm run build` first.');
        process.exit(1);
    }
    const templatePath = path.join(DIST_DIR, 'index.html');
    if (!fs.existsSync(templatePath)) {
        console.error('❌  dist/index.html not found — run `npm run build` first.');
        process.exit(1);
    }
    if (!fs.existsSync(SERVER_BUNDLE)) {
        console.error('❌  build/server-bundle.cjs not found — run `npm run server:build` first.');
        process.exit(1);
    }

    // Load the CJS server bundle from an ESM context via createRequire
    const require = createRequire(import.meta.url);
    const { renderRoute } = require(SERVER_BUNDLE);

    // --- Font Optimization ---
    const { fontStyles, fontPreloads } = optimizeFonts();

    // --- Prepare optimized template ---
    const baseTemplate = fs.readFileSync(templatePath, 'utf8');
    const cleanTmpl = cleanTemplate(baseTemplate);
    const optimizedTemplate = injectFontOptimizations(cleanTmpl, { fontPreloads, fontStyles });

    await generateHomeRoute(optimizedTemplate, renderRoute);

    generateSitemap();

    console.log('\n✨  All static routes generated successfully!');
}

generate();
