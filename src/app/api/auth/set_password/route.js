import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 1. Security Check: Is the user logged in?
  if (!accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 2. Parse Body
    // Expects: { new_password, re_new_password, current_password }
    const body = await request.json();

    // 3. Call Django Djoser Endpoint
    await axios.post(
      `${backendUrl}/auth/password/change/`, 
      body, 
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // ✅ Inject Secure Token
        },
      }
    );

    // 4. Return Success
    // Djoser returns 204 No Content on success, we return 200 OK to frontend
    return NextResponse.json(
      { success: true, message: "Password updated successfully" }, 
      { status: 200 }
    );

  } catch (error) {
    // 5. Production Error Handling
    if (axios.isAxiosError(error) && error.response) {
      console.warn("Password Change Failed:", error.response.data);
      
      // Pass Django validation errors to frontend
      // Examples: "Password too short", "Passwords don't match", "Wrong current password"
      return NextResponse.json(error.response.data, { status: error.response.status });
    }

    console.error("Password Change Server Error:", error.message);
    return NextResponse.json(
      { error: "Unable to change password. Please try again later." }, 
      { status: 500 }
    );
  }
}