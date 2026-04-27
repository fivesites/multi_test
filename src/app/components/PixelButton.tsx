"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

export default function PixelButton({ children = "Click me" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const text = children;
    const fontSize = 24;

    // 🔥 IMPORTANT: match your CSS font here
    const font = `${fontSize}px "font-rounded", sans-serif`;

    const temp = document.createElement("canvas").getContext("2d");
    temp.font = font;
    const metrics = temp.measureText(text);

    const paddingX = 32;
    const paddingY = 20;

    const width = Math.ceil(metrics.width + paddingX);
    const height = Math.ceil(fontSize + paddingY);

    const scale = 0.15;

    canvas.width = width * scale;
    canvas.height = height * scale;

    ctx.scale(scale, scale);

    ctx.font = font;
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(text, width / 2, height / 2);
  }, [children]);

  return (
    <>
      <Button variant="glow" className="btn">
        {/* pixel version */}
        <canvas ref={canvasRef} className="pixel hover:opacity-0" />

        {/* crisp version */}
        <span className=" font-rounded text-foreground hover:opacity-100 opacity-0">
          {children}
        </span>
      </Button>

      <style jsx>{`
        .btn {
          position: relative;
        }

        /* PIXEL LAYER */
        canvas.pixel {
          display: block;
          width: 120px; /* 🔥 controls visual size */
          height: auto;
          image-rendering: pixelated;
          transition: opacity 0.25s ease;
        }

        /* CRISP TEXT LAYER */
        .text {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;

          font-size: 24px;
          color: black;

          opacity: 0;
          transition: opacity 0.25s ease;
        }
      `}</style>
    </>
  );
}
