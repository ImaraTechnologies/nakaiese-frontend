import { NextResponse } from "next/server";

export async function GET(request) {
    // 1. Get ID from Search Params (Query String)
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log("Id detection in SSR",id)

    if (!id) {
        return NextResponse.json({ error: "Property ID is required" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const locale = request.headers.get('accept-language') || 'en';

    try {
        // Call Django Backend
        const res = await fetch(`${backendUrl}/post/properties/${id}/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale,
            },
            cache: 'no-store',
        });

        const data = await res.json();
        
        if (!res.ok) {
            return NextResponse.json(data, { status: res.status });
        }

        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}