/**
 * SSR render entry point.
 *
 * This file is compiled by webpack.server.config.mjs into dist/server-bundle.cjs
 * (CommonJS, node target) so that scripts/generate-static-routes.js can require()
 * it via createRequire() from an ESM context.
 *
 * Exports:
 *   renderRoute(route: string) → { html: string, stylesTags: string }
 */
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ThemeProvider, CssBaseline } from '@mui/material';
import createEmotionServer from '@emotion/server/create-instance';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from '../utils/createEmotionCache.js';
import App from '../App.js';

import theme from '../utils/theme.js';

export function renderRoute(route) {
  const cache = createEmotionCache();
  const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

  const html = renderToString(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StaticRouter location={route}>
          <App/>
        </StaticRouter>
      </ThemeProvider>
    </CacheProvider>
  );

  const chunks = extractCriticalToChunks(html);
  const stylesTags = constructStyleTagsFromChunks(chunks);

  return { html, stylesTags };
}
