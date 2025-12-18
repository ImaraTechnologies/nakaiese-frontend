import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 1. Initialize next-intl
const handleI18nRouting = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // 2. Define PROTECTED Routes
  // These pages require the user to be logged in.
  const protectedRoutes = ['/profile', '/vendor', '/dashboard'];

  // 3. Normalize the path (Remove /en or /fr to check the actual route)
  // e.g., "/fr/profile" becomes "/profile"
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

  // 4. Check if the current route matches a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // 5. Check for the Authentication Cookie
  const token = request.cookies.get('access_token')?.value;

  // 6. SECURITY CHECK
  // If page is protected AND user has no token -> Redirect to Login
  if (isProtectedRoute && !token) {
    // Determine the current locale to keep the user in the same language
    const locale = pathname.split('/')[1] || 'en'; 
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    
    // Optional: Add a ?callbackUrl= parameter so you can redirect them back after login
    // loginUrl.searchParams.set('callbackUrl', pathname);
    
    return NextResponse.redirect(loginUrl);
  }

  // 7. If authorized (or page is public), run internationalization
  return handleI18nRouting(request);
}

export const config = {
  // Update Matcher to ensure it runs on all pages (excluding api, static assets)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};