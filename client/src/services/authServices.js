    import axios from "axios";

    // Base API URL
    const BASE_URL = "http://0.0.0.0:8000/api/auth/";

    // Login function
    export const login = async (email, password) => {
    try {
        const response = await axios.post(`${BASE_URL}login/`, {
        email: email,
        password: password,
        });
        const { data, tokens } = response.data;

        // Store tokens in localStorage
        localStorage.setItem("accessToken", tokens.access);
        localStorage.setItem("refreshToken", tokens.refresh);

        return {
        message: "Login successful",
        status: "success",
        data: data,
        tokens: tokens,
        };
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        return {
        message: "Login failed",
        status: "error",
        errors: error.response?.data || error.message,
        };
    }
    };

    // Signup function
    export const signup = async (
    username,
    email,
    password,
    firstName = "",
    lastName = ""
    ) => {
    try {
        const response = await axios.post(`${BASE_URL}register/`, {
        username: username,
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        });
        return {
        message: "Registration successful",
        status: "success",
        data: response.data,
        };
    } catch (error) {
        console.error("Signup error:", error.response?.data || error.message);
        return {
        message: "Registration failed",
        status: "error",
        errors: error.response?.data || error.message,
        };
    }
    };

    // Logout function (optional if you want to clear tokens)
    export const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return {
        message: "Logout successful",
        status: "success",
    };
    };

    // Function to get access token from localStorage
    export const getAccessToken = () => {
    return localStorage.getItem("accessToken");
    };

    // Function to get refresh token from localStorage
    export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
    };
