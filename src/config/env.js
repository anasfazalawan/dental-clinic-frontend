/**
 * Centralized Frontend Environment Configuration
 * Strictly reads from Vite environment variables (import.meta.env)
 * without hardcoded strings or URLs.
 */
export const env = {
  API_BASE_URL: import.meta.env.VITE_API_URL,
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  MODE: import.meta.env.MODE,
};

export default env;
