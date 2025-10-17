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
}

export async function getProducts(): Promise<Response> {

    const response = await http.get<Response>('/products')
    return response.data
}
export async function addProduct(product: { name: string; price: number }): Promise<Product> {

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