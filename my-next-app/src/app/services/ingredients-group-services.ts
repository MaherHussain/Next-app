import http from "./http";
import { IngredientsGroup } from "../types";



interface Response {
    success: boolean,
    data: IngredientsGroup[],
   
}
export async function getIngredientGroups({ restaurantId }: { restaurantId: string }): Promise<Response> {

    const response = await http.get<Response>(`/ingredients-group?restaurantId=${restaurantId}`)
    return response.data
}
export async function addIngredientGroup({ name, ingredients, restaurantId }: { name: string, ingredients: string[], restaurantId: string }): Promise<IngredientsGroup> {

    const response = await http.post<IngredientsGroup>(`/ingredients-group`, { name, ingredients, restaurantId })
    return response.data
}
export async function editIngredientGroup({ id, name, ingredients }: { id: string, name: string, ingredients: string[] }): Promise<IngredientsGroup> {

    const response = await http.put<IngredientsGroup>(`/ingredients-group`, { id, name, ingredients })
    return response.data
}
export async function deleteIngredientGroup(id: string): Promise<{ success: boolean; message: string }> {

    const response = await http.delete<{ success: boolean; message: string }>('/ingredients-group', { data: { id } })
    return response.data
}