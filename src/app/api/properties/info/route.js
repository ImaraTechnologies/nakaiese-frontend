import { NextResponse } from "next/server";

export async function GET(request) {
    // 1. Get Search Params from the incoming request URL
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString(); // e.g., "p_id=...&guests=2"

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const locale = request.headers.get('accept-language') || 'en';

    try {
        // 2. Call Django Backend (Forwarding the Query String)
        const res = await fetch(`${backendUrl}/post/p-info/?${queryString}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
            },
            cache: 'no-store', // Always fetch fresh data for pricing/availability
        });

        const data = await res.json();
        
        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Internal Server Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}