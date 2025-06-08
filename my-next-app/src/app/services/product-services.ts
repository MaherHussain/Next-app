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