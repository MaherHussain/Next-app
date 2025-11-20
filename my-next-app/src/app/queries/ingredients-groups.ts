import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getIngredientGroups } from "../services/ingredients-group-services";

export function useGetIngredientsGroups({ restaurantId }: { restaurantId: string }) {
    return useQuery({
        queryKey: ['ingredient-groups', { restaurantId }],
        queryFn: () => getIngredientGroups({ restaurantId }),
        retry: 3,
        enabled: !!restaurantId,
    })
}