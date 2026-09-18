import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {


    const session = await auth.api.getSession({
        headers: await headers()
    })

    // If user is not signed-in
    if(!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // If user is signed-in but not an ADMIN
    const requestURL = new URL(request.url)

    if(session.user.role !== "admin" && requestURL.pathname.startsWith("/admin")){
        return NextResponse.redirect(new URL("/account", request.url))
    }

    return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/admin/:path*"], // Specify the routes the middleware applies to
};