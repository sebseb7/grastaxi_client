/**
 * scripts/ssg/routes/home.js
 *
 * Generate the home page.
 */

import fs from 'fs';
import path from 'path';
import { DIST_DIR } from '../config.js';
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
                    'item': "https://grastaxi.info/"
                }
            ]
        };

        const headExtras = `
    <title>Grastaxi.info</title>
    <meta name="description" content="Dresden Grastaxi">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://grastaxi.info/">
    <meta property="og:title" content="grastaxi.info">
    <meta property="og:description" content="Dresden Grastaxi">
    <meta property="og:url" content="https://grastaxi.info/">
    <meta property="og:type" content="website">
    <meta property="og:locale" content="de_DE">
    <meta property="og:image" content="/favicon-192x192.png">
    <meta property="og:image:width" content="192">
    <meta property="og:image:height" content="192">
    <meta property="og:logo" content="favicon-192x192.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="https://grastaxi.info/favicon-192x192.png">
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
