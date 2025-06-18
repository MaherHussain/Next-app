import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Cart from '@/lib/models/Cart';

export async function GET(req: NextRequest,
    { params }: { params: { cartId: string } }) {
    await dbConnect()
    try {
        const { cartId } = await params
        const cart = await Cart.findOne({ cartId })
        if (!cart) {
            return NextResponse.json({ items: [] }, { status: 200 })
        }
        return NextResponse.json(cart, { status: 200 })
    } catch (error) {
        console.error('[GET_CART_ERROR]', error);
        return NextResponse.json(
            { message: 'Error fetching cart', error },
            { status: 500 }
        );
    }
}