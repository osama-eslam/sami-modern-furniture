import { business } from "@/config/business";

export const whatsappLink = (message?: string) =>
  `https://wa.me/${business.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

export const telLink = (e164: string) => `tel:${e164}`;
