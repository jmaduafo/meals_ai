import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-06-24.dahlia",
  // apiVersion: "2024-12-18.acacia",
});

export const MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_ID_MONTHLY ?? "";
