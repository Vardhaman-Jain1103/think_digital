import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { handle } = await params;
  const profile = await prisma.profile.findUnique({
    where: { handle },
    include: { user: true },
  });

  if (!profile) return { title: "Not Found" };

  return {
    title: `${profile.user.name ?? profile.handle} | IdentityLink`,
    description: profile.bio ?? `${profile.handle}'s link profile`,
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { handle } = await params;

  const profile = await prisma.profile.findUnique({
    where: { handle },
    include: {
      user: true,
      links: {
        where: { isPublic: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center py-8">
      <div className="mb-6 flex flex-col items-center gap-3">
        {profile.user.avatarUrl ? (
          <img
            src={profile.user.avatarUrl}
            alt={profile.user.name ?? profile.handle}
            className="h-20 w-20 rounded-full border-2 border-zinc-700 shadow-lg"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 text-2xl font-bold text-white shadow-lg">
            {(profile.user.name ?? profile.handle).charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-zinc-50">
            {profile.user.name ?? profile.handle}
          </h1>
          {profile.bio && (
            <p className="mt-1 max-w-xs text-sm text-zinc-400">{profile.bio}</p>
          )}
        </div>
      </div>

      <div className="w-full space-y-3">
        {profile.links.length === 0 ? (
          <p className="text-center text-sm text-zinc-500">
            No public links yet.
          </p>
        ) : (
          profile.links.map((link) => (
            <Link
              key={link.id}
              href={`/r/${link.id}`}
              className="flex w-full items-center justify-between rounded-full border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-sm text-zinc-100 transition hover:border-emerald-400/70 hover:bg-zinc-900"
            >
              <span className="flex items-center gap-2">
                {link.icon && <span>{link.icon}</span>}
                <span>{link.title}</span>
              </span>
              <svg
                className="h-4 w-4 text-zinc-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ))
        )}
      </div>

      <div className="mt-8 text-center text-[10px] text-zinc-600">
        Powered by{" "}
        <Link href="/" className="text-emerald-500 hover:underline">
          IdentityLink
        </Link>
      </div>
    </div>
  );
}
