export const isAuthenticated = () => !!localStorage.getItem("authToken");

export const getUserRole = () => localStorage.getItem("userRole");
