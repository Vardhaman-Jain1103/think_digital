import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LinksManager } from "./links-manager";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: {
        include: {
          links: {
            orderBy: { sortOrder: "asc" },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/");
  }

  const profile =
    user.profile ??
    (await prisma.profile.create({
      data: {
        userId: user.id,
        handle: user.username,
        bio: "",
        theme: "dark",
      },
      include: {
        links: true,
      },
    }));

  const links = profile.links;
  const totalLinks = links.length;
  const totalClicks = links.reduce((sum, link) => sum + link.clickCount, 0);
  const publicLinks = links.filter((l) => l.isPublic).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-50 sm:text-xl">
            Dashboard
          </h1>
          <p className="text-xs text-zinc-500 sm:text-sm">
            Signed in as{" "}
            <span className="font-medium text-zinc-200">
              {user.username}
            </span>
            . Your public profile is available at{" "}
            <Link
              href={`/${profile.handle}`}
              className="text-emerald-400 underline-offset-2 hover:underline"
            >
              /{profile.handle}
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
          <span className="rounded-full border border-zinc-800 px-2 py-1">
            Total links:{" "}
            <span className="font-semibold text-zinc-100">
              {totalLinks}
            </span>
          </span>
          <span className="rounded-full border border-zinc-800 px-2 py-1">
            Public:{" "}
            <span className="font-semibold text-zinc-100">
              {publicLinks}
            </span>
          </span>
          <span className="rounded-full border border-zinc-800 px-2 py-1">
            Total clicks:{" "}
            <span className="font-semibold text-emerald-400">
              {totalClicks}
            </span>
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 sm:p-5">
        <LinksManager links={links} />
      </div>
    </div>
  );
}

