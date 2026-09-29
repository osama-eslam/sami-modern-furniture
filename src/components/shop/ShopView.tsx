"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { siteConfig } from "@/config/site";
import { categories } from "@/data/categories";
import { useI18n } from "@/i18n/provider";
import { fmt } from "@/i18n/config";
import { facets, filterProducts, type Collection, type ShopQuery, type SortKey } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Availability, Product, Room, Style } from "@/types/commerce";
import { useDialog } from "../layout/useDialog";
import { ProductCard } from "../product/ProductCard";
import { Icon } from "../ui/Icon";

const SORTS: SortKey[] = ["featured", "newest", "price-asc", "price-desc", "popular"];
const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);

export function ShopView({ products, collection = "all", fixedCategory, emptyText }: { products: Product[]; collection?: Collection; fixedCategory?: string; emptyText?: string }) {
  const { dict, locale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [drawer, setDrawer] = useState(false);
  const [visible, setVisible] = useState(siteConfig.itemsPerPage);
  const drawerRef = useDialog<HTMLDivElement>(drawer, () => setDrawer(false));

  const scope = useMemo(() => filterProducts(products, { collection, category: fixedCategory ? [fixedCategory] : undefined }, locale), [products, collection, fixedCategory, locale]);
  const f = useMemo(() => facets(scope), [scope]);

  const query: ShopQuery = {
    collection,
    category: fixedCategory ? [fixedCategory] : list(params.get("category")),
    colors: list(params.get("color")),
    materials: list(params.get("material")),
    rooms: list(params.get("room")) as Room[],
    styles: list(params.get("style")) as Style[],
    availability: list(params.get("availability")) as Availability[],
    min: params.get("min") ? Number(params.get("min")) : undefined,
    max: params.get("max") ? Number(params.get("max")) : undefined,
    sort: (SORTS.includes(params.get("sort") as SortKey) ? params.get("sort") : "featured") as SortKey,
  };
  const paramsKey = params.toString();
  const results = useMemo(() => filterProducts(products, query, locale), [products, paramsKey, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  const update = (key: string, value: string | string[] | undefined) => {
    const next = new URLSearchParams(params.toString());
    const v = Array.isArray(value) ? value.join(",") : value;
    if (v) next.set(key, v);
    else next.delete(key);
    setVisible(siteConfig.itemsPerPage);
    router.replace(`${pathname}${next.toString() ? `?${next}` : ""}`, { scroll: false });
  };
  const toggle = (key: string, value: string) => {
    const cur = list(params.get(key));
    update(key, cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value]);
  };
  const activeCount = ["category", "color", "material", "room", "style", "availability", "min", "max"].filter((k) => params.get(k) && !(k === "category" && fixedCategory)).length;
  const clear = () => router.replace(params.get("sort") ? `${pathname}?sort=${params.get("sort")}` : pathname, { scroll: false });

  const checkProps = (k: string, value: string) => ({ checked: list(params.get(k)).includes(value), onToggle: () => toggle(k, value) });

  const filters = (
    <div>
      {!fixedCategory && (
        <Group title={dict.shop.category}>
          {categories
            .filter((c) => scope.some((p) => p.category === c.slug))
            .map((c) => (
              <Check key={c.slug} {...checkProps("category", c.slug)} label={t(c.name)} />
            ))}
        </Group>
      )}
      <Group title={dict.shop.price}>
        <div className="grid grid-cols-2 gap-3">
          {(["min", "max"] as const).map((k) => (
            <label key={k} className="field">
              <span className="text-xs text-mute">{dict.shop[k]}</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={500}
                placeholder={formatPrice(k === "min" ? f.priceRange.min : f.priceRange.max, locale)}
                defaultValue={params.get(k) ?? ""}
                onBlur={(e) => update(k, e.target.value || undefined)}
                onKeyDown={(e) => e.key === "Enter" && update(k, (e.target as HTMLInputElement).value || undefined)}
                className="input input-box !min-h-11 num text-sm"
              />
            </label>
          ))}
        </div>
      </Group>
      <Group title={dict.shop.color}>
        <div className="grid grid-cols-2 gap-x-3">
          {f.colors.map((c) => (
            <Check key={c.key} {...checkProps("color", c.key)} label={t(c.name)} swatch={c.hex} />
          ))}
        </div>
      </Group>
      <Group title={dict.shop.material} defaultOpen={false}>
        {f.materials.map((m) => (
          <Check key={m.key} {...checkProps("material", m.key)} label={t(m.name)} />
        ))}
      </Group>
      <Group title={dict.shop.room} defaultOpen={false}>
        {f.rooms.map((r) => (
          <Check key={r} {...checkProps("room", r)} label={dict.shop.rooms[r]} />
        ))}
      </Group>
      <Group title={dict.shop.style} defaultOpen={false}>
        {f.styles.map((s) => (
          <Check key={s} {...checkProps("style", s)} label={dict.shop.styles[s]} />
        ))}
      </Group>
      <Group title={dict.shop.availability} defaultOpen={false}>
        {f.availability.map((a) => (
          <Check key={a} {...checkProps("availability", a)} label={dict.availability[a]} />
        ))}
      </Group>
    </div>
  );

  return (
    <div className="container-x pb-24">
      {/* Toolbar */}
      <div className="sticky top-[calc(var(--header-h)-1px)] z-30 -mx-[var(--gutter)] mb-10 flex items-center justify-between gap-4 border-y hairline bg-ivory/90 px-[var(--gutter)] py-3 backdrop-blur-xl">
        <button type="button" onClick={() => setDrawer(true)} className="flex items-center gap-2 text-sm lg:hidden" aria-haspopup="dialog">
          <Icon name="filter" size={18} /> {dict.shop.filters}
          {activeCount > 0 && <span className="num grid size-5 place-items-center rounded-full bg-charcoal text-[10px] text-ivory">{activeCount}</span>}
        </button>
        <p className="num hidden text-sm text-mute lg:block" aria-live="polite">
          {fmt(dict.shop.showing, { count: results.length })}
        </p>
        <label className="flex items-center gap-3 text-sm">
          <span className="text-mute max-sm:sr-only">{dict.shop.sort}</span>
          <select value={query.sort} onChange={(e) => update("sort", e.target.value === "featured" ? undefined : e.target.value)} className="input !min-h-10 !w-auto !border-0 !py-0 text-sm">
            {SORTS.map((s) => (
              <option key={s} value={s}>
                {dict.shop.sortOptions[s]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr] xl:grid-cols-[280px_1fr] xl:gap-16">
        <aside className="hidden lg:block" aria-label={dict.shop.filters}>
          <div className="sticky top-[calc(var(--header-h)+5rem)] max-h-[calc(100vh-var(--header-h)-6rem)] overflow-y-auto pe-2 no-scrollbar">
            <div className="flex items-center justify-between border-b hairline pb-4">
              <p className="font-display text-2xl">{dict.shop.filters}</p>
              {activeCount > 0 && (
                <button type="button" onClick={clear} className="text-xs text-mute underline underline-offset-4">
                  {dict.shop.clear}
                </button>
              )}
            </div>
            {filters}
          </div>
        </aside>

        <div>
          <p className="num mb-6 text-sm text-mute lg:hidden" aria-live="polite">
            {fmt(dict.shop.showing, { count: results.length })}
          </p>
          {results.length === 0 ? (
            <div className="flex flex-col items-start gap-6 border-t hairline py-20">
              <p className="font-display text-h3">{emptyText ?? dict.shop.empty}</p>
              {activeCount > 0 && (
                <button type="button" onClick={clear} className="btn btn-outline">
                  {dict.shop.emptyCta}
                </button>
              )}
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6">
                {results.slice(0, visible).map((p, i) => (
                  <li key={p.id}>
                    <ProductCard product={p} index={i} priority={i < 3} sizes="(min-width:1280px) 25vw, (min-width:768px) 30vw, 50vw" />
                  </li>
                ))}
              </ul>
              {visible < results.length && (
                <div className="mt-16 flex flex-col items-center gap-4">
                  <p className="num text-xs text-mute">
                    {visible} / {results.length}
                  </p>
                  <div className="h-px w-40 bg-line">
                    <div className="h-px bg-charcoal" style={{ width: `${(visible / results.length) * 100}%` }} />
                  </div>
                  <button type="button" onClick={() => setVisible((v) => v + siteConfig.itemsPerPage)} className="btn btn-outline mt-2">
                    {dict.shop.loadMore}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <div className="overlay-backdrop lg:hidden" data-open={drawer} onClick={() => setDrawer(false)} aria-hidden />
      <div ref={drawerRef} role="dialog" aria-modal="true" aria-label={dict.shop.filters} className="drawer lg:hidden" data-side="start" data-open={drawer}>
        <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between border-b hairline px-5">
          <p className="font-display text-2xl">{dict.shop.filters}</p>
          <button type="button" onClick={() => setDrawer(false)} className="grid size-10 place-items-center" aria-label={dict.common.close}>
            <Icon name="close" size={22} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5">{filters}</div>
        <div className="grid shrink-0 grid-cols-2 gap-3 border-t hairline p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button type="button" onClick={clear} className="btn btn-outline" disabled={!activeCount}>
            {dict.shop.clear}
          </button>
          <button type="button" onClick={() => setDrawer(false)} className="btn btn-primary">
            {dict.shop.apply} ({results.length})
          </button>
        </div>
      </div>
    </div>
  );
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="accordion border-b hairline" open={defaultOpen}>
      <summary className="flex items-center justify-between py-5">
        <span className="label">{title}</span>
        <Icon name="plus" size={16} className="acc-icon" />
      </summary>
      <div className="acc-body">
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </details>
  );
}

function Check({ checked, onToggle, label, swatch }: { checked: boolean; onToggle: () => void; label: string; swatch?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span className={cn("grid size-4 shrink-0 place-items-center border transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2", checked ? "border-charcoal bg-charcoal text-ivory" : "border-line-strong")}>
        {checked && <Icon name="check" size={12} strokeWidth={2} />}
      </span>
      {swatch && <span className="size-3.5 rounded-full ring-1 ring-charcoal/15" style={{ background: swatch }} />}
      <span className={checked ? "text-charcoal" : "text-ink"}>{label}</span>
    </label>
  );
}
