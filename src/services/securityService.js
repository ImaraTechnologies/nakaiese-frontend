import localapi from "@/utils/local_api"; // Use your Next.js Proxy

// Change Password
export const changeUserPassword = async (data) => {
    // Djoser endpoint: /auth/users/set_password/
    const response = await localapi.post('/auth/set_password/', data);
    return response.data;
};

// Delete Account
export const deleteUserAccount = async (currentPassword) => {
    // Djoser endpoint: /auth/users/me/ (DELETE)
    // Usually requires 'current_password' in body for safety
    const response = await localapi.delete('/auth/delete', {
        data: { current_password: currentPassword }
    });
    return response.data;
};