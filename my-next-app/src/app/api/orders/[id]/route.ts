import http from "@/app/services/http";
import dbConnect from "@/lib/mongodb";
import Order from "@/lib/models/Order";
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