"use client";

import { useEffect, useRef } from "react";

/**
 * Accessible dialog behaviour: focus the panel on open, trap Tab inside,
 * close on Escape, restore focus to the trigger on close.
 */
export function useDialog<T extends HTMLElement>(open: boolean, onClose: () => void) {
  const ref = useRef<T>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const panel = ref.current;
    const previous = document.activeElement as HTMLElement | null;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])') ?? [],
      ).filter((el) => el.offsetParent !== null);

    const t = setTimeout(() => {
      const auto = panel?.querySelector<HTMLElement>("[data-autofocus]");
      (auto ?? focusables()[0] ?? panel)?.focus();
    }, 60);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeRef.current();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables();
      if (!list.length) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open]);

  return ref;
}
