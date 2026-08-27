import { NextResponse } from "next/server";

/**
 * Newsletter signups. The provider is deliberately not hardcoded: point
 * NEWSLETTER_ENDPOINT at the list's form/webhook URL (Mailchimp, Buttondown,
 * Resend audiences, …) and set NEWSLETTER_API_KEY if it needs a bearer token.
 * Without NEWSLETTER_ENDPOINT the route reports 501 rather than pretending
 * the address was stored.
 */

// Deliberately loose — the provider is the real authority on deliverability.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const endpoint = process.env.NEWSLETTER_ENDPOINT;
  if (!endpoint) {
    console.warn("[newsletter] NEWSLETTER_ENDPOINT is not set — signup dropped");
    return NextResponse.json(
      { error: "Newsletter is not configured" },
      { status: 501 },
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.NEWSLETTER_API_KEY && {
        Authorization: `Bearer ${process.env.NEWSLETTER_API_KEY}`,
      }),
    },
    body: JSON.stringify({ email: email.trim() }),
  });

  if (!res.ok) {
    console.error("[newsletter] provider rejected signup", res.status);
    return NextResponse.json({ error: "Signup failed" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
