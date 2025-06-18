import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const {
            items,
            contactData,
            selectedTime,
            orderMethod,
            paymentMethod,
            total
        } = await req.json()


        if (!items || !contactData || !contactData.name || !contactData.phone) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 })
        }
        const newOrder = new Order({
            items,
            contactData,
            selectedTime,
            paymentMethod,
            total,
            orderMethod,
            status: 'awaiting-admin'
        })
        await newOrder.save()
        return NextResponse.json({ message: `Your order is sent to restaurant and waitng confirmation, please wait  ..... `, data: newOrder },)

    } catch (error) {
        return NextResponse.json(
            { message: 'Failed to place order', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }

}