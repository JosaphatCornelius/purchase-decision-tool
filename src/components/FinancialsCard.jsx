"use client";

import CurrencyInput from "@/components/CurrencyInput";
import { useTranslation } from "@/lib/i18n";

export default function FinancialsCard({ financials, onChange }) {
  const { t } = useTranslation();
  const update = (key) => (next) => onChange({ ...financials, [key]: next });

  return (
    <section className="card-soft rounded-card border border-border bg-surface p-5 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyInput
          id="income"
          label={t("input.income")}
          value={financials.income}
          onChange={update("income")}
          placeholder="0"
        />
        <CurrencyInput
          id="expenses"
          label={t("input.expenses")}
          value={financials.expenses}
          onChange={update("expenses")}
          placeholder="0"
        />
      </div>
    </section>
  );
}
