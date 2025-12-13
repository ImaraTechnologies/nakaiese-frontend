import { NextResponse } from "next/server";

export async function GET(request) {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!backendUrl) {
        return NextResponse.json({ error: "Server Config Error" }, { status: 500 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        
        // This will now correctly be 'fr' because Axios sent it explicitly
        const locale = request.headers.get('accept-language') || 'en';

        // CHECK THIS PATH: usually 'posts' plural based on your previous code
        const targetUrl = `${backendUrl}/post/properties/?${queryString}`;

        const res = await fetch(targetUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept-Language": locale, // Forwards 'fr' to Django
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