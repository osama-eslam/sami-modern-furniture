"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ui } from "@/store/stores";

/**
 * One IntersectionObserver for every [data-reveal] element on the page.
 * Re-scans when the route or DOM changes. No animation library needed.
 */
export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    const scan = () => document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => io.observe(el));
    scan();
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);
  return null;
}

/** Thin reading-progress line at the very top of the viewport. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (ref.current) ref.current.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} aria-hidden className="fixed inset-x-0 top-0 z-[120] h-px origin-left bg-bronze rtl:origin-right" style={{ transform: "scaleX(0)" }} />;
}

/** Subtle difference-blend cursor dot for fine pointers. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    const sync = () => setEnabled(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current!;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const loop = () => {
      cx += (x - cx) * 0.22;
      cy += (y - cy) * 0.22;
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      el.dataset.hover = String(!!t.closest("a, button, [role=button], label, summary, input, select, textarea"));
    };
    const leave = () => (el.style.opacity = "0");
    const enter = () => (el.style.opacity = "1");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
    };
  }, [enabled]);
  if (!enabled) return null;
  return <div ref={ref} aria-hidden className="cursor-dot" />;
}

/** Wrap a button/link to make it drift slightly toward the pointer. */
export function Magnetic({ children, strength = 0.25, className }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate3d(${dx * strength}px, ${dy * strength}px, 0)`;
    };
    const reset = () => (el.style.transform = "");
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
    };
  }, [strength]);
  return (
    <span ref={ref} className={`inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${className ?? ""}`}>
      {children}
    </span>
  );
}

/** Polite status toast (e.g. "link copied"). */
export function Toast() {
  const { toast } = ui.use();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const show = setTimeout(() => setVisible(true), 0);
    const hide = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [toast]);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-nav-h)+1.25rem)] z-[150] flex justify-center px-4">
      <div className={`bg-charcoal px-5 py-3 text-sm text-ivory transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>{toast?.text}</div>
    </div>
  );
}

/** Lock body scroll while any overlay is open. */
export function ScrollLock() {
  const { cartOpen, searchOpen, menuOpen, quickViewId } = ui.use();
  const locked = cartOpen || searchOpen || menuOpen || !!quickViewId;
  useEffect(() => {
    if (!locked) return;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [locked]);
  return null;
}

/** Close overlays on route change. */
export function RouteChangeReset() {
  const pathname = usePathname();
  useEffect(() => {
    ui.set((u) => ({ ...u, cartOpen: false, searchOpen: false, menuOpen: false, quickViewId: null }));
  }, [pathname]);
  return null;
}
