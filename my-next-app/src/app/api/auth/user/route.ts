import { NextRequest, NextResponse } from "next/server";
import Partner from '@/lib/models/Partner';
import Restaurant from '@/lib/models/Restaurant';
import dbConnect from "@/lib/mongodb";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
    await dbConnect();

    const token = req.cookies.get('auth-token')?.value;

    if (!token) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

        const { payload } = await jwtVerify(token, secret);

        const userId = payload.userId as string;
        if (!userId) {
            return NextResponse.json({ user: null }, { status: 401 });
        }

        const user = await Partner.findById(userId)
            .select('-password')

        if (!user) {
            return NextResponse.json({ user: null }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}