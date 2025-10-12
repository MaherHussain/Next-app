import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {

    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;

    // Check if the request is for a protected route
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/partner/dashboard');

    if (isProtectedRoute) {
        if (!token) {
            // No token found, redirect to login
            return NextResponse.redirect(new URL('/auth/partner/login', request.url));
        }

        try {
            // Verify the token
            const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
            await jwtVerify(token, secret);

            // Token is valid, allow access
            return NextResponse.next();
        } catch (error) {
            // Token is invalid or expired, redirect to login
            const response = NextResponse.redirect(new URL('/auth/login', request.url));

            // Clear the invalid cookie
            response.cookies.delete('auth-token');

            return response;
        }
    }

    // For non-protected routes, just continue
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/partner/dashboard/:path*',
        '/auth/partner/login',
        '/auth/partner/register'
    ]
}; 