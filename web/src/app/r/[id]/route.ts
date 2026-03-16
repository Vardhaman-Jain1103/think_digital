import { prisma } from "@/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  // Ignore prefetch requests (browsers send these on hover)
  const purpose = req.headers.get("purpose") || req.headers.get("x-purpose");
  const isPrefetch =
    purpose === "prefetch" ||
    req.headers.get("sec-fetch-dest") === "empty" ||
    req.headers.get("x-moz") === "prefetch";

  const link = await prisma.link.findUnique({
    where: { id },
  });

  if (!link || !link.url) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Only allow http/https destinations
  let targetUrl: URL;
  try {
    targetUrl = new URL(link.url);
    if (!["http:", "https:"].includes(targetUrl.protocol)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Only count actual clicks, not prefetches
  if (!isPrefetch) {
    await prisma.link.update({
      where: { id: link.id },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }

  return NextResponse.redirect(targetUrl, { status: 307 });
}

