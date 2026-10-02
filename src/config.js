// Read the API URL from Vite's public frontend configuration.
// Fall back to the local Express server during development.
export const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000";
