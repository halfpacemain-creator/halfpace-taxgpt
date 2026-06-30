/**
 * Income Tax knowledge — structured, updatable.
 *
 * All slabs / thresholds / due dates live here so they can be revised
 * when the Finance Act / CBDT notifications change. Do NOT hardcode any
 * of these numbers in components, prompts, or server logic — read from
 * this file (or extend it) and let the AI cite them.
 *
 * Last reviewed: FY 2024-25 / AY 2025-26 (as per Finance (No. 2) Act, 2024).
 * Update `lastReviewed` whenever any value is changed.
 */

export const INCOME_TAX = {
  lastReviewed: "2025-04-01",
  assessmentYear: "AY 2025-26",
  financialYear: "FY 2024-25",

  // New tax regime u/s 115BAC (default regime for individuals/HUF)
  // Source: Finance (No. 2) Act, 2024 amendments.
  newRegimeSlabs: [
    { upTo: 300000, rate: 0 },
    { upTo: 700000, rate: 0.05 },
    { upTo: 1000000, rate: 0.1 },
    { upTo: 1200000, rate: 0.15 },
    { upTo: 1500000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ],
  newRegimeStandardDeduction: 75000, // salaried / pensioners
  newRegimeRebate87A: { limit: 700000, maxRebate: 25000 },

  // Old regime (optional) — individuals < 60 yrs
  oldRegimeSlabs: [
    { upTo: 250000, rate: 0 },
    { upTo: 500000, rate: 0.05 },
    { upTo: 1000000, rate: 0.2 },
    { upTo: Infinity, rate: 0.3 },
  ],
  oldRegimeStandardDeduction: 50000,
  oldRegimeRebate87A: { limit: 500000, maxRebate: 12500 },

  // Common surcharge slabs (both regimes; new regime caps at 25%)
  surcharge: [
    { aboveIncome: 5000000, rate: 0.1 },
    { aboveIncome: 10000000, rate: 0.15 },
    { aboveIncome: 20000000, rate: 0.25 },
    // Old regime only: 37% above 5 cr. New regime capped at 25%.
  ],
  healthAndEducationCess: 0.04,

  dueDates: {
    itrNonAudit: "31 July (of the assessment year)",
    itrAuditCases: "31 October",
    itrTransferPricing: "30 November",
    belatedRevisedItr: "31 December",
    advanceTax: [
      { instalment: "1st", by: "15 June", cumulative: "15%" },
      { instalment: "2nd", by: "15 September", cumulative: "45%" },
      { instalment: "3rd", by: "15 December", cumulative: "75%" },
      { instalment: "4th", by: "15 March", cumulative: "100%" },
    ],
    tdsDeposit: "7th of next month (April: 30 April)",
    tdsReturn: "Quarterly — 31 July, 31 October, 31 January, 31 May",
  },

  interest: {
    section234A: "1% per month — delay in filing ITR",
    section234B: "1% per month — shortfall in advance tax (<90%)",
    section234C: "1% per month — deferment of advance tax instalments",
    section201_1A: "1% / 1.5% per month — late TDS deduction / deposit",
  },

  notes: [
    "From AY 2024-25 the new regime u/s 115BAC is the DEFAULT. Taxpayers must opt out via Form 10-IEA to use the old regime if they have business/profession income.",
    "Rebate u/s 87A under new regime: full rebate if total income ≤ ₹7,00,000. Marginal relief applies just above this limit.",
    "Income-tax Act, 2025 has been enacted but applicability/commencement of specific provisions should always be verified before citing.",
  ],
} as const;
