import { NextResponse, type NextRequest } from "next/server";

const locales = ["ar", "en"];

/** Redirect locale-less URLs to /ar or /en (cookie → Accept-Language → Arabic). */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;

  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  const accept = request.headers.get("accept-language") ?? "";
  const locale = cookie && locales.includes(cookie) ? cookie : /^\s*en\b/i.test(accept) ? "en" : "ar";

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip API routes, Next internals and any file with an extension.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
