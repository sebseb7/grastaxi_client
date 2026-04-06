/**
 * scripts/ssg/routes/home.js
 *
 * Generate the home page.
 */

import fs from 'fs';
import path from 'path';
import { BASE_URL, DIST_DIR } from '../config.js';
import { injectIntoTemplate } from '../template/inject.js';

export async function generateHomeRoute(optimizedTemplate, renderRoute) {
    try {

        const { html, stylesTags } = renderRoute('/');

        // Standard Home Page Meta
        const breadcrumbLd = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
                {
                    '@type': 'ListItem',
                    'position': 1,
                    'name': 'Home',
                    'item': BASE_URL
                }
            ]
        };

        const headExtras = `
    <title>Grastaxi.info</title>
    <meta name="description" content="Dresden Grastaxi">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${BASE_URL}/">
    <meta property="og:title" content="grastaxi.info">
    <meta property="og:description" content="Dresden Grastaxi">
    <meta property="og:url" content="${BASE_URL}/">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="de_DE">
    <script type="application/ld+json">${JSON.stringify(breadcrumbLd)}</script>
        `;

        const content = injectIntoTemplate(optimizedTemplate, {
            html,
            stylesTags,
            route: '/',
            headExtras
        });

        const templatePath = path.join(DIST_DIR, 'index.html');
        fs.writeFileSync(templatePath, content, 'utf8');
        console.log(`✅  Generated / (${html.length} chars)`);
    } catch (err) {
        console.error('❌  Failed to generate /:', err);
        process.exit(1);
    }
}
