import { createClient } from "next-sanity";
import { NextResponse } from "next/server";
import { twoDesignsQuery } from "../../../../sanity/lib/queries";

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

export async function GET() {
  const designs = await writeClient.fetch(twoDesignsQuery);
  return NextResponse.json(designs);
}

export async function POST(req: Request) {
  const body = await req.json();
  const count = await writeClient.fetch<number>(
    `count(*[_type == "twoDesign"])`,
  );
  const doc = await writeClient.create({
    _type: "twoDesign",
    label: body.label,
    cells: JSON.stringify(body.cells),
    style: body.style,
    noGap: body.noGap ?? false,
    cols: body.cols,
    rows: body.rows,
    asset: body.asset ?? null,
    order: count,
  });
  return NextResponse.json({ id: doc._id });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await writeClient.delete(id);
  return NextResponse.json({ ok: true });
}
