import { NextResponse } from "next/server";

export async function POST(request) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // 1. Safety Check: Ensure backend URL is defined
    if (!backendUrl) {
        console.error("Critical: NEXT_PUBLIC_API_BASE_URL is not defined.");
        return NextResponse.json({ error: "Service configuration error" }, { status: 503 });
    }

    try {
        // 2. Parse Body safely
        const body = await request.json().catch(() => null);
        if (!body) {
            return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        // 3. Extract Headers
        const locale = request.headers.get('accept-language') || 'en';
        // Optional: If you use Auth, forward the token:
        // const authHeader = request.headers.get('authorization') || '';

        // 4. Call Django Backend
        const res = await fetch(`${backendUrl}/booking/bookings/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
                // "Authorization": authHeader, // Uncomment if your Django view requires auth
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();

        // 5. Handle Django Errors (400 Bad Request, 403 Forbidden, etc.)
        if (!res.ok) {
            // Pass through the specific error messages from Django (e.g., validation errors)
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