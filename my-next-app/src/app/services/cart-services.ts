import http from "./http";

export interface Payload {
    cartId: string,
    product: { name: string, id: string, price: number },
    quantity: number,
    ingredients: Record<string, string[]>,
}

interface CreateCartItemResponse {
    message: string,
    data: Record<string, any>
}
export async function addItemToCart(payload: Payload): Promise<CreateCartItemResponse> {
    const response = await http.post('/cart/add', payload)
    return response.data

}
export async function getOneCart(cartId: string) {
    const response = await http.get(`/cart/${cartId}`)
    return response.data
}