import localapi from "@/utils/local_api";

export const getUserProfile = async () => {
    const response = await localapi.get('/auth/profile/');
    return response.data;
}
export const updateUserProfile = async (profileData) => {
    const response = await localapi.patch('/auth/profile/update/', profileData);
    return response.data;
}