import { NextResponse, NextRequest } from 'next/server';
import dbConnect from "@/lib/mongodb";
import Order from '@/lib/models/Order';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
      // Get today's start and end
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
    // Fetch orders from the database
      const orders = await Order.find({
          createdAt: { $gte: start, $lte: end }
      }).sort({createdAt:-1});
      return NextResponse.json(orders, { status: 200 });
  } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
