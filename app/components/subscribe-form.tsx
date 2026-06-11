"use client";

import { useState } from "react";
import { LocalizedText, useLanguage } from "./language";

type SubscriptionStatus = "idle" | "submitting" | "success" | "error" | "unavailable";

type Props = {
  source: string;
  compact?: boolean;
};

export function SubscribeForm({ source, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscriptionStatus>("idle");
  const { language } = useLanguage();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("submitting");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          website: form.get("website"),
        }),
      });

      if (response.ok) {
        setEmail("");
        setStatus("success");
        return;
      }

      setStatus(response.status === 502 || response.status === 503 ? "unavailable" : "error");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`mx-auto flex w-full ${
        compact ? "max-w-xl flex-col gap-3 sm:flex-row" : "max-w-2xl flex-col gap-4 sm:flex-row"
      }`}
    >
      <label className="sr-only" htmlFor={`email-${source}`}>
        <LocalizedText en="Email address" zh="邮箱地址" />
      </label>
      <input
        id={`email-${source}`}
        name="email"
        type="email"
        autoComplete="email"
        inputMode="email"
        required
        maxLength={254}
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setStatus("idle");
        }}
        placeholder="you@example.com"
        className="min-h-12 flex-1 rounded-lg border border-zinc-700 bg-black/40 px-4 text-sm text-zinc-100 outline-none duration-200 placeholder:text-zinc-600 focus:border-zinc-300"
      />
      <input
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 rounded-lg border border-zinc-500 px-5 text-sm font-medium text-zinc-200 duration-200 hover:border-zinc-200 hover:text-white disabled:cursor-wait disabled:opacity-60"
      >
        {status === "submitting" ? (
          <LocalizedText en="Submitting..." zh="提交中..." />
        ) : (
          <LocalizedText en="Subscribe" zh="订阅" />
        )}
      </button>
      <div className="sm:basis-full" aria-live="polite">
        {status === "success" ? (
          <p className="text-sm text-zinc-300">
            <LocalizedText
              en="Thanks. Your subscription has been confirmed."
              zh="谢谢，你的订阅已确认。"
            />
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-zinc-400">
            <LocalizedText
              en="Please check your email address and try again."
              zh="请检查邮箱地址后重试。"
            />
          </p>
        ) : null}
        {status === "unavailable" ? (
          <p className="text-sm text-zinc-400">
            {language === "zh"
              ? "订阅服务暂未配置或暂时不可用，请稍后再试。"
              : "The subscription service is not configured or is temporarily unavailable."}
          </p>
        ) : null}
      </div>
    </form>
  );
}
