"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Nav() {
  return (
    <nav className="fixed z-40 top-0 left-0 w-full flex justify-center items-center gap-6 px-4 lg:px-8 py-4">
      <Button
        className="text-background font-absolution1"
        variant="link"
        size="lg"
        asChild
      >
        <Link href="/work">Work</Link>
      </Button>
      <Button
        className="text-background font-absolution1"
        variant="link"
        size="lg"
        asChild
      >
        <Link href="/philosophy">Philosophy</Link>
      </Button>
      <Button
        className="text-background font-absolution1"
        variant="link"
        size="lg"
        asChild
      >
        <Link href="/connect">Connect</Link>
      </Button>
    </nav>
  );
}
