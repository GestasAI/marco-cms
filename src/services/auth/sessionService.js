/**
 * Session Service - Handles localStorage persistence
 */
export const sessionService = {
    setToken(token) {
        localStorage.setItem('marco_token', token);
    },

    getToken() {
        return localStorage.getItem('marco_token');
    },

    setUser(user) {
        localStorage.setItem('marco_user', JSON.stringify(user));
    },

    getUser() {
        const userStr = localStorage.getItem('marco_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    setRefreshToken(token) {
        localStorage.setItem('marco_refresh_token', token);
    },

    clear() {
        localStorage.removeItem('marco_token');
        localStorage.removeItem('marco_user');
        localStorage.removeItem('marco_refresh_token');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};
