import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addIngredientGroup, deleteIngredientGroup, editIngredientGroup, getIngredientGroups } from "../services/ingredients-group-services";

export function useGetIngredientsGroups({ restaurantId }: { restaurantId: string }) {
    return useQuery({
        queryKey: ['ingredient-groups', { restaurantId }],
        queryFn: () => getIngredientGroups({ restaurantId }),
        retry: 3,
        enabled: !!restaurantId,
    })
}

export function useAddIngredientGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (newGroup: { name: string; ingredients: string[]; restaurantId: string }) =>
            addIngredientGroup(newGroup),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-groups'] });
        },
    });
}

export function useEditIngredientGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (updatedGroup: { id: string; name: string; ingredients: string[] }) =>
            editIngredientGroup(updatedGroup),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-groups'] });
        },
    });
}
export function useDeleteIngredientGroup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteIngredientGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredient-groups'] });
        },
    });
}
