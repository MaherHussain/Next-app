import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Cart, { ICart } from '@/lib/models/Cart';
import { CartItem } from '@/app/types';
import { ingredientsMatch } from '@/app/utils/cart-utils';

export async function POST(req: NextRequest, { params }: { params: Promise<{ cartId: string }> }) {
    await dbConnect()

    try {
        const { cartId } = await params
        const { product, quantity, ingredients } = await req.json()

        if ( !product || !quantity) {
            return NextResponse.json({ message: 'cartId, product, and quantity are required' }, { status: 400 })
        }

        let cart: ICart | null = await Cart.findOne({ cartId })


        if (!cart) {
            cart = new Cart({ cartId, items: [] })
        }

        const existingItem = cart?.items.find((item: CartItem) => {
            return item.product.id.toString() === product.id && ingredientsMatch(item.ingredients, ingredients)
        })

        if (existingItem) {
            existingItem.quantity = Number(existingItem.quantity) + Number(quantity);
        }
        else {
            const newItem = {
                product: { name: product.name, id: product.id, price: product.price },
                ingredients,
                quantity,
            }
            cart?.items.push(newItem)
        }

        await cart?.save()
        return NextResponse.json({ message: "item has been added to cart", data: cart }, { status: 200 })

    } catch (error) {
        console.error('[CART_ADD_ERROR]', error);
        return NextResponse.json(
            { message: 'Failed to add item to cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
} 
