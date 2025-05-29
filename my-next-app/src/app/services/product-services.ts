import http from "./http";

interface Product {
    name: string,
    price: string | number
}

interface Response {
    success: boolean,
    data: Product[]
}

export async function getProducts(): Promise<Response> {

    const response = await http.get<Response>('/products')
    return response.data
}