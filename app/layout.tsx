import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { FocusSessionBar } from "@/components/focus-session-bar";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f19" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "StudyFlow | Student Academic Productivity Platform",
  description:
    "High-performance student academic productivity platform featuring persistent state orchestration, type-safe Server Actions, relational PostgreSQL schemas, and real-time MongoDB telemetry.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "StudyFlow — Student Academic Productivity Platform",
    description: "Orchestrate your coursework, focus sessions, and academic milestones with type-safe confidence.",
    url: "/",
    siteName: "StudyFlow",
    images: [
      {
        url: "/api/og?title=StudyFlow%20Platform&subtitle=Academic%20Productivity%20System",
        width: 1200,
        height: 630,
        alt: "StudyFlow Open Graph Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyFlow — Student Academic Productivity Platform",
    description: "Next.js App Router, Prisma ORM, Zustand, Zod & Server Actions.",
    images: ["/api/og?title=StudyFlow%20Platform&subtitle=Academic%20Productivity%20System"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FocusSessionBar />
          <Navbar />
          <main className="flex-1 flex flex-col">{children}</main>
          <Toaster position="top-right" richColors closeButton />
          
          <footer className="border-t py-6 md:py-8 bg-muted/30 text-center text-xs text-muted-foreground">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p>
                © 2026-27 StudyFlow Platform — Department of AIML. Programming Laboratory-III (DJS23AMD302L).
              </p>
              <div className="flex items-center gap-4">
                <span>RSC Architecture</span>
                <span>•</span>
                <span>PostgreSQL + Prisma</span>
                <span>•</span>
                <span>Mongoose Telemetry</span>
                <span>•</span>
                <span>Zustand Client State</span>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
