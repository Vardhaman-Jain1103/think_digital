import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  const link = await prisma.link.findUnique({
    where: { id },
  });

  if (!link || !link.url) {
    redirect("/");
  }

  // Only allow http/https destinations and guard against open redirect payloads.
  try {
    const target = new URL(link.url);
    if (!["http:", "https:"].includes(target.protocol)) {
      redirect("/");
    }
  } catch {
    redirect("/");
  }

  await prisma.link.update({
    where: { id: link.id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });

  redirect(link.url);
}

