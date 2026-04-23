import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/order";
import axios from 'axios';

//get all orders by restaurantId with pagination
export async function GET(request: Request) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const restaurantId = searchParams.get('restaurantId');

        const pageParam = searchParams.get('page') ?? '1';
        const limitParam = searchParams.get('limit') ?? '10';
        const page = Math.max(1, parseInt(pageParam, 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(limitParam, 10) || 10)); // cap limit to 100
        const skip = (page - 1) * limit;

        if (!restaurantId) {
            return new Response(JSON.stringify({ success: false, message: 'restaurantId required' }), { status: 400 });
        }
        const [orders, total] = await Promise.all([
            Order.find({ restaurantId }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Order.countDocuments({ restaurantId })
        ]);

        return new Response(JSON.stringify({ success: true, data: orders, meta: { total, page, limit } }), { status: 200 });
    } catch (error) {
        console.error('[GET_ORDERS_ERROR]', error);
        return new Response(JSON.stringify({ success: false, message: 'Failed to fetch orders', error: error instanceof Error ? error.message : 'Unknown error' }), { status: 500 });
    }
}

//place order
export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const {
            items,
            contactData,
            selectedTime,
            orderMethod,
            paymentMethod,
            total,
            restaurantId
        } = await req.json()


        if (!items || !contactData || !contactData.name || !contactData.phone || !restaurantId) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }
        const newOrder = new Order({
            items,
            contactData,
            selectedTime,
            paymentMethod,
            total,
            orderMethod,
            status: 'awaiting-admin',
            restaurantId
        })
        await newOrder.save()

        // Notify the Socket.IO server
        try {
            await axios.post('http://localhost:4000/notify-new-order', {
                restaurantId,
                order: newOrder,
            });

        } catch (notifyError) {
            console.error('Failed to notify Socket.IO server:', notifyError);
        }


        return NextResponse.json({ message: `Your order is sent to restaurant and waitng confirmation, please wait  ..... `, data: newOrder },)

    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to place order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }

}