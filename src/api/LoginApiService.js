import axios from 'axios';

const loginURL = process.env.REACT_APP_APIURL_AUTH;
const CLIENT_SECRET = process.env.REACT_APP_APIURL_CLIENT_SECRET
const SSO_BASE_URL = process.env.REACT_APP_APIURL_SSO;
const CLIENT_ID = "react-auth";
const GRANT_TYPE = "password";

export const keycloakLoginAuth = async (userAuth) => {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('grant_type', GRANT_TYPE);
    data.append('client_secret', CLIENT_SECRET);
    data.append('username', userAuth.username);
    data.append('password', userAuth.password);

    try {
        const keycloakInstance = await axios.post(`${SSO_BASE_URL}/token`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 'Access-Control-Allow-Origin': '*',
                // 'Access-Control-Allow-Credentials': true,
                // 'Access-Control-Allow-Headers': "*"

            },
        });
        return { data: keycloakInstance.data, error: null }; // Return the response or perform further actions as needed
    } catch (error) {
        console.error('Token request error:', error);
        return { data: null, error: error }; // Throw the error or handle it appropriately
    }
};

export const keycloakLogoutAuth = async () => {
    const data = new URLSearchParams();
    data.append('client_id', CLIENT_ID);
    data.append('refresh_token', localStorage.getItem("refreshToken"));
    data.append('client_secret', CLIENT_SECRET);

    try {
        const keycloakInstance = await axios.post(`${SSO_BASE_URL}/logout`, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return { data: keycloakInstance.data, error: null }; // Return the response or perform further actions as needed
    } catch (error) {
        console.error('Token request error:', error);
        return { data: null, error: error }; // Throw the error or handle it appropriately
    }
};

export const loginUser = async (data) => {
    try {
        console.log("api call data", data);
        const response = await axios.post(`${loginURL}/login`, data);
        return response;
    } catch (error) {
        console.error("Error in login User:", error);
        return error;
    }
};

export const getServiceList = async (userInfo) => {
    try {
        console.log("api call data", userInfo);
        const response = await axios.post(`${loginURL}/getServiceList`, userInfo);
        return response.data;
    } catch (error) {
        console.error("Error in login User:", error);
        throw error;
    }
};

