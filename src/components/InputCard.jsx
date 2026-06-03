"use client";

import CurrencyInput from "@/components/CurrencyInput";
import { useTranslation } from "@/lib/i18n";
import { FREQUENCY_OPTIONS, IMPACT_OPTIONS, IMPULSE_OPTIONS } from "@/lib/scoring";

const selectClasses =
  "w-full rounded-control border border-border bg-surface px-3 py-2.5 text-[15px] text-ink outline-none focus:border-primary";

const numberClasses =
  "w-full rounded-control border border-border bg-surface px-3 py-2.5 text-[15px] text-ink outline-none placeholder:text-muted focus:border-primary";

function parsePositiveInt(raw) {
  const digits = String(raw).replace(/\D/g, "");
  return digits === "" ? NaN : Number(digits);
}

export default function InputCard({ item, onChange, idPrefix, title, subtitle }) {
  const { t } = useTranslation();
  const update = (key) => (next) => onChange({ ...item, [key]: next });
  const showInstallment = item.frequency === "once";

  return (
    <section className="card-soft rounded-card border border-border bg-surface p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}

      <div className="mt-5 space-y-4">
        <label htmlFor={`${idPrefix}-name`} className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            {t("input.name.label")}
          </span>
          <input
            id={`${idPrefix}-name`}
            type="text"
            value={item.name}
            placeholder={t("input.name.placeholder")}
            onChange={(event) => update("name")(event.target.value)}
            className={numberClasses}
          />
        </label>

        <CurrencyInput
          id={`${idPrefix}-price`}
          label={t("input.price")}
          value={item.price}
          onChange={update("price")}
          placeholder="0"
        />

        <div>
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            {t("input.frequency.label")}
          </span>
          <div className="inline-flex w-full rounded-control border border-border bg-surface p-0.5">
            {FREQUENCY_OPTIONS.map((value) => {
              const active = item.frequency === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => update("frequency")(value)}
                  aria-pressed={active}
                  className={`flex-1 rounded-[6px] px-2 py-1.5 text-sm font-semibold transition-colors ${
                    active ? "bg-primary-soft text-primary" : "text-muted hover:text-ink"
                  }`}
                >
                  {t(`freq.${value}`)}
                </button>
              );
            })}
          </div>
        </div>

        {showInstallment ? (
          <div className="rounded-control border border-border p-3">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={item.installmentOn}
                onChange={(event) => update("installmentOn")(event.target.checked)}
                className="h-4 w-4 accent-[var(--primary)]"
              />
              <span className="text-sm font-semibold text-ink">
                {t("input.installment.toggle")}
              </span>
            </label>

            {item.installmentOn ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label htmlFor={`${idPrefix}-months`} className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink">
                    {t("input.installment.months")}
                  </span>
                  <input
                    id={`${idPrefix}-months`}
                    type="text"
                    inputMode="numeric"
                    value={Number.isFinite(item.installmentMonths) ? item.installmentMonths : ""}
                    placeholder="12"
                    onChange={(event) =>
                      update("installmentMonths")(parsePositiveInt(event.target.value))
                    }
                    className={numberClasses}
                  />
                </label>
                <label htmlFor={`${idPrefix}-interest`} className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink">
                    {t("input.installment.interest")}
                  </span>
                  <input
                    id={`${idPrefix}-interest`}
                    type="text"
                    inputMode="numeric"
                    value={Number.isFinite(item.installmentInterest) ? item.installmentInterest : ""}
                    placeholder="0"
                    onChange={(event) =>
                      update("installmentInterest")(parsePositiveInt(event.target.value))
                    }
                    className={numberClasses}
                  />
                </label>
              </div>
            ) : null}
          </div>
        ) : null}

        <label htmlFor={`${idPrefix}-impulse`} className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">{t("input.impulse")}</span>
          <select
            id={`${idPrefix}-impulse`}
            value={item.impulse}
            onChange={(event) => update("impulse")(event.target.value)}
            className={selectClasses}
          >
            {IMPULSE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`impulse.${option.value}`)}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor={`${idPrefix}-impact`} className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">{t("input.impact")}</span>
          <select
            id={`${idPrefix}-impact`}
            value={item.impact}
            onChange={(event) => update("impact")(event.target.value)}
            className={selectClasses}
          >
            {IMPACT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`impact.${option.value}`)}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor={`${idPrefix}-reason`} className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            {t("input.reason.label")}
          </span>
          <input
            id={`${idPrefix}-reason`}
            type="text"
            value={item.reason}
            placeholder={t("input.reason.placeholder")}
            onChange={(event) => update("reason")(event.target.value)}
            className={numberClasses}
          />
        </label>
      </div>
    </section>
  );
}
