import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function PUT(req: NextRequest) {
    await dbConnect();
    try {
        const { id, name, price } = await req.json();
        if (!id || !name || !price) {
            return NextResponse.json({
                success: false,
                message: 'Product ID, name and price are required'
            }, { status: 400 });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, { name, price }, { new: true });
        if (!updatedProduct) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: updatedProduct
        }, { status: 200 });
    } catch (error) {
        console.error('[UPDATE_PRODUCT_ERROR]', error);
        return NextResponse.json(
            {
                message: 'Failed to update product',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }

}
