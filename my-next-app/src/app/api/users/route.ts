import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongodb";
import User from '@/lib/models/User';

export async function GET() {
    await dbConnect()
    try {
        const users = await User.find()
        return NextResponse.json({
            success: true,
            data: users
        })
    } catch (error) {
        console.error('[GET_USERS_ERROR]', error);

        return NextResponse.json(
            { message: 'Failed to fetch users', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}