export const cn = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(" ");

export const uid = (prefix = "") =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/** Egyptian mobile (01x…) or +20 international. */
export const isValidEgPhone = (v: string) => /^(\+?20|0)?1[0125]\d{8}$/.test(v.replace(/[\s-]/g, ""));
export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const normalizePhone = (v: string) => {
  const digits = v.replace(/[^\d+]/g, "");
  if (digits.startsWith("+20")) return digits;
  if (digits.startsWith("20")) return `+${digits}`;
  if (digits.startsWith("0")) return `+2${digits}`;
  return `+20${digits}`;
};
