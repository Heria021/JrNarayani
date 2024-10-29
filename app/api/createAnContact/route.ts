import { NextResponse } from 'next/server';
import { ConvexClient } from 'convex/browser';
import { api } from "@/convex/_generated/api";

const convex = new ConvexClient("https://beaming-caribou-151.convex.cloud");

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { address, city, contact, email, file, name, meetTime, message } = body;

    if (!address || !city || !contact || !email || !file || !name || !meetTime || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const newContact = await convex.mutation(api.contact.createContact, {
      address,
      city,
      contact,
      email,
      file,
      name,
      meetTime,
      message
    });

    const response = NextResponse.json(newContact);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;

  } catch (error) {
    console.error('Error creating contact:', error);

    const errorResponse = NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    errorResponse.headers.set('Access-Control-Allow-Origin', '*'); 
    return errorResponse;
  }
}