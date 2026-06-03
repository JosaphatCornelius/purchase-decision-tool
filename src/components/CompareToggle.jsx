"use client";

import { useTranslation } from "@/lib/i18n";

const MODES = [
  { value: "single", key: "mode.single" },
  { value: "compare", key: "mode.compare" },
];

export default function CompareToggle({ mode, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="inline-flex rounded-control border border-border bg-surface p-0.5">
      {MODES.map((option) => {
        const active = mode === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            className={`rounded-[6px] px-3 py-1.5 text-sm font-semibold transition-colors ${
              active ? "bg-primary-soft text-primary" : "text-muted hover:text-ink"
            }`}
          >
            {t(option.key)}
          </button>
        );
      })}
    </div>
  );
}
