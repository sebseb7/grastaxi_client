import React from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createEmotionCache from './utils/createEmotionCache.js';
import '@fontsource-variable/outfit';
import App from './App.js';
import { startVersionChecker } from './utils/versionChecker.js';

import theme from './utils/theme.js';

const emotionCache = createEmotionCache();
const container = document.getElementById('root');
let root = null;

// Function to render the app
const renderApp = (AppComponent) => {
  const app = (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <AppComponent/>
        </BrowserRouter>
      </ThemeProvider>
    </CacheProvider>
  );

  if (root) {
    root.render(app);
  } else {
    root = createRoot(container);
    root.render(app);
  }
};

if (container) {
  // Start version checker to detect deployment changes
  startVersionChecker();

  // Check if the container has meaningful prerendered content
  // (more than just whitespace or an empty root)
  const hasPrerenderedContent = container.innerHTML.trim().length > 0 &&
    !container.innerHTML.includes('<!-- -->'); // React SSR comment marker

  if (hasPrerenderedContent) {
    console.log('Hydrating prerendered content');
    hydrateRoot(
      container,
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <App/>
          </BrowserRouter>
        </ThemeProvider>
      </CacheProvider>
    );
    // Store reference for HMR
    root = { render: (app) => hydrateRoot(container, app) };
  } else {
    console.log('Rendering fresh (no prerendered content detected)');
    renderApp(App);
  }
} else {
  console.error('Root element not found');
}

// Hot Module Replacement (HMR) support for ES modules
// webpack provides import.meta.webpackHot in ESM mode
if (import.meta.webpackHot) {
  import.meta.webpackHot.accept('./App.js', () => {
    console.log('App module updated, re-rendering...');
    // Re-render the app with the updated module
    renderApp(App);
  });
}
