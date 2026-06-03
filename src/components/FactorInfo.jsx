"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// One breakdown card: factor label, an optional "?" disclosure, score, and
// a progress bar. Owns its own help-text reveal state.
export default function FactorInfo({ label, help, score, color }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card-soft rounded-card border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-ink">{label}</span>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={label}
            className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-xs font-semibold text-muted transition-colors hover:border-primary hover:text-primary"
          >
            ?
          </button>
        </div>
        <span className="text-sm font-semibold" style={{ color }}>
          {score}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-primary-soft">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={false}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden text-sm text-muted"
          >
            {help}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
