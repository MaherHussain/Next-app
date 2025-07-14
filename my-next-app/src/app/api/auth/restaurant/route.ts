import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/lib/models/Restaurant";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
    await dbConnect();

    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);

        const userId = payload.userId as string;
        const restaurantId = payload.restaurantId as string;
        if (!userId && !restaurantId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return NextResponse.json({ message: 'Restaurant not found' }, { status: 404 });
        }

        return NextResponse.json({ data: restaurant });
    } catch (error) {
        console.error('[RESTAURANT_ROUTE]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}