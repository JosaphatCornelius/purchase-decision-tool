"use client";

import { useTranslation } from "@/lib/i18n";

const LANGS = [
  { value: "en", label: "EN" },
  { value: "id", label: "ID" },
];

export default function LanguageToggle() {
  const { lang, setLang, t } = useTranslation();

  return (
    <div
      role="group"
      aria-label={t("lang.label")}
      className="inline-flex rounded-control border border-border bg-surface p-0.5"
    >
      {LANGS.map((option) => {
        const active = lang === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLang(option.value)}
            aria-pressed={active}
            className={`rounded-[6px] px-2.5 py-1 text-xs font-semibold transition-colors ${
              active ? "bg-primary-soft text-primary" : "text-muted hover:text-ink"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
