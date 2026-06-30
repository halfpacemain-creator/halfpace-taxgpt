/**
 * GST knowledge — structured, updatable.
 *
 * Update whenever CBIC notifies new rates / due dates / late fees.
 * Do NOT hardcode these in components or prompts.
 */

export const GST = {
  lastReviewed: "2025-04-01",

  registrationThresholds: {
    goodsNormalStates: 4000000, // ₹40 lakh aggregate turnover
    goodsSpecialCategory: 2000000, // ₹20 lakh (NE & hill states)
    services: 2000000, // ₹20 lakh (₹10 lakh for special category states)
    servicesSpecialCategory: 1000000,
    compositionGoods: 15000000, // ₹1.5 cr
    compositionServices: 5000000, // ₹50 lakh
  },

  rateSlabs: [0, 0.05, 0.12, 0.18, 0.28] as const,

  dueDates: {
    gstr1Monthly: "11th of next month",
    gstr1Quarterly_QRMP: "13th of month following the quarter",
    iff_QRMP: "13th of next month (first two months of quarter)",
    gstr3bMonthly: "20th of next month",
    gstr3bQRMP: "22nd / 24th of month following the quarter (state-wise)",
    gstr4Composition: "30 June (annual)",
    cmp08Composition: "18th of month following the quarter",
    gstr5NRTP: "13th of next month or 7 days after expiry of registration",
    gstr6ISD: "13th of next month",
    gstr7TDS: "10th of next month",
    gstr8TCS: "10th of next month",
    gstr9Annual: "31 December of next financial year",
    gstr9CReconciliation: "31 December of next financial year (turnover > ₹5 cr)",
  },

  lateFees: {
    gstr3bNilReturn: "₹20 per day (₹10 CGST + ₹10 SGST), max ₹500",
    gstr3bWithLiability: "₹50 per day (₹25 + ₹25), capped slab-wise",
    gstr1: "Same structure as GSTR-3B",
    gstr9: "₹200 per day (₹100 + ₹100), capped at 0.25% of turnover in state",
  },

  interest: {
    delayedPayment: "18% p.a. on net cash liability (Section 50(1))",
    excessITC: "24% p.a. on excess/wrongly availed ITC utilised (Section 50(3))",
  },

  itc: {
    timeLimit:
      "ITC for an FY may be claimed up to 30 November of the next FY or filing of annual return, whichever is earlier (Section 16(4)).",
    blockedCredits:
      "Section 17(5) — motor vehicles (with exceptions), food & beverages, club memberships, works contract for immovable property (except plant & machinery), personal consumption, goods lost/stolen/destroyed, etc.",
    conditions:
      "Section 16(2) — possession of tax invoice, receipt of goods/services, supplier has paid tax & filed GSTR-1/IFF (auto-populated in GSTR-2B), recipient has filed return.",
  },

  eInvoicing: {
    threshold: "Aggregate turnover > ₹5 crore in any FY from 2017-18 onwards",
    appliesTo: "B2B supplies, exports, SEZ supplies, credit/debit notes",
  },

  eWayBill: {
    threshold: "Consignment value > ₹50,000 (inter-state; intra-state varies)",
    validity: "1 day per 200 km (or part thereof) for normal cargo",
  },

  notes: [
    "Always verify the latest CBIC notification number before citing a specific rate, exemption, or due-date extension — these change frequently.",
    "Reverse Charge: refer notifications 13/2017 (services) and 4/2017 (goods) as amended.",
  ],
} as const;
