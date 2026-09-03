import type { Metadata } from "next";
import localFont from "next/font/local";
import React from "react";

import "./globals.css";
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
import SmoothScroll from "@/app/components/SmoothScroll";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Re-applies the saved colour theme before first paint, so a chosen
            palette survives reloads without a red flash. Bare :root is already
            the red palette, so "red" / no value needs no class. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('multi2-theme');var m={red:'multi2_red',blue:'multi2_blue',green:'multi2_green',pink:'multi2_pink',teal:'multi2_teal',bw:'multi2_bw'};if(t&&m[t])document.documentElement.classList.add(m[t]);}catch(e){}})();`,
          }}
        />
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

                    <SmoothScroll>{children}</SmoothScroll>
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
