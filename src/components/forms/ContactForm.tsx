"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/provider";
import { isValidEgPhone, isValidEmail } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { api } from "@/services/api";
import { Icon } from "../ui/Icon";
import { SelectField, TextField } from "./Field";

type Values = { name: string; phone: string; email: string; type: string; orderNumber: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;

export function ContactForm({ defaultType = "product" }: { defaultType?: string }) {
  const { dict, locale } = useI18n();
  const c = dict.contact;
  const [v, setV] = useState<Values>({ name: "", phone: "", email: "", type: defaultType, orderNumber: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback">("idle");

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setV((s) => ({ ...s, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const validate = () => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = dict.common.fieldRequired;
    if (!isValidEgPhone(v.phone)) e.phone = dict.common.invalidPhone;
    if (v.email && !isValidEmail(v.email)) e.email = dict.common.invalidEmail;
    if (!v.message.trim()) e.message = dict.common.fieldRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const waText = [
    dict.whatsappMessages.general,
    `${c.name}: ${v.name}`,
    `${c.phone}: ${v.phone}`,
    v.email ? `${c.email}: ${v.email}` : null,
    `${c.type}: ${c.types[v.type as keyof typeof c.types]}`,
    v.orderNumber ? `${c.orderNumber}: ${v.orderNumber}` : null,
    "",
    v.message,
  ]
    .filter((x) => x !== null)
    .join("\n");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("form [aria-invalid=true]")?.focus());
      return;
    }
    setState("sending");
    const res = await api.contact({ ...v, locale });
    setState(res.ok ? "done" : "fallback");
  };

  if (state === "done") {
    return (
      <div className="flex min-h-[420px] flex-col items-start justify-center gap-6" role="status">
        <span className="grid size-14 place-items-center rounded-full bg-success text-ivory">
          <Icon name="check" size={24} />
        </span>
        <p className="font-display text-h2 max-w-md">{c.success}</p>
        <button
          type="button"
          className="link-line text-sm"
          onClick={() => {
            setV((s) => ({ ...s, message: "", orderNumber: "" }));
            setState("idle");
          }}
        >
          {c.formTitle}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
      <TextField label={c.name} name="name" autoComplete="name" required value={v.name} onChange={set("name")} error={errors.name} />
      <TextField label={c.phone} name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required value={v.phone} onChange={set("phone")} error={errors.phone} placeholder="01x xxxx xxxx" />
      <TextField label={c.email} name="email" type="email" inputMode="email" autoComplete="email" dir="ltr" value={v.email} onChange={set("email")} error={errors.email} optionalLabel={dict.common.optional} />
      <SelectField label={c.type} name="type" value={v.type} onChange={set("type")}>
        {Object.entries(c.types).map(([k, label]) => (
          <option key={k} value={k}>
            {label}
          </option>
        ))}
      </SelectField>
      {v.type === "order" && (
        <TextField label={c.orderNumber} name="orderNumber" dir="ltr" value={v.orderNumber} onChange={set("orderNumber")} className="sm:col-span-2" placeholder="SM-XXXXXX-XXXXX" />
      )}
      <TextField label={c.message} name="message" multiline rows={5} required value={v.message} onChange={set("message")} error={errors.message} className="sm:col-span-2" />

      {state === "fallback" ? (
        <div className="border-s-2 border-bronze bg-paper p-5 sm:col-span-2" role="status">
          <p className="text-sm leading-relaxed text-ink">{c.whatsappFallback}</p>
          <a href={whatsappLink(waText)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-5">
            <Icon name="whatsapp" size={18} /> {dict.custom.sendWhatsapp}
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={state === "sending"}>
            {state === "sending" ? c.sending : c.send}
            <Icon name="arrow" size={16} className="flip-rtl" />
          </button>
          <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-mute hover:text-charcoal">
            <Icon name="whatsapp" size={16} /> {dict.common.chatWhatsapp}
          </a>
        </div>
      )}
    </form>
  );
}
