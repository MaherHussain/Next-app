import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Partner from '@/lib/models/Partner';
import Restaurant from '@/lib/models/Restaurant';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const { partnerName, phone, email, password, restaurantName, restaurantAddress, cvrNumber, openHours } = await req.json()


        const isRestaurantExists = await Restaurant.findOne({ name: restaurantName })
        const isEmailExistes = await Partner.findOne({ email })
        const errors: Record<string, string> = {}
        //check if restaurant is exists
        if (isRestaurantExists) {
            errors.restaurantName = "This restaurant already exists, please try another restaurant name.";
        }
        //check if email is exists
        if (isEmailExistes) {
            errors.email = "This email is already registered, please use another email or login.";
        }

        if (Object.keys(errors).length > 0) {
            return NextResponse.json(
                { errors },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        // create restaurant 

        const restaurant = await Restaurant.create({
            name: restaurantName,
            address: restaurantAddress,
            cvrNumber,
            openHours
        })

        // create partner

        const partner = await Partner.create({
            partnerName,
            phone,
            email,
            password: hashedPassword,
            restaurantId: restaurant._id
        })

        return NextResponse.json({ message: 'partner registered successfully', data: partner }, { status: 201 })

    } catch (error) {
        console.error('[REGISTER_PARTNER]', error);
        return NextResponse.json({ message: 'Server error', error }, { status: 500 });
    }
}