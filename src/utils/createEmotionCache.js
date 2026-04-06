import createCache from '@emotion/cache';

/**
 * Creates a shared Emotion cache used by both the client (index.js)
 * and the server (src/server/render.js) to guarantee identical key/configuration.
 */
const createEmotionCache = () => createCache({ key: 'css' });

export default createEmotionCache;
