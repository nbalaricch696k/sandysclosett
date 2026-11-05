import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  const reference = new URL(request.url).searchParams.get("reference");
  if (!secret || !reference) {
    return NextResponse.redirect(new URL("/?payment=unverified", request.url));
  }

  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store"
    });
    const result = await response.json();
    if (response.ok && result.status && result.data?.status === "success" && result.data?.currency === "GHS") {
      // Production TODO: persist the verified order in a database and match amount/reference.
      return NextResponse.redirect(new URL(`/?payment=success&reference=${encodeURIComponent(reference)}`, request.url));
    }
  } catch {
    // Do not mark a payment as successful if verification is unavailable.
  }
  return NextResponse.redirect(new URL("/?payment=failed", request.url));
}
