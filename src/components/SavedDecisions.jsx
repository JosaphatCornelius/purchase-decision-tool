"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatIDR } from "@/lib/format";
import { useTranslation } from "@/lib/i18n";

const VERDICT_STYLE = {
  buy: { color: "var(--buy)", bg: "var(--buy-bg)" },
  fine: { color: "var(--fine)", bg: "var(--fine-bg)" },
  wait: { color: "var(--wait)", bg: "var(--wait-bg)" },
  skip: { color: "var(--skip)", bg: "var(--skip-bg)" },
};

const DAY_MS = 1000 * 60 * 60 * 24;

function daysAgo(savedAt, now) {
  return Math.floor((now - savedAt) / DAY_MS);
}

export default function SavedDecisions({ decisions, now, onLetGo, onRemove, onKeep }) {
  const { t } = useTranslation();

  if (decisions.length === 0) {
    return (
      <section className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted">{t("saved.empty")}</p>
      </section>
    );
  }

  const savedLabel = (days) => {
    if (days <= 0) return t("saved.today");
    if (days === 1) return t("saved.yesterday");
    return t("saved.daysAgo", { days });
  };

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-ink">{t("saved.title")}</h2>
      <AnimatePresence initial={false}>
        {decisions.map((decision) => {
          const days = daysAgo(decision.savedAt, now);
          const style = VERDICT_STYLE[decision.verdictKey];
          return (
            <motion.div
              key={decision.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="card-soft overflow-hidden rounded-card border border-border bg-surface p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink">{decision.itemName}</p>
                  <p className="text-sm text-muted">
                    {formatIDR(decision.cost)} · {savedLabel(days)}
                  </p>
                </div>
                <span
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: style.bg, color: style.color }}
                >
                  {t(`verdict.${decision.verdictKey}.label`)} · {decision.score}
                </span>
              </div>

              {days >= 7 ? (
                <div className="mt-3 rounded-control bg-primary-soft p-3">
                  <p className="text-sm text-ink">{t("saved.coolOff")}</p>
                  {decision.reason ? (
                    <p className="mt-1 text-sm italic text-muted">
                      {t("saved.reasonRecall", { reason: decision.reason })}
                    </p>
                  ) : null}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onKeep(decision.id)}
                      className="rounded-control bg-primary px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
                    >
                      {t("saved.stillWant")}
                    </button>
                    <button
                      type="button"
                      onClick={() => onLetGo(decision.id)}
                      className="rounded-control px-3 py-1.5 text-sm font-semibold text-muted transition-colors hover:bg-border/60"
                    >
                      {t("saved.letItGo")}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onRemove(decision.id)}
                  className="mt-2 text-sm font-semibold text-muted transition-colors hover:text-ink"
                >
                  {t("saved.remove")}
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </section>
  );
}
