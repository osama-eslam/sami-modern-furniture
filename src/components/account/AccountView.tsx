"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { governorates } from "@/data/config/shipping";
import { fmt } from "@/i18n/config";
import { useI18n } from "@/i18n/provider";
import { productById, productsByIds } from "@/lib/catalog";
import { formatDate, formatPrice } from "@/lib/format";
import { cn, isValidEgPhone, isValidEmail } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { auth } from "@/services/auth";
import { useHydrated } from "@/store/create-store";
import { accountStore, addresses, cart, notifications, ordersStore, recentStore, toast, wishlistStore } from "@/store/stores";
import type { Address, Order } from "@/types/commerce";
import { OrderLines, StatusTimeline, formatAddress, orderWhatsappText } from "../checkout/order-bits";
import { SelectField, TextField } from "../forms/Field";
import { ProductCard } from "../product/ProductCard";
import { Icon, type IconName } from "../ui/Icon";
import { EmptyState } from "../ui/primitives";

const TABS = ["overview", "orders", "wishlist", "addresses", "profile", "notifications"] as const;
type Tab = (typeof TABS)[number];
const ICONS: Record<Tab, IconName> = { overview: "home", orders: "box", wishlist: "heart", addresses: "pin", profile: "user", notifications: "bell" };

export function AccountView() {
  const { dict, href } = useI18n();
  const hydrated = useHydrated();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { user, notifications: notes } = accountStore.use();
  const tabParam = params.get("tab") as Tab | null;
  const tab: Tab = tabParam && TABS.includes(tabParam) ? tabParam : "overview";
  const unread = notes.filter((n) => !n.read).length;

  if (!hydrated) return <div className="container-x min-h-[60vh]" />;
  if (!user) return <SignIn onDone={() => (params.get("next") === "checkout" ? router.push(href("/checkout")) : undefined)} />;

  const go = (t: Tab) => router.replace(t === "overview" ? pathname : `${pathname}?tab=${t}`, { scroll: false });

  return (
    <div className="container-x grid gap-10 pb-28 lg:grid-cols-12 lg:gap-16">
      <aside className="lg:col-span-3">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
          <div className="hidden border-b hairline pb-6 lg:block">
            <span className="font-display grid size-14 place-items-center rounded-full bg-charcoal text-xl text-ivory">{user.fullName.trim().charAt(0).toUpperCase()}</span>
            <p className="mt-4 font-medium">{user.fullName}</p>
            <p className="num mt-1 text-xs text-mute" dir="ltr">
              {user.phone}
            </p>
          </div>
          <nav aria-label={dict.account.title}>
            <ul className="no-scrollbar -mx-[var(--gutter)] flex gap-1 overflow-x-auto border-y hairline px-[var(--gutter)] py-2 lg:mx-0 lg:flex-col lg:gap-0 lg:border-0 lg:px-0 lg:py-4">
              {TABS.map((t) => (
                <li key={t} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => go(t)}
                    aria-current={tab === t ? "page" : undefined}
                    className={cn(
                      "flex h-10 w-full items-center gap-3 whitespace-nowrap px-3 text-sm transition-colors lg:h-12 lg:px-0",
                      tab === t ? "bg-charcoal text-ivory lg:bg-transparent lg:font-medium lg:text-charcoal" : "text-mute hover:text-charcoal",
                    )}
                  >
                    <Icon name={ICONS[t]} size={18} className="hidden lg:block" />
                    {dict.account[t]}
                    {t === "notifications" && unread > 0 && <span className="num grid h-5 min-w-5 place-items-center rounded-full bg-bronze px-1 text-[10px] text-ivory">{unread}</span>}
                    {tab === t && <span className="ms-auto hidden h-px w-6 bg-charcoal lg:block" aria-hidden />}
                  </button>
                </li>
              ))}
              <li className="shrink-0 lg:mt-4 lg:border-t lg:hairline lg:pt-4">
                <button type="button" onClick={() => auth.signOut()} className="flex h-10 w-full items-center gap-3 whitespace-nowrap px-3 text-sm text-mute hover:text-danger lg:h-12 lg:px-0">
                  <Icon name="logout" size={18} className="hidden lg:block" /> {dict.account.logout}
                </button>
              </li>
            </ul>
          </nav>
          <p className="mt-6 hidden text-xs leading-relaxed text-taupe lg:block">{dict.demo.accountNote}</p>
        </div>
      </aside>

      <div key={tab} className="min-w-0 lg:col-span-9" style={{ animation: "fade-up .6s cubic-bezier(.16,1,.3,1) both" }}>
        {tab === "overview" && <Overview go={go} />}
        {tab === "orders" && <Orders />}
        {tab === "wishlist" && <Wishlist />}
        {tab === "addresses" && <Addresses />}
        {tab === "profile" && <Profile />}
        {tab === "notifications" && <Notifications />}
        <p className="mt-10 text-xs leading-relaxed text-taupe lg:hidden">{dict.demo.accountNote}</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- sign in */

function SignIn({ onDone }: { onDone: () => void }) {
  const { dict } = useI18n();
  const [v, setV] = useState({ fullName: "", phone: "", email: "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      fullName: v.fullName.trim() ? undefined : dict.common.fieldRequired,
      phone: isValidEgPhone(v.phone) ? undefined : dict.common.invalidPhone,
      email: !v.email || isValidEmail(v.email) ? undefined : dict.common.invalidEmail,
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    setBusy(true);
    await auth.signIn(v);
    setBusy(false);
    onDone();
  };

  return (
    <div className="container-x grid gap-14 pb-28 lg:grid-cols-12 lg:gap-16">
      <form onSubmit={submit} noValidate className="border-t border-charcoal pt-8 lg:col-span-5">
        <h2 className="font-display text-h2">{dict.account.signInTitle}</h2>
        <p className="mt-3 max-w-md leading-relaxed text-mute">{dict.account.signInBody}</p>
        <div className="mt-10 grid gap-8">
          <TextField label={dict.auth.name} autoComplete="name" required value={v.fullName} onChange={(e) => setV({ ...v, fullName: e.target.value })} error={errors.fullName} />
          <TextField label={dict.auth.phone} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" required value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} error={errors.phone} placeholder="01x xxxx xxxx" />
          <TextField label={dict.auth.email} type="email" inputMode="email" autoComplete="email" dir="ltr" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} />
        </div>
        <button type="submit" disabled={busy} className="btn btn-primary mt-10 w-full sm:w-auto">
          {dict.account.signInCta} <Icon name="arrow" size={16} className="flip-rtl" />
        </button>
        <p className="mt-6 text-xs leading-relaxed text-taupe">{dict.demo.accountNote}</p>
      </form>
      <div className="hidden lg:col-span-6 lg:col-start-7 lg:block">
        <ul className="grid gap-px bg-line">
          {(["orders", "addresses", "wishlist", "notifications"] as const).map((t) => (
            <li key={t} className="flex items-center gap-5 bg-ivory py-6">
              <span className="grid size-12 place-items-center border hairline">
                <Icon name={ICONS[t]} size={20} />
              </span>
              <span className="font-display text-2xl">{dict.account[t]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- overview */

function Overview({ go }: { go: (t: Tab) => void }) {
  const { dict } = useI18n();
  const { user, addresses: addrs } = accountStore.use();
  const { orders } = ordersStore.use();
  const { ids } = wishlistStore.use();
  const { ids: recent } = recentStore.use();
  const recentProducts = productsByIds(recent).slice(0, 4);

  const stats: [Tab, string, number][] = [
    ["orders", dict.account.stats.orders, orders.length],
    ["wishlist", dict.account.stats.wishlist, ids.length],
    ["addresses", dict.account.stats.addresses, addrs.length],
  ];

  return (
    <div className="space-y-16">
      <h2 className="font-display text-h1">{fmt(dict.account.hello, { name: user!.fullName.split(" ")[0] })}</h2>
      <ul className="grid grid-cols-3 border-y hairline">
        {stats.map(([t, label, n], i) => (
          <li key={t} className={i > 0 ? "border-s hairline" : ""}>
            <button type="button" onClick={() => go(t)} className="group w-full px-3 py-6 text-start md:px-6 md:py-8 first:ps-0">
              <span className="num block font-latin text-4xl font-extralight md:text-6xl">{n}</span>
              <span className="mt-2 flex items-center gap-2 text-xs text-mute md:text-sm">
                {label} <Icon name="arrow" size={12} className="flip-rtl opacity-0 transition-opacity group-hover:opacity-100" />
              </span>
            </button>
          </li>
        ))}
      </ul>
      {orders[0] && (
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <h3 className="eyebrow text-mute">{dict.account.orders}</h3>
            <button type="button" onClick={() => go("orders")} className="link-line text-xs">
              {dict.nav.viewAll}
            </button>
          </div>
          <OrderCard order={orders[0]} />
        </section>
      )}
      {recentProducts.length > 0 && (
        <section>
          <h3 className="eyebrow mb-6 text-mute">{dict.account.recentlyViewed}</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
            {recentProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} sizes="(min-width:1024px) 18vw, 50vw" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- orders */

function OrderCard({ order }: { order: Order }) {
  const { dict, href, locale } = useI18n();
  const [open, setOpen] = useState(false);
  const reorder = () => {
    order.lines.forEach((l) => {
      const sel = productById(l.productId)?.variants.find((v) => v.id === l.variantId)?.selection ?? {};
      cart.add(l.productId, sel, l.quantity);
    });
  };
  return (
    <article className="border hairline">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 p-5 md:p-6">
        <div className="flex -space-x-3 rtl:space-x-reverse">
          {order.lines.slice(0, 3).map((l) => (
            <span key={l.sku} className="relative size-12 overflow-hidden border-2 border-ivory bg-stone">
              <Image src={l.image} alt="" fill sizes="48px" className="object-cover" />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="num font-medium">{order.number}</p>
          <p className="mt-0.5 text-xs text-mute">
            {dict.account.orderDate} <span className="num">{formatDate(order.createdAt, locale)}</span> · {order.lines.reduce((n, l) => n + l.quantity, 0)} {dict.account.products}
          </p>
        </div>
        <span className="border hairline px-3 py-1 text-xs">{dict.status[order.status]}</span>
        <span className="num text-lg">{formatPrice(order.totals.total, locale)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t hairline px-5 py-3 text-sm md:px-6">
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-1.5">
          {dict.account.viewOrder} <Icon name="chevronDown" size={14} className={cn("transition-transform duration-500", open && "rotate-180")} />
        </button>
        <button type="button" onClick={reorder} className="text-mute hover:text-charcoal">
          {dict.account.reorder}
        </button>
        <Link href={`${href("/track-order")}?order=${order.number}`} className="text-mute hover:text-charcoal">
          {dict.success.track}
        </Link>
        <a href={whatsappLink(orderWhatsappText(order, dict, locale))} target="_blank" rel="noopener noreferrer" className="ms-auto flex items-center gap-1.5 text-mute hover:text-charcoal">
          <Icon name="whatsapp" size={15} /> {dict.account.support}
        </a>
      </div>
      <div className={cn("grid transition-[grid-template-rows] duration-500", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="grid gap-10 border-t hairline p-5 md:p-6 xl:grid-cols-2">
            <div>
              <StatusTimeline order={order} />
              <p className="eyebrow mt-8 mb-2 text-mute">{dict.success.address}</p>
              <p className="text-sm leading-relaxed">{formatAddress(order.address, locale)}</p>
            </div>
            <OrderLines order={order} />
          </div>
        </div>
      </div>
    </article>
  );
}

function Orders() {
  const { dict, href } = useI18n();
  const { orders } = ordersStore.use();
  if (!orders.length) return <EmptyState icon="box" title={dict.account.noOrders} action={{ href: href("/shop"), label: dict.cart.continue }} />;
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <OrderCard key={o.number} order={o} />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------- wishlist */

function Wishlist() {
  const { dict, href } = useI18n();
  const { ids } = wishlistStore.use();
  const products = productsByIds(ids);
  if (!products.length) return <EmptyState icon="heart" title={dict.wishlist.empty} body={dict.wishlist.emptyBody} action={{ href: href("/shop"), label: dict.cart.continue }} />;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} index={i} sizes="(min-width:1024px) 24vw, 50vw" />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- addresses */

const emptyAddress: Omit<Address, "id"> = { label: "", fullName: "", phone: "", governorate: "alexandria", city: "", area: "", street: "", building: "", floor: "", apartment: "", instructions: "" };

function Addresses() {
  const { dict, locale } = useI18n();
  const { addresses: list, user } = accountStore.use();
  const [editing, setEditing] = useState<(Omit<Address, "id"> & { id?: string }) | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const req = ["fullName", "city", "area", "street", "building"] as const;
    const errs: Record<string, string | undefined> = {};
    req.forEach((k) => {
      if (!String(editing[k] ?? "").trim()) errs[k] = dict.common.fieldRequired;
    });
    if (!isValidEgPhone(editing.phone)) errs.phone = dict.common.invalidPhone;
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    addresses.upsert(editing);
    setEditing(null);
  };

  if (editing) {
    const f = (k: keyof Address) => ({ value: String(editing[k] ?? ""), onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setEditing({ ...editing, [k]: e.target.value }), error: errors[k] });
    return (
      <form onSubmit={save} noValidate>
        <h2 className="font-display text-h2 mb-10">{editing.id ? dict.account.editAddress : dict.account.addAddress}</h2>
        <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          <TextField label={dict.account.addressLabel} {...f("label")} optionalLabel={dict.common.optional} className="sm:col-span-2" />
          <TextField label={dict.checkout.fullName} required {...f("fullName")} />
          <TextField label={dict.checkout.phone} type="tel" dir="ltr" required {...f("phone")} />
          <SelectField label={dict.checkout.governorate} required {...f("governorate")}>
            {governorates.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name[locale]}
              </option>
            ))}
          </SelectField>
          <TextField label={dict.checkout.city} required {...f("city")} />
          <TextField label={dict.checkout.area} required {...f("area")} />
          <TextField label={dict.checkout.street} required {...f("street")} />
          <div className="grid grid-cols-3 gap-x-5 sm:col-span-2 sm:gap-x-8">
            <TextField label={dict.checkout.building} required {...f("building")} />
            <TextField label={dict.checkout.floor} {...f("floor")} />
            <TextField label={dict.checkout.apartment} {...f("apartment")} />
          </div>
          <TextField label={dict.checkout.instructions} multiline rows={3} {...f("instructions")} className="sm:col-span-2" />
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="submit" className="btn btn-primary">
            {dict.common.save}
          </button>
          <button type="button" onClick={() => setEditing(null)} className="btn btn-outline">
            {dict.common.cancel}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-h2">{dict.account.addresses}</h2>
        <button type="button" onClick={() => { setErrors({}); setEditing({ ...emptyAddress, fullName: user?.fullName ?? "", phone: user?.phone.replace(/^\+20/, "0") ?? "" }); }} className="btn btn-outline btn-sm">
          <Icon name="plus" size={15} /> {dict.account.addAddress}
        </button>
      </div>
      {list.length === 0 ? (
        <p className="border-t hairline py-12 text-mute">{dict.account.noAddresses}</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {list.map((a) => (
            <li key={a.id} className={cn("flex flex-col border p-6", a.isDefault ? "border-charcoal" : "hairline")}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-medium">{a.label || a.fullName}</p>
                {a.isDefault && <span className="bg-charcoal px-2 py-0.5 text-[10px] tracking-wider text-ivory">{dict.account.default}</span>}
              </div>
              <p className="num mt-1 text-xs text-mute" dir="ltr">
                {a.phone}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-mute">{formatAddress(a, locale)}</p>
              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6 text-sm">
                <button type="button" onClick={() => { setErrors({}); setEditing(a); }} className="link-line">
                  {dict.common.edit}
                </button>
                {!a.isDefault && (
                  <button type="button" onClick={() => addresses.setDefault(a.id)} className="text-mute hover:text-charcoal">
                    {dict.account.setDefault}
                  </button>
                )}
                <DeleteButton onConfirm={() => addresses.remove(a.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Two-tap inline confirmation (no blocking browser dialogs). */
function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const { dict } = useI18n();
  const [armed, setArmed] = useState(false);
  return armed ? (
    <span className="ms-auto flex items-center gap-3">
      <span className="text-xs text-mute">{dict.account.confirmDelete}</span>
      <button type="button" onClick={onConfirm} className="text-danger">
        {dict.common.yes}
      </button>
      <button type="button" onClick={() => setArmed(false)} className="text-mute">
        {dict.common.no}
      </button>
    </span>
  ) : (
    <button type="button" onClick={() => setArmed(true)} className="ms-auto flex items-center gap-1.5 text-mute hover:text-danger">
      <Icon name="trash" size={15} /> {dict.common.delete}
    </button>
  );
}

/* --------------------------------------------------------------- profile */

function Profile() {
  const { dict } = useI18n();
  const { user } = accountStore.use();
  const [v, setV] = useState({ fullName: user?.fullName ?? "", phone: user?.phone.replace(/^\+20/, "0") ?? "", email: user?.email ?? "" });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = {
      fullName: v.fullName.trim() ? undefined : dict.common.fieldRequired,
      phone: isValidEgPhone(v.phone) ? undefined : dict.common.invalidPhone,
      email: !v.email || isValidEmail(v.email) ? undefined : dict.common.invalidEmail,
    };
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    await auth.updateProfile({ fullName: v.fullName.trim(), phone: v.phone, email: v.email.trim() || undefined });
    toast(dict.account.profileSaved);
  };
  return (
    <form onSubmit={save} noValidate className="max-w-2xl">
      <h2 className="font-display text-h2 mb-10">{dict.account.profile}</h2>
      <div className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
        <TextField label={dict.auth.name} required value={v.fullName} onChange={(e) => setV({ ...v, fullName: e.target.value })} error={errors.fullName} className="sm:col-span-2" />
        <TextField label={dict.auth.phone} type="tel" dir="ltr" required value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} error={errors.phone} />
        <TextField label={dict.auth.email} type="email" dir="ltr" value={v.email} onChange={(e) => setV({ ...v, email: e.target.value })} error={errors.email} />
      </div>
      <button type="submit" className="btn btn-primary mt-10">
        {dict.common.save}
      </button>
    </form>
  );
}

/* --------------------------------------------------------- notifications */

function Notifications() {
  const { dict, href, locale, t } = useI18n();
  const { notifications: list } = accountStore.use();
  return (
    <div>
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-display text-h2">{dict.account.notifications}</h2>
        {list.some((n) => !n.read) && (
          <button type="button" onClick={notifications.markAllRead} className="link-line text-sm">
            {dict.account.markRead}
          </button>
        )}
      </div>
      {list.length === 0 ? (
        <p className="border-t hairline py-12 text-mute">{dict.account.noNotifications}</p>
      ) : (
        <ul className="divide-y hairline border-y hairline">
          {list.map((n) => (
            <li key={n.id} className="flex items-start gap-4 py-5">
              <span className={cn("mt-2 size-2 shrink-0 rounded-full", n.read ? "bg-line-strong" : "bg-bronze")} aria-hidden />
              <div className="min-w-0 flex-1">
                {n.href ? (
                  <Link href={href(n.href)} className="hover:underline underline-offset-4">
                    {t(n.text)}
                  </Link>
                ) : (
                  <p>{t(n.text)}</p>
                )}
                <p className="num mt-1 text-xs text-mute">{formatDate(n.at, locale, true)}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
