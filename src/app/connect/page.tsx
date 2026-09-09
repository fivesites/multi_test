"use client";

import BottomNav from "@/app/components/BottomNav";
import ConnectSection from "@/app/components/ConnectSection";

export default function ConnectPage() {
  return (
    <div className="flex min-h-screen flex-col pt-28 lg:pt-36">
      <div className="flex-1">
        <ConnectSection />
      </div>

      <div className="w-full mb-12">
        <BottomNav />
      </div>
    </div>
  );
}
