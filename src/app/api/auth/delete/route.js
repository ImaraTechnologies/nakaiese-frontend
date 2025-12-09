import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function DELETE(request) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!accessToken) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { current_password } = body;

        if (!current_password) {
            return NextResponse.json(
                { error: "Password is required to delete account." },
                { status: 400 }
            );
        }

        // Call Django (which now correctly returns 200 OK)
        await axios.delete(`${backendUrl}/auth/users/delete/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            data: { current_password: current_password },
        });

        // Cleanup Cookies
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");

        // ✅ FIX: Use status 200. 
        // You are returning a JSON body ({ success: true }), so you cannot use 204.
        return NextResponse.json({ success: true }, { status: 200 });

    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.warn("Account Deletion Failed:", error.response.data);
            return NextResponse.json(error.response.data, { status: error.response.status });
        }

        console.error("Delete Account Error:", error.message);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}