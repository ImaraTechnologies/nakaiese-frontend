import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    // In Next.js 15+ cookies() is async, so we await it to be future-proof
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    console.log("Access Token:", accessToken);

    // 1. Immediate validation to save a network call
    if (!accessToken) {
        return NextResponse.json(
            { error: "Unauthorized: No access token provided" },
            { status: 401 }
        );
    }

    try {
        // 2. Call Django Backend (No search params appended)
        const res = await fetch(`${backendUrl}/dashboard/bookings/stats/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            cache: 'no-store', // Ensure fresh data on every request
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Dashboard Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error connecting to backend" }, 
            { status: 500 }
        );
    }
}