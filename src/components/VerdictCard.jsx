"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import ScoreGauge from "@/components/ScoreGauge";
import ShareButton from "@/components/ShareButton";
import { useTranslation } from "@/lib/i18n";

const VERDICT_COLOR = {
  buy: "var(--buy)",
  fine: "var(--fine)",
  wait: "var(--wait)",
  skip: "var(--skip)",
};

export default function VerdictCard({
  decision,
  reframe,
  installmentLine,
  targetLine,
  monthsLine,
  share,
}) {
  const { t } = useTranslation();
  const captureRef = useRef(null);

  return (
    <section className="card-soft overflow-hidden rounded-card border border-border bg-surface">
      <AnimatePresence mode="wait">
        {decision.ready ? (
          <motion.div
            key={decision.verdict.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div ref={captureRef} className="bg-surface">
              <div
                className="flex items-center justify-between gap-4 p-6 sm:p-8"
                style={{ backgroundColor: VERDICT_COLOR[decision.verdict.key] }}
              >
                <div className="min-w-0">
                  <p className="eyebrow text-white/70">{t("verdict.eyebrow")}</p>
                  <p className="mt-1 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl">
                    {t(`verdict.${decision.verdict.key}.label`)}
                  </p>
                </div>
                <ScoreGauge score={decision.finalScore} />
              </div>

              <div className="p-6 sm:p-8">
                <p className="text-[15px] text-ink">{t(`verdict.${decision.verdict.key}.line`)}</p>
                {reframe ? <p className="mt-1.5 text-sm text-muted">{reframe}</p> : null}
                {installmentLine ? (
                  <p className="mt-1.5 text-sm text-muted">{installmentLine}</p>
                ) : null}
                {monthsLine ? <p className="mt-1.5 text-sm text-muted">{monthsLine}</p> : null}

                {targetLine ? (
                  <p className="mt-3 rounded-control bg-primary-soft px-3 py-2 text-sm font-semibold text-primary">
                    {targetLine}
                  </p>
                ) : null}
              </div>
            </div>

            {share ? (
              <div className="px-6 pb-6 sm:px-8">
                <ShareButton
                  captureRef={captureRef}
                  shareText={share.shareText}
                  shareUrl={share.shareUrl}
                  fileName={share.fileName}
                />
              </div>
            ) : null}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6 sm:p-8"
          >
            <p className="text-lg font-semibold text-ink">{t("verdict.placeholderTitle")}</p>
            <p className="mt-1.5 text-sm text-muted">{t(`hint.${decision.hint}`)}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
