/**
 * scripts/ssg/sitemap.js
 *
 * Generate XML sitemap for search engines.
 */

import fs from 'fs';
import path from 'path';
import { DIST_DIR } from './config.js';

export function generateSitemap() {
    const now = new Date().toISOString();
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    <url>
        <loc>https://grastaxi.info/</loc>
        <lastmod>${now}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>`;

    xml += '\n</urlset>';
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), xml, 'utf8');
    console.log('✅  Generated sitemap.xml');
}
