/**
 * SHIPPING CONFIGURATION
 * The existing samymodern.com states delivery fees are confirmed by the team
 * after ordering, so every fee is `null` ("confirmed by our team") and no
 * delivery durations are published. Fill in `fee` / `estimatedDays` per
 * governorate (or per city) once Samy Modern confirms them.
 */
import type { DeliveryMethod, Governorate } from "@/types/commerce";

const g = (id: string, ar: string, en: string): Governorate => ({ id, name: { ar, en }, fee: null, estimatedDays: null, enabled: true });

export const governorates: Governorate[] = [
  g("alexandria", "الإسكندرية", "Alexandria"),
  g("cairo", "القاهرة", "Cairo"),
  g("giza", "الجيزة", "Giza"),
  g("beheira", "البحيرة", "Beheira"),
  g("matrouh", "مطروح", "Matrouh"),
  g("kafr-el-sheikh", "كفر الشيخ", "Kafr El Sheikh"),
  g("gharbia", "الغربية", "Gharbia"),
  g("dakahlia", "الدقهلية", "Dakahlia"),
  g("monufia", "المنوفية", "Monufia"),
  g("qalyubia", "القليوبية", "Qalyubia"),
  g("sharqia", "الشرقية", "Sharqia"),
  g("damietta", "دمياط", "Damietta"),
  g("port-said", "بورسعيد", "Port Said"),
  g("ismailia", "الإسماعيلية", "Ismailia"),
  g("suez", "السويس", "Suez"),
  g("faiyum", "الفيوم", "Faiyum"),
  g("beni-suef", "بني سويف", "Beni Suef"),
  g("minya", "المنيا", "Minya"),
  g("assiut", "أسيوط", "Assiut"),
  g("sohag", "سوهاج", "Sohag"),
  g("qena", "قنا", "Qena"),
  g("luxor", "الأقصر", "Luxor"),
  g("aswan", "أسوان", "Aswan"),
  g("red-sea", "البحر الأحمر", "Red Sea"),
  g("new-valley", "الوادي الجديد", "New Valley"),
  g("north-sinai", "شمال سيناء", "North Sinai"),
  g("south-sinai", "جنوب سيناء", "South Sinai"),
];

export const shippingSettings = {
  /** e.g. 50000 → free delivery above 50,000 EGP. null = no free-shipping rule. */
  freeShippingThreshold: null as number | null,
};

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "home_delivery",
    enabled: true,
    name: { ar: "توصيل للمنزل", en: "Home delivery" },
    description: { ar: "يتواصل فريقنا معك لتأكيد موعد ورسوم التوصيل.", en: "Our team contacts you to confirm delivery date and fee." },
  },
  {
    // Disabled until Samy Modern confirms in-store collection.
    id: "showroom_pickup",
    enabled: false,
    name: { ar: "الاستلام من المعرض", en: "Collect from showroom" },
    description: { ar: "استلم طلبك من معرض فلمنج.", en: "Collect your order from the Fleming showroom." },
  },
];
