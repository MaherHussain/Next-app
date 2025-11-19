import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addIngredient, getIngredients } from "../services/ingredient-services";

export function useGetIngredients({ restaurantId, page, limit }: { restaurantId: string, page: number, limit: number }) {
    return useQuery({
        queryKey: ['ingredients', { restaurantId, page, limit }],
        queryFn: () => getIngredients({ restaurantId, page, limit }),
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
            console.log(errorMessage);
        },
    });
}