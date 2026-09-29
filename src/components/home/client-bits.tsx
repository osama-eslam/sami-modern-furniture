"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/provider";
import { isOpenNow } from "@/lib/hours";
import { cn } from "@/lib/utils";

/** Moves its content at a fraction of the scroll speed (disabled for reduced motion). */
export function Parallax({ children, speed = 0.25, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.parentElement!.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);
  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  );
}

/** "Open now / Closed now" computed in Cairo time, client-only to avoid hydration drift. */
export function OpenStatus({ className }: { className?: string }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const tick = () => setOpen(isOpenNow());
    tick();
    const t = setInterval(tick, 60_000);
    return () => clearInterval(t);
  }, []);
  if (open === null) return <span className={className}>&nbsp;</span>;
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className={cn("relative size-2 rounded-full", open ? "bg-success" : "bg-taupe")}>
        {open && <span className="absolute inset-0 animate-ping rounded-full bg-success/60" />}
      </span>
      {open ? dict.showroom.openNow : dict.showroom.closedNow}
    </span>
  );
}
