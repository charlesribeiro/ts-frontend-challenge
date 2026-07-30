/**
 * The only credentials the simulated login accepts.
 *
 * These are deliberately committed and deliberately fake. Nothing they protect
 * is private, and the login page shows them so a reviewer can get in without
 * hunting through the source. Real credentials never belong in a repository.
 *
 * The email is stored lowercase because sign-in compares against it that way.
 */
export const DEMO_CREDENTIALS = {
  email: 'demo@example.com',
  password: 'demo1234',
} as const;
