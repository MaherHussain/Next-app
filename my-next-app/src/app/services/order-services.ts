import http from "./http";
import { ContactData, CartItem } from '../types'

interface Payload {
    items: CartItem[]
    contactData: ContactData
    total: number
    selectedTime: string
    orderMethod: string
    paymentMethod: string
    restaurantId?: string
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

export async function getOrderById(orderId: string): Promise<OrderResponse> {
    const response = await http.get(`orders/${orderId}`)
    return response.data
}

export async function placeOrder(payload: Payload): Promise<OrderResponse> {
    const response = await http.post('orders', payload)
    return response.data
}

export async function acceptOrder(payload: AcceptOrderPayload) {
    const { orderId, estimatedTime } = payload;
    const response = await http.patch(`orders/${orderId}`, { estimatedTime, status: 'confirmed' })
    return response.data
}

interface RejectOrderPayload {
    orderId: string
    rejectionReason?: string
}

export async function rejectOrder(payload: RejectOrderPayload) {
    const { orderId, rejectionReason } = payload;
    const response = await http.patch(`orders/${orderId}`, { status: 'rejected', rejectionReason })
    return response.data
}

export async function markOrderReady(orderId: string) {
    const response = await http.patch(`orders/${orderId}`, { status: 'ready' })
    return response.data
}
