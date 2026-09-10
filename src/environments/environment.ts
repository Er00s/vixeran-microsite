/**
 * Application environment.
 *
 * Development keeps reading static JSON under assets/ so `ng serve` works
 * without the PHP backend. Production points at the Hostinger `/api` endpoints.
 */
export const environment = {
  production: false,
  /** Empty = use Phase-1 static assets. Set to `/api` (or absolute URL) for Hostinger. */
  apiBaseUrl: '' as string,
};
