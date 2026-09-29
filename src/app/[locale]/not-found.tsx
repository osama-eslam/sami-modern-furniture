"use client";

import Image from "next/image";
import Link from "next/link";
import { images } from "@/data/demo/images";
import { useI18n } from "@/i18n/provider";
import { Icon } from "@/components/ui/Icon";

export default function NotFound() {
  const { dict, href, t } = useI18n();
  const links = [
    ["/shop", dict.nav.shop],
    ["/categories", dict.nav.categories],
    ["/showroom", dict.nav.showroom],
    ["/contact", dict.nav.contact],
  ];
  return (
    <section className="container-x grid min-h-[80svh] gap-12 pt-[calc(var(--header-h)+var(--notice-h)+3rem)] pb-24 lg:grid-cols-12 lg:items-center lg:gap-16">
      <div className="lg:col-span-6">
        <p className="num text-[clamp(5rem,16vw,12rem)] font-extralight leading-none tracking-[-0.06em] text-stone" aria-hidden>
          404
        </p>
        <h1 className="font-display text-h1 mt-4">{dict.notFound.title}</h1>
        <p className="lead mt-6 max-w-md">{dict.notFound.body}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={href("/")} className="btn btn-primary">
            {dict.notFound.cta} <Icon name="arrow" size={16} className="flip-rtl" />
          </Link>
          <button type="button" onClick={() => history.back()} className="btn btn-outline">
            {dict.common.back}
          </button>
        </div>
        <ul className="mt-14 grid grid-cols-2 border-t hairline sm:grid-cols-4">
          {links.map(([h, l]) => (
            <li key={h} className="border-b hairline">
              <Link href={href(h)} className="group flex items-center justify-between gap-2 py-4 pe-4 text-sm">
                {l}
                <Icon name="arrowUpRight" size={14} className="flip-rtl text-mute transition-colors group-hover:text-charcoal" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative hidden aspect-[4/5] overflow-hidden bg-stone lg:col-span-5 lg:col-start-8 lg:block">
        <Image src={images.sparseRoom.src} alt={t(images.sparseRoom.alt)} fill sizes="40vw" className="object-cover" />
      </div>
    </section>
  );
}
