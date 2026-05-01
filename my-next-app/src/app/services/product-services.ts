import http from "./http";
import { Product } from "../types";
interface Response {
    success: boolean,
    data: Product[]
    meta: {
        total: number,
        page: number,
        limit: number,
        totalPages: number
    }
}

export async function getProducts({ page, limit, restaurantId, activeOnly }: { page?: number, limit?: number, restaurantId: string, activeOnly: boolean }): Promise<Response> {

    const response = await http.get<Response>('/products', { params: { page, limit, restaurantId, activeOnly } })
    return response.data
}
export async function addProduct(product: { name: string; price: number; restaurantId: string; active?: boolean, ingredients?: string[], imageUrl?: string }): Promise<Product> {

    const response = await http.post<Product>('/products', product)
    return response.data
}
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {

    const response = await http.delete<{ success: boolean; message: string }>('/products', { data: { id } })
    return response.data
}

export async function editProduct(product: { id: string, name?: string; price?: number; active?: boolean, ingredients?: string[], imageUrl?: string }): Promise<Product> {

    const response = await http.put<Product>(`/products/${product.id}`, product)
    return response.data
}
export async function searchProducts({ query, page, limit, restaurantId, activeOnly }: { query: string, page?: number, limit?: number, restaurantId: string, activeOnly: boolean }): Promise<Response> {
    const response = await http.get<Response>(`/products/search`, { params: { q: query, page, limit, restaurantId, activeOnly } });
    return response.data;
}