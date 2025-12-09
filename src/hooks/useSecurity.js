import { useMutation } from "@tanstack/react-query";
import { changeUserPassword, deleteUserAccount } from "@/services/securityService";
import { useAuth } from "@/context/AuthContext";

export const useSecurity = () => {
    const { logout } = useAuth();

    // 1. Change Password Mutation
    const changePasswordMutation = useMutation({
        mutationFn: changeUserPassword,
        onSuccess: () => {
            // Optional: Logout user after password change to force re-login
            // or just show success message
            alert("Password changed successfully.");
        },
        onError: (error) => {
            console.error("Password change failed", error);
        }
    });

    // 2. Delete Account Mutation
    const deleteAccountMutation = useMutation({
        mutationFn: deleteUserAccount,
        onSuccess: () => {
            // Immediately logout and clear storage
            logout();
            window.location.href = '/';
        },
        onError: (error) => {
            console.error("Delete account failed", error);
        }
    });

    return {
        changePassword: changePasswordMutation.mutateAsync,
        isChangingPassword: changePasswordMutation.isPending,
        changePasswordError: changePasswordMutation.error,

        deleteAccount: deleteAccountMutation.mutateAsync,
        isDeleting: deleteAccountMutation.isPending,
        deleteError: deleteAccountMutation.error,
    };
};