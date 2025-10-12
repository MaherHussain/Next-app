import http from "./http";
import { ContactData, Item } from '../types'

interface Payload {
    items: Item[]
    contactData: ContactData
    total: number
    selectedTime: string
    orderMethod: string
    paymentMethod: string
    restaurantId?: string // add restaurantId as optional
}

interface OrderResponse {
    message: string,
    data: Record<string, any>
}
interface AcceptOrderPayload {
    orderId: string
    estimatedTime: string | number
}

export async function placeOrder(payload: Payload): Promise<OrderResponse> {
    const response = await http.post('order/place-order', payload)
    return response.data

}

export async function acceptOrder(payload: AcceptOrderPayload) {
    const response = await http.patch('order/accept', payload)
    return response.data

}
export async function getOrderById(id: string) {
    const response = await http.get(`order/${id}`);
    return response.data;
}
export async function getTodayOrders() {
    const response = await http.get(`order/orders`);
    return response.data;
}