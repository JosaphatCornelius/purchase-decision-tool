"use client";

import { useTranslation } from "@/lib/i18n";
import { DEFAULT_WEIGHTS, FACTOR_KEYS } from "@/lib/scoring";

function weightPercent(weights, key) {
  const total =
    weights.affordability + weights.budgetFit + weights.productiveImpact + weights.impulseCheck;
  if (total <= 0) return 0;
  return Math.round((weights[key] / total) * 100);
}

export default function TuneCard({ weights, onChange }) {
  const { t } = useTranslation();
  const update = (key) => (event) =>
    onChange({ ...weights, [key]: Number(event.target.value) });

  const isDefault = FACTOR_KEYS.every((key) => weights[key] === DEFAULT_WEIGHTS[key]);

  return (
    <section className="card-soft rounded-card border border-border bg-surface p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow text-primary">{t("tune.title")}</p>
          <p className="mt-1 text-sm text-muted">{t("tune.subtitle")}</p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ ...DEFAULT_WEIGHTS })}
          disabled={isDefault}
          className="shrink-0 rounded-control px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-soft disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent"
        >
          {t("tune.reset")}
        </button>
      </div>

      <p className="mt-3 rounded-control bg-primary-soft px-3 py-2 text-sm text-ink">
        {t("tune.intro")}
      </p>

      <div className="mt-5 space-y-6">
        {FACTOR_KEYS.map((key) => (
          <div key={key}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">{t(`factor.${key}`)}</span>
              <span className="font-display text-sm font-bold text-primary">
                {weightPercent(weights, key)}%
              </span>
            </div>
            <p className="mb-2 text-xs text-muted">{t(`factorHelp.${key}`)}</p>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights[key]}
              onChange={update(key)}
              aria-label={t(`factor.${key}`)}
            />
            <div className="mt-1 flex justify-between text-[11px] font-semibold uppercase tracking-wide text-muted">
              <span>{t("tune.less")}</span>
              <span>{t("tune.more")}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
