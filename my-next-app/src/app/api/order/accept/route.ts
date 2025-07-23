import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

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
        order.status = 'confirmed';
        order.estimatedTime = estimatedTime;
        await order.save();
        return NextResponse.json({ message: 'Order accepted', data: order });
    } catch (error) {
        return NextResponse.json({ message: 'Failed to accept order', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
} 