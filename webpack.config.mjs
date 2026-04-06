import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config();

// Compute a hash of the source files for version checking
function computeBuildHash() {
  const hash = crypto.createHash('md5');
  const srcDir = path.resolve(__dirname, 'src');
  
  function hashDirectory(dir) {
    const files = fs.readdirSync(dir);
    files.sort(); // Ensure consistent ordering
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        hashDirectory(filePath);
      } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.html'))) {
        const content = fs.readFileSync(filePath, 'utf8');
        hash.update(content);
      }
    }
  }
  
  hashDirectory(srcDir);
  // Also hash the webpack config itself
  hash.update(fs.readFileSync(__filename, 'utf8'));
  
  return hash.digest('hex').substring(0, 20);
}

const buildHash = computeBuildHash();

export default {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  entry: './src/index.js',
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, 'node_modules/.cache/webpack-client'),
    buildDependencies: {
      config: [__filename],
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/',
    clean: false,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 10,
          enforce: true,
        },
      },
    },
    runtimeChunk: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext][query]'
        }
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      inject: true,
      chunksSortMode: 'auto',
      meta: {
        'build-hash': buildHash,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          to: '.',
          globOptions: {
            ignore: ['**/index.html'], // Already handled by HtmlWebpackPlugin
          },
        },
      ],
    }),
    ...(process.env.NODE_ENV === 'production' ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: false,
      }),
    ] : []),
  ],
  devServer: {
    port: 3609,
    host: '0.0.0.0',
    allowedHosts: 'all',
    hot: true,
    static: false,
    proxy: [
      {
        context: ['/api'],
        target: 'http://192.168.56.1:3610',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/api': '',  // Remove /api prefix when proxying
        },
      },
    ],
    client: {
      logging: 'verbose',
      overlay: {
        errors: true,
        warnings: false,
      },
      webSocketURL: {
        hostname: 'dev.grastaxi.info',
        port: 443,
        protocol: 'wss',
        pathname: '/ws',
      },
    },
    devMiddleware: {
      writeToDisk: false,
    },
  },
};
