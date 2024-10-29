'use client';
import localFont from "next/font/local";
import "./globals.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { UploadProvider } from "@/context/UploadContext";
// import { ThemeProvider } from "@/components/shared/theme-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ConvexProvider client={convex}>
          <UploadProvider>
            {/* <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            > */}
              {children}
            {/* </ThemeProvider>/ */}
          </UploadProvider>
        </ConvexProvider>
      </body>
    </html>
  );
}
