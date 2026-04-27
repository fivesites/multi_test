"use client";

import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const VERTEX_SRC = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Large pixel blocks → small pixel blocks → fade out
const FRAGMENT_SRC = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_progress;
varying vec2 v_uv;

void main() {
  // Quadratic ease-in keeps blocks chunky for most of the animation
  float t = 1.0 - u_progress;
  float pixel_size = max(1.0, 48.0 * t * t);
  vec2 block = floor(gl_FragCoord.xy / pixel_size);

  float h1 = fract(sin(dot(block, vec2(12.9898, 78.233))) * 43758.5453);
  float h2 = fract(sin(dot(block, vec2(93.989, 67.345))) * 43758.5453);

  vec3 col = mix(vec3(0.02, 0.0, 0.0), vec3(0.9, 0.0, 0.0), h1 * 0.28);
  col = mix(col, vec3(0.0), h2 * 0.5);

  // Only fade in the last 18% so the full pixel journey is visible
  float alpha = (1.0 - smoothstep(0.82, 1.0, u_progress)) * 0.92;
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  return shader;
}

export interface PixelShaderOverlayProps {
  /** Increment to re-trigger the animation */
  trigger?: number;
  /** "element" = absolute overlay over parent; "viewport" = fixed full-screen portal */
  mode?: "element" | "viewport";
  /** Animation duration in ms */
  duration?: number;
}

export default function PixelShaderOverlay({
  trigger = 1,
  mode = "element",
  duration = 600,
}: PixelShaderOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (trigger === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (mode === "viewport") {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    } else {
      const parent = canvas.parentElement;
      const { width, height } = parent?.getBoundingClientRect() ?? { width: 0, height: 0 };
      canvas.width = Math.round(width) || 1;
      canvas.height = Math.round(height) || 1;
    }

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uProg = gl.getUniformLocation(program, "u_progress");
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    canvas.style.display = "block";

    const start = performance.now();
    let raf: number;

    function frame(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      gl!.uniform1f(uProg, progress);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      if (progress < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        canvas!.style.display = "none";
        gl!.deleteProgram(program);
        gl!.deleteShader(vs);
        gl!.deleteShader(fs);
        gl!.deleteBuffer(buf);
      }
    }

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [trigger, mode, duration, mounted]);

  const elementStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    display: "none",
    borderRadius: "inherit",
    zIndex: 10,
  };

  const viewportStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    display: "none",
    zIndex: 9999,
  };

  const canvas = (
    <canvas ref={canvasRef} style={mode === "viewport" ? viewportStyle : elementStyle} />
  );

  return mounted && mode === "viewport" ? createPortal(canvas, document.body) : canvas;
}
