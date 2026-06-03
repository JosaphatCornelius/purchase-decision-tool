"use client";

import { formatThousands, parseDigits } from "@/lib/format";

// Text input that shows live id-ID thousands separators ("3.000.000")
// while storing a plain number. Reports NaN when empty.
export default function CurrencyInput({ id, label, value, onChange, placeholder }) {
  const display = Number.isFinite(value) ? formatThousands(value) : "";

  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">{label}</span>
      <div className="flex items-stretch overflow-hidden rounded-control border border-border bg-surface focus-within:border-primary">
        <span className="flex items-center bg-primary-soft px-3 text-sm font-semibold text-primary">
          Rp
        </span>
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={display}
          placeholder={placeholder}
          onChange={(event) => onChange(parseDigits(event.target.value))}
          className="w-full bg-transparent px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-muted"
        />
      </div>
    </label>
  );
}
