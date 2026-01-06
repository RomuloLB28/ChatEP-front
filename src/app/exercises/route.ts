import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const url = type
    ? `https://chatep-back.onrender.com/exercises?type=${type}`
    : `https://chatep-back.onrender.com/exercises`;


  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
