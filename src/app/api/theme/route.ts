import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GLOBALS_PATH = path.join(process.cwd(), "src/app/globals.css");

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const { vars }: { vars: Record<string, string> } = await req.json();

  let css = fs.readFileSync(GLOBALS_PATH, "utf-8");

  for (const [key, value] of Object.entries(vars)) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    css = css.replace(
      new RegExp(`(${escaped}\\s*:)[^;]+;`),
      `$1 ${value};`,
    );
  }

  fs.writeFileSync(GLOBALS_PATH, css, "utf-8");
  return NextResponse.json({ ok: true });
}
