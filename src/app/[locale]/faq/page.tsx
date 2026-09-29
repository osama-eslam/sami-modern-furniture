import Link from "next/link";
import { notFound } from "next/navigation";
import { business } from "@/config/business";
import { faqGroups } from "@/data/content/faq";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatPhone } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import { Icon } from "@/components/ui/Icon";
import { Accordion, JsonLd, PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/faq", title: dict.faq.title, description: dict.faq.body });
}

export default async function FaqPage({ params }: PageProps<"/[locale]/faq">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqGroups.flatMap((g) => g.items.map((i) => ({ "@type": "Question", name: i.q[locale], acceptedAnswer: { "@type": "Answer", text: i.a[locale] } }))),
        }}
      />
      <PageHeader
        eyebrow={dict.faq.eyebrow}
        title={dict.faq.title}
        body={dict.faq.body}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.faq, href: h("/faq") },
        ]}
      />

      <div className="container-x grid gap-14 border-t hairline pt-10 pb-24 lg:grid-cols-12 lg:gap-16 lg:pt-14">
        <aside className="lg:col-span-3">
          <nav aria-label={dict.nav.faq} className="sticky top-[calc(var(--header-h)-1px)] z-10 -mx-[var(--gutter)] border-b hairline bg-ivory/90 px-[var(--gutter)] backdrop-blur-lg lg:top-[calc(var(--header-h)+2rem)] lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:backdrop-blur-none">
            <ul className="no-scrollbar flex gap-6 overflow-x-auto py-4 text-sm lg:flex-col lg:gap-0 lg:py-0">
              {faqGroups.map((g, i) => (
                <li key={g.id} className="shrink-0 lg:border-b lg:hairline">
                  <a href={`#${g.id}`} className="group flex items-baseline gap-3 whitespace-nowrap hover:text-wood lg:py-3.5">
                    <span className="num hidden text-[10px] text-taupe lg:inline">{String(i + 1).padStart(2, "0")}</span>
                    {g.title[locale]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-20 lg:col-span-8 lg:col-start-5">
          {faqGroups.map((g, i) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-t`} className="scroll-mt-[calc(var(--header-h)+5rem)]">
              <div className="mb-6 flex items-baseline gap-4">
                <span className="num text-xs text-taupe">{String(i + 1).padStart(2, "0")}</span>
                <h2 id={`${g.id}-t`} className="font-display text-h3">
                  {g.title[locale]}
                </h2>
              </div>
              <Accordion name={`faq-${g.id}`} items={g.items.map((it) => ({ title: it.q[locale], content: it.a[locale] }))} />
            </section>
          ))}
        </div>
      </div>

      <section className="bg-charcoal text-ivory on-dark">
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:items-end md:py-28">
          <div className="md:col-span-7">
            <p className="eyebrow mb-5 text-ivory/50">SAMY MODERN / SUPPORT</p>
            <h2 className="font-display text-h1">{dict.faq.still}</h2>
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <a href={whatsappLink(dict.whatsappMessages.general)} target="_blank" rel="noopener noreferrer" className="btn btn-light">
              <Icon name="whatsapp" size={18} /> {dict.common.chatWhatsapp}
            </a>
            <a href={telLink(business.phones.primary)} className="btn btn-ghost-light">
              <Icon name="phone" size={16} /> <span className="num" dir="ltr">{formatPhone(business.phones.primary)}</span>
            </a>
            <Link href={h("/contact")} className="btn btn-ghost-light">
              {dict.nav.contact}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
