import { notFound } from "next/navigation";
import { business } from "@/config/business";
import { isLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatPhone, formatTime } from "@/lib/format";
import { buildMetadata } from "@/lib/seo";
import { telLink, whatsappLink } from "@/lib/whatsapp";
import { ContactForm } from "@/components/forms/ContactForm";
import { OpenStatus } from "@/components/home/client-bits";
import { SocialLinks } from "@/components/layout/Footer";
import { Icon, type IconName } from "@/components/ui/Icon";
import { PageHeader } from "@/components/ui/primitives";

export async function generateMetadata({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: "/contact", title: dict.contact.title, description: dict.contact.body });
}

export default async function ContactPage({ params }: PageProps<"/[locale]/contact">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const h = (p: string) => localePath(locale, p);
  const weekday = business.hours.find((x) => x.day === 1)!;
  const weekend = business.hours.find((x) => x.day === 5)!;
  const phones = [business.phones.primary, ...business.phones.secondary, business.phones.landline];

  const channels: { icon: IconName; label: string; value: string; href: string; external?: boolean; dark?: boolean }[] = [
    { icon: "whatsapp", label: dict.nav.whatsapp, value: formatPhone(business.phones.primary), href: whatsappLink(dict.whatsappMessages.general), external: true, dark: true },
    { icon: "phone", label: dict.common.callUs, value: formatPhone(business.phones.primary), href: telLink(business.phones.primary) },
    { icon: "mail", label: dict.contact.emails, value: business.emails.info, href: `mailto:${business.emails.info}` },
  ];

  return (
    <>
      <PageHeader
        eyebrow={dict.contact.eyebrow}
        title={dict.contact.title}
        body={dict.contact.body}
        breadcrumbs={[
          { name: dict.nav.home, href: h("/") },
          { name: dict.nav.contact, href: h("/contact") },
        ]}
      />

      {/* Quick channels */}
      <div className="container-x">
        <ul className="grid border-y hairline md:grid-cols-3">
          {channels.map((ch, i) => (
            <li key={ch.icon} className={i < channels.length - 1 ? "border-b hairline md:border-b-0 md:border-e" : ""}>
              <a
                href={ch.href}
                {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group flex items-center gap-5 py-6 md:px-6 md:py-8"
                style={i === 0 ? { paddingInlineStart: 0 } : undefined}
              >
                <span className={`grid size-12 shrink-0 place-items-center transition-colors duration-500 ${ch.dark ? "bg-[#1f3b2d] text-ivory" : "border hairline group-hover:bg-charcoal group-hover:text-ivory"}`}>
                  <Icon name={ch.icon} size={21} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="eyebrow block text-mute">{ch.label}</span>
                  <span className={`mt-1 block truncate text-lg ${ch.icon === "mail" ? "" : "num"}`} dir="ltr">
                    {ch.value}
                  </span>
                </span>
                <Icon name="arrowUpRight" size={18} className="flip-rtl shrink-0 text-mute transition-transform duration-500 group-hover:-translate-y-1" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="container-x grid gap-16 py-20 md:py-28 lg:grid-cols-12 lg:gap-20">
        <section className="lg:col-span-7" aria-labelledby="form-title">
          <h2 id="form-title" className="font-display text-h2 mb-12">
            {dict.contact.formTitle}
          </h2>
          <ContactForm />
        </section>

        <aside className="space-y-12 lg:col-span-4 lg:col-start-9">
          <div>
            <p className="eyebrow mb-5 text-mute">{dict.contact.channels}</p>
            <ul className="divide-y hairline border-y hairline text-sm">
              {phones.map((p) => (
                <li key={p}>
                  <a href={telLink(p)} className="flex items-center justify-between py-3.5 transition-colors hover:text-wood">
                    <span className="num" dir="ltr">
                      {formatPhone(p)}
                    </span>
                    <Icon name="phone" size={16} className="text-mute" />
                  </a>
                </li>
              ))}
              {Object.values(business.emails).map((m) => (
                <li key={m}>
                  <a href={`mailto:${m}`} className="flex items-center justify-between py-3.5 transition-colors hover:text-wood">
                    <span dir="ltr">{m}</span>
                    <Icon name="mail" size={16} className="text-mute" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-mute">{dict.showroom.branches}</p>
            <ul className="space-y-7">
              {business.branches.map((b) => (
                <li key={b.id} className="border-s-2 border-bronze ps-5">
                  <p className="font-medium">{b.name[locale]}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-mute">{b.address[locale]}</p>
                  {b.landmark && <p className="mt-1 text-xs text-taupe">{b.landmark[locale]}</p>}
                  <a href={b.directionsUrl ?? b.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-3 text-xs">
                    <Icon name="pin" size={14} /> {dict.common.getDirections}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-5 text-mute">{dict.showroom.hours}</p>
            <OpenStatus className="mb-3 text-sm" />
            <p className="num text-sm leading-relaxed">
              {dict.showroom.days[6]} – {dict.showroom.days[4]}: {formatTime(weekday.open, locale)} – {formatTime(weekday.close, locale)}
              <br />
              {dict.showroom.days[5]} & {dict.showroom.days[0]}: {formatTime(weekend.open, locale)} – {formatTime(weekend.close, locale)}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5 text-mute">{dict.contact.social}</p>
            <SocialLinks className="flex gap-2 text-charcoal [&_a]:border-line-strong [&_a:hover]:bg-charcoal [&_a:hover]:text-ivory" />
          </div>
        </aside>
      </div>
    </>
  );
}
