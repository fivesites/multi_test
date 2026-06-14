"use client";

import { useEffect, useRef, useState } from "react";
import TypedWord from "./TypedWord";

export default function MultiFooter() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && window.scrollY > 10) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={ref}
      className="absolute bottom-0 left-0 w-full px-4 lg:px-8 py-4 grid grid-cols-1 items-center lg:grid-cols-6"
    >
      <TypedWord
        text="Multi² 2026. All Rights Reserved."
        visible={visible}
        delay={0}
        className="col-span-2 font-visual text-lg font-medium leading-tight text-lava items-center text-center lg:text-left"
      />
    </footer>
  );
}
