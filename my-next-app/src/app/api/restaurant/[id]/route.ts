import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Restaurant from "@/lib/models/restaurant";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const restaurant = await Restaurant.findById(id).select("name address openHours logo");
    
    if (!restaurant) {
      return NextResponse.json({ message: "Restaurant not found" }, { status: 404 });
    }

    return NextResponse.json({ data: restaurant });
  } catch (error) {
    console.error("[RESTAURANT_ID_GET]", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
