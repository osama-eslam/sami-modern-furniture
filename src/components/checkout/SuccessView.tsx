"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/i18n/provider";
import { formatDate, formatPrice } from "@/lib/format";
import { whatsappLink } from "@/lib/whatsapp";
import { useHydrated } from "@/store/create-store";
import { ordersStore } from "@/store/stores";
import { Icon } from "../ui/Icon";
import { EmptyState } from "../ui/primitives";
import { OrderLines, StatusTimeline, formatAddress, orderWhatsappText, paymentName } from "./order-bits";

export function SuccessView() {
  const { dict, href, locale } = useI18n();
  const hydrated = useHydrated();
  const number = useSearchParams().get("order") ?? "";
  const { orders } = ordersStore.use();
  const order = orders.find((o) => o.number === number);

  if (!hydrated) return <div className="min-h-[70vh]" />;
  if (!order) {
    return (
      <div className="container-x pt-[calc(var(--header-h)+var(--notice-h)+3rem)] pb-24">
        <EmptyState icon="box" title={dict.success.notFound} action={{ href: href("/track-order"), label: dict.success.track }} />
      </div>
    );
  }

  const preview = order.channel === "preview";
  const wa = whatsappLink(orderWhatsappText(order, dict, locale));

  return (
    <>
      <header className="container-x pt-[calc(var(--header-h)+var(--notice-h)+3rem)] pb-12 md:pt-[calc(var(--header-h)+var(--notice-h)+5rem)] md:pb-16">
        <span className="hero-fade grid size-16 place-items-center rounded-full bg-charcoal text-ivory">
          <Icon name="check" size={28} strokeWidth={1.6} />
        </span>
        <p className="eyebrow hero-fade mt-10 text-mute">{dict.success.eyebrow}</p>
        <h1 className="font-display text-h1 hero-fade mt-5 max-w-4xl" style={{ "--line-delay": "120ms" } as React.CSSProperties}>
          {dict.success.title}
        </h1>
        <p className="lead hero-fade mt-6" style={{ "--line-delay": "220ms" } as React.CSSProperties}>
          {dict.success.thanks}
        </p>

        <dl className="hero-fade mt-12 grid grid-cols-2 border-y hairline md:grid-cols-4" style={{ "--line-delay": "320ms" } as React.CSSProperties}>
          {[
            [dict.success.number, <span key="n" className="num select-all">{order.number}</span>],
            [dict.success.date, <span key="d" className="num">{formatDate(order.createdAt, locale)}</span>],
            [dict.success.total, <span key="t" className="num">{formatPrice(order.totals.total, locale)}</span>],
            [dict.success.payment, paymentName(order.paymentMethod, locale)],
          ].map(([k, v], i) => (
            <div key={i} className={`py-5 ${i % 2 === 0 ? "pe-4" : "ps-4 border-s hairline"} md:border-s md:ps-6 md:first:border-s-0 md:first:ps-0`}>
              <dt className="text-xs text-mute">{k}</dt>
              <dd className="mt-1.5 text-base md:text-lg">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      <div className="container-x grid gap-14 pb-28 lg:grid-cols-12 lg:gap-16">
        <div className="space-y-12 lg:col-span-7">
          {preview && (
            <div className="border-s-2 border-bronze bg-paper p-6" role="status">
              <p className="text-sm leading-relaxed text-ink">{dict.demo.orderPreview}</p>
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-5">
                <Icon name="whatsapp" size={18} /> {dict.success.sendWhatsapp}
              </a>
            </div>
          )}

          <section aria-labelledby="next-title">
            <h2 id="next-title" className="font-display text-h3">{dict.success.nextSteps}</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-mute">{dict.success.nextStepsBody}</p>
            <div className="mt-8">
              <StatusTimeline order={order} />
            </div>
          </section>

          <section className="border-t hairline pt-8 text-sm" aria-label={dict.success.address}>
            <p className="eyebrow mb-3 text-mute">{dict.success.address}</p>
            <p className="font-medium">{order.address.fullName}</p>
            <p className="num mt-1 text-mute" dir="ltr">
              {order.address.phone}
            </p>
            <p className="mt-1 leading-relaxed text-mute">{formatAddress(order.address, locale)}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <Link href={`${href("/track-order")}?order=${encodeURIComponent(order.number)}`} className="btn btn-primary">
              {dict.success.track} <Icon name="arrow" size={16} className="flip-rtl" />
            </Link>
            <Link href={href("/shop")} className="btn btn-outline">
              {dict.success.continue}
            </Link>
            {!preview && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Icon name="whatsapp" size={16} /> {dict.success.contact}
              </a>
            )}
          </div>
        </div>

        <aside className="lg:col-span-5 xl:col-span-4 xl:col-start-9" aria-label={dict.checkout.summary}>
          <div className="bg-paper p-6 md:p-8">
            <h2 className="font-display text-h3">{dict.checkout.summary}</h2>
            <div className="mt-4">
              <OrderLines order={order} />
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
