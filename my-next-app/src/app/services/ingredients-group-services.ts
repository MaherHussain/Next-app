import http from "./http";

interface IngredientGroup {
    _id: string
    name: string
    ingredients: string[]
    createdAt: string
    updatedAt: string
}

interface Response {
    success: boolean,
    data: IngredientGroup[],
   
}
export async function getIngredientGroups({ restaurantId }: { restaurantId: string }): Promise<Response> {

    const response = await http.get<Response>(`/ingredients-group?restaurantId=${restaurantId}`)
    return response.data
}
export async function addIngredientGroup({ name, ingredients, restaurantId }: { name: string, ingredients: string[], restaurantId: string }): Promise<IngredientGroup> {

    const response = await http.post<IngredientGroup>(`/ingredients-group`, { name, ingredients, restaurantId })
    return response.data
}