import Link from "next/link";
import { SignInButton } from "./signin-button";

export default function Home() {
  return (
    <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:items-start">
      <section className="flex-1 space-y-5 md:space-y-6">
        <h1 className="text-balance text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl md:text-5xl">
          One secure link profile,
          <span className="bg-gradient-to-r from-emerald-400 to-sky-500 bg-clip-text text-transparent">
            {" "}
            owned by you.
          </span>
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
          IdentityLink lets you create a GitHub-authenticated link hub with full
          control over your data, visibility, and analytics. No vendor
          lock-in, no surprise ads, just your links under your identity.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <SignInButton />
          <span className="text-xs text-zinc-500">
            Uses GitHub OAuth2 for verified identity. No passwords stored.
          </span>
        </div>
        <div className="mt-4 grid gap-3 text-xs text-zinc-300 sm:grid-cols-3 sm:text-sm">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            <p className="font-medium text-zinc-100">Identity first</p>
            <p className="mt-1 text-zinc-400">
              Profiles are tied to GitHub accounts with strict ownership checks.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            <p className="font-medium text-zinc-100">Secure by design</p>
            <p className="mt-1 text-zinc-400">
              Sanitised URLs, private links, and server-side redirects only.
            </p>
          </div>
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
            <p className="font-medium text-zinc-100">Analytics ready</p>
            <p className="mt-1 text-zinc-400">
              Track link clicks per profile, engineered for auditability.
            </p>
          </div>
        </div>
      </section>
      <section className="mt-2 flex-1 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 shadow-[0_0_80px_rgba(16,185,129,0.12)] sm:p-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
            Preview
          </span>
          <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] text-zinc-400">
            IdentityLink
          </span>
        </div>
        <div className="space-y-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500" />
          <div>
            <p className="text-sm font-semibold text-zinc-100">
              parthgorde
            </p>
            <p className="text-xs text-zinc-500">
              Software engineer · Identity-aware systems
            </p>
          </div>
          <div className="space-y-2 pt-2">
            <button className="flex w-full items-center justify-between rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-left text-xs text-zinc-100 transition hover:border-emerald-400/70 hover:bg-zinc-900">
              <span>Portfolio</span>
              <span className="text-[10px] text-emerald-400">public</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full border border-zinc-800 bg-zinc-900/70 px-4 py-2 text-left text-xs text-zinc-100 transition hover:border-emerald-400/70 hover:bg-zinc-900">
              <span>GitHub</span>
              <span className="text-[10px] text-emerald-400">public</span>
            </button>
            <button className="flex w-full items-center justify-between rounded-full border border-zinc-900/80 bg-zinc-900/40 px-4 py-2 text-left text-xs text-zinc-500">
              <span>Internal dashboard</span>
              <span className="text-[10px] text-zinc-500">private</span>
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-zinc-900 pt-3 text-[10px] text-zinc-500">
            <span>Click analytics enabled</span>
            <Link
              href="#"
              className="rounded-full border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-300 hover:border-emerald-400/70"
            >
              View dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
