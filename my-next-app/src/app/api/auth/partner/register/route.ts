import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Partner from '@/lib/models/Partner';
import Restaurant from '@/lib/models/Restaurant';
import bcrypt from 'bcrypt';
import { RegisterFormSchema } from '@/lib/validations/register-validation';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
    await dbConnect()
    try {
        const body = await req.json();

        // Validate input with Zod
        const parsed = RegisterFormSchema.safeParse(body);
        if (!parsed.success) {
            const errors: Record<string, string> = {};
            parsed.error.errors.forEach((error) => {
                const field = error.path[0] as string;
                errors[field] = error.message;
            });
            return NextResponse.json({ errors }, { status: 400 });
        }

        const { partnerName, email, password, restaurantName, restaurantAddress } = parsed.data;

        const isRestaurantExists = await Restaurant.findOne({ name: restaurantName })
        const isEmailExists = await Partner.findOne({ email })
        const errors: Record<string, string> = {}

        //check if restaurant is exists
        if (isRestaurantExists) {
            errors.restaurantName = "This restaurant already exists, please try another restaurant name.";
        }
        //check if email is exists
        if (isEmailExists) {
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
        })

        // create partner
        const partner = await Partner.create({
            partnerName,
            email,
            password: hashedPassword,
            restaurantId: restaurant._id
        })

        // Create JWT token for auto-login
        const token = await new SignJWT({
            userId: partner._id,
            email: partner.email,
            type: 'partner'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

        // Create response with HTTP-only cookie
        const response = NextResponse.json({
            message: 'Partner registered successfully',
            user: {
                id: partner._id,
                email: partner.email,
                partnerName: partner.partnerName,
                restaurantName: restaurant.name
            }
        }, { status: 201 });

        // Set HTTP-only cookie
        response.cookies.set('auth-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;

    } catch (error) {
        console.error('[REGISTER_PARTNER]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}