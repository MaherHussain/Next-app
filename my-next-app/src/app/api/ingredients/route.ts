import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Ingredient from '@/lib/models/Ingredient'; '@/lib/models/Ingredient';

export async function GET () {
    await dbConnect();
    try {
        const req = arguments[0] as NextRequest | undefined;
        const url = req ? new URL(req.url) : undefined;

        const pageParam = url?.searchParams.get('page') ?? '1';
        const limitParam = url?.searchParams.get('limit') ?? '10';
        const page = Math.max(1, parseInt(pageParam, 10) || 1);
        const limit = Math.max(1, Math.min(100, parseInt(limitParam, 10) || 10)); // cap limit to 100
        const skip = (page - 1) * limit;
        const restaurantId = url?.searchParams.get('restaurantId');

        if (!restaurantId) {
            return NextResponse.json({ success: false, message: 'restaurantId required' }, { status: 400 });

        }
        const filter: any = { restaurantId }
          const [ingredients, total] = await Promise.all([
                    Ingredient.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
                    Ingredient.countDocuments({ restaurantId })
                ]);
        const totalPages = Math.max(1, Math.ceil(total / limit));
        return NextResponse.json({
            success: true,
            data: ingredients,
            meta: { total, page, limit, totalPages }
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const { name, cost, restaurantId } = await req.json();

        if (!name || !restaurantId) {
            return NextResponse.json({ error: 'Ingredient name and restaurant ID are required' }, { status: 400 });
        }

        const newIngredient = new Ingredient({ name, cost, restaurantId });
        await newIngredient.save();
        return NextResponse.json({
            success: true,
            data: newIngredient
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create ingredient' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    await dbConnect();
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Ingredient ID is required' }, { status: 400 });
        }
        const deletedIngredient = await Ingredient.findByIdAndDelete(id);
        if (!deletedIngredient) {
            return NextResponse.json({ error: 'Ingredient not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Ingredient deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete ingredient' }, { status: 500 });
    }
}
export async function PUT(req: NextRequest) {
    await dbConnect();
    try {
        const { id, name, cost } = await req.json();
        if (!id) {

            return NextResponse.json({ error: 'Ingredient ID is required' }, { status: 400 });
        }
        const updatedIngredient = await Ingredient.findByIdAndUpdate(
            id,
            { name, cost },
            { new: true }
        );

        if (!updatedIngredient) {
            return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updatedIngredient });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update ingredient' }, { status: 500 });
    }
}