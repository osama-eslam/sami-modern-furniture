"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { fmt } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/format";
import { normalizePhone } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { api } from "@/services/api";
import { ordersStore } from "@/store/stores";
import type { Order } from "@/types/commerce";
import { TextField } from "../forms/Field";
import { Icon } from "../ui/Icon";
import { OrderLines, StatusTimeline, formatAddress } from "./order-bits";

/** Matches an order stored on this device by number + phone or email. */
const localLookup = (number: string, contact: string): Order | undefined => {
  const n = number.trim().toUpperCase();
  const c = contact.trim().toLowerCase();
  return ordersStore.get().orders.find((o) => {
    if (o.number.toUpperCase() !== n) return false;
    if (c.includes("@")) return o.customer.email?.toLowerCase() === c;
    return normalizePhone(c) === o.customer.phone;
  });
};

export function TrackOrderView() {
  const { dict, locale } = useI18n();
  const initial = useSearchParams().get("order") ?? "";
  const [number, setNumber] = useState(initial);
  const [contact, setContact] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "found" | "missing">("idle");
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<{ number?: string; contact?: string }>({});

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = { number: number.trim() ? undefined : dict.common.fieldRequired, contact: contact.trim() ? undefined : dict.common.fieldRequired };
    setErrors(errs);
    if (errs.number || errs.contact) return;
    setState("loading");
    const res = await api.trackOrder(number.trim(), contact.trim());
    const found = res.ok ? res.data.order : localLookup(number, contact);
    setOrder(found ?? null);
    setState(found ? "found" : "missing");
  };

  const last = order?.history[order.history.length - 1];

  return (
    <div className="container-x grid gap-14 pb-28 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <form onSubmit={submit} noValidate className="border-t border-charcoal pt-8">
          <div className="grid gap-8">
            <TextField label={dict.track.number} value={number} onChange={(e) => setNumber(e.target.value)} error={errors.number} required dir="ltr" placeholder="SM-XXXXXX-XXXXX" autoCapitalize="characters" inputClassName="uppercase" />
            <TextField label={dict.track.contact} value={contact} onChange={(e) => setContact(e.target.value)} error={errors.contact} required dir="ltr" autoComplete="tel" />
          </div>
          <button type="submit" className="btn btn-primary mt-10 w-full sm:w-auto" disabled={state === "loading"}>
            {state === "loading" ? dict.common.loading : dict.track.submit}
            <Icon name="search" size={16} />
          </button>
        </form>
        <div className="mt-12 flex items-center gap-4 border-t hairline pt-6 text-sm">
          <span className="text-mute">{dict.track.help}</span>
          <a href={whatsappLink(number ? fmt(dict.whatsappMessages.order, { order: number }) : dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="link-line">
            <Icon name="whatsapp" size={16} /> {dict.nav.whatsapp}
          </a>
        </div>
      </div>

      <div className="lg:col-span-7" aria-live="polite">
        {state === "missing" && (
          <div className="border-s-2 border-bronze bg-paper p-6" style={{ animation: "fade-up .6s cubic-bezier(.16,1,.3,1) both" }}>
            <p className="leading-relaxed">{dict.track.notFound}</p>
            <a href={whatsappLink(fmt(dict.whatsappMessages.order, { order: number }))} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm mt-5">
              <Icon name="whatsapp" size={16} /> {dict.common.chatWhatsapp}
            </a>
          </div>
        )}
        {state === "found" && order && (
          <article className="bg-paper p-6 md:p-10" style={{ animation: "fade-up .7s cubic-bezier(.16,1,.3,1) both" }}>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b hairline pb-6">
              <div>
                <p className="text-xs text-mute">{dict.success.number}</p>
                <p className="num mt-1 text-2xl font-light">{order.number}</p>
              </div>
              <div className="text-end text-xs text-mute">
                <p>{dict.account.orderDate}</p>
                <p className="num mt-1 text-sm text-charcoal">{formatDate(order.createdAt, locale)}</p>
              </div>
            </div>
            <p className="mt-6 text-sm">
              <span className="text-mute">{dict.success.status}: </span>
              <span className="font-medium">{dict.status[order.status]}</span>
              {last && <span className="num ms-2 text-xs text-mute">· {dict.track.lastUpdate} {formatDate(last.at, locale, true)}</span>}
            </p>
            <div className="mt-8">
              <StatusTimeline order={order} />
            </div>
            <div className="mt-10 border-t hairline pt-6 text-sm">
              <p className="eyebrow mb-2 text-mute">{dict.success.address}</p>
              <p className="leading-relaxed">{formatAddress(order.address, locale)}</p>
            </div>
            <div className="mt-8">
              <OrderLines order={order} />
            </div>
          </article>
        )}
        {state === "idle" && (
          <div className="hidden h-full min-h-[320px] place-items-center border border-dashed border-line-strong text-mute lg:grid">
            <Icon name="box" size={48} strokeWidth={0.8} />
          </div>
        )}
      </div>
    </div>
  );
}
