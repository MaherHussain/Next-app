import { useMutation } from "@tanstack/react-query";
import { loginPartner, logoutPartner, createPartner } from "@/app/services/auth-services";

export function useCreatePartner(onSuccessCallback?: () => void) {
    return useMutation({
        mutationFn: createPartner,
        onSuccess: (res) => {
            if (onSuccessCallback) onSuccessCallback(); // Call component-level callback
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}

export const useLoginPartner = () => {
    return useMutation({
        mutationFn: loginPartner,
    });
};

export const useLogoutPartner = () => {
    return useMutation({
        mutationFn: logoutPartner,
    });
}; 