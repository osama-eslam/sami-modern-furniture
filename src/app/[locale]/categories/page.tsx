import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, fmt } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { categoryCounts, sortedCategories } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";
import { Icon } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/categories">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildMetadata({ locale, path: "/categories", title: getDictionary(locale).shop.categoriesTitle });
}

export default async function CategoriesPage({ params }: PageProps<"/[locale]/categories">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const counts = categoryCounts();
  const cats = sortedCategories();

  return (
    <>
      <PageHeader
        eyebrow={dict.shop.categoriesEyebrow}
        title={dict.shop.categoriesTitle}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.categories, href: h("/categories") },
        ]}
      />
      <section className="container-x pb-28">
        <ul className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c, i) => (
            <li key={c.slug} data-reveal style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties} className={i % 3 === 1 ? "lg:mt-20" : ""}>
              <Link href={h(`/categories/${c.slug}`)} className="group block">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                  <Image src={c.image.src} alt={c.image.alt[locale]} fill sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" className="zoom-on-hover object-cover" />
                  <span className="num absolute start-5 top-5 bg-ivory/85 px-2 py-1 text-[10px] tracking-widest backdrop-blur">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <div className="mt-5 flex items-start justify-between gap-4 border-t hairline pt-5">
                  <div>
                    <h2 className="font-display text-h3">{c.name[locale]}</h2>
                    <p className="mt-2 text-sm text-mute">{c.tagline[locale]}</p>
                  </div>
                  <span className="flex items-center gap-3 text-xs text-mute">
                    <span className="num">{fmt(dict.common.items, { count: counts[c.slug] ?? 0 })}</span>
                    <Icon name="arrowUpRight" size={18} className="flip-rtl transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
