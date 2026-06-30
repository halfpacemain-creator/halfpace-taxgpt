/**
 * ROC / MCA / LLP / TDS / PT compliance knowledge.
 * Structured and updatable.
 */

export const COMPLIANCE = {
  lastReviewed: "2025-04-01",

  roc: {
    aoc4: "Filing of financial statements — within 30 days of AGM",
    mgt7: "Annual Return — within 60 days of AGM (MGT-7A for OPC/small co.)",
    adt1: "Auditor appointment — within 15 days of AGM",
    dir3KYC: "Annual DIN KYC — by 30 September every year",
    dpt3: "Return of deposits / loans — by 30 June",
    msme1: "Half-yearly return of dues to MSME — 30 April & 31 October",
  },

  llp: {
    form8: "Statement of Account & Solvency — by 30 October",
    form11: "Annual Return — by 30 May",
    auditRequirement:
      "Audit mandatory if turnover > ₹40 lakh or contribution > ₹25 lakh",
  },

  tds: {
    commonSections: {
      "192": "Salary — as per slab",
      "194A": "Interest other than securities — 10% (threshold ₹40,000 / ₹50,000 senior)",
      "194C": "Contractor — 1% (individual/HUF) / 2% (others), threshold ₹30,000 single / ₹1,00,000 aggregate",
      "194H": "Commission/Brokerage — 5% (2% from 1 Oct 2024), threshold ₹15,000",
      "194I": "Rent — 10% land/building, 2% plant & machinery, threshold ₹2,40,000",
      "194J": "Professional/Technical fees — 10% (2% for technical), threshold ₹30,000",
      "194Q": "Purchase of goods — 0.1%, threshold ₹50 lakh, turnover > ₹10 cr",
      "194O": "E-commerce — 1% (0.1% from 1 Oct 2024)",
      "194T": "Payments by firm to partner (salary/remuneration/interest) — 10% from 1 April 2025, threshold ₹20,000",
    },
    tcs206C1H: "0.1% on sale of goods > ₹50 lakh (turnover > ₹10 cr) — omitted w.e.f. 1 April 2025",
  },

  msme: {
    udyamRegistration:
      "Free online registration on udyamregistration.gov.in; based on investment + turnover criteria",
    classification: {
      micro: "Investment ≤ ₹1 cr AND turnover ≤ ₹5 cr",
      small: "Investment ≤ ₹10 cr AND turnover ≤ ₹50 cr",
      medium: "Investment ≤ ₹50 cr AND turnover ≤ ₹250 cr",
    },
    section43B_h:
      "Income Tax: Payments to Micro/Small enterprises must be made within 15 days (or 45 days if there is a written agreement) — else deduction is disallowed in the year of accrual.",
  },

  professionalTax: {
    note:
      "Levied state-wise (Maharashtra, Karnataka, WB, TN, Gujarat, etc.). Maximum ₹2,500 per year per person. Rates, slabs and due dates differ — always check the specific state's Act.",
  },

  trademark: {
    classes: "45 Nice Classification classes (1–34 goods, 35–45 services)",
    process: [
      "Public search on IP India portal",
      "File TM-A (₹4,500 individual/startup/MSME; ₹9,000 others, per class)",
      "Examination report → response within 30 days",
      "Journal publication → 4 months opposition window",
      "Registration certificate; valid 10 years, renewable",
    ],
  },
} as const;
