"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { articles } from "@/data/content/articles";
import { useI18n } from "@/i18n/provider";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Article } from "@/types/content";
import { Icon } from "../ui/Icon";

type Topic = "all" | Article["topic"];

export function ArticleCard({ article, index = 0, large }: { article: Article; index?: number; large?: boolean }) {
  const { dict, href, locale, t } = useI18n();
  return (
    <Link
      href={href(`/inspiration/${article.slug}`)}
      className={cn("group block", large && "md:grid md:grid-cols-12 md:items-end md:gap-10")}
      style={{ animation: `fade-up .9s cubic-bezier(.16,1,.3,1) ${Math.min(index, 8) * 70}ms both` }}
    >
      <div className={cn("relative overflow-hidden bg-stone", large ? "aspect-[4/3] md:col-span-8 md:aspect-[16/10]" : "aspect-[4/5]")}>
        <Image src={article.hero.src} alt={t(article.hero.alt)} fill sizes={large ? "(min-width:768px) 66vw, 100vw" : "(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"} className="zoom-on-hover object-cover" priority={large} />
      </div>
      <div className={cn(large ? "mt-6 md:col-span-4 md:mt-0 md:pb-4" : "mt-5")}>
        <p className="eyebrow text-mute">
          {dict.inspiration.topics[article.topic]} · <span className="num">{article.readingMinutes}</span> {dict.common.minutes}
        </p>
        <h3 className={cn("font-display mt-3 transition-colors group-hover:text-wood", large ? "text-h2" : "text-h3")}>{t(article.title)}</h3>
        <p className={cn("mt-3 leading-relaxed text-mute", large ? "text-base" : "text-sm")}>{t(article.excerpt)}</p>
        <p className="mt-5 flex items-center justify-between text-xs text-taupe">
          <time dateTime={article.publishedAt} className="num">
            {formatDate(article.publishedAt, locale)}
          </time>
          <span className="link-line label text-charcoal">
            {dict.common.readMore} <Icon name="arrow" size={14} className="flip-rtl" />
          </span>
        </p>
      </div>
    </Link>
  );
}

export function ArticleList() {
  const { dict } = useI18n();
  const [topic, setTopic] = useState<Topic>("all");
  const present = new Set(articles.map((a) => a.topic));
  const topics = (Object.keys(dict.inspiration.topics) as Topic[]).filter((k) => k === "all" || present.has(k as Article["topic"]));
  const list = topic === "all" ? articles : articles.filter((a) => a.topic === topic);
  const [lead, ...rest] = list;

  return (
    <>
      <div className="sticky top-[calc(var(--header-h)-1px)] z-20 border-y hairline bg-ivory/90 backdrop-blur-lg">
        <div className="container-x">
          <ul className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto py-3" aria-label={dict.inspiration.title}>
            {topics.map((k) => (
              <li key={k} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={topic === k}
                  onClick={() => setTopic(k)}
                  className={cn("h-10 whitespace-nowrap px-4 text-sm transition-colors duration-500", topic === k ? "bg-charcoal text-ivory" : "text-mute hover:text-charcoal")}
                >
                  {dict.inspiration.topics[k]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div key={topic} className="container-x pt-12 pb-24 md:pt-16 md:pb-32">
        {lead && <ArticleCard article={lead} large />}
        {rest.length > 0 && (
          <div className="mt-20 grid gap-x-6 gap-y-16 border-t hairline pt-14 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a, i) => (
              <ArticleCard key={a.slug} article={a} index={i + 1} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
