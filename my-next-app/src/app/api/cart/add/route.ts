import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Cart, { ICart } from '@/lib/models/Cart';
import { Item } from '@/app/types';

function ingredientsMatch(a: any, b: any) {
    // If both are undefined or empty, they're considered matching
    if (!a && !b) return true;
    if (!a || !b) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (const key of aKeys) {
        // Compare arrays for each ingredient group by JSON stringification
        if (JSON.stringify(a[key] || []) !== JSON.stringify(b[key] || [])) {
            return false;
        }
    }
    return true;
}

export async function POST(req: NextRequest) {
    await dbConnect()

    try {
        const { cartId, product, quantity, ingredients } = await req.json()

        if (!cartId || !product || !quantity) {
            return NextResponse.json({ message: 'cartId, product, and quantity are required' }, { status: 400 })
        }

        let cart: ICart | null = await Cart.findOne({ cartId })


        if (!cart) {
            cart = new Cart({ cartId, items: [] })
        }

        const existingItem = cart?.items.find((item: Item) => {
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
