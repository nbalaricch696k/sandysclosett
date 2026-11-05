import { NextResponse } from "next/server";

const catalogue: Record<number, number> = { 1: 320, 2: 480, 3: 550, 4: 390 };

export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Paystack is not configured. Add PAYSTACK_SECRET_KEY to .env.local." }, { status: 503 });

    const body = await request.json();
    const email = String(body.email || "");
    const items = body.items as { id: number; quantity: number }[];
    if (!/^\\S+@\\S+\\.\\S+$/.test(email) || !Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: "A valid email and at least one item are required." }, { status: 400 });
    }

    // Recalculate prices on the server; never trust totals sent by the browser.
    let total = 0;
    for (const item of items) {
      const price = catalogue[Number(item.id)];
      const quantity = Math.floor(Number(item.quantity));
      if (!price || !Number.isFinite(quantity) || quantity < 1 || quantity > 20) {
        return NextResponse.json({ error: "Invalid cart item." }, { status: 400 });
      }
      total += price * quantity;
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const result = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        amount: Math.round(total * 100),
        currency: "GHS",
        callback_url: `${origin}/api/paystack/verify`
      })
    });
    const data = await result.json();
    if (!result.ok || !data.status) {
      return NextResponse.json({ error: data.message || "Paystack initialization failed." }, { status: 502 });
    }
    return NextResponse.json({ authorization_url: data.data.authorization_url });
  } catch {
    return NextResponse.json({ error: "Unable to initialize payment." }, { status: 500 });
  }
}
