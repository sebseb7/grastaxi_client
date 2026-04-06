/**
 * scripts/ssg/template/inject.js
 *
 * HTML template manipulation utilities.
 */

import serialize from 'serialize-javascript';

export function injectIntoTemplate(template, { html, stylesTags, route, headExtras = '' }) {
    let output = template;

    // 1. Inject Metadata/Head Extras into <head>
    // First, remove any existing meta/title tags that might be in the template
    // to ensure we only use the route-specific ones.
    const tagsToOverride = [
        /<title>[\s\S]*?<\/title>/i,
        /<meta[^>]*name=["']description["'][^>]*>/i,
        /<meta[^>]*property=["']og:[^"']+["'][^>]*>/i,
        /<meta[^>]*name=["']twitter:[^"']+["'][^>]*>/i,
        /<link[^>]*rel=["']canonical["'][^>]*>/i
    ];

    tagsToOverride.forEach(regex => {
        output = output.replace(regex, '');
    });

    if (headExtras) {
        output = output.replace(/<\/head>/i, `${headExtras}\n</head>`);
    }

    if (stylesTags) {
        output = output.replace(/<\/head>/i, `${stylesTags}\n</head>`);
    }

    // 2. Inject server-rendered HTML into #root
    // Use a regex to be robust against minification and allow matching even if
    // the div already contains content (idempotency).
    const rootRegex = /(<div[^>]*id=["']?root["']?[^>]*>)([\s\S]*?)(<\/div>)/i;
    if (rootRegex.test(output)) {
        output = output.replace(rootRegex, `$1${html}$3`);
    } else {
        console.warn(`⚠️  Could not find <div id="root"></div> in template for route: ${route}`);
        // Log a snippet of the template around the body tag to help debug
        const bodyStart = output.indexOf('<body');
        if (bodyStart !== -1) {
            console.warn('   Template snippet around body:', output.substring(bodyStart, bodyStart + 100));
        }
    }


    return output;
}
