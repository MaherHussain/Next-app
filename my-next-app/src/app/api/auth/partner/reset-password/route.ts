import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Partner from "@/lib/models/partner";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const now = new Date();

        console.log("[DEBUG_RESET_PASSWORD] Received Token:", token);
        console.log("[DEBUG_RESET_PASSWORD] Calculated Hash:", tokenHash);
        console.log("[DEBUG_RESET_PASSWORD] Current Date:", now.toISOString());

        const partner = await Partner.findOne({
            resetPasswordToken: tokenHash,
            resetPasswordExpires: { $gt: now }
        });

        console.log("[DEBUG_RESET_PASSWORD] Partner Found:", partner ? partner.email : "NONE");

        if (!partner) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        partner.password = await bcrypt.hash(password, salt);

        // Clear reset fields
        partner.resetPasswordToken = undefined;
        partner.resetPasswordExpires = undefined;
        await partner.save();

        return NextResponse.json({ message: "Password reset successful. You can now log in with your new password." });
    } catch (error: any) {
        console.error("[RESET_PASSWORD_ERROR]", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
