import api from '@/utils/api'; // Your improved axios instance

export const loginUser = async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await api.post('/auth/register/', userData);
    return response.data;
};

export const logoutUser = async (refreshToken) => {
    const response = await api.post('/auth/logout/', { refresh: refreshToken });
    return response.data;
};

export const forgotPassword = async (email) => {
    const response = await api.post('/auth/password/reset/', { email });
    return response.data;
};

export const resetPassword = async (token, newPassword) => {
    const response = await api.post('/auth/password/reset/confirm/', { token, newPassword });
    return response.data;
};