import http from "./http";
import { ContactData, Item } from '../types'

interface Payload {
    items: Item[]
    contactData: ContactData
    total: number
    selectedTime: string
    orderMethod: string
    paymentMethod: string
}

interface OrderResponse {
    message: string,
    data: Record<string, any>
}

export async function placeOrder(payload: Payload): Promise<OrderResponse> {
    const response = await http.post('order/place-order', payload)
    return response.data

}