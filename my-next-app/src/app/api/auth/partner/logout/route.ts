import { NextResponse } from 'next/server';

export async function POST() {
    try {

        // Create response
        const response = NextResponse.json({
            message: 'Logged out successfully'
        });

        // Clear the auth cookie
        response.cookies.delete('auth-token');

        return response;
    } catch (error) {
        console.error('[LOGOUT]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
} 