import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

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
        <div className="flex gap-2 text-xs text-zinc-400">
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
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-zinc-100 sm:text-base">
            Links &amp; analytics
          </h2>
          <p className="text-[11px] text-zinc-500">
            Click counts update in real time on redirect.
          </p>
        </div>

        {links.length === 0 ? (
          <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/60 p-4 text-xs text-zinc-400 sm:text-sm">
            You have no links yet. In the next step, we can add a form to create
            links pointing to your portfolio, GitHub, and more.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-1 text-left text-xs sm:text-sm">
              <thead className="text-[11px] uppercase tracking-[0.16em] text-zinc-500">
                <tr>
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Target URL</th>
                  <th className="px-3 py-2 text-center">Visibility</th>
                  <th className="px-3 py-2 text-right">Clicks</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id}>
                    <td className="rounded-l-xl bg-zinc-950/80 px-3 py-2 align-middle text-zinc-100">
                      <div className="flex flex-col">
                        <span className="font-medium">{link.title}</span>
                        <span className="text-[11px] text-zinc-500">
                          /r/{link.id}
                        </span>
                      </div>
                    </td>
                    <td className="bg-zinc-950/80 px-3 py-2 align-middle text-[11px] text-zinc-400 sm:text-xs">
                      <span className="line-clamp-2 break-all">
                        {link.url}
                      </span>
                    </td>
                    <td className="bg-zinc-950/80 px-3 py-2 text-center align-middle">
                      <span
                        className={
                          "inline-flex rounded-full px-2 py-0.5 text-[10px] " +
                          (link.isPublic
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/40"
                            : "bg-zinc-900 text-zinc-400 border border-zinc-700")
                        }
                      >
                        {link.isPublic ? "public" : "private"}
                      </span>
                    </td>
                    <td className="rounded-r-xl bg-zinc-950/80 px-3 py-2 text-right align-middle">
                      <span className="text-xs font-semibold text-emerald-400">
                        {link.clickCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

