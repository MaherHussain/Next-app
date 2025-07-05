import { useMutation } from "@tanstack/react-query";
import { loginPartner, logoutPartner } from "@/app/services/auth-services";

export const useLogin = () => {
    return useMutation({
        mutationFn: loginPartner,
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: logoutPartner,
    });
}; 