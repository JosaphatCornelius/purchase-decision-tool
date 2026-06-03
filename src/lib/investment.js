// Opportunity-cost helpers: what the money could become if invested instead.
// Pure functions only — transparent compound growth, no projections of risk.

function clampInputs(amount, annualRatePct, years) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? amount : 0;
  const safeRate = Number.isFinite(annualRatePct) && annualRatePct >= 0 ? annualRatePct : 0;
  const safeYears = Number.isFinite(years) && years > 0 ? years : 0;
  return { safeAmount, safeRate, safeYears };
}

// One-time lump sum growing with annual compounding.
export function futureValue(principal, annualRatePct, years) {
  const { safeAmount, safeRate, safeYears } = clampInputs(principal, annualRatePct, years);
  const value = safeAmount * (1 + safeRate / 100) ** safeYears;
  return {
    futureValue: Math.round(value),
    contributed: Math.round(safeAmount),
    gain: Math.round(value - safeAmount),
  };
}

// Recurring monthly deposits with monthly compounding (annuity future value).
export function annuityFutureValue(monthly, annualRatePct, years) {
  const { safeAmount, safeRate, safeYears } = clampInputs(monthly, annualRatePct, years);
  const months = Math.round(safeYears * 12);
  const monthlyRate = safeRate / 100 / 12;
  const contributed = safeAmount * months;
  const value =
    monthlyRate === 0
      ? contributed
      : safeAmount * (((1 + monthlyRate) ** months - 1) / monthlyRate);
  return {
    futureValue: Math.round(value),
    contributed: Math.round(contributed),
    gain: Math.round(value - contributed),
  };
}
