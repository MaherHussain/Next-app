import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function GET() {
    await dbConnect();
    try {
        const products = await Product.find();
        return NextResponse.json({ succuss: true, data: products }, { status: 200 });
    } catch (error) {
        console.error('[GET_PRODUCTS_ERROR]', error);

        return NextResponse.json(
            { message: 'Failed to fetch products', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {

    await dbConnect()
    try {
        const { name, price } = await req.json()

        if (!name || !price) {
            return NextResponse.json({
                success: false,
                message: 'name and price are required'
            }, { status: 400 })

        }
        const newProduct = new Product({
            name, price
        })

        await newProduct.save()

        return NextResponse.json({
            success: true,
            data: newProduct
        }, { status: 201 })

    } catch (error) {
        console.error('[CREATE_PRODUCT_ERROR]', error);
        return NextResponse.json(
            {
                message: 'Failed to create product',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }

}