import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose"; // ✅ Import this
import { verifyToken } from "@/utils/auth-helpers";

export async function POST(request) {
  const body = await request.json();
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. Call Django
  const res = await fetch(`${backendUrl}/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const data = await res.json();
  const { access, refresh } = data;

  // 2. Set Cookies
  const cookieStore = await cookies();
  cookieStore.set("access_token", access, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60,
    path: "/",
  });
  cookieStore.set("refresh_token", refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  // 3. ✅ DECODE TOKEN & PREPARE USER DATA
  // We decode it here so the frontend gets the user object INSTANTLY
  let user = null;
  user = await verifyToken(access);

  // 4. Return the user object to the frontend
  return NextResponse.json({ success: true, user });
}