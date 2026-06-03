// IDR currency formatting helpers (id-ID locale: "Rp 3.000.000").

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const groupFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

export function formatIDR(value) {
  if (!Number.isFinite(value)) return "Rp 0";
  return idrFormatter.format(Math.round(value));
}

// Digits only, grouped with id-ID thousands separators ("3.000.000").
// Used for live formatting inside number inputs.
export function formatThousands(value) {
  if (!Number.isFinite(value)) return "";
  return groupFormatter.format(Math.round(value));
}

// Parse a user-typed string (possibly with separators) into a number.
// Returns NaN when there are no digits.
export function parseDigits(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits === "") return NaN;
  return Number(digits);
}
