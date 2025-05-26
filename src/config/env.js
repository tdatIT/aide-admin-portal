const requiredEnvVars = {
  VITE_GOOGLE_CLIENT_ID: 'Google Client ID',
  VITE_API_URL: 'API URL'
};

// Validate environment variables
Object.entries(requiredEnvVars).forEach(([key, name]) => {
  if (!import.meta.env[key]) {
    throw new Error(`Missing required environment variable: ${name} (${key})`);
  }
});

export const env = {
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  apiUrl: import.meta.env.VITE_API_URL
}; 