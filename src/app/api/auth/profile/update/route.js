import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(request) {
    // 1. Validating Configuration
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!backendUrl) {
        return NextResponse.json(
            { error: "Server Configuration Error: API URL missing" }, 
            { status: 500 }
        );
    }

    // 2. Auth Check
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (!accessToken) {
        return NextResponse.json(
            { error: "Unauthorized: Please log in to update your profile" },
            { status: 401 }
        );
    }

    try {
        // 3. Prepare Request Body and Headers
        // We need to determine if the frontend sent JSON or FormData (files)
        const contentType = request.headers.get("content-type") || "";
        
        let body;
        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            // Do NOT set Content-Type yet; we decide below
        };

        if (contentType.includes("application/json")) {
            // Case A: Standard JSON update
            body = JSON.stringify(await request.json());
            headers["Content-Type"] = "application/json";
        } else if (contentType.includes("multipart/form-data")) {
            // Case B: File Uploads (Avatar/Profile Pic)
            // request.formData() parses the incoming stream
            body = await request.formData(); 
            
            // CRITICAL: When using fetch with FormData, do NOT set the 
            // 'Content-Type' header manually. The browser/fetch client 
            // automatically sets 'multipart/form-data; boundary=...'
        } else {
             return NextResponse.json(
                { error: "Unsupported Media Type" },
                { status: 415 }
            );
        }

        // 4. Call Django Backend
        const res = await fetch(`${backendUrl}/dashboard/profile/`, {
            method: "PATCH", // Ensure this matches the Django view method
            headers: headers,
            body: body,
            cache: 'no-store',
        });

        // 5. Parse Response
        // We attempt to parse JSON, but handle cases where backend returns empty 204
        let data = {};
        const resContentType = res.headers.get("content-type");
        if (resContentType && resContentType.includes("application/json")) {
            data = await res.json();
        }

        // 6. Handle Backend Errors (400 Validation, 403 Forbidden, etc.)
        if (!res.ok) {
            // Pass the exact Django error message back to the frontend form
            return NextResponse.json(data, { status: res.status });
        }

        // 7. Success
        return NextResponse.json(data, { status: 200 });

    } catch (error) {
        console.error("Profile Update Proxy Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error: Could not reach backend." },
            { status: 500 }
        );
    }
}