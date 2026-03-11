import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GATEWAY – Land Your First Internship",
  description: "AI-powered CV analysis for international B1 students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#09090b] text-zinc-50 overflow-x-hidden min-h-screen`}
      >
        <header className="sticky top-0 z-40 border-b border-white/5 bg-[#09090b]/80 backdrop-blur">
          <div className="container max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-sm font-semibold text-zinc-100">
              GATEWAY
            </Link>
            <Link
              href="/?reset=1"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-zinc-900/80 px-3 py-2 text-xs font-medium text-zinc-200 transition-colors hover:border-violet-500/40 hover:text-violet-200"
            >
              Back to Home
            </Link>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
