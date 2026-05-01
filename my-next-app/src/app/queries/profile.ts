import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "@/app/services/profile-services";
import { toast } from "react-toastify";

export function useGetProfile() {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        retry: false,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['restaurant'] });
            toast.success("Profile updated successfully");
        },
        onError: (error: any) => {
            const message = error?.response?.data?.message || "Failed to update profile";
            toast.error(message);
        }
    });
}
