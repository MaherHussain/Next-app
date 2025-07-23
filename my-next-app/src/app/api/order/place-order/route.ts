import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Order from '@/lib/models/Order';
import axios from 'axios';

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
            restaurantId // <-- accept restaurantId from request
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
            restaurantId // <-- save restaurantId
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