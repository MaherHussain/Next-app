import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Partner from '@/lib/models/Partner';
import Restaurant from '@/lib/models/Restaurant';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    await dbConnect()
    try {

        const { partnerName, phone, email, password, restaurantName, restaurantAddress, cvrNumber, openHours } = await req.json()

        //check if email is exists 
        const isEmailExistes = await Partner.findOne({ email })

        if (isEmailExistes) {
            return NextResponse.json({ message: "This email is already used, please try another email" }, { status: 400 })
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