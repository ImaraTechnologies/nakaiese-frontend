import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendUrl) {
        return NextResponse.json({ error: "Service configuration error" }, { status: 503 });
    }

    try {
        const body = await request.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        const locale = request.headers.get('accept-language') || 'en';
        
        // --- FIX: Await cookies() ---
        // In Next.js 15+, cookies() is async!
        const cookieStore = await cookies(); 
        const accessToken = cookieStore.get("access_token")?.value;

        // --- PREPARE HEADERS ---
        const headers = {
            "Content-Type": "application/json",
            "Accept-Language": locale,
        };

        // Attach token if it exists
        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        // --- CALL DJANGO BACKEND ---
        const res = await fetch(`${backendUrl}/booking/bookings/`, {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 201 });

    } catch (error) {
        console.error("Booking API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}