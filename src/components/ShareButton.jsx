"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n";

async function dataUrlToFile(dataUrl, fileName) {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: "image/png" });
}

export default function ShareButton({ captureRef, shareText, shareUrl, fileName }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const handleShareLink = async () => {
    const payload = { title: t("app.title"), text: shareText, url: shareUrl };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // Cancelled or unsupported — fall back to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — nothing more we can do silently.
    }
  };

  const handleShareImage = async () => {
    if (!captureRef?.current) return;
    const { toPng } = await import("html-to-image");
    try {
      const dataUrl = await toPng(captureRef.current, {
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });
      const file = await dataUrlToFile(dataUrl, `${fileName}.png`);
      if (
        typeof navigator !== "undefined" &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: t("app.title"), text: shareText });
        return;
      }
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}.png`;
      link.click();
    } catch {
      // Image generation failed — leave the UI untouched.
    }
  };

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleShareLink}
        className="rounded-control border border-border px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-soft"
      >
        {copied ? t("share.copied") : t("share.button")}
      </button>
      <button
        type="button"
        onClick={handleShareImage}
        className="rounded-control border border-border px-3 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-primary-soft"
      >
        {t("share.image")}
      </button>
    </div>
  );
}
