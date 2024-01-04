import { jwtDecode } from "jwt-decode";
import { keycloakLogoutAuth } from "../api/LoginApiService";

export const logout = async () => {
    try {
        // Call logout API
        const logoutResponse = await keycloakLogoutAuth();

        // Clear local storage elements upon successful logout
        if (!logoutResponse.error) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("roles");
            // Clear any other relevant data
        } else {
            // Handle error in case of logout failure
            console.error("Logout request failed:", logoutResponse.error);
            // Handle error accordingly, display a message or take appropriate action
        }
    } catch (error) {
        // Catch unexpected errors
        console.error("Logout error:", error);
        // Handle error accordingly, display a message or take appropriate action
    }
}

export const isTokenExpired = (token) => {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds for comparison
    return decodedToken.exp < currentTime;
};