import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { loginPartner, logoutPartner, createPartner, getUser } from "@/app/services/auth-services";

export function useCreatePartner(onSuccessCallback?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPartner,
        onSuccess: (res) => {
            // Invalidate and refetch user data after successful registration
            queryClient.invalidateQueries({ queryKey: ['user'] });
            if (onSuccessCallback) onSuccessCallback(); // Call component-level callback
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}

export function useLoginPartner() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: loginPartner,
        onSuccess: () => {
            // Invalidate and refetch user data after successful login
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}

export function useLogoutPartner() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: logoutPartner,
        onSuccess: () => {
            // Clear user data from cache after logout
            queryClient.setQueryData(['user'], null);
        },
        onError(error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || "An error occurred";
            console.log(errorMessage)
        },
    })
}

export function useGetUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    })
}

// Utility function to invalidate user cache
export function useInvalidateUser() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['user'] });
    };
} 