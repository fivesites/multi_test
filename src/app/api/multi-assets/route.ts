import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { multiAssetsQuery } from "../../../../sanity/lib/queries";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function GET() {
  const assets = await writeClient.fetch(multiAssetsQuery);
  return NextResponse.json(assets);
}

export async function POST(req: Request) {
  const body = await req.json();
  const count = await writeClient.fetch<number>(`count(*[_type == "multiAsset"])`);
  const doc = await writeClient.create({
    _type: "multiAsset",
    label: body.label,
    type: body.type,
    order: count,
    // glyph
    cells:         body.cells         ? JSON.stringify(body.cells) : undefined,
    glyphStyle:    body.glyphStyle    ?? undefined,
    noGap:         body.noGap         ?? false,
    cols:          body.cols          ?? undefined,
    rows:          body.rows          ?? undefined,
    uploadedAsset: body.uploadedAsset ?? undefined,
    // pattern
    colorA:            body.colorA            ?? undefined,
    colorB:            body.colorB            ?? undefined,
    checkerStripCount: body.checkerStripCount ?? undefined,
  });
  return NextResponse.json({ id: doc._id });
}

export async function PATCH(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  const body = await req.json();
  const patch: Record<string, unknown> = {};
  if (body.label !== undefined) patch.label = body.label;
  if (body.role  !== undefined) patch.role  = body.role;
  await writeClient.patch(id).set(patch).commit();
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await writeClient.delete(id);
  return NextResponse.json({ ok: true });
}
