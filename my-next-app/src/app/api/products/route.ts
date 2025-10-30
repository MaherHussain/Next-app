import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function GET() {
    await dbConnect();
    try {
        // `GET` may be called with a Request argument by Next.js — read it from arguments[0]
        const req = arguments[0] as NextRequest | undefined;
        const url = req ? new URL(req.url) : undefined;

        const pageParam = url?.searchParams.get('page') ?? '1';
        const limitParam = url?.searchParams.get('limit') ?? '10';

        const page = Math.max(1, parseInt(pageParam, 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(limitParam, 10) || 10)); // cap limit to 100
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
            Product.countDocuments()
        ]);

        const totalPages = Math.max(1, Math.ceil(total / limit));

        return NextResponse.json({
            success: true,
            data: products,
            meta: { total, page, limit, totalPages }
        }, { status: 200 });
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

export async function DELETE(req: NextRequest) {
    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({
                success: false,
                message: 'Product ID is required'
            }, { status: 400 });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return NextResponse.json({
                success: false,
                message: 'Product not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Product deleted successfully'
        }, { status: 200 });
    } catch (error) {
        console.error('[DELETE_PRODUCT_ERROR]', error);
        return NextResponse.json(
            {
                message: 'Failed to delete product',
                error: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }

}
