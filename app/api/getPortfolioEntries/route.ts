import { NextResponse } from 'next/server';
import { ConvexClient } from 'convex/browser';
import { api } from "@/convex/_generated/api";

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL as string);

export async function GET(req: Request) {
  try {
    const data = await convex.query(api.portfolio.getAllPortfolioEntries, {});
    const response = NextResponse.json(data);
    response.headers.set('Access-Control-Allow-Origin', '*');

    return response;
  } catch (error) {
    console.error('Error fetching portfolio entries:', error);

    const errorResponse = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');

    return errorResponse;
  }
}