import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/lib/models/partner";
import crypto from 'crypto';
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const partner = await Partner.findOne({ email });
        if (!partner) {
            return NextResponse.json({ message: "No account found with this email address." }, { status: 404 });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        console.log("[DEBUG_FORGOT_PASSWORD] Generated Token:", resetToken);
        console.log("[DEBUG_FORGOT_PASSWORD] Generated Hash:", tokenHash);

        // Set expiry (1 hour)
        const expiry = new Date(Date.now() + 3600000);

        // Save to partner using findOneAndUpdate to bypass schema caching issues
        const updatedPartner = await Partner.findOneAndUpdate(
            { email },
            { 
                $set: { 
                    resetPasswordToken: tokenHash, 
                    resetPasswordExpires: expiry 
                } 
            },
            { new: true, strict: false }
        );

        if (!updatedPartner) {
            console.error("[FORGOT_PASSWORD_ERROR] Partner not found during update");
            return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
        }

        console.log("[DEBUG_FORGOT_PASSWORD] Partner updated in DB:", updatedPartner.email);
        console.log("[DEBUG_FORGOT_PASSWORD] Stored Hash:", updatedPartner.resetPasswordToken);

        // Create reset URL
        const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';
        const resetUrl = `${domain}/auth/partner/reset-password?token=${resetToken}`;

        // Send email
        await sendPasswordResetEmail(email, resetUrl);

        return NextResponse.json({ message: "If this email is registered, you will receive a reset link shortly." });
    } catch (error: any) {
        console.error("[FORGOT_PASSWORD_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
