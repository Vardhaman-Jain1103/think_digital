"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useTransition } from "react";

export function SignInButton() {
  const { data: session, status } = useSession();
  const [isPending, startTransition] = useTransition();

  const loading = status === "loading" || isPending;

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() =>
            startTransition(() => {
              signOut();
            })
          }
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-xs font-medium text-zinc-50 shadow-sm transition hover:border-emerald-400/70 hover:bg-zinc-900/80 disabled:opacity-60"
        >
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/10 text-[10px] text-emerald-300">
            {session.user.name?.charAt(0).toUpperCase() ?? "U"}
          </span>
          <span>Signed in as {session.user.username ?? session.user.name}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() =>
        startTransition(() => {
          signIn("github");
        })
      }
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-emerald-950 shadow-lg shadow-emerald-500/40 transition hover:bg-emerald-400 disabled:opacity-60"
    >
      <span className="h-4 w-4 rounded-full bg-zinc-900/70" />
      <span>{loading ? "Redirecting…" : "Continue with GitHub"}</span>
    </button>
  );
}

