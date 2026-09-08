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
import { ThemeProvider } from "@/context/ThemeContext";
import M2Nav from "@/app/components/M2Nav";
import CookieAndSound from "@/app/components/CookieAndSound";
import LoaderGrid from "@/app/components/LoaderGrid";
import SmoothScroll from "@/app/components/SmoothScroll";
import UnderConstruction from "./components/UnderConstruction";

export const metadata: Metadata = {
  title: "multi2",
  description: "multiplied",
};

const visualFont = localFont({
  src: [
    {
      path: "../../public/fonts/visual/Visual-Light.woff2",
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
            __html: `(function(){try{var t=localStorage.getItem('multi2-theme');var m={red:'multi2_red',blue:'multi2_blue',green:'multi2_green',pink:'multi2_pink',teal:'multi2_teal',bw:'multi2_bw'};if(t&&m[t])document.documentElement.classList.add(m[t]);if(localStorage.getItem('multi2-dark')==='1')document.documentElement.classList.add('multi2_dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${visualFont.variable}  antialiased`}>
        <WorkContextServer>
          <CopyContextServer>
            <UIProvider>
              {/* Wraps the whole tree: the consent box and the nav read reel
                  state too, not just the page below them. */}
              <SoundProvider>
                <ReelProvider>
                  {/* CursorProvider stays for the busy-state signal the nav
                      publishes; the custom cursor itself is off. */}
                  <CursorProvider>
                    <ThemeProvider>
                      <M2Nav />
                      <LoaderGrid />
                      <CookieAndSound />
                      <UnderConstruction />
                      <SmoothScroll>{children}</SmoothScroll>
                    </ThemeProvider>
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
