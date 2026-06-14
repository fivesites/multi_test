import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";

import "./globals.css";
import { cookies } from "next/headers";
import { WorkContextServer } from "@/context/WorkContextServer";
import { CopyContextServer } from "@/context/CopyContextServer";
import { UIProvider } from "@/context/UIContext";
import Cookie from "@/app/components/Cookie";

export const metadata: Metadata = {
  title: "multi2",
  description: "multiplied",
};

const visualFont = localFont({
  src: [
    { path: "./Visual-Regular.woff2", weight: "400", style: "normal" },

    { path: "./Visual-Medium.woff2", weight: "500", style: "normal" },

    { path: "./Visual-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-visual",
});

const karlRounded = localFont({
  src: [
    { path: "./KarlST_Regular.woff2", weight: "400", style: "normal" },

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
        className={` ${visualFont.variable}  ${karlRounded.variable} antialiased`}
      >
        <WorkContextServer>
          <CopyContextServer>
            <UIProvider>{children}</UIProvider>
          </CopyContextServer>
        </WorkContextServer>
        <Cookie />
      </body>
    </html>
  );
}
