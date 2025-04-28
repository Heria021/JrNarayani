export const AUTH_ROUTES = {
  SIGN_IN: "/auth/signin",
  SIGN_OUT: "/auth/signout",
  DASHBOARD: "/dashboard",
} as const;

export const AUTH_MESSAGES = {
  SIGN_IN_SUCCESS: "Successfully signed in",
  SIGN_IN_ERROR: "Invalid credentials",
  UNEXPECTED_ERROR: "An unexpected error occurred. Please try again.",
} as const; 