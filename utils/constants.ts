// Affiliate/referral links for grocery delivery partners. Replace with your
// actual affiliate/partner tags once approved for each program.
export const GROCERY_PARTNERS = [
  {
    id: "instacart",
    name: "Instacart",
    ctaLabel: "Order these on Instacart",
    buildUrl: (query: string) =>
      `https://www.instacart.com/store/search?k=${encodeURIComponent(query)}&aff=${process.env.INSTACART_AFFILIATE_TAG ?? ""}`,
  },
  {
    id: "amazon_fresh",
    name: "Amazon Fresh",
    ctaLabel: "Order these on Amazon Fresh",
    buildUrl: (query: string) =>
      `https://www.amazon.com/s?k=${encodeURIComponent(query)}&i=amazonfresh&tag=${process.env.AMAZON_FRESH_AFFILIATE_TAG ?? ""}`,
  },
] as const;

export const PRICING = {
  monthly: { amountUsd: 9.99, label: "Monthly" },
};
