import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addIngredient, deletedIngredient, editIngredient, getAllIngredients, getIngredients } from "../services/ingredient-services";

export function useGetIngredients({ restaurantId, page, limit }: { restaurantId: string, page: number, limit: number }) {
    return useQuery({
        queryKey: ['ingredients', { restaurantId, page, limit }],
        queryFn: () => getIngredients({ restaurantId, page, limit }),
        retry: 3,
        enabled: !!restaurantId,
    })
}

export function useGetAllIngredients({ restaurantId }: { restaurantId: string }) {
    return useQuery({
        queryKey: ['ingredients', { restaurantId, all: true }],
        queryFn: () => getAllIngredients({ restaurantId }),
        retry: 3,
        enabled: !!restaurantId,
    })
}

export function useAddIngredient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
        onError: (err: any) => {
            const errorMessage =
                err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        },
    });
}

export function useDeleteIngredient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
        onError: (err: any) => {
            const errorMessage =
                err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        },
    });
}

export function useEditIngredient() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: editIngredient,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        },
        onError: (err: any) => {
            const errorMessage =
                err?.response?.data?.message || err?.message || "An error occurred";
            return errorMessage
        },
    });
}