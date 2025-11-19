import http from "./http";

interface Ingredient {
    _id: string
    name: string
    cost: number
    createdAt: string
    updatedAt: string
}
interface Response {
    success: boolean,
    data: Ingredient[],
    meta: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    }
}

export async function getIngredients({ restaurantId, page, limit }: { restaurantId: string, page: number, limit: number }): Promise<Response> {

    const response = await http.get<Response>(`/ingredients?restaurantId=${restaurantId}&page=${page}&limit=${limit}`)
    return response.data
}

export async function addIngredient(ingredient: { name: string, cost: number, restaurantId: string }): Promise<Ingredient> {
    const response = await http.post<Ingredient>("/ingredients", ingredient);
    return response.data;
}

export async function deletedIngredient(id: string): Promise<{ success: boolean; message: string }> {

    const response = await http.delete<{ success: boolean; message: string }>('/ingredients', { data: { id } })
    return response.data
}

export async function editIngredient(ingredient: { id: string, name: string, cost: number }): Promise<Ingredient> {
    const response = await http.put<Ingredient>("/ingredients", ingredient);
    return response.data;
}