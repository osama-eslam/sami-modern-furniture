/**
 * Category structure. Names and slugs are structural (they match the rooms the
 * brand serves). Images are illustrative placeholders — see data/demo/images.ts.
 */
import type { Category } from "@/types/commerce";
import { images } from "./demo/images";

export const categories: Category[] = [
  { slug: "bedrooms", order: 1, featured: true, name: { ar: "غرف النوم", en: "Bedrooms" }, tagline: { ar: "هدوء يبدأ من التفاصيل", en: "Calm that starts with the details" }, image: images.bedroomDark },
  { slug: "living-rooms", order: 2, featured: true, name: { ar: "غرف المعيشة", en: "Living Rooms" }, tagline: { ar: "المكان اللي البيت كله بيتجمع فيه", en: "Where the whole home gathers" }, image: images.creamSectional },
  { slug: "dining-rooms", order: 3, featured: true, name: { ar: "غرف السفرة", en: "Dining Rooms" }, tagline: { ar: "لكل عزومة حكاية", en: "Every gathering, a story" }, image: images.diningGreen },
  { slug: "sofas", order: 4, featured: true, name: { ar: "الكنب", en: "Sofas" }, tagline: { ar: "راحة بتصميم", en: "Comfort, designed" }, image: images.sofaLeather },
  { slug: "corner-sofas", order: 5, name: { ar: "الركنات", en: "Corner Sofas" }, tagline: { ar: "مساحة أكبر للّمة", en: "More room to gather" }, image: images.cornerOrange },
  { slug: "tables", order: 6, featured: true, name: { ar: "الترابيزات", en: "Tables" }, tagline: { ar: "مركز كل غرفة", en: "The centre of every room" }, image: images.diningWood },
  { slug: "tv-units", order: 7, name: { ar: "وحدات التلفزيون", en: "TV Units" }, tagline: { ar: "ترتيب بأناقة", en: "Order, elegantly" }, image: images.tvWall },
  { slug: "libraries", order: 8, name: { ar: "المكتبات", en: "Libraries" }, tagline: { ar: "لكل ما تحب أن تعرضه", en: "For everything worth displaying" }, image: images.libraryLiving },
  { slug: "wardrobes", order: 9, name: { ar: "الدواليب", en: "Wardrobes" }, tagline: { ar: "تنظيم يليق بغرفتك", en: "Storage worthy of your room" }, image: images.wardrobe },
  { slug: "storage", order: 10, featured: true, name: { ar: "وحدات التخزين", en: "Storage" }, tagline: { ar: "كل حاجة في مكانها", en: "A place for everything" }, image: images.sideboardGreen },
  { slug: "kitchens", order: 11, name: { ar: "المطابخ", en: "Kitchens" }, tagline: { ar: "قلب البيت", en: "The heart of the home" }, image: images.kitchenDark },
  { slug: "office", order: 12, featured: true, name: { ar: "المكاتب", en: "Office" }, tagline: { ar: "تركيز بهدوء", en: "Focus, quietly" }, image: images.officeGreen },
  { slug: "accessories", order: 13, featured: true, name: { ar: "الإكسسوارات", en: "Accessories" }, tagline: { ar: "اللمسة الأخيرة", en: "The finishing touch" }, image: images.armchairYellow },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
