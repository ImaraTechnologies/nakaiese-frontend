import localapi from '@/utils/local_api'

export const loginUser = async (credentials) => {
    const response = await localapi.post('/auth/login/', credentials);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await localapi.post('/auth/register/', userData);
    return response.data;
};

export const logoutUser = async () => {
    const response = await localapi.post('/auth/logout/');
    return response.data;
};
export const logoutAllUser = async () => {
    const response = await localapi.post('/auth/logout_all/');
    return response.data;
};

