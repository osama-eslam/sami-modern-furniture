"use client";

import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { toast } from "@/store/stores";
import { Icon } from "./Icon";

/** Native share sheet where available, otherwise copies the link. */
export function ShareButton({ title, url, className, label }: { title: string; url?: string; className?: string; label?: string }) {
  const { dict } = useI18n();
  const share = async () => {
    const link = url ?? window.location.href;
    try {
      if (navigator.share) await navigator.share({ title, url: link });
      else {
        await navigator.clipboard.writeText(link);
        toast(dict.common.copied);
      }
    } catch {
      /* user cancelled */
    }
  };
  return (
    <button type="button" onClick={share} className={cn("inline-flex items-center gap-2", className)}>
      <Icon name="share" size={18} /> {label ?? dict.common.share}
    </button>
  );
}
