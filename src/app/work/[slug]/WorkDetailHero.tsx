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
  portraitImageUrls?: [string?, string?];
  mobileImageUrl?: string;
}

function ImageCol({
  imageUrl,
  title,
  priority,
}: {
  imageUrl?: string;
  title: string;
  priority?: boolean;
}) {
  return (
    <div className="relative h-full overflow-hidden">
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          priority={priority}
        />
      )}
    </div>
  );
}

export default function WorkDetailHero({
  client,
  title,
  categories,
  portraitImageUrls,
  mobileImageUrl,
}: Props) {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    if (isExiting) return;
    setIsExiting(true);
  };

  return (
    <div className="relative h-screen">
      {/* Back button — ghost with X icon */}
      <div className="absolute top-0 left-0 z-20 p-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Mobile: bg-primary top, image bottom */}
      <div className="lg:hidden flex flex-col h-full">
        <div className="bg-primary h-[50vh] flex flex-col items-center justify-center px-6 gap-2 relative">
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-4xl text-primary-foreground"
            textSize="text-4xl"
            textColor="text-primary-foreground"
          />
          {categories && categories.length > 0 && (
            <div className="absolute bottom-0 left-0 flex flex-wrap justify-center w-full gap-2 p-8 ">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="ghost"
                  className="text-primary-foreground/70 border-primary-foreground/30"
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          {mobileImageUrl ? (
            <div className="relative w-full aspect-square">
              <Image
                src={mobileImageUrl}
                alt={title}
                fill
                className="object-cover"
                priority
              />
            </div>
          ) : (
            <div className="h-full bg-muted" />
          )}
        </div>
      </div>

      {/* Desktop: portrait | bg-primary (center) | portrait */}
      <div className="hidden lg:grid grid-cols-3 h-full">
        <ImageCol imageUrl={portraitImageUrls?.[0]} title={title} priority />

        <div className="bg-primary h-full flex flex-col items-center justify-center px-8 gap-3 relative">
          <ClientSquared
            texts={[client ?? title]}
            className="font-rounded font-black text-5xl text-primary-foreground text-center"
            textSize="text-5xl"
            textColor="text-primary-foreground"
          />
          {categories && categories.length > 0 && (
            <div className="absolute bottom-0 left-0 flex flex-wrap justify-center w-full gap-2 p-8">
              {categories.map((cat) => (
                <Badge
                  key={cat}
                  variant="ghost"
                  className="text-primary-foreground/70 border-primary-foreground/30"
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <ImageCol imageUrl={portraitImageUrls?.[1]} title={title} />
      </div>

      {/* Exit curtain — slides down over the page, then navigates back */}
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
