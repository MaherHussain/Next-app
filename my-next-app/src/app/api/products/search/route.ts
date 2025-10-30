import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/Product";

export async function GET(request: NextRequest) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const rowQuery = searchParams.get('q');
    const query = (rowQuery ?? "").trim();
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const skip = (page - 1) * limit;
    try {

        let items;
        let total;
        const regex = new RegExp(query.trim(), "i");
        const filter = { $or: [{ name: regex }] };
        [items, total] = await Promise.all([
            Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            Product.countDocuments(filter)
        ]);
       
        const totalPages = Math.max(1, Math.ceil(total / limit));

        return NextResponse.json(
            { success: true, data: items, meta: { total, page, limit, totalPages } },
            { status: 200 }
        );

    } catch (error) {
        console.error('[GET_PRODUCTS_ERROR]', error);

        return NextResponse.json(
            { message: 'Failed to fetch products', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
