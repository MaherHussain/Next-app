import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/order";
import { NextRequest, NextResponse } from "next/server";

//get order by id
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }>  }) {
    await dbConnect();

    try {
        const {id} = await params;
        const order = await Order.findById(id).lean();

        if (!order) {
            return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: order }, { status: 200 });
    } catch (error) {
        console.error('[GET_ORDER_ERROR]', error);
        return NextResponse.json({ success: false, message: 'Failed to fetch order', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}

//update order status (accept/etc)
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;
        const { status, estimatedTime } = await request.json();

        const updateData: any = {};
        if (status) updateData.status = status;
        if (estimatedTime) updateData.estimatedTime = estimatedTime;

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ message: 'Missing update fields' }, { status: 400 });
        }

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Order updated', data: order });
    } catch (error) {
        console.error('[UPDATE_ORDER_ERROR]', error);
        return NextResponse.json({ message: 'Failed to update order', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
    }
}