// Transparent weighted scoring model for purchase decisions.
// Pure functions only — no UI, no side effects.

export const IMPACT_OPTIONS = [
  { value: "high", score: 90 },
  { value: "medium", score: 60 },
  { value: "low", score: 25 },
];

export const IMPULSE_OPTIONS = [
  { value: "now", score: 20 },
  { value: "days", score: 55 },
  { value: "weeks", score: 90 },
];

export const FREQUENCY_OPTIONS = ["once", "monthly", "yearly"];

export const DEFAULT_WEIGHTS = {
  affordability: 30,
  budgetFit: 30,
  productiveImpact: 30,
  impulseCheck: 10,
};

export const FACTOR_KEYS = ["affordability", "budgetFit", "productiveImpact", "impulseCheck"];

export const VERDICTS = {
  buy: { key: "buy", minScore: 80 },
  fine: { key: "fine", minScore: 55 },
  wait: { key: "wait", minScore: 35 },
  skip: { key: "skip", minScore: 0 },
};

const FINE_THRESHOLD = VERDICTS.fine.minScore;

function affordabilityScore(cost, income) {
  const ratio = cost / income;
  if (ratio < 0.05) return 95;
  if (ratio < 0.15) return 75;
  if (ratio < 0.3) return 45;
  return 15;
}

function budgetFitScore(cost, income, expenses) {
  const spare = income - expenses;
  if (spare <= 0) return 5;
  const ratio = cost / spare;
  if (ratio < 0.25) return 90;
  if (ratio < 0.5) return 65;
  if (ratio < 1) return 35;
  return 8;
}

export function verdictForScore(score) {
  if (score >= VERDICTS.buy.minScore) return VERDICTS.buy;
  if (score >= VERDICTS.fine.minScore) return VERDICTS.fine;
  if (score >= VERDICTS.wait.minScore) return VERDICTS.wait;
  return VERDICTS.skip;
}

function weightSumOf(weights) {
  return weights.affordability + weights.budgetFit + weights.productiveImpact + weights.impulseCheck;
}

// The amount the model scores against, derived from price + how it's paid.
// Recurring spend and installments compete with monthly cash flow, so they
// are assessed on a monthly figure rather than the lump sum.
export function computeAssessmentCost({ price, frequency, installment }) {
  if (installment?.on && installment.months > 0) {
    const total = price * (1 + (installment.interestPct || 0) / 100);
    return total / installment.months;
  }
  if (frequency === "monthly") return price;
  if (frequency === "yearly") return price / 12;
  return price;
}

export function totalCostOf({ price, installment }) {
  if (installment?.on && installment.months > 0) {
    return price * (1 + (installment.interestPct || 0) / 100);
  }
  return price;
}

function scoreFor(assessmentCost, income, expenses, impactScore, impulseScore, weights) {
  const factors = {
    affordability: affordabilityScore(assessmentCost, income),
    budgetFit: budgetFitScore(assessmentCost, income, expenses),
    productiveImpact: impactScore,
    impulseCheck: impulseScore,
  };
  const sum = weightSumOf(weights);
  const weighted =
    factors.affordability * weights.affordability +
    factors.budgetFit * weights.budgetFit +
    factors.productiveImpact * weights.productiveImpact +
    factors.impulseCheck * weights.impulseCheck;
  return { factors, finalScore: Math.round(weighted / sum) };
}

// Returns either a "not ready" result with a gentle hint, or a full decision.
export function computeDecision({
  price,
  frequency = "once",
  installment,
  income,
  expenses,
  impactScore,
  impulseScore,
  weights = DEFAULT_WEIGHTS,
}) {
  const safeExpenses = Number.isFinite(expenses) && expenses > 0 ? expenses : 0;

  if (!Number.isFinite(price) || price <= 0) {
    return { ready: false, hint: "price" };
  }
  if (!Number.isFinite(income) || income <= 0) {
    return { ready: false, hint: "income" };
  }
  if (weightSumOf(weights) <= 0) {
    return { ready: false, hint: "weights" };
  }

  const assessmentCost = computeAssessmentCost({ price, frequency, installment });
  const { factors, finalScore } = scoreFor(
    assessmentCost,
    income,
    safeExpenses,
    impactScore,
    impulseScore,
    weights,
  );

  return {
    ready: true,
    factors,
    finalScore,
    verdict: verdictForScore(finalScore),
    spare: income - safeExpenses,
    assessmentCost,
    totalCost: totalCostOf({ price, installment }),
  };
}

// Highest price that would still reach "Probably fine" (score >= 55), holding
// everything else fixed. Score is monotonic non-increasing in price, so a
// binary search over price is safe. Returns null when price is not the limiter.
export function findTargetPrice(inputs) {
  const { income, expenses, impactScore, impulseScore, weights = DEFAULT_WEIGHTS } = inputs;
  const safeExpenses = Number.isFinite(expenses) && expenses > 0 ? expenses : 0;
  if (!Number.isFinite(income) || income <= 0 || weightSumOf(weights) <= 0) return null;
  if (!Number.isFinite(inputs.price) || inputs.price <= 0) return null;

  const scoreAtPrice = (price) => {
    const assessmentCost = computeAssessmentCost({ ...inputs, price });
    return scoreFor(assessmentCost, income, safeExpenses, impactScore, impulseScore, weights)
      .finalScore;
  };

  if (scoreAtPrice(inputs.price) >= FINE_THRESHOLD) return null;
  if (scoreAtPrice(0) < FINE_THRESHOLD) return null;

  let low = 0;
  let high = inputs.price;
  for (let i = 0; i < 40; i += 1) {
    const mid = (low + high) / 2;
    if (scoreAtPrice(mid) >= FINE_THRESHOLD) low = mid;
    else high = mid;
  }
  const target = Math.round(low);
  if (target <= 0 || target >= inputs.price * 0.99) return null;
  return target;
}

// Months of disposable income needed to cover a one-time purchase out of reach.
export function monthsToAfford({ price, frequency, installment, income, expenses }) {
  if (frequency !== "once" || installment?.on) return null;
  if (!Number.isFinite(price) || price <= 0) return null;
  const safeExpenses = Number.isFinite(expenses) && expenses > 0 ? expenses : 0;
  const spare = income - safeExpenses;
  if (!Number.isFinite(spare) || spare <= 0) return null;
  const months = Math.ceil(price / spare);
  return months > 1 ? months : null;
}

export function optionScore(options, value) {
  return options.find((option) => option.value === value)?.score ?? 0;
}
