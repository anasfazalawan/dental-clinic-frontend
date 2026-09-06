/**
 * Centralized Frontend Environment Configuration
 * Strictly reads from Vite environment variables (import.meta.env)
 * without arbitrary hardcoded strings across components.
 */

const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  console.warn(
    '⚠️ [Config] VITE_API_URL environment variable is not defined. Please configure .env'
  );
}

export const env = {
  API_BASE_URL: rawApiUrl || 'http://localhost:5000/api',
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
};

export default env;
