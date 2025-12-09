import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

// Helper to get headers with the token
async function getAuthHeaders() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return null;
    }

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
    };
}

// =================================================================
// GET: Fetch User Profile
// =================================================================
export async function GET() {
    const headers = await getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 1. Security Check
    if (!headers) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // 2. Call Django
        // Adjust endpoint '/auth/users/me/' to match your Djoser/DRF URL
        const response = await axios.get(`${backendUrl}/auth/profile/`, { headers });

        // 3. Return Data
        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        // 4. Error Handling
        if (axios.isAxiosError(error) && error.response) {
            // If Django says 401 (Token Expired), pass that to frontend so it can logout
            return NextResponse.json(error.response.data, { status: error.response.status });
        }

        console.error("Fetch Profile Error:", error.message);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// =================================================================
// PATCH: Update User Profile
// =================================================================
export async function PATCH(request) {
    const headers = await getAuthHeaders();
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 1. Security Check
    if (!headers) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // 2. Call Django
        // Use PATCH for partial updates (e.g. just changing phone number)
        const response = await axios.patch(`${backendUrl}/auth/profile/`, body, { headers });

        // 3. Return Updated Data
        return NextResponse.json(response.data, { status: 200 });

    } catch (error) {
        // 4. Error Handling
        if (axios.isAxiosError(error) && error.response) {
            // Pass Validation Errors (e.g. "Phone number invalid") directly to frontend form
            console.warn("Update Profile Failed:", error.response.data);
            return NextResponse.json(error.response.data, { status: error.response.status });
        }

        console.error("Update Profile Error:", error.message);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}