"use client";

import FactorInfo from "@/components/FactorInfo";
import { useTranslation } from "@/lib/i18n";
import { FACTOR_KEYS } from "@/lib/scoring";

function scoreColor(score) {
  if (score >= 70) return "var(--buy)";
  if (score >= 40) return "var(--wait)";
  return "var(--skip)";
}

export default function Breakdown({ factors, showHeading = true }) {
  const { t } = useTranslation();

  return (
    <section>
      {showHeading ? (
        <>
          <h2 className="mb-1 text-lg font-semibold text-ink">{t("breakdown.title")}</h2>
          <p className="mb-4 text-sm text-muted">{t("breakdown.subtitle")}</p>
        </>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {FACTOR_KEYS.map((key) => (
          <FactorInfo
            key={key}
            label={t(`factor.${key}`)}
            help={t(`factorHelp.${key}`)}
            score={factors[key]}
            color={scoreColor(factors[key])}
          />
        ))}
      </div>
    </section>
  );
}
