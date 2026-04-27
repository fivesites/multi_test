import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";
import { Tiny5 } from "next/font/google";

import "./globals.css";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "multi2",
  description: "multiplied",
};

const absolution1 = localFont({
  src: "./Absolution-Contextual.woff2",
  variable: "--font-absolution1",
});

const tiny5 = Tiny5({
  weight: "400",
  style: "normal",
  display: "swap",
  subsets: ["latin"],
  variable: "--font-tiny5",
});

const ft88 = localFont({
  src: "./FT88-Regular.woff",
  variable: "--font-ft88",
});

const ft88Gothique = localFont({
  src: "./FT88-Gothique.woff",
  variable: "--font-ft88-gothique",
});

const karlRounded = localFont({
  src: [
    { path: "./KarlST_Regular.woff2", weight: "400", style: "normal" },
    {
      path: "./KarlSTTrial-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    { path: "./KarlSTTrial-Medium.woff2", weight: "500", style: "normal" },
    {
      path: "./KarlSTTrial-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    { path: "./KarlSTTrial-Bold.woff2", weight: "700", style: "normal" },
    { path: "./KarlSTTrial-BoldItalic.woff2", weight: "700", style: "italic" },
    { path: "./KarlSTTrial-Black.woff2", weight: "800", style: "normal" },
    { path: "./KarlSTTrial-BlackItalic.woff2", weight: "800", style: "italic" },
    { path: "./KarlST_UltraBlack.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-rounded",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const raw = cookieStore.get("theme-overrides")?.value;
  let themeCSS = "";
  if (raw) {
    try {
      const overrides: Record<string, string> = JSON.parse(
        decodeURIComponent(raw),
      );
      const vars = Object.entries(overrides)
        .map(([k, v]) => `${k}:${v}`)
        .join(";");
      themeCSS = `:root{${vars}}`;
    } catch {}
  }

  return (
    <html lang="en">
      <head>
        {themeCSS ? (
          <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
        ) : null}
      </head>
      <body
        className={` ${tiny5.variable} ${absolution1.variable} ${ft88.variable} ${ft88Gothique.variable} ${karlRounded.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
