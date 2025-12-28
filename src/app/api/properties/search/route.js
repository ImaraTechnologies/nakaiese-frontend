import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        // 1. Get query parameters
        const { searchParams } = new URL(request.url);
        
        // --- FIX: Use .get() to retrieve the ID ---
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        
        // 2. Construct Backend URL
        // Ensure your Django URL pattern matches this exactly (e.g., trailing slash)
        const backendUrl = new URL(`${baseUrl}/post/h-filters/${id}/check-availability/`);
        
        // 3. Attach filters. 
        // Note: We remove 'id' from the query params sent to backend to keep the URL clean, 
        // though DRF usually ignores extra params anyway.
        const backendParams = new URLSearchParams(searchParams);
        backendParams.delete('id'); 
        backendUrl.search = backendParams.toString();

        // 4. Forward the Request
        const response = await fetch(backendUrl.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': request.headers.get('Accept-Language') || 'en',
            },
            cache: 'no-store', // CRITICAL for real-time inventory
        });

        // 5. Handle Errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            return NextResponse.json(
                { 
                    error: errorData?.error || errorData?.detail || 'Backend availability check failed',
                    status: response.status 
                }, 
                { status: response.status }
            );
        }

        // 6. Return Data
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Availability Proxy Error:", error);
        return NextResponse.json(
            { error: 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}