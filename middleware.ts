import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import AppRoutes, { buildRoute } from "./util/appRoutes";

const isPublicRoute = createRouteMatcher([
  AppRoutes.HOME,
  AppRoutes.SIGN_IN,
  AppRoutes.SIGN_UP,
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, redirectToSignIn } = await auth();

  if (userId && isPublicRoute(req)) {
    let path = AppRoutes.SELECT_ORGANIZATION.toString();

    if (orgId) {
      path = buildRoute(AppRoutes.ORGANIZATION_ID, { id: orgId });
    }

    const orgSelection = new URL(path, req.url);
    return NextResponse.redirect(orgSelection);
  }

  if (!userId && !isPublicRoute(req)) {
    return redirectToSignIn({ returnBackUrl: req.url });
  }

  if (
    userId &&
    !orgId &&
    req.nextUrl.pathname !== AppRoutes.SELECT_ORGANIZATION
  ) {
    const orgSelection = new URL(AppRoutes.SELECT_ORGANIZATION, req.url);
    return NextResponse.redirect(orgSelection);
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
