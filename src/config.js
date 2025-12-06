// In development, we use Vite proxy (relative path). In production, we use the full URL.
export const API_URL = import.meta.env.DEV ? "" : (import.meta.env.VITE_API_URL || "https://gestasai.com");
