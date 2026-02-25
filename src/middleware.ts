import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Normalize the path
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/';

  // 2. Handle the "Vendor" logic
  // Check if we are on the vendor route and if 'step' is already present
  if (pathWithoutLocale.startsWith('/vendor')) {
    if (!searchParams.has('step')) {
      const url = request.nextUrl.clone();
      url.searchParams.set('step', '1');
      
      // Use redirect if you want the URL in the browser address bar to change
      return NextResponse.redirect(url);
    }
  }

  // 3. Protected Routes Logic
  const protectedRoutes = ['/profile'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );
  const token = request.cookies.get('access_token')?.value;

  if (isProtectedRoute && !token) {
    const locale = pathname.split('/')[1] || 'en'; 
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Default: Run i18n routing
  return handleI18nRouting(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};