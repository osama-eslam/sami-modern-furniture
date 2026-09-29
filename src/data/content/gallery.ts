/**
 * GALLERY — illustrative placeholders. Replace with real Samy Modern project,
 * showroom and detail photography. The "showroom" filter stays empty until
 * real showroom photos are added (we never label stock photos as the showroom).
 */
import type { GalleryItem } from "@/types/content";
import { images } from "../demo/images";

export const galleryItems: GalleryItem[] = [
  { id: "g1", category: "living", image: images.openLiving, ratio: "landscape", caption: { ar: "معيشة مفتوحة", en: "Open living" } },
  { id: "g2", category: "bedrooms", image: images.bedroomDark, ratio: "portrait", caption: { ar: "غرفة نوم داكنة", en: "Dark bedroom" } },
  { id: "g3", category: "details", image: images.kitchenDetail, ratio: "square", caption: { ar: "رخام ونحاس", en: "Marble & brass" } },
  { id: "g4", category: "sofas", image: images.sofaVelvet, ratio: "landscape", caption: { ar: "قطيفة خضراء", en: "Green velvet" } },
  { id: "g5", category: "dining", image: images.diningGreen, ratio: "portrait", caption: { ar: "سفرة للّمة", en: "Dining for gatherings" } },
  { id: "g6", category: "living", image: images.creamSectional, ratio: "portrait", caption: { ar: "درجات الكريم", en: "Cream tones" } },
  { id: "g7", category: "details", image: images.sideTable, ratio: "portrait", caption: { ar: "ملمس الخشب", en: "Timber texture" } },
  { id: "g8", category: "bedrooms", image: images.bedroomRust, ratio: "landscape", caption: { ar: "مفارش دافية", en: "Warm linen" } },
  { id: "g9", category: "sofas", image: images.cornerOrange, ratio: "square", caption: { ar: "ركنة كراميل", en: "Caramel corner" } },
  { id: "g10", category: "living", image: images.libraryLiving, ratio: "landscape", caption: { ar: "مكتبة مدمجة", en: "Built-in library" } },
  { id: "g11", category: "details", image: images.consoleRattan, ratio: "portrait", caption: { ar: "خيزران طبيعي", en: "Natural rattan" } },
  { id: "g12", category: "dining", image: images.diningWood, ratio: "landscape", caption: { ar: "خشب طبيعي", en: "Natural wood" } },
  { id: "g13", category: "bedrooms", image: images.bedroomArt, ratio: "square", caption: { ar: "لمسة كريستال", en: "A touch of crystal" } },
  { id: "g14", category: "sofas", image: images.sofaLeather, ratio: "landscape", caption: { ar: "جلد عسلي", en: "Cognac leather" } },
  { id: "g15", category: "living", image: images.editorialLiving, ratio: "portrait", caption: { ar: "خشب وجلد", en: "Wood & leather" } },
  { id: "g16", category: "details", image: images.chairPlant, ratio: "square", caption: { ar: "ضوء وظل", en: "Light & shade" } },
];

/** Before/after pairs. Illustrative concept only — replace with real projects. */
export const beforeAfterPairs = [
  { id: "ba1", before: images.sparseRoom, after: images.creamSectional, caption: { ar: "ليفينج — فكرة توضيحية", en: "Living room — concept illustration" } },
];
