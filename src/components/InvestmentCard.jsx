"use client";

import { formatIDR } from "@/lib/format";
import { useTranslation } from "@/lib/i18n";
import { annuityFutureValue, futureValue } from "@/lib/investment";
import { totalCostOf } from "@/lib/scoring";

const HORIZONS = [1, 3, 5, 10];

function parseRate(raw) {
  const cleaned = String(raw).replace(/[^\d.]/g, "");
  return cleaned === "" ? NaN : Number(cleaned);
}

export default function InvestmentCard({ item, rate, years, onRate, onYears }) {
  const { t } = useTranslation();
  const hasPrice = Number.isFinite(item.price) && item.price > 0;
  const recurring = item.frequency === "monthly";
  const safeRate = Number.isFinite(rate) ? rate : 0;

  const principal = recurring
    ? item.price
    : totalCostOf({
        price: item.price,
        installment: {
          on: item.installmentOn,
          months: item.installmentMonths,
          interestPct: item.installmentInterest,
        },
      });

  const result = recurring
    ? annuityFutureValue(principal, safeRate, years)
    : futureValue(principal, safeRate, years);

  const yearsLabel = t("invest.years", { n: years });

  const resultLine = recurring
    ? t("invest.recurring", {
        amount: formatIDR(principal),
        rate: safeRate,
        years: yearsLabel,
        future: formatIDR(result.futureValue),
        contributed: formatIDR(result.contributed),
      })
    : t("invest.lump", {
        amount: formatIDR(principal),
        rate: safeRate,
        years: yearsLabel,
        future: formatIDR(result.futureValue),
      });

  return (
    <section className="card-soft rounded-card border border-border bg-surface p-5 sm:p-6">
      <p className="eyebrow text-primary">{t("invest.eyebrow")}</p>
      <h2 className="mt-1 text-lg font-semibold text-ink">{t("invest.title")}</h2>
      <p className="mt-1 text-sm text-muted">{t("invest.subtitle")}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label htmlFor="invest-rate" className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">{t("invest.rate")}</span>
          <div className="flex items-stretch overflow-hidden rounded-control border border-border bg-surface focus-within:border-primary">
            <input
              id="invest-rate"
              type="text"
              inputMode="decimal"
              value={Number.isFinite(rate) ? rate : ""}
              onChange={(event) => onRate(parseRate(event.target.value))}
              className="w-full bg-transparent px-3 py-2.5 text-[15px] text-ink outline-none"
            />
            <span className="flex items-center bg-primary-soft px-3 text-sm font-semibold text-primary">
              %
            </span>
          </div>
        </label>

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink">{t("invest.horizon")}</span>
          <div className="inline-flex w-full rounded-control border border-border bg-surface p-0.5">
            {HORIZONS.map((value) => {
              const active = years === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => onYears(value)}
                  aria-pressed={active}
                  className={`flex-1 rounded-[7px] px-2 py-1.5 text-sm font-semibold transition-colors ${
                    active ? "bg-primary-soft text-primary" : "text-muted hover:text-ink"
                  }`}
                >
                  {t("invest.yrShort", { n: value })}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {hasPrice ? (
        <>
          <p className="mt-4 text-[15px] text-ink">{resultLine}</p>
          <p className="mt-3 rounded-control bg-primary-soft px-3 py-2 text-sm font-semibold text-primary">
            {t("invest.framing", { gain: formatIDR(result.gain), years: yearsLabel })}
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted">{t("invest.hint")}</p>
      )}
    </section>
  );
}
