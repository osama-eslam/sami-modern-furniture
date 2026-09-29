"use client";

import { business } from "@/config/business";
import { useI18n } from "@/i18n/provider";
import { formatTime } from "@/lib/format";
import { todayIndex } from "@/lib/hours";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/store/create-store";

/** Week schedule starting Saturday (Egyptian week), with today highlighted in Cairo time. */
export function HoursTable({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const { dict, locale } = useI18n();
  // Client-only: "today" depends on the current time in Cairo.
  const today = useHydrated() ? todayIndex() : null;
  const order = [6, 0, 1, 2, 3, 4, 5];
  const light = tone === "light";

  return (
    <table className={cn("w-full text-sm", className)}>
      <caption className="sr-only">{dict.showroom.hours}</caption>
      <tbody className={cn("divide-y", light ? "divide-ivory/10" : "divide-line")}>
        {order.map((d) => {
          const h = business.hours.find((x) => x.day === d);
          const isToday = today === d;
          return (
            <tr key={d} className={cn(isToday && (light ? "text-ivory" : "text-charcoal"), !isToday && (light ? "text-ivory/60" : "text-mute"))}>
              <th scope="row" className="py-3 text-start font-normal">
                <span className="flex items-center gap-2">
                  {isToday && <span className="size-1.5 rounded-full bg-bronze" aria-hidden />}
                  <span className={cn(isToday && "font-medium")}>{dict.showroom.days[d]}</span>
                </span>
              </th>
              <td className="num py-3 text-end">{h ? `${formatTime(h.open, locale)} – ${formatTime(h.close, locale)}` : dict.showroom.closedNow}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
