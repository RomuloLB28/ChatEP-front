import { NextResponse } from "next/server";
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const url = type
    ? `${NEXT_PUBLIC_API_URL}/exercises?type=${type}`
    : `${NEXT_PUBLIC_API_URL}/exercises`;


  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
