"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { formatPrice } from "@/lib/format";
import { cn, isValidEgPhone, isValidEmail } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { api } from "@/services/api";
import { useHydrated } from "@/store/create-store";
import { accountStore, addresses, cart, notifications, ordersStore } from "@/store/stores";
import type { DeliveryMethod, Governorate, Order, PaymentMethodConfig } from "@/types/commerce";
import { SelectField, TextField } from "../forms/Field";
import { Icon } from "../ui/Icon";
import { EmptyState } from "../ui/primitives";
import { CouponForm } from "./CartView";
import { OrderSummary } from "./OrderSummary";
import { formatAddress, governorateName } from "./order-bits";
import { useCart } from "./useCart";

type Form = {
  fullName: string;
  phone: string;
  email: string;
  governorate: string;
  city: string;
  area: string;
  street: string;
  building: string;
  floor: string;
  apartment: string;
  instructions: string;
  deliveryMethod: DeliveryMethod["id"];
  paymentMethod: PaymentMethodConfig["id"] | "";
  notes: string;
};
type Errors = Partial<Record<keyof Form, string>>;

const REQUIRED: (keyof Form)[] = ["fullName", "governorate", "city", "area", "street", "building"];

export function CheckoutView({ payments, deliveries, governorates }: { payments: PaymentMethodConfig[]; deliveries: DeliveryMethod[]; governorates: Governorate[] }) {
  const { dict, href, locale, t } = useI18n();
  const router = useRouter();
  const hydrated = useHydrated();
  const { user, addresses: saved } = accountStore.use();
  // Prefilled from the signed-in profile / default address. The form only renders
  // after hydration, so reading the persisted store in the initializer is safe.
  const [form, setForm] = useState<Form>(() => {
    const acct = accountStore.get();
    const def = acct.addresses.find((a) => a.isDefault) ?? acct.addresses[0];
    return {
      fullName: acct.user?.fullName ?? "",
      phone: acct.user?.phone.replace(/^\+20/, "0") ?? "",
      email: acct.user?.email ?? "",
      governorate: def?.governorate ?? "alexandria",
      city: def?.city ?? "",
      area: def?.area ?? "",
      street: def?.street ?? "",
      building: def?.building ?? "",
      floor: def?.floor ?? "",
      apartment: def?.apartment ?? "",
      instructions: def?.instructions ?? "",
      deliveryMethod: deliveries[0]?.id ?? "home_delivery",
      paymentMethod: payments[0]?.id ?? "",
      notes: "",
    };
  });
  const { lines, totals, coupon, count } = useCart(form.governorate);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [saveAddr, setSaveAddr] = useState(true);
  const [addrChoice, setAddrChoice] = useState<string>(() => {
    const acct = accountStore.get();
    return (acct.addresses.find((a) => a.isDefault) ?? acct.addresses[0])?.id ?? "new";
  });
  const [placing, setPlacing] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const stepRefs = useRef<(HTMLElement | null)[]>([]);


  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const pickSaved = (id: string) => {
    setAddrChoice(id);
    const a = saved.find((x) => x.id === id);
    if (a) setForm((f) => ({ ...f, governorate: a.governorate, city: a.city, area: a.area, street: a.street, building: a.building, floor: a.floor ?? "", apartment: a.apartment ?? "", instructions: a.instructions ?? "" }));
  };

  const validateInfo = () => {
    const e: Errors = {};
    for (const k of REQUIRED) if (!String(form[k]).trim()) e[k] = dict.common.fieldRequired;
    if (!isValidEgPhone(form.phone)) e.phone = dict.common.invalidPhone;
    if (form.email && !isValidEmail(form.email)) e.email = dict.common.invalidEmail;
    setErrors(e);
    if (Object.keys(e).length) requestAnimationFrame(() => document.querySelector<HTMLElement>("#checkout [aria-invalid=true]")?.focus());
    return Object.keys(e).length === 0;
  };

  const goTo = (s: number) => {
    setStep(s);
    requestAnimationFrame(() => stepRefs.current[s]?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  const place = async () => {
    if (!validateInfo()) return goTo(0);
    if (!form.paymentMethod) return;
    setPlacing(true);
    setFailure(null);
    const res = await api.placeOrder({
      customer: { fullName: form.fullName.trim(), phone: form.phone, email: form.email.trim() },
      address: {
        fullName: form.fullName.trim(),
        phone: form.phone,
        governorate: form.governorate,
        city: form.city.trim(),
        area: form.area.trim(),
        street: form.street.trim(),
        building: form.building.trim(),
        floor: form.floor.trim() || undefined,
        apartment: form.apartment.trim() || undefined,
        instructions: form.instructions.trim() || undefined,
      },
      deliveryMethod: form.deliveryMethod,
      paymentMethod: form.paymentMethod,
      couponCode: totals.couponResult?.ok ? coupon : undefined,
      notes: form.notes.trim() || undefined,
      lines: lines.map((l) => ({ productId: l.productId, variantId: l.variant?.id, selection: l.selection, quantity: l.quantity })),
    });
    if (!res.ok) {
      setPlacing(false);
      setFailure(res.error);
      return;
    }
    const order: Order = res.data.order;
    ordersStore.set((s) => ({ orders: [order, ...s.orders.filter((o) => o.number !== order.number)].slice(0, 50) }));
    notifications.push({ ar: `تم استلام الطلب ${order.number}.`, en: `Order ${order.number} was received.` }, `/account?tab=orders`);
    if (user && saveAddr && addrChoice === "new") {
      addresses.upsert({ fullName: form.fullName, phone: form.phone, governorate: form.governorate, city: form.city, area: form.area, street: form.street, building: form.building, floor: form.floor, apartment: form.apartment, instructions: form.instructions });
    }
    cart.clear();
    if (res.data.payment.kind === "redirect") window.location.assign(res.data.payment.url);
    else router.push(`${href("/checkout/success")}?order=${encodeURIComponent(order.number)}`);
  };

  if (!hydrated) return <div className="container-x min-h-[60vh]" />;
  if (!lines.length && !placing) {
    return (
      <div className="container-x pb-24">
        <EmptyState title={dict.checkout.emptyCart} action={{ href: href("/shop"), label: dict.cart.continue }} />
      </div>
    );
  }

  const delivery = deliveries.find((d) => d.id === form.deliveryMethod);
  const payment = payments.find((p) => p.id === form.paymentMethod);

  return (
    <div id="checkout" className="pb-28">
      {/* Mobile summary toggle */}
      <div className="border-y hairline bg-paper lg:hidden">
        <button type="button" onClick={() => setSummaryOpen((o) => !o)} aria-expanded={summaryOpen} className="container-x flex h-14 items-center justify-between gap-4 text-sm">
          <span className="flex items-center gap-2">
            <Icon name="bag" size={18} /> {dict.checkout.summary}
            <span className="num text-mute">({count})</span>
            <Icon name="chevronDown" size={14} className={cn("transition-transform duration-500", summaryOpen && "rotate-180")} />
          </span>
          <span className="num text-base">{formatPrice(totals.total, locale)}</span>
        </button>
        <div className={cn("grid transition-[grid-template-rows] duration-500", summaryOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <div className="container-x pb-6">
              <OrderSummary lines={lines} subtotal={totals.subtotal} discount={totals.discount} shipping={totals.shipping} total={totals.total} />
              <div className="mt-5">
                <CouponForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-14 pt-10 lg:grid-cols-12 lg:gap-16 lg:pt-0">
        <div className="lg:col-span-7">
          {/* Stepper */}
          <ol className="mb-10 hidden items-center gap-3 text-xs text-mute sm:flex">
            {dict.checkout.steps.map((s, i) => (
              <li key={s} className={cn("flex items-center gap-3", i === step && "text-charcoal font-medium", i < step && "text-charcoal")}>
                {i > 0 && <span className="h-px w-8 bg-line-strong" aria-hidden />}
                <span className="num">{String(i + 1).padStart(2, "0")}</span> {s}
              </li>
            ))}
          </ol>

          {/* 1 — Information & address */}
          <section ref={(el) => { stepRefs.current[0] = el; }} className="scroll-mt-[calc(var(--header-h)+1.5rem)] border-t border-charcoal pt-6" aria-label={dict.checkout.steps[0]}>
            <StepHead step={step} editLabel={dict.checkout.edit} n={0} title={dict.checkout.customer} done={step > 0} onEdit={() => goTo(0)} />
            {step === 0 ? (
              <form
                className="mt-8"
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (validateInfo()) goTo(1);
                }}
              >
                {!user && (
                  <p className="mb-8 flex flex-wrap items-center gap-x-2 text-sm text-mute">
                    {dict.account.signInBody}
                    <Link href={`${href("/account")}?next=checkout`} className="link-line text-charcoal">
                      {dict.account.signIn}
                    </Link>
                  </p>
                )}
                <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                  <TextField label={dict.checkout.fullName} autoComplete="name" required value={form.fullName} onChange={set("fullName")} error={errors.fullName} className="sm:col-span-2" />
                  <TextField label={dict.checkout.phone} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required value={form.phone} onChange={set("phone")} error={errors.phone} placeholder="01x xxxx xxxx" />
                  <TextField label={dict.checkout.email} type="email" inputMode="email" autoComplete="email" dir="ltr" value={form.email} onChange={set("email")} error={errors.email} optionalLabel={dict.common.optional} />
                </div>

                <h3 className="eyebrow mt-14 mb-6 text-mute">{dict.checkout.address}</h3>
                {user && saved.length > 0 && (
                  <fieldset className="mb-10">
                    <legend className="field-label mb-3">{dict.checkout.savedAddresses}</legend>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {saved.map((a) => (
                        <label key={a.id} className="choice">
                          <input type="radio" name="saved" className="sr-only" checked={addrChoice === a.id} onChange={() => pickSaved(a.id)} />
                          <span className="text-sm">
                            <span className="font-medium">{a.label || a.fullName}</span>
                            <span className="mt-1 block text-xs leading-relaxed text-mute">{formatAddress(a, locale)}</span>
                          </span>
                        </label>
                      ))}
                      <label className="choice items-center">
                        <input type="radio" name="saved" className="sr-only" checked={addrChoice === "new"} onChange={() => setAddrChoice("new")} />
                        <Icon name="plus" size={16} /> <span className="text-sm">{dict.checkout.useNewAddress}</span>
                      </label>
                    </div>
                  </fieldset>
                )}
                <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
                  <SelectField label={dict.checkout.governorate} required value={form.governorate} onChange={set("governorate")} error={errors.governorate}>
                    <option value="" disabled>
                      {dict.checkout.selectGovernorate}
                    </option>
                    {governorates.map((g) => (
                      <option key={g.id} value={g.id}>
                        {t(g.name)}
                      </option>
                    ))}
                  </SelectField>
                  <TextField label={dict.checkout.city} autoComplete="address-level2" required value={form.city} onChange={set("city")} error={errors.city} />
                  <TextField label={dict.checkout.area} autoComplete="address-level3" required value={form.area} onChange={set("area")} error={errors.area} />
                  <TextField label={dict.checkout.street} autoComplete="address-line1" required value={form.street} onChange={set("street")} error={errors.street} />
                  <div className="grid grid-cols-3 gap-x-5 sm:col-span-2 sm:gap-x-8">
                    <TextField label={dict.checkout.building} required value={form.building} onChange={set("building")} error={errors.building} />
                    <TextField label={dict.checkout.floor} value={form.floor} onChange={set("floor")} inputMode="numeric" />
                    <TextField label={dict.checkout.apartment} value={form.apartment} onChange={set("apartment")} />
                  </div>
                  <TextField label={dict.checkout.instructions} multiline rows={3} value={form.instructions} onChange={set("instructions")} optionalLabel={dict.common.optional} className="sm:col-span-2" />
                </div>
                {user && addrChoice === "new" && (
                  <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
                    <input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="size-4 accent-charcoal" />
                    {dict.checkout.saveAddress}
                  </label>
                )}
                <button type="submit" className="btn btn-primary mt-10 w-full sm:w-auto">
                  {dict.common.next} <Icon name="arrow" size={16} className="flip-rtl" />
                </button>
              </form>
            ) : (
              <div className="mt-5 ps-12 text-sm leading-relaxed text-mute">
                <p className="text-charcoal">{form.fullName}</p>
                <p className="num" dir="ltr">{form.phone}{form.email && ` · ${form.email}`}</p>
                <p className="mt-1">{formatAddress({ ...form, fullName: form.fullName, phone: form.phone }, locale)}</p>
              </div>
            )}
          </section>

          {/* 2 — Delivery */}
          <section ref={(el) => { stepRefs.current[1] = el; }} className="mt-10 scroll-mt-[calc(var(--header-h)+1.5rem)] border-t hairline pt-6" aria-label={dict.checkout.steps[1]}>
            <StepHead step={step} editLabel={dict.checkout.edit} n={1} title={dict.checkout.deliveryMethod} done={step > 1} onEdit={() => goTo(1)} />
            {step === 1 && (
              <div className="mt-8">
                <div className="grid gap-3">
                  {deliveries.map((d) => (
                    <label key={d.id} className="choice">
                      <input type="radio" name="delivery" className="sr-only" checked={form.deliveryMethod === d.id} onChange={() => setForm((f) => ({ ...f, deliveryMethod: d.id }))} />
                      <Icon name="truck" size={22} className="mt-0.5 shrink-0" />
                      <span className="flex-1 text-sm">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="font-medium">{t(d.name)}</span>
                          <span className={totals.shipping.fee === null ? "text-xs text-mute" : "num"}>{totals.shipping.fee === null ? dict.cart.shippingTbc : formatPrice(totals.shipping.fee, locale)}</span>
                        </span>
                        <span className="mt-1 block text-xs leading-relaxed text-mute">{t(d.description)}</span>
                        <span className="mt-2 block text-xs text-mute">{governorateName(form.governorate, locale)}</span>
                      </span>
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-mute">{dict.cart.shippingNote}</p>
                <button type="button" onClick={() => goTo(2)} className="btn btn-primary mt-10 w-full sm:w-auto">
                  {dict.common.next} <Icon name="arrow" size={16} className="flip-rtl" />
                </button>
              </div>
            )}
            {step > 1 && delivery && <p className="mt-5 ps-12 text-sm text-mute">{t(delivery.name)}</p>}
          </section>

          {/* 3 — Payment & review */}
          <section ref={(el) => { stepRefs.current[2] = el; }} className="mt-10 scroll-mt-[calc(var(--header-h)+1.5rem)] border-t hairline pt-6" aria-label={dict.checkout.steps[2]}>
            <StepHead step={step} editLabel={dict.checkout.edit} n={2} title={dict.checkout.paymentMethod} done={false} />
            {step === 2 && (
              <div className="mt-8">
                {payments.length === 0 ? (
                  <div className="border-s-2 border-bronze bg-paper p-5 text-sm">
                    <p>{dict.checkout.noPaymentMethods}</p>
                    <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm mt-4">
                      <Icon name="whatsapp" size={16} /> {dict.common.chatWhatsapp}
                    </a>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {payments.map((p) => (
                      <label key={p.id} className="choice">
                        <input type="radio" name="payment" className="sr-only" checked={form.paymentMethod === p.id} onChange={() => setForm((f) => ({ ...f, paymentMethod: p.id }))} />
                        <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border", form.paymentMethod === p.id ? "border-charcoal" : "border-line-strong")}>
                          {form.paymentMethod === p.id && <span className="size-2.5 rounded-full bg-charcoal" />}
                        </span>
                        <span className="text-sm">
                          <span className="font-medium">{t(p.name)}</span>
                          <span className="mt-1 block text-xs leading-relaxed text-mute">{t(p.description)}</span>
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <TextField label={dict.checkout.notes} multiline rows={3} value={form.notes} onChange={set("notes")} placeholder={dict.checkout.notesPlaceholder} optionalLabel={dict.common.optional} className="mt-10" maxLength={1000} />

                <div className="mt-10 bg-paper p-5 text-sm md:p-6">
                  <p className="eyebrow mb-4 text-mute">{dict.checkout.review}</p>
                  <dl className="grid gap-3 sm:grid-cols-[8rem_1fr]">
                    <dt className="text-mute">{dict.success.address}</dt>
                    <dd>{formatAddress({ ...form }, locale)}</dd>
                    <dt className="text-mute">{dict.checkout.deliveryMethod}</dt>
                    <dd>{delivery ? t(delivery.name) : ""}</dd>
                    <dt className="text-mute">{dict.checkout.paymentMethod}</dt>
                    <dd>{payment ? t(payment.name) : dict.common.emptyValue}</dd>
                    <dt className="text-mute">{dict.cart.estimatedTotal}</dt>
                    <dd className="num text-base">{formatPrice(totals.total, locale)}</dd>
                  </dl>
                </div>

                {failure && (
                  <div className="mt-6 border-s-2 border-danger bg-danger/5 p-5 text-sm" role="alert">
                    <p>{dict.checkout.error}</p>
                    <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="link-line mt-3 text-sm">
                      <Icon name="whatsapp" size={16} /> {dict.common.chatWhatsapp}
                    </a>
                  </div>
                )}

                <button type="button" onClick={place} disabled={placing || !form.paymentMethod} className="btn btn-primary btn-block mt-8 !min-h-14">
                  {placing ? dict.checkout.placing : dict.checkout.placeOrder}
                  {!placing && <Icon name="arrow" size={16} className="flip-rtl" />}
                </button>
                <p className="mt-4 text-center text-xs leading-relaxed text-mute">
                  {dict.checkout.agree}{" "}
                  <Link href={href("/terms")} className="underline underline-offset-2">
                    {dict.footer.terms}
                  </Link>{" "}
                  ·{" "}
                  <Link href={href("/privacy")} className="underline underline-offset-2">
                    {dict.footer.privacy}
                  </Link>
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Desktop summary */}
        <aside className="hidden lg:col-span-5 lg:block xl:col-span-4 xl:col-start-9" aria-label={dict.checkout.summary}>
          <div className="sticky top-[calc(var(--header-h)+2rem)] bg-paper p-8">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-h3">{dict.checkout.summary}</h2>
              <Link href={href("/cart")} className="link-line text-xs">
                {dict.checkout.edit}
              </Link>
            </div>
            <div className="mt-4 max-h-[46vh] overflow-y-auto pe-1">
              <OrderSummary lines={lines} subtotal={totals.subtotal} discount={totals.discount} shipping={totals.shipping} total={totals.total} />
            </div>
            <div className="mt-6 border-t hairline pt-6">
              <CouponForm />
            </div>
            <p className="mt-2 flex items-center gap-2 text-xs text-mute">
              <Icon name="check" size={14} /> {dict.cart.shippingNote}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StepHead({ n, step, title, done, onEdit, editLabel }: { n: number; step: number; title: string; done: boolean; onEdit?: () => void; editLabel: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h2 className="flex items-center gap-4">
        <span className={cn("num grid size-8 shrink-0 place-items-center rounded-full border text-xs transition-colors", done ? "border-charcoal bg-charcoal text-ivory" : step === n ? "border-charcoal" : "border-line-strong text-mute")}>
          {done ? <Icon name="check" size={14} strokeWidth={2} /> : n + 1}
        </span>
        <span className={cn("font-display text-h3", step !== n && !done && "text-mute")}>{title}</span>
      </h2>
      {done && onEdit && (
        <button type="button" onClick={onEdit} className="link-line text-sm">
          {editLabel}
        </button>
      )}
    </div>
  );
}
