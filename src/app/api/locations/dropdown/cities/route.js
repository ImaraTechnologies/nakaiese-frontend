import { NextResponse } from "next/server";

export async function GET(request) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
        return NextResponse.json({ error: "Server Config Error" }, { status: 500 });
    }
    try {
        const locale = request.headers.get('accept-language') || 'en';
        const targetUrl = `${backendUrl}/post/cities/dropdown/`;
        const res = await fetch(targetUrl, {
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