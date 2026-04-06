/**
 * scripts/ssg/config.js
 *
 * Centralized configuration for the static site generator.
 * Loads environment variables from .env file.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables immediately when this module is imported
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3608';
export const DIST_DIR = path.resolve(__dirname, '../../dist');
export const BUILD_DIR = path.resolve(__dirname, '../../build');
export const SERVER_BUNDLE = path.join(BUILD_DIR, 'server-bundle.cjs');
