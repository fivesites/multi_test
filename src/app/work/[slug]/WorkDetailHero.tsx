"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ClientSquared from "@/app/components/ClientSquared";

const CATEGORY_LABELS: Record<string, string> = {
  photo: "Photo",
  video: "Video",
  production: "Production",
  "art-direction": "Art Direction",
  concept: "Concept",
  "sound-design": "Sound Design",
  vax: "Vax",
  dop: "DOP",
  "post-processing": "Post",
};

interface Props {
  client?: string;
  title: string;
  categories?: string[];
  coverImageUrl?: string;
}

export default function WorkDetailHero({
  client,
  title,
  categories,
  coverImageUrl,
}: Props) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
  };

  return (
    <div className="relative h-screen snap-start">
      {/* Full-width background image */}
      {coverImageUrl && (
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      )}

      {/* Dark gradient over bottom 40% for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* Back button */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Bottom 20% info area */}
      <div className="absolute bottom-0 left-0 right-0 h-[20%] z-10 flex flex-col justify-center px-6 lg:px-12 gap-2">
        <ClientSquared
          texts={[client ?? title]}
          className="font-rounded font-black text-3xl lg:text-5xl text-white"
          textSize="text-3xl lg:text-5xl"
          textColor="text-white"
        />
        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Badge
                key={cat}
                variant="ghost"
                className="text-white/70 border-white/30"
              >
                {CATEGORY_LABELS[cat] ?? cat}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Exit curtain */}
      <AnimatePresence>
        {isExiting && (
          <motion.div
            className="fixed inset-0 z-50 bg-primary"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => router.back()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
