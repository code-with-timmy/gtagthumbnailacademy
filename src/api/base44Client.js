import { createClient } from "@base44/sdk";
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6913ef9d88f5466c017efc78",
  requiresAuth: false, // Ensure authentication is required for all operations
});
