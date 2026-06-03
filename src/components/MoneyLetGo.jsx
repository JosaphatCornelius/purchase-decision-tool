"use client";

import { formatIDR } from "@/lib/format";
import { useTranslation } from "@/lib/i18n";

function isSameMonth(timestamp, now) {
  const a = new Date(timestamp);
  const b = new Date(now);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export default function MoneyLetGo({ letGo, now }) {
  const { t } = useTranslation();
  if (!letGo.length) return null;

  const total = letGo.reduce((sum, item) => sum + item.cost, 0);
  const monthTotal = letGo
    .filter((item) => isSameMonth(item.letGoAt, now))
    .reduce((sum, item) => sum + item.cost, 0);
  const itemLabel = t(letGo.length === 1 ? "item" : "items");

  return (
    <section className="card-soft rounded-card border border-border bg-buy-bg p-5">
      <h2 className="text-sm font-semibold" style={{ color: "var(--buy)" }}>
        {t("letGo.title")}
      </h2>
      <p className="mt-1 text-[15px] text-ink">
        {t("letGo.summary", { total: formatIDR(total), count: letGo.length, itemLabel })}
      </p>
      {monthTotal > 0 ? (
        <p className="mt-0.5 text-sm text-muted">
          {t("letGo.thisMonth", { total: formatIDR(monthTotal) })}
        </p>
      ) : null}
    </section>
  );
}
