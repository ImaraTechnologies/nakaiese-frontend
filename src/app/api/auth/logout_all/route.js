import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST() {
  const cookieStore = await cookies();

  // 1. Retrieve tokens
  const refreshToken = cookieStore.get("refresh_token")?.value;
  const accessToken = cookieStore.get("access_token")?.value;
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;


  if (backendUrl && refreshToken && accessToken) {
    try {
      await axios.post(
        `${backendUrl}/auth/logout/all/`,
        { refresh: refreshToken },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      // Ignore backend errors during logout, we must clear cookies anyway
      console.warn("Backend logout failed (non-critical):", error.message);
    }
  }

  // 3. Clear Cookies (Crucial)
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return NextResponse.json({ success: true }, { status: 200 });
}