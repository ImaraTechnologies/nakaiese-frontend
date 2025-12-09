import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  const refreshToken = cookieStore.get("refresh_token")?.value;
  const accessToken = cookieStore.get("access_token")?.value;

  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (backendUrl && refreshToken) {
    try {
      const res = await fetch(`${backendUrl}/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          refresh: refreshToken
        }),
      });

      if (!res.ok) {
        console.warn(`Backend logout warning: Received status ${res.status}`);
      }
    } catch (error) {
      console.error("Backend logout error (Connection Failed):", error);
      // We continue execution to ensure cookies are still deleted
    }
  }


  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  return NextResponse.json({ success: true });
}