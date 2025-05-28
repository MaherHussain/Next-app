//endpoint is  api/test-mongodb.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/mongodb";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        await dbConnect();

        res.status(200).json({
            success: true,
            message: "Mongoose connected successfully!",
        });
    } catch (error: any) {
        console.error("Mongoose connection error:", error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
}