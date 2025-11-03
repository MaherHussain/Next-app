import http from "./http";

interface Product {
    _id: string
    name: string
    price: number
    createdAt: string
    updatedAt: string
}

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

export async function getProducts({ page, limit, restaurantId }: { page?: number, limit?: number, restaurantId: string }): Promise<Response> {

    const response = await http.get<Response>('/products', { params: { page, limit, restaurantId } })
    return response.data
}
export async function addProduct(product: { name: string; price: number; restaurantId: string }): Promise<Product> {

    const response = await http.post<Product>('/products', product)
    return response.data
}
export async function deleteProduct(id: string): Promise<{ success: boolean; message: string }> {

    const response = await http.delete<{ success: boolean; message: string }>('/products', { data: { id } })
    return response.data
}

export async function editProduct(product: { id: string, name?: string; price?: number }): Promise<Product> {

    const response = await http.put<Product>(`/products/${product.id}`, product)
    return response.data
}
export async function searchProducts({ query, page, limit, restaurantId }: { query: string, page?: number, limit?: number, restaurantId: string }): Promise<Response> {
    const response = await http.get<Response>(`/products/search`, { params: { q: query, page, limit, restaurantId } });
    return response.data;
}