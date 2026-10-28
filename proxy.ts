import { captureRegistryEvent } from "@wandry/analytics-sdk";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = (request: NextRequest) => {
  captureRegistryEvent(
    request,
    process.env.NEXT_PUBLIC_WANDRY_REGISTRY_TOKEN || ""
  );

  return NextResponse.next();
};

export const config = {
  matcher: "/widgets/:path*",
};
