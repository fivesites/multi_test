import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";

import "./globals.css";
import { cookies } from "next/headers";
import { WorkContextServer } from "@/context/WorkContextServer";
import { CopyContextServer } from "@/context/CopyContextServer";
import { UIProvider } from "@/context/UIContext";
import { ReelProvider } from "@/context/ReelContext";
import { SoundProvider } from "@/context/SoundContext";
import { CursorProvider } from "@/context/CursorContext";
import MultiNav from "@/app/components/MultiNav";
import MultiVertNav from "@/app/components/MultiVertNav";
import M2Nav from "@/app/components/M2Nav";
import CookieAndSound from "@/app/components/CookieAndSound";
import CustomCursor from "@/app/components/CustomCursor";

export const metadata: Metadata = {
  title: "multi2",
  description: "multiplied",
};

const visualFont = localFont({
  src: [
    {
      path: "../../public/fonts/visual/Visual-Light-trial.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/visual/Visual-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/visual/Visual-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/visual/Visual-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-visual",
  display: "swap",
});

// Diatype ships 5 weights, all upright — no italic cuts.
const diatype = localFont({
  src: [
    {
      path: "../../public/fonts/diatype/ABCDiatypeEdu-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/diatype/ABCDiatypeEdu-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/diatype/ABCDiatypeEdu-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/diatype/ABCDiatypeEdu-Heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../public/fonts/diatype/ABCDiatypeEdu-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-diatype",
  display: "swap",
});

// Karl currently ships Regular only.
const karl = localFont({
  src: [
    {
      path: "../../public/fonts/karl/KarlST_Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-karl",
  display: "swap",
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
        className={`${visualFont.variable} ${diatype.variable} ${karl.variable} antialiased`}
      >
        <WorkContextServer>
          <CopyContextServer>
            <UIProvider>
              {/* Wraps the whole tree: the consent box and the nav read reel
                  state too, not just the page below them. */}
              <SoundProvider>
                <ReelProvider>
                  {/* Above the nav: the nav reports its loading state to the
                    cursor. */}
                  <CursorProvider>
                    <CustomCursor />
                    <M2Nav />
                    <CookieAndSound />

                    {children}
                  </CursorProvider>
                </ReelProvider>
              </SoundProvider>
            </UIProvider>
          </CopyContextServer>
        </WorkContextServer>
      </body>
    </html>
  );
}
