"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { isValidEmail } from "@/lib/utils";
import { api } from "@/services/api";
import { Icon } from "../ui/Icon";

export function Newsletter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { dict, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "not_configured" | "error" | "invalid">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email)) return setState("invalid");
    setState("sending");
    const res = await api.subscribe(email, locale);
    if (res.ok) setState("done");
    else setState(res.error === "not_configured" ? "not_configured" : "error");
  };

  const light = tone === "light";
  return (
    <form onSubmit={submit} noValidate className="w-full">
      <label htmlFor={`nl-${tone}`} className="sr-only">{dict.newsletter.placeholder}</label>
      <div className={`flex items-center border-b ${light ? "border-ivory/40 focus-within:border-ivory" : "border-line-strong focus-within:border-charcoal"} transition-colors`}>
        <input
          id={`nl-${tone}`}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== "idle" && state !== "sending") setState("idle");
          }}
          placeholder={dict.newsletter.placeholder}
          aria-invalid={state === "invalid"}
          aria-describedby={`nl-${tone}-msg`}
          className={`min-w-0 flex-1 bg-transparent py-4 text-base outline-none ${light ? "placeholder:text-ivory/40" : "placeholder:text-taupe"}`}
          dir="ltr"
        />
        <button type="submit" disabled={state === "sending"} className="flex items-center gap-2 py-4 ps-4 text-sm font-medium">
          {dict.newsletter.cta}
          <Icon name="arrow" size={16} className="flip-rtl" />
        </button>
      </div>
      <p id={`nl-${tone}-msg`} role="status" className={`mt-3 min-h-5 text-sm ${light ? "text-ivory/70" : "text-mute"}`}>
        {state === "done" && dict.newsletter.success}
        {state === "invalid" && dict.newsletter.invalid}
        {(state === "not_configured" || state === "error") && dict.newsletter.notConfigured}
      </p>
    </form>
  );
}
