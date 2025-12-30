import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Cart, { ICart } from '@/lib/models/Cart';
import { CartItem } from '@/app/types';
import { ingredientsMatch } from '@/app/utils/cart-utils';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ cartId: string }> }) {
    await dbConnect()

    try {
        const {cartId} = await params
        const {  product, ingredients } = await req.json()
        

        if (!cartId || !product || !product.id) {
            return NextResponse.json({ message: 'cartId and product (with id) are required' }, { status: 400 })
        }
        console.log(product , ingredients)
        const cart: ICart | null = await Cart.findOne({ cartId })

        if (!cart) {
            return NextResponse.json({ message: 'Cart not found' }, { status: 404 })
        }
        

        // Find the item to remove
        const itemIndex = cart.items.findIndex((item: CartItem) => {
           console.log({item})
            // Convert Map to plain object if it's a Map
            const itemIngredients = item.ingredients instanceof Map 
                ? Object.fromEntries(item.ingredients) 
                : item.ingredients || {};
            
            return item.product.id.toString() === product.id.toString() && ingredientsMatch(itemIngredients, ingredients || {})
        })
        console.log(itemIndex)
        if (itemIndex === -1) {
            return NextResponse.json({ message: 'Item not found in cart' }, { status: 404 })
        }

        // Remove the item from the array
        cart.items.splice(itemIndex, 1)

        await cart.save()
        return NextResponse.json({ message: "item has been removed from cart", data: cart }, { status: 200 })

    } catch (error) {
        console.error('[CART_REMOVE_ERROR]', error);
        return NextResponse.json(
            { message: 'Failed to remove item from cart', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
