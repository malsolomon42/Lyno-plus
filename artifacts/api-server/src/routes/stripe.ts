import { Router, type IRouter, type Request, type Response } from "express";
import { getUncachableStripeClient } from "../stripeClient";

const router: IRouter = Router();

const PRICE_DEFINITIONS = {
  support: {
    product: "lyno+ Support",
    description: "A one-time contribution that keeps independent space and science coverage free.",
  },
  advertising: {
    product: "lyno+ Advertising",
    description: "Advertising placement and sponsorship support for lyno+.",
  },
} as const;

async function getOrCreatePrice(kind: keyof typeof PRICE_DEFINITIONS, amount: number) {
  const stripe = await getUncachableStripeClient();
  const definition = PRICE_DEFINITIONS[kind];
  const lookupKey = `lynoplus_${kind}_${amount}`;
  const existing = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  if (existing.data[0]) return { stripe, price: existing.data[0] };

  const product = await stripe.products.create({
    name: definition.product,
    description: definition.description,
    metadata: { lynoplus_kind: kind },
  });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: Math.round(amount * 100),
    currency: "usd",
    lookup_key: lookupKey,
    metadata: { lynoplus_kind: kind },
  });
  return { stripe, price };
}

function getReturnUrl(req: Request, path: string) {
  const host = req.get("host");
  const protocol = req.headers["x-forwarded-proto"] || req.protocol;
  return `${protocol}://${host}${path}`;
}

router.post("/stripe/checkout", async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Sign in to continue." });
  const kind = req.body?.kind === "advertising" ? "advertising" : "support";
  const amount = Number(req.body?.amount);
  if (!Number.isFinite(amount) || amount < 1 || amount > 100000) {
    return res.status(400).json({ error: "Enter an amount between $1 and $100,000." });
  }

  try {
    const { stripe, price } = await getOrCreatePrice(kind, amount);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: req.user.email ?? undefined,
      client_reference_id: req.user.id,
      metadata: { kind, userId: req.user.id },
      success_url: getReturnUrl(req, `/support?payment=success&kind=${kind}`),
      cancel_url: getReturnUrl(req, `/support?payment=cancelled`),
    });
    return res.json({ url: session.url });
  } catch (error) {
    req.log.error({ error }, "Stripe checkout creation failed");
    return res.status(502).json({ error: "Payment checkout is temporarily unavailable." });
  }
});

export default router;