"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CompareToggle from "@/components/CompareToggle";
import LanguageToggle from "@/components/LanguageToggle";
import FinancialsCard from "@/components/FinancialsCard";
import InputCard from "@/components/InputCard";
import TuneCard from "@/components/TuneCard";
import VerdictCard from "@/components/VerdictCard";
import Breakdown from "@/components/Breakdown";
import InvestmentCard from "@/components/InvestmentCard";
import MoneyLetGo from "@/components/MoneyLetGo";
import SavedDecisions from "@/components/SavedDecisions";
import { formatIDR } from "@/lib/format";
import { useTranslation } from "@/lib/i18n";
import {
  DEFAULT_WEIGHTS,
  FREQUENCY_OPTIONS,
  IMPACT_OPTIONS,
  IMPULSE_OPTIONS,
  computeDecision,
  findTargetPrice,
  monthsToAfford,
  optionScore,
  totalCostOf,
} from "@/lib/scoring";

const KEYS = {
  financials: "should-i-buy-it/financials",
  weights: "should-i-buy-it/weights",
  decisions: "should-i-buy-it/decisions",
  letGo: "should-i-buy-it/letGo",
  investment: "should-i-buy-it/investment",
};

const DEFAULT_INVESTMENT = { rate: 6, years: 5 };

const DEFAULT_ITEM = {
  name: "",
  price: NaN,
  frequency: "once",
  installmentOn: false,
  installmentMonths: NaN,
  installmentInterest: 0,
  impulse: "days",
  impact: "medium",
  reason: "",
};

const COMPARE_TIE_GAP = 5;

function readStorage(key, fallback) {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures (private mode / quota).
  }
}

function installmentOf(item) {
  return {
    on: item.installmentOn,
    months: item.installmentMonths,
    interestPct: item.installmentInterest,
  };
}

function decisionInputs(item, financials, weights) {
  return {
    price: item.price,
    frequency: item.frequency,
    installment: installmentOf(item),
    income: financials.income,
    expenses: financials.expenses,
    impactScore: optionScore(IMPACT_OPTIONS, item.impact),
    impulseScore: optionScore(IMPULSE_OPTIONS, item.impulse),
    weights,
  };
}

function encodeShare(item, financials, weights) {
  const params = new URLSearchParams();
  if (item.name) params.set("n", item.name);
  if (Number.isFinite(item.price)) params.set("p", String(item.price));
  params.set("f", item.frequency);
  if (item.installmentOn) {
    params.set("io", "1");
    if (Number.isFinite(item.installmentMonths)) params.set("im", String(item.installmentMonths));
    if (Number.isFinite(item.installmentInterest))
      params.set("ii", String(item.installmentInterest));
  }
  params.set("u", item.impulse);
  params.set("m", item.impact);
  if (Number.isFinite(financials.income)) params.set("inc", String(financials.income));
  if (Number.isFinite(financials.expenses)) params.set("exp", String(financials.expenses));
  params.set(
    "w",
    `${weights.affordability}-${weights.budgetFit}-${weights.productiveImpact}-${weights.impulseCheck}`,
  );
  return params.toString();
}

function decodeShare(search) {
  const params = new URLSearchParams(search);
  if (!params.has("p") && !params.has("n")) return null;
  const num = (key) => {
    const value = params.get(key);
    return value == null || value === "" ? NaN : Number(value);
  };
  const interest = num("ii");
  const item = {
    ...DEFAULT_ITEM,
    name: params.get("n") ?? "",
    price: num("p"),
    frequency: FREQUENCY_OPTIONS.includes(params.get("f")) ? params.get("f") : "once",
    installmentOn: params.get("io") === "1",
    installmentMonths: num("im"),
    installmentInterest: Number.isFinite(interest) ? interest : 0,
    impulse: params.get("u") ?? "days",
    impact: params.get("m") ?? "medium",
  };
  const financials = { income: num("inc"), expenses: num("exp") };
  let weights = null;
  const raw = params.get("w");
  if (raw) {
    const parts = raw.split("-").map(Number);
    if (parts.length === 4 && parts.every(Number.isFinite)) {
      weights = {
        affordability: parts[0],
        budgetFit: parts[1],
        productiveImpact: parts[2],
        impulseCheck: parts[3],
      };
    }
  }
  return { item, financials, weights };
}

export default function Home() {
  const { t } = useTranslation();
  const [mode, setMode] = useState("single");
  const [financials, setFinancials] = useState({ income: NaN, expenses: NaN });
  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [items, setItems] = useState({ a: DEFAULT_ITEM, b: DEFAULT_ITEM });
  const [saved, setSaved] = useState([]);
  const [letGo, setLetGo] = useState([]);
  const [investment, setInvestment] = useState(DEFAULT_INVESTMENT);
  const [now, setNow] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const loaded = useRef(false);

  useEffect(() => {
    setNow(Date.now());
    setFinancials(readStorage(KEYS.financials, { income: NaN, expenses: NaN }));
    setWeights(readStorage(KEYS.weights, DEFAULT_WEIGHTS));
    setSaved(readStorage(KEYS.decisions, []));
    setLetGo(readStorage(KEYS.letGo, []));
    setInvestment(readStorage(KEYS.investment, DEFAULT_INVESTMENT));

    const shared = decodeShare(window.location.search);
    if (shared) {
      setItems((current) => ({ ...current, a: shared.item }));
      if (Number.isFinite(shared.financials.income) || Number.isFinite(shared.financials.expenses)) {
        setFinancials(shared.financials);
      }
      if (shared.weights) setWeights(shared.weights);
    }
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (loaded.current) writeStorage(KEYS.financials, financials);
  }, [financials]);
  useEffect(() => {
    if (loaded.current) writeStorage(KEYS.weights, weights);
  }, [weights]);
  useEffect(() => {
    if (loaded.current) writeStorage(KEYS.decisions, saved);
  }, [saved]);
  useEffect(() => {
    if (loaded.current) writeStorage(KEYS.letGo, letGo);
  }, [letGo]);
  useEffect(() => {
    if (loaded.current) writeStorage(KEYS.investment, investment);
  }, [investment]);

  const setItem = (slot) => (next) => setItems((current) => ({ ...current, [slot]: next }));

  const buildView = (item) => {
    const inputs = decisionInputs(item, financials, weights);
    const decision = computeDecision(inputs);
    const lines = {};

    if (item.installmentOn && item.installmentMonths > 0 && Number.isFinite(item.price) && item.price > 0) {
      const total = totalCostOf({ price: item.price, installment: installmentOf(item) });
      lines.installmentLine = t("installment.note", {
        amount: formatIDR(total / item.installmentMonths),
        months: item.installmentMonths,
        total: formatIDR(total),
      });
    }

    if (decision.ready) {
      const recurring = item.frequency !== "once" || item.installmentOn;
      const percent = Math.round((decision.assessmentCost / financials.income) * 100);
      if (recurring) {
        lines.reframe = t("reframe.recurring", {
          price: formatIDR(decision.assessmentCost),
          percent,
        });
      } else {
        const days = Math.round(item.price / (financials.income / 30));
        lines.reframe = t("reframe.once", {
          price: formatIDR(item.price),
          percent,
          days,
          dayLabel: t(days === 1 ? "day" : "days"),
        });
      }

      const outOfReach = decision.verdict.key === "wait" || decision.verdict.key === "skip";
      const priceLimited =
        decision.factors.affordability < 55 || decision.factors.budgetFit < 55;
      if (outOfReach && priceLimited) {
        const target = findTargetPrice(inputs);
        if (target) {
          lines.targetLine = t(item.frequency === "monthly" ? "target.recurring" : "target.once", {
            price: formatIDR(target),
          });
        }
        const months = monthsToAfford(inputs);
        if (months) {
          lines.monthsLine = t("months.save", {
            months,
            monthLabel: t(months === 1 ? "month" : "months"),
          });
        }
      }
    }

    return { decision, lines };
  };

  const viewA = useMemo(() => buildView(items.a), [items.a, financials, weights, t]);
  const viewB = useMemo(() => buildView(items.b), [items.b, financials, weights, t]);

  const canSave = viewA.decision.ready && items.a.name.trim().length > 0;

  const buildShare = (item, decision) => {
    if (typeof window === "undefined") return null;
    const query = encodeShare(item, financials, weights);
    const shareUrl = `${window.location.origin}${window.location.pathname}?${query}`;
    const shareText = t("share.text", {
      name: item.name || t("input.title"),
      price: formatIDR(item.price),
      verdict: t(`verdict.${decision.verdict.key}.label`),
      score: decision.finalScore,
    });
    const fileName = (item.name || "should-i-buy-it").replace(/[^\w\s-]/g, "").trim() || "verdict";
    return { shareText, shareUrl, fileName };
  };

  const handleSave = () => {
    if (!canSave) return;
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      itemName: items.a.name.trim(),
      cost: viewA.decision.totalCost,
      score: viewA.decision.finalScore,
      verdictKey: viewA.decision.verdict.key,
      reason: items.a.reason.trim(),
      savedAt: Date.now(),
    };
    setSaved((current) => [entry, ...current]);
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2000);
  };

  const handleRemove = (id) => setSaved((current) => current.filter((item) => item.id !== id));
  const handleKeep = (id) =>
    setSaved((current) =>
      current.map((item) => (item.id === id ? { ...item, savedAt: Date.now() } : item)),
    );
  const handleLetGo = (id) => {
    setSaved((current) => {
      const target = current.find((item) => item.id === id);
      if (target) {
        setLetGo((log) => [
          { id: target.id, itemName: target.itemName, cost: target.cost, letGoAt: Date.now() },
          ...log,
        ]);
      }
      return current.filter((item) => item.id !== id);
    });
  };

  const compareSummary = () => {
    if (!viewA.decision.ready || !viewB.decision.ready) return t("compare.needBoth");
    const gap = Math.abs(viewA.decision.finalScore - viewB.decision.finalScore);
    if (gap < COMPARE_TIE_GAP) return t("compare.tooClose");
    const winner = viewA.decision.finalScore > viewB.decision.finalScore ? items.a : items.b;
    const fallback = winner === items.a ? t("compare.itemA") : t("compare.itemB");
    return t("compare.winner", { name: winner.name.trim() || fallback });
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <header>
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-control bg-primary text-white">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
          </span>
          <LanguageToggle />
        </div>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.02] tracking-tight text-ink sm:text-5xl">
          {t("app.title")}
        </h1>
        <div className="mt-3 h-1.5 w-16 rounded-full bg-primary" />
        <p className="mt-3 text-[15px] text-muted">{t("app.tagline")}</p>
        <div className="mt-5">
          <CompareToggle mode={mode} onChange={setMode} />
        </div>
      </header>

      <div className="mt-8 space-y-5">
        <FinancialsCard financials={financials} onChange={setFinancials} />
        <TuneCard weights={weights} onChange={setWeights} />

        {mode === "single" ? (
          <>
            <InputCard
              item={items.a}
              onChange={setItem("a")}
              idPrefix="a"
              title={t("input.title")}
              subtitle={t("input.subtitle")}
            />
            <VerdictCard
              decision={viewA.decision}
              reframe={viewA.lines.reframe}
              installmentLine={viewA.lines.installmentLine}
              targetLine={viewA.lines.targetLine}
              monthsLine={viewA.lines.monthsLine}
              share={viewA.decision.ready ? buildShare(items.a, viewA.decision) : null}
            />
            {viewA.decision.ready ? <Breakdown factors={viewA.decision.factors} /> : null}

            <InvestmentCard
              item={items.a}
              rate={investment.rate}
              years={investment.years}
              onRate={(rate) => setInvestment((current) => ({ ...current, rate }))}
              onYears={(years) => setInvestment((current) => ({ ...current, years }))}
            />

            <div className="card-soft rounded-card border border-border bg-surface p-5 sm:p-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={!canSave}
                className="w-full rounded-control bg-primary px-4 py-3 text-[15px] font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
              >
                {justSaved ? t("save.saved") : t("save.button")}
              </button>
              {!canSave ? (
                <p className="mt-2 text-center text-sm text-muted">{t("save.hint")}</p>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <div className="grid gap-5 md:grid-cols-2">
              {[
                { slot: "a", item: items.a, view: viewA, label: t("compare.itemA") },
                { slot: "b", item: items.b, view: viewB, label: t("compare.itemB") },
              ].map(({ slot, item, view, label }) => (
                <div key={slot} className="space-y-5">
                  <InputCard item={item} onChange={setItem(slot)} idPrefix={slot} title={label} />
                  <VerdictCard
                    decision={view.decision}
                    reframe={view.lines.reframe}
                    installmentLine={view.lines.installmentLine}
                    targetLine={view.lines.targetLine}
                    monthsLine={view.lines.monthsLine}
                  />
                  {view.decision.ready ? (
                    <Breakdown factors={view.decision.factors} showHeading={false} />
                  ) : null}
                </div>
              ))}
            </div>
            <section className="card-soft rounded-card border border-border bg-primary-soft p-5 text-center">
              <p className="text-[15px] font-semibold text-ink">{compareSummary()}</p>
            </section>
          </>
        )}

        <MoneyLetGo letGo={letGo} now={now} />
        <SavedDecisions
          decisions={saved}
          now={now}
          onLetGo={handleLetGo}
          onRemove={handleRemove}
          onKeep={handleKeep}
        />
      </div>

      <footer className="mt-10 text-center text-sm text-muted">{t("footer.disclaimer")}</footer>
    </main>
  );
}
