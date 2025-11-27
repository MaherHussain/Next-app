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
    success: boolean
    message: string
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    },
    data: Record<string, any>
}
interface AcceptOrderPayload {
    orderId: string
    estimatedTime: string
}

export async function getAllOrders({ page, limit, restaurantId }: { page?: number, limit?: number, restaurantId: string }): Promise<OrderResponse> {
    const response = await http.get('orders', { params: { page, limit, restaurantId } })
    return response.data
}

export async function placeOrder(payload: Payload): Promise<OrderResponse> {
    const response = await http.post('order/place-order', payload)
    return response.data

}

export async function acceptOrder(payload: AcceptOrderPayload) {
    const response = await http.patch('order/accept', payload)
    return response.data

}