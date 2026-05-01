import { NextRequest, NextResponse } from "next/server";
import Partner from '@/lib/models/partner';
import Restaurant from '@/lib/models/restaurant';
import dbConnect from "@/lib/mongodb";
import { jwtVerify } from "jose";

async function getPartnerFromRequest(req: NextRequest) {
    const token = req.cookies.get('auth-token')?.value;
    if (!token) return null;

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
        const { payload } = await jwtVerify(token, secret);
        return payload.userId as string;
    } catch (error) {
        return null;
    }
}

export async function GET(req: NextRequest) {
    await dbConnect();
    const userId = await getPartnerFromRequest(req);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const partner = await Partner.findById(userId);
        if (!partner) {
            return NextResponse.json({ message: "Partner not found" }, { status: 404 });
        }

        const restaurant = await Restaurant.findById(partner.restaurantId).lean();
        if (!restaurant) {
            return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
        }

        console.log("[DEBUG_SERVER_RESTAURANT]", JSON.stringify(restaurant, null, 2));

        return NextResponse.json({ restaurant });
    } catch (error) {
        console.error("[PROFILE_GET_ERROR]", error);
        return NextResponse.json({ message: "Internal error" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await dbConnect();
    const userId = await getPartnerFromRequest(req);

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { name, address, logo, openHours } = body;

        const partner = await Partner.findById(userId);
        if (!partner) {
            return NextResponse.json({ message: "Partner not found" }, { status: 404 });
        }

        // Update restaurant using findByIdAndUpdate to ensure fields are saved
        try {
            const updatedRestaurant = await Restaurant.findByIdAndUpdate(
                partner.restaurantId,
                { 
                    $set: { 
                        name, 
                        address,
                        logo, 
                        openHours 
                    } 
                },
                { new: true, runValidators: true, strict: false }
            );

            if (!updatedRestaurant) {
                return NextResponse.json({ message: "Restaurant not found in DB" }, { status: 404 });
            }

            return NextResponse.json({ 
                message: "Profile updated successfully",
                restaurant: updatedRestaurant 
            });
        } catch (dbError: any) {
            console.error("[PROFILE_PUT_DB_ERROR]", dbError);
            if (dbError.code === 11000) {
                return NextResponse.json({ message: "Restaurant name or address already exists" }, { status: 400 });
            }
            return NextResponse.json({ message: dbError.message || "Database update failed" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("[PROFILE_PUT_INTERNAL_ERROR]", error);
        return NextResponse.json({ message: error.message || "Internal server error" }, { status: 500 });
    }
}
