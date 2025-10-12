import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';
import axios from 'axios';

type Params = {
    selectedTime: string; estimateMinutes: string
}

function calculateEstimatedTime({ selectedTime, estimateMinutes }: Params) {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const date = new Date();

    date.setHours(hours);
    date.setMinutes(minutes + Number(estimateMinutes));

    const newHours = String(date.getHours()).padStart(2, '0');
    const newMinutes = String(date.getMinutes()).padStart(2, '0');

    return `${newHours}:${newMinutes}`;
}

export async function PATCH(req: NextRequest) {
    await dbConnect();
    try {
        const { orderId, estimatedTime } = await req.json();
        if (!orderId || !estimatedTime) {
            return NextResponse.json({ message: 'Missing orderId or estimatedTime' }, { status: 400 });
        }
        const order = await Order.findById(orderId);
        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }
        const newEstimatedTime = calculateEstimatedTime({ selectedTime: order.selectedTime, estimateMinutes: estimatedTime });
        order.estimatedTime = newEstimatedTime;
        order.status = 'confirmed';
        await order.save();
        try {

            await axios.post('http://localhost:4000/notify-order-accepted', {
                restaurantId: order.restaurantId,
                orderId: order._id,
                order: order
            });
        } catch (notifyError) {
            console.error('Failed to notify Socket.IO server:', notifyError);
        }
        return NextResponse.json({ message: 'Order accepted', data: order });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to accept order', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
} 