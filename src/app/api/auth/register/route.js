import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth-helpers";

export async function POST(request) {
  // 1. Validate Environment Variable
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!backendUrl) {
    return NextResponse.json({ error: "Server Configuration Error: Missing API URL" }, { status: 500 });
  }

  try {
    // 2. Parse the incoming JSON body
    const body = await request.json();

    // 3. Proxy the request to Django
    // Note: Adjust '/auth/register/' if your DRF endpoint is different (e.g., /auth/registration/)
    const res = await fetch(`${backendUrl}/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // 4. Handle Django Errors (e.g., 400 Bad Request for duplicate email)
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 5. AUTO-LOGIN Logic (Optional but recommended)
    // If your backend returns tokens immediately after register, set the cookies now.
    if (data.access && data.refresh) {
      const cookieStore = await cookies();

      // Set Access Token
      cookieStore.set("access_token", data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60, // 1 hour
        path: "/",
      });

      // Set Refresh Token
      cookieStore.set("refresh_token", data.refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }
    let user = null;
    user = await verifyToken(data.access);

    // 6. Return success to the client
    return NextResponse.json(data, user, { status: 201 });

  } catch (error) {
    console.error("Registration Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}