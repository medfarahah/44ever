import { createAuthClient } from '@neondatabase/neon-js/auth';

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;

if (!authUrl) {
  console.warn('VITE_NEON_AUTH_URL is not set. Please add it to your .env file.');
}

export const authClient = createAuthClient(
    authUrl || ''
);
