import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function GET(request: NextRequest,
    { params }: { params: Promise<{ id: string }> },) {
    await dbConnect()

       const id = (await params).id;
    if (!id) return 
    try {
        const order = await Order.findOne({ _id: id }).sort({ createdAt: -1 });
        if (!order) {
            return NextResponse.json({ error: 'Order not found or not confirmed yet' }, { status: 404 });
        }
        if (!order.estimatedTime || order.status !== 'confirmed') {
            return NextResponse.json({ state: 'pending', message: 'Order is still pending acceptance.' }, { status: 202 });
        }   
        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch confirmed order' }, { status: 500 });
    }
}