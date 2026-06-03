"use client";

import { createContext, useContext, useEffect, useState } from "react";

const LANGUAGE_KEY = "should-i-buy-it/language";

const en = {
  "app.title": "Should I buy it?",
  "app.tagline": "A calm second opinion before you spend.",
  "lang.label": "Language",

  "mode.single": "One item",
  "mode.compare": "Compare",

  "input.title": "The item",
  "input.subtitle": "Tell us a little about what you're considering.",
  "input.name.label": "What are you thinking of buying?",
  "input.name.placeholder": "e.g. a new pair of headphones",
  "input.price": "Price",
  "input.income": "Monthly income",
  "input.expenses": "Monthly expenses",
  "input.frequency.label": "How often do you pay?",
  "freq.once": "One-time",
  "freq.monthly": "Monthly",
  "freq.yearly": "Yearly",
  "input.installment.toggle": "Paying in installments (cicilan)?",
  "input.installment.months": "Number of months",
  "input.installment.interest": "Interest / fees (%)",
  "input.reason.label": "Why do you want it? (optional)",
  "input.reason.placeholder": "e.g. my old one broke",
  "input.impulse": "How long have you wanted it?",
  "input.impact": "How much will it help you work, earn, or live better?",

  "impulse.now": "Just saw it",
  "impulse.days": "A few days",
  "impulse.weeks": "Weeks or more",
  "impact.high": "A lot — daily use / helps me earn",
  "impact.medium": "Somewhat — useful but not essential",
  "impact.low": "A little — mostly a want",

  "tune.title": "Tune what matters to you",
  "tune.subtitle": "Each slider sets how much that factor counts toward your verdict.",
  "tune.intro": "Drag a slider right to make that factor matter more. The percentages always add up to 100%.",
  "tune.reset": "Reset to defaults",
  "tune.less": "Less",
  "tune.more": "More",

  "factor.affordability": "Affordability",
  "factor.budgetFit": "Budget fit",
  "factor.productiveImpact": "Productive impact",
  "factor.impulseCheck": "Impulse check",
  "factorHelp.affordability": "How big this is compared with your monthly income.",
  "factorHelp.budgetFit": "How big this is compared with the money you have left after expenses.",
  "factorHelp.productiveImpact": "How much real use or value it adds to your life.",
  "factorHelp.impulseCheck": "Purchases you've considered longer score higher than spur-of-the-moment ones.",

  "verdict.placeholderTitle": "Your verdict will appear here",
  "verdict.eyebrow": "Verdict",
  "verdict.buy.label": "Buy it",
  "verdict.fine.label": "Probably fine",
  "verdict.wait.label": "Wait on it",
  "verdict.skip.label": "Skip it",
  "verdict.buy.line": "This looks like a comfortable, worthwhile buy.",
  "verdict.fine.line": "Reasonable. If you want it, it should be okay.",
  "verdict.wait.line": "No rush. Give it a little time before deciding.",
  "verdict.skip.line": "This one looks like more strain than it's worth.",

  "hint.price": "Enter a price to see your verdict.",
  "hint.income": "Add your monthly income so we can weigh it up.",
  "hint.weights": "Give at least one factor some weight to get a verdict.",

  "reframe.once": "{price} is about {percent}% of your monthly income — roughly {days} {dayLabel} of earnings.",
  "reframe.recurring": "{price} per month is about {percent}% of your monthly income.",
  "target.once": "A price around {price} would move this to “Probably fine”.",
  "target.recurring": "Around {price} per month would move this to “Probably fine”.",
  "months.save": "Save for about {months} {monthLabel} and this fits comfortably.",
  "installment.note": "About {amount} per month for {months} months — {total} in total.",

  "day": "day",
  "days": "days",
  "month": "month",
  "months": "months",
  "item": "item",
  "items": "items",

  "breakdown.title": "Why this verdict",
  "breakdown.subtitle": "Every factor is shown — no black box.",

  "invest.eyebrow": "Or invest it instead",
  "invest.title": "What if you held off?",
  "invest.subtitle": "See what this money could become if you invested it instead.",
  "invest.rate": "Yearly return",
  "invest.horizon": "Time horizon",
  "invest.yrShort": "{n} yr",
  "invest.years": "{n} years",
  "invest.lump": "Invest {amount} at {rate}%/yr and in {years} it could become {future}.",
  "invest.recurring": "Invest {amount}/month at {rate}%/yr and in {years} you'd have {future} (you'd put in {contributed}).",
  "invest.gain": "That's a potential gain of {gain}.",
  "invest.framing": "Holding off could be worth {gain} to you in {years}.",
  "invest.hint": "Enter a price to see what investing it could earn.",

  "save.button": "Save this decision",
  "save.saved": "Saved",
  "save.hint": "Add an item name and price to save it for later.",

  "saved.title": "Saved decisions",
  "saved.empty": "No saved decisions yet. Save one to give yourself a calm cool-off.",
  "saved.today": "Saved today",
  "saved.yesterday": "Saved yesterday",
  "saved.daysAgo": "Saved {days} days ago",
  "saved.coolOff": "You saved this a week ago — do you still want it?",
  "saved.reasonRecall": "A week ago you said: “{reason}”",
  "saved.stillWant": "Still want it",
  "saved.letItGo": "Let it go",
  "saved.remove": "Remove",

  "letGo.title": "Money you let go",
  "letGo.summary": "You've stepped back from {total} across {count} {itemLabel}.",
  "letGo.thisMonth": "{total} let go this month.",

  "compare.itemA": "Item A",
  "compare.itemB": "Item B",
  "compare.needBoth": "Fill in both items to compare them.",
  "compare.winner": "{name} is the better pick.",
  "compare.tooClose": "Too close to call — both score about the same.",

  "share.button": "Share",
  "share.image": "Save image",
  "share.copied": "Link copied",
  "share.text": "I'm deciding on {name} ({price}). Verdict: {verdict} ({score}/100).",

  "footer.disclaimer": "This is a helpful guide, not financial advice.",
};

const id = {
  "app.title": "Haruskah aku membelinya?",
  "app.tagline": "Pendapat kedua yang menenangkan sebelum kamu belanja.",
  "lang.label": "Bahasa",

  "mode.single": "Satu barang",
  "mode.compare": "Bandingkan",

  "input.title": "Barangnya",
  "input.subtitle": "Ceritakan sedikit tentang yang sedang kamu pertimbangkan.",
  "input.name.label": "Apa yang ingin kamu beli?",
  "input.name.placeholder": "mis. headphone baru",
  "input.price": "Harga",
  "input.income": "Penghasilan bulanan",
  "input.expenses": "Pengeluaran bulanan",
  "input.frequency.label": "Seberapa sering kamu membayar?",
  "freq.once": "Sekali bayar",
  "freq.monthly": "Bulanan",
  "freq.yearly": "Tahunan",
  "input.installment.toggle": "Bayar dengan cicilan?",
  "input.installment.months": "Jumlah bulan",
  "input.installment.interest": "Bunga / biaya (%)",
  "input.reason.label": "Kenapa kamu menginginkannya? (opsional)",
  "input.reason.placeholder": "mis. yang lama sudah rusak",
  "input.impulse": "Sudah berapa lama kamu menginginkannya?",
  "input.impact": "Seberapa besar ini membantu kamu bekerja, menghasilkan, atau hidup lebih baik?",

  "impulse.now": "Baru saja melihatnya",
  "impulse.days": "Beberapa hari",
  "impulse.weeks": "Berminggu-minggu atau lebih",
  "impact.high": "Banyak — dipakai harian / membantu menghasilkan",
  "impact.medium": "Lumayan — berguna tapi tidak penting",
  "impact.low": "Sedikit — lebih ke keinginan",

  "tune.title": "Atur apa yang penting bagimu",
  "tune.subtitle": "Tiap penggeser menentukan seberapa besar faktor itu memengaruhi putusanmu.",
  "tune.intro": "Geser ke kanan agar faktor itu lebih berpengaruh. Persentasenya selalu berjumlah 100%.",
  "tune.reset": "Kembalikan ke awal",
  "tune.less": "Kurang",
  "tune.more": "Lebih",

  "factor.affordability": "Keterjangkauan",
  "factor.budgetFit": "Kecocokan anggaran",
  "factor.productiveImpact": "Dampak produktif",
  "factor.impulseCheck": "Cek impulsif",
  "factorHelp.affordability": "Seberapa besar ini dibanding penghasilan bulananmu.",
  "factorHelp.budgetFit": "Seberapa besar ini dibanding sisa uangmu setelah pengeluaran.",
  "factorHelp.productiveImpact": "Seberapa besar kegunaan atau nilainya bagi hidupmu.",
  "factorHelp.impulseCheck": "Pembelian yang dipikirkan lebih lama bernilai lebih tinggi daripada yang mendadak.",

  "verdict.placeholderTitle": "Putusanmu akan muncul di sini",
  "verdict.eyebrow": "Putusan",
  "verdict.buy.label": "Beli saja",
  "verdict.fine.label": "Sepertinya oke",
  "verdict.wait.label": "Tunda dulu",
  "verdict.skip.label": "Lewati saja",
  "verdict.buy.line": "Ini terlihat seperti pembelian yang nyaman dan layak.",
  "verdict.fine.line": "Masuk akal. Kalau kamu mau, sepertinya tidak masalah.",
  "verdict.wait.line": "Tidak perlu buru-buru. Beri sedikit waktu sebelum memutuskan.",
  "verdict.skip.line": "Yang ini terlihat lebih membebani daripada manfaatnya.",

  "hint.price": "Masukkan harga untuk melihat putusanmu.",
  "hint.income": "Tambahkan penghasilan bulananmu agar bisa kami timbang.",
  "hint.weights": "Beri bobot pada setidaknya satu faktor untuk mendapat putusan.",

  "reframe.once": "{price} kira-kira {percent}% dari penghasilan bulananmu — sekitar {days} {dayLabel} penghasilan.",
  "reframe.recurring": "{price} per bulan kira-kira {percent}% dari penghasilan bulananmu.",
  "target.once": "Harga sekitar {price} akan membuatnya jadi “Sepertinya oke”.",
  "target.recurring": "Sekitar {price} per bulan akan membuatnya jadi “Sepertinya oke”.",
  "months.save": "Menabung sekitar {months} {monthLabel} dan ini akan terasa nyaman.",
  "installment.note": "Sekitar {amount} per bulan selama {months} bulan — total {total}.",

  "day": "hari",
  "days": "hari",
  "month": "bulan",
  "months": "bulan",
  "item": "barang",
  "items": "barang",

  "breakdown.title": "Kenapa putusan ini",
  "breakdown.subtitle": "Semua faktor ditampilkan — tanpa kotak hitam.",

  "invest.eyebrow": "Atau investasikan saja",
  "invest.title": "Bagaimana kalau ditahan dulu?",
  "invest.subtitle": "Lihat uang ini bisa jadi berapa kalau kamu investasikan.",
  "invest.rate": "Imbal hasil per tahun",
  "invest.horizon": "Jangka waktu",
  "invest.yrShort": "{n} thn",
  "invest.years": "{n} tahun",
  "invest.lump": "Investasikan {amount} dengan {rate}%/tahun dan dalam {years} bisa menjadi {future}.",
  "invest.recurring": "Investasikan {amount}/bulan dengan {rate}%/tahun dan dalam {years} kamu punya {future} (modalmu {contributed}).",
  "invest.gain": "Itu potensi keuntungan {gain}.",
  "invest.framing": "Menahan diri bisa bernilai {gain} bagimu dalam {years}.",
  "invest.hint": "Masukkan harga untuk melihat hasil jika diinvestasikan.",

  "save.button": "Simpan keputusan ini",
  "save.saved": "Tersimpan",
  "save.hint": "Tambahkan nama barang dan harga untuk menyimpannya.",

  "saved.title": "Keputusan tersimpan",
  "saved.empty": "Belum ada keputusan tersimpan. Simpan satu untuk memberi dirimu waktu menenangkan diri.",
  "saved.today": "Disimpan hari ini",
  "saved.yesterday": "Disimpan kemarin",
  "saved.daysAgo": "Disimpan {days} hari lalu",
  "saved.coolOff": "Kamu menyimpan ini seminggu lalu — apakah masih menginginkannya?",
  "saved.reasonRecall": "Seminggu lalu kamu berkata: “{reason}”",
  "saved.stillWant": "Masih mau",
  "saved.letItGo": "Lepaskan saja",
  "saved.remove": "Hapus",

  "letGo.title": "Uang yang kamu lepaskan",
  "letGo.summary": "Kamu sudah mundur dari {total} pada {count} {itemLabel}.",
  "letGo.thisMonth": "{total} dilepaskan bulan ini.",

  "compare.itemA": "Barang A",
  "compare.itemB": "Barang B",
  "compare.needBoth": "Isi kedua barang untuk membandingkannya.",
  "compare.winner": "{name} pilihan yang lebih baik.",
  "compare.tooClose": "Sulit dibedakan — keduanya hampir sama.",

  "share.button": "Bagikan",
  "share.image": "Simpan gambar",
  "share.copied": "Tautan disalin",
  "share.text": "Aku sedang memutuskan {name} ({price}). Putusan: {verdict} ({score}/100).",

  "footer.disclaimer": "Ini panduan yang membantu, bukan nasihat keuangan.",
};

export const translations = { en, id };

function interpolate(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in params ? String(params[key]) : match,
  );
}

const LanguageContext = createContext({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(LANGUAGE_KEY);
      if (stored === "en" || stored === "id") setLang(stored);
    } catch {
      // Storage unavailable — stay on the default language.
    }
  }, []);

  const changeLang = (next) => {
    setLang(next);
    try {
      window.localStorage.setItem(LANGUAGE_KEY, next);
    } catch {
      // Ignore write failures.
    }
  };

  const t = (key, params) => {
    const value = translations[lang]?.[key] ?? translations.en[key] ?? key;
    return interpolate(value, params);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
