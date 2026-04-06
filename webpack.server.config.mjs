import path from 'path';
import { fileURLToPath } from 'url';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  target: 'node',
  entry: './src/server/render.js',
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack-server'),
    buildDependencies: {
      config: [__filename],
    },
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server-bundle.cjs',
    library: {
      type: 'commonjs2',
    },
  },
  externals: [
    nodeExternals({
      // Bundle these packages rather than externalizing them — they reference
      // browser globals (document, window) that webpack's node target stubs,
      // and they must be processed through the webpack build to work in Node.
      allowlist: [/^@emotion/, /^@mui/, /^@fontsource/, /^react/, /^react-dom/, /^react-router/],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        // Server-side: ignore CSS/font imports entirely
        test: /\.css$/,
        use: 'null-loader',
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          // Emit to a throwaway path; we don't serve server-bundle fonts
          filename: 'server-fonts/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL || 'http://localhost:3608'),
    }),
  ],
};
