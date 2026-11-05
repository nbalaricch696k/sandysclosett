# Sandy's Closet — custom storefront starter

A Next.js 15 + React storefront starter with a responsive fashion homepage, sample products, a client-side cart, and server-side Paystack transaction initialization/verification.

## Run locally

1. Install Node.js 20.9+.
2. In this folder run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add your Paystack **test** secret key to `PAYSTACK_SECRET_KEY`.
5. Set `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
6. Run `npm run dev` and open http://localhost:3000.

## Paystack notes

- Start with a Paystack test key. Never put the secret key in browser code or commit `.env.local`.
- The server calculates prices from its own catalogue before initializing a GHS transaction.
- The callback route verifies the transaction with Paystack before showing a success redirect.
- This is a starter, not production-ready order management. Before launch, add a database for products, orders and payment references; verify the expected amount and reference against the saved pending order; add a signed Paystack webhook with idempotency; and add stock, delivery, refunds, privacy and admin workflows.
- Replace sample product names, prices and images with Sandy's Closet's real inventory. Update the server-side `catalogue` in `app/api/paystack/initialize/route.ts` at the same time.
- Confirm current Paystack Ghana payment-channel availability and merchant onboarding requirements in the Paystack dashboard/docs.

## Project structure

- `app/page.tsx` — storefront and shopping bag
- `app/globals.css` — responsive visual styling
- `app/api/paystack/initialize/route.ts` — secure server-side payment initialization
- `app/api/paystack/verify/route.ts` — server-side transaction verification
