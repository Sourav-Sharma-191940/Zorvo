import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
// Global styles: Tailwind + the theme (src/styles/theme.css) + element defaults.
import "./globals.css";
import { QueryProvider } from "@/shared/lib/api/query-client";
import { ThemeSync } from "@/shared/theme/ThemeProvider";
import { Toaster } from "@/shared/ui/toast";
import { themeInitScript } from "@/shared/theme/runtime";
import { THEME_BROWSER_COLOR } from "@/shared/theme/constants";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Command Center",
  description: "Your unified dashboard for documents, expenses, loans, and bills.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_BROWSER_COLOR.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_BROWSER_COLOR.dark },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // data-theme is set before paint by themeInitScript, so the server markup
    // intentionally differs from the client on <html>.
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeSync />
        <QueryProvider>{children}</QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
