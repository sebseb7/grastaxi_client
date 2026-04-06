# grastaxi_client

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in development mode using webpack-dev-server.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.  
The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build/` folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run server:build`

Builds the server bundle for production using the `webpack.server.config.mjs` configuration.  
This is used internally by the `generate` script.

### `npm run generate`

Generates static routes for the application.  
Runs the server build first, then executes `scripts/generate-static-routes.js` to create static HTML files.

### `npm run analyze:coverage`

Analyzes code coverage using `scripts/analyze-coverage.js`.  
Generates coverage reports to help identify untested code paths.

### `npm run test`

# Run all tests
npm test

# Run tests in watch mode (re-run on changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode with coverage
npm run test:ci


