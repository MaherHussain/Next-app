import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import IngredientGroup from '@/lib/models/ingredients-group';


export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const url = new URL(req.url);

        const restaurantId = url?.searchParams.get("restaurantId");
        const ingredientsGroup = await IngredientGroup.find({ restaurantId }).populate({ path: "ingredients", select: "name cost" });

        return NextResponse.json({ success: true, data: ingredientsGroup }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch ingredients' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();  
    try {
        const {name, ingredients, restaurantId }= await req.json();
        if(!name || !ingredients || !restaurantId){
            return NextResponse.json({ error: 'Ingredient group name, ingredients, and restaurant ID are required' }, { status: 400 });
        }
        
        const newIngredientGroup = new IngredientGroup({ name, ingredients, restaurantId });
        
        await newIngredientGroup.save();
        
        return NextResponse.json({
            success: true,
            data: newIngredientGroup
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create ingredient group' }, { status: 500 });
    }   
}

export async function DELETE(req: NextRequest) {    
    await dbConnect();
    try {

        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Ingredient group ID is required' }, { status: 400 });
        }


        const deletedIngredientGroup = await IngredientGroup.findByIdAndDelete(id);
        if (!deletedIngredientGroup) {
            return NextResponse.json({ error: 'Ingredient group not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Ingredient group deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete ingredient group' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const { id, name ,ingredients} = await req.json();
        if (!id || !name || !ingredients) {
            return NextResponse.json({ error: 'Ingredient group ID, name, and ingredients are required' }, { status: 400 });
        }
        const updatedIngredientGroup = await IngredientGroup.findByIdAndUpdate(
            id,
            { name, ingredients },
            { new: true }
        );

        if (!updatedIngredientGroup) {
            return NextResponse.json({ error: 'Ingredient group not found' }, { status: 404 });
        }
        return NextResponse.json(updatedIngredientGroup);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update ingredient group' }, { status: 500 });
    }
}
