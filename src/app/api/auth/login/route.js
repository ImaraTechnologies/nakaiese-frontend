import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth-helpers";
import axios from "axios"; // ✅ Direct import, separate from client utils

export async function POST(request) {
  const body = await request.json();
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    // 1. Call Django (Using Axios)
    // Axios throws an error automatically if status is 4xx/5xx
    const response = await axios.post(`${backendUrl}/auth/login/`, body, {
      headers: { "Content-Type": "application/json" },
    });

    // Axios returns data directly in .data
    const { access, refresh } = response.data;

    // 2. Set Cookies
    const cookieStore = await cookies();
    
    // Set Access Token
    cookieStore.set("access_token", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    // Set Refresh Token
    cookieStore.set("refresh_token", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // 3. Decode Token
    let user = null;
    if (access) {
        user = await verifyToken(access);
    }

    // 4. Return Success
    return NextResponse.json({ success: true, user }, { status: 200 });

  } catch (error) {
    // 5. Handle Errors Safely
    if (axios.isAxiosError(error) && error.response) {
      console.warn("Django Login Error:", error.response.data);
      return NextResponse.json(error.response.data, { status: error.response.status });
    }

    console.error("Server Error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}