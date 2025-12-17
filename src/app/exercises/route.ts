import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");

  const url = type
    ? `http://localhost:4000/exercises?type=${type}`
    : `http://localhost:4000/exercises`;


  const res = await fetch(url);
  const data = await res.json();

  return NextResponse.json(data);
}
