"use client";

import { useMemo, useState } from "react";
import { LocalizedText } from "./language";

type SubscriptionStatus = "idle" | "success" | "error";

type Props = {
  source: string;
  compact?: boolean;
};

export function SubscribeForm({ source, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubscriptionStatus>("idle");

  const subscription = useMemo(
    () => ({
      email,
      source,
      createdAt: new Date().toISOString(),
      status,
    }),
    [email, source, status],
  );

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setStatus("error");
      return;
    }

    console.info("Subscription prepared for future email service", subscription);
    setStatus("success");
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
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setStatus("idle");
        }}
        placeholder="you@example.com"
        className="min-h-12 flex-1 rounded-lg border border-zinc-700 bg-black/40 px-4 text-sm text-zinc-100 outline-none duration-200 placeholder:text-zinc-600 focus:border-zinc-300"
      />
      <button
        type="submit"
        className="min-h-12 rounded-lg border border-zinc-500 px-5 text-sm font-medium text-zinc-200 duration-200 hover:border-zinc-200 hover:text-white"
      >
        <LocalizedText en="Subscribe" zh="订阅" />
      </button>
      <div className="sm:basis-full">
        {status === "success" ? (
          <p className="text-sm text-zinc-300">
            <LocalizedText
              en="Thanks. Your subscription is queued for the future email service."
              zh="谢谢。你的订阅已记录，后续可接入正式邮件服务。"
            />
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-zinc-400">
            <LocalizedText en="Please enter a valid email address." zh="请输入有效的邮箱地址。" />
          </p>
        ) : null}
      </div>
    </form>
  );
}
