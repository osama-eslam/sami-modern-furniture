import Link from "next/link";
import { notFound } from "next/navigation";
import { policies, policyBySlug } from "@/data/content/policies";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatDate } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { whatsappLink } from "@/lib/whatsapp";
import { Icon } from "../ui/Icon";
import { PageHeader } from "../ui/primitives";

export async function policyMetadata(params: Promise<{ locale: string }>, slug: string) {
  const { locale } = await params;
  const doc = policyBySlug(slug);
  if (!isLocale(locale) || !doc) return {};
  return buildMetadata({ locale, path: `/${slug}`, title: doc.title[locale], description: doc.intro[locale] });
}

/** Shared layout for privacy / terms / shipping / returns. */
export async function PolicyPage({ params, slug }: { params: Promise<{ locale: string }>; slug: string }) {
  const { locale } = await params;
  const doc = policyBySlug(slug);
  if (!isLocale(locale) || !doc) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);

  return (
    <>
      <PageHeader
        eyebrow={`SAMY MODERN / ${dict.footer.policies}`}
        title={doc.title[locale]}
        body={doc.intro[locale]}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: doc.title[locale], href: h(`/${slug}`) },
        ]}
      />
      <div className="container-x grid gap-14 border-t hairline pt-12 pb-28 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-3">
          <nav aria-label={dict.footer.policies} className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <p className="eyebrow mb-5 text-mute">{dict.footer.policies}</p>
            <ul className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
              {policies.map((p) => (
                <li key={p.slug} className="shrink-0">
                  <Link
                    href={h(`/${p.slug}`)}
                    aria-current={p.slug === slug ? "page" : undefined}
                    className="block whitespace-nowrap border hairline px-4 py-2.5 text-sm transition-colors hover:border-charcoal aria-[current=page]:border-charcoal aria-[current=page]:bg-charcoal aria-[current=page]:text-ivory lg:border-0 lg:border-b lg:px-0 lg:py-3.5 lg:aria-[current=page]:bg-transparent lg:aria-[current=page]:text-charcoal lg:aria-[current=page]:font-medium"
                  >
                    {p.title[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <article className="lg:col-span-7 lg:col-start-5">
          {doc.updatedAt && (
            <p className="mb-10 text-xs text-mute">
              {dict.policies.updated}: <span className="num">{formatDate(doc.updatedAt, locale)}</span>
            </p>
          )}
          <ol className="space-y-12">
            {doc.sections.map((s, i) => (
              <li key={s.heading.en} className="grid gap-4 md:grid-cols-[3rem_1fr]" data-reveal>
                <span className="num pt-1.5 text-xs text-taupe">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="font-display text-h3">{s.heading[locale]}</h2>
                  {s.pending ? (
                    <div className="mt-5 border-s-2 border-bronze bg-paper px-5 py-4">
                      <p className="text-sm font-medium">{dict.policies.pending}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-mute">{dict.policies.pendingBody}</p>
                    </div>
                  ) : (
                    <p className="mt-4 text-[1.0625rem] leading-[1.85] text-ink">{s.body[locale]}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-20 flex flex-col gap-6 border-t hairline pt-10 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-display text-2xl">{dict.faq.still}</p>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm">
                <Icon name="whatsapp" size={16} /> {dict.nav.whatsapp}
              </a>
              <Link href={h("/contact")} className="btn btn-outline btn-sm">
                {dict.nav.contact}
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
