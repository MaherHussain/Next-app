import { NextRequest, NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Partner from '@/lib/models/Partner';
import bcrypt from 'bcrypt';
import { LoginFormSchema } from '@/lib/validations/login-validation';
import { SignJWT } from 'jose';

export async function POST(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();

        // Validate input with Zod
        const parsed = LoginFormSchema.safeParse(body);
        if (!parsed.success) {
            const errors: Record<string, string> = {};
            parsed.error.errors.forEach((error) => {
                const field = error.path[0] as string;
                errors[field] = error.message;
            });
            return NextResponse.json({ errors }, { status: 400 });
        }

        const { email, password } = parsed.data;

        // Find user by email
        const partner = await Partner.findOne({ email }).populate('restaurantId');
        if (!partner) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, partner.password);
        if (!isPasswordValid) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        }

        // Create JWT token
        const token = await new SignJWT({
            userId: partner._id,
            email: partner.email,
            type: 'partner'
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('7d')
            .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

        // Get restaurant name safely
        const restaurantName = partner.restaurantId && typeof partner.restaurantId === 'object' && 'name' in partner.restaurantId
            ? (partner.restaurantId as any).name
            : 'Unknown Restaurant';

        // Create response with HTTP-only cookie
        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: partner._id,
                email: partner.email,
                partnerName: partner.partnerName,
                restaurantName
            }
        });

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
        console.error('[LOGIN_PARTNER]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
} 