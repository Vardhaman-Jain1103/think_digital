import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSessionProvider } from "@/components/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IdentityLink",
  description: "Secure identity-aware link hub.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-950 text-zinc-50`}
      >
        <AppSessionProvider>
          <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-black">
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
              <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-500 shadow-lg" />
                  <span className="text-sm font-semibold tracking-tight text-zinc-100">
                    IdentityLink
                  </span>
                </div>
                <span className="text-xs text-zinc-500">
                  Secure, identity-aware link profiles
                </span>
              </header>
              <main className="flex-1 py-8">{children}</main>
              <footer className="mt-8 border-t border-zinc-900 pt-4 text-xs text-zinc-500">
                Built for interview use — GitHub-authenticated and Postgres-backed.
              </footer>
            </div>
          </div>
        </AppSessionProvider>
      </body>
    </html>
  );
}
