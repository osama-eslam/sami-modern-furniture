/**
 * Editorial journal. General design guidance written for the site — no claims
 * about the business. Hero images are illustrative placeholders.
 */
import type { Article } from "@/types/content";
import { images } from "../demo/images";

export const articles: Article[] = [
  {
    slug: "living-room-layout",
    topic: "living",
    title: { ar: "ليفينج يتعاش فيه: خمس قواعد للتوزيع", en: "A living room to live in: five layout rules" },
    excerpt: { ar: "قبل ما تختار الكنبة، اختار إزاي هتتحرك في المكان.", en: "Before choosing the sofa, decide how you'll move through the room." },
    hero: images.editorialLiving,
    readingMinutes: 4,
    publishedAt: "2026-09-10",
    body: [
      { heading: { ar: "ابدأ بالحركة", en: "Start with movement" }, text: { ar: "سيب ممر لا يقل عن 80 سم بين القطع الأساسية. الغرفة اللي بتتنفس بتبان أوسع وأغلى.", en: "Leave at least 80 cm of walkway between key pieces. A room that breathes looks larger — and more expensive." } },
      { heading: { ar: "نقطة تركيز واحدة", en: "One focal point" }, text: { ar: "شاشة، شباك أو حيطة فنية — اختار واحدة ورتّب الجلسة حواليها.", en: "A screen, a window or an art wall — pick one and arrange the seating around it." }, image: images.creamLiving },
      { heading: { ar: "السجادة بتجمع", en: "The rug unites" }, text: { ar: "خلي الأرجل الأمامية للكنب والفوتيهات على السجادة علشان الجلسة تبان وحدة واحدة.", en: "Keep the front legs of sofas and chairs on the rug so the seating reads as one group." } },
      { heading: { ar: "طبقات إضاءة", en: "Layer the light" }, text: { ar: "إضاءة سقف، أباجورة أرضية ولمبة جانبية — تلات مستويات بتغيّر إحساس الغرفة بالليل.", en: "Ceiling light, floor lamp and a table lamp — three levels that transform the room at night." } },
    ],
    relatedCategories: ["living-rooms", "sofas", "tables"],
    relatedProducts: ["p-milan-living", "p-elena-sofa", "p-orbit-coffee-table"],
  },
  {
    slug: "calm-bedroom",
    topic: "bedroom",
    title: { ar: "غرفة نوم هادية: الألوان والخامات", en: "The calm bedroom: colour and texture" },
    excerpt: { ar: "الهدوء مش لون واحد — هو طبقات من الملمس.", en: "Calm isn't one colour — it's layers of texture." },
    hero: images.bedroomHeadboard,
    readingMinutes: 3,
    publishedAt: "2026-08-28",
    body: [
      { heading: { ar: "ظهر السرير هو البطل", en: "The headboard leads" }, text: { ar: "ظهر منجّد بيدّي دفا وبيمتص الصوت — وبيحدد طابع الغرفة كلها.", en: "An upholstered headboard adds warmth, softens sound and sets the tone for the whole room." } },
      { heading: { ar: "تلات درجات بس", en: "Only three tones" }, text: { ar: "لون أساسي، لون مساعد ولمسة داكنة. أكتر من كده الغرفة بتتلخبط.", en: "A base, a supporting tone and one dark accent. More than that and the room gets noisy." }, image: images.bedroomPlants },
      { heading: { ar: "تخزين مخفي", en: "Hidden storage" }, text: { ar: "دولاب بدرف ناعمة ومقابض مخفية بيخلّي الحيطة تبان هادية.", en: "A wardrobe with flush doors and concealed handles keeps the wall quiet." } },
    ],
    relatedCategories: ["bedrooms", "wardrobes"],
    relatedProducts: ["p-mini-moka-bedroom", "p-halo-wardrobe", "p-vela-nightstand"],
  },
  {
    slug: "dining-for-gatherings",
    topic: "dining",
    title: { ar: "سفرة للّمة: المقاسات الصح", en: "Dining for gatherings: getting the sizes right" },
    excerpt: { ar: "كل كرسي محتاج حوالي 60 سم — والباقي تفاصيل.", en: "Every chair needs about 60 cm — the rest is detail." },
    hero: images.diningGreen,
    readingMinutes: 3,
    publishedAt: "2026-08-12",
    body: [
      { heading: { ar: "المسافة حوالين الترابيزة", en: "Clearance around the table" }, text: { ar: "سيب حوالي 90 سم من طرف الترابيزة للحيطة علشان الكراسي تتسحب براحة.", en: "Allow about 90 cm from the table edge to the wall so chairs pull out comfortably." } },
      { heading: { ar: "الإضاءة فوق الترابيزة", en: "Light over the table" }, text: { ar: "النجفة تكون تقريباً على ارتفاع 75 سم فوق سطح الترابيزة.", en: "Hang the pendant roughly 75 cm above the tabletop." }, image: images.diningWood },
      { heading: { ar: "البوفيه يكمّل", en: "The sideboard completes" }, text: { ar: "بوفيه منخفض بيدّي مكان للتقديم وبيوازن الحيطة.", en: "A low sideboard gives you a serving surface and balances the wall." } },
    ],
    relatedCategories: ["dining-rooms", "tables", "storage"],
    relatedProducts: ["p-modern-dining", "p-oak-dining-table", "p-terra-sideboard"],
  },
  {
    slug: "small-spaces",
    topic: "small-spaces",
    title: { ar: "مساحات صغيرة، أفكار كبيرة", en: "Small spaces, big ideas" },
    excerpt: { ar: "القطع المعلّقة والأرجل الرفيعة بتكبّر أي غرفة.", en: "Floating pieces and slim legs make any room feel larger." },
    hero: images.wallDesk,
    readingMinutes: 3,
    publishedAt: "2026-07-30",
    body: [
      { heading: { ar: "فرّغ الأرضية", en: "Clear the floor" }, text: { ar: "وحدات التلفزيون والمكاتب المعلّقة بتخلّي العين تشوف أرضية أكتر.", en: "Floating TV units and desks let the eye see more floor." } },
      { heading: { ar: "قطع بوظيفتين", en: "Pieces with two jobs" }, text: { ar: "ترابيزة وسط بتخزين، سرير بأدراج، كونسول بيبقى مكتب.", en: "A coffee table with storage, a bed with drawers, a console that doubles as a desk." }, image: images.tvWall },
      { heading: { ar: "ألوان فاتحة ولمسة داكنة", en: "Light tones, one dark note" }, text: { ar: "الحيطان الفاتحة بتوسّع، ولمسة داكنة واحدة بتدّي عمق.", en: "Light walls open the room; one dark accent gives it depth." } },
    ],
    relatedCategories: ["office", "tv-units", "storage"],
    relatedProducts: ["p-float-wall-desk", "p-nova-tv-unit", "p-smart-storage"],
  },
  {
    slug: "warm-neutrals",
    topic: "color",
    title: { ar: "الألوان المحايدة الدافية", en: "Warm neutrals" },
    excerpt: { ar: "العاجي والرملي والحجري — لوحة ما بتقدمش.", en: "Ivory, sand and stone — a palette that doesn't date." },
    hero: images.creamSectional,
    readingMinutes: 2,
    publishedAt: "2026-07-14",
    body: [
      { heading: { ar: "ابدأ بالعاجي", en: "Begin with ivory" }, text: { ar: "العاجي أدفى من الأبيض وبيتماشى مع الخشب الطبيعي.", en: "Ivory is warmer than white and pairs naturally with timber." } },
      { heading: { ar: "أضف ملمس", en: "Add texture" }, text: { ar: "كتان، بوكليه وخيزران — الملمس بيعوّض قلة الألوان.", en: "Linen, bouclé and rattan — texture makes up for a restrained palette." }, image: images.brightLiving },
    ],
    relatedCategories: ["living-rooms", "sofas"],
    relatedProducts: ["p-milan-living", "p-cove-lounge"],
  },
  {
    slug: "pairing-pieces",
    topic: "combinations",
    title: { ar: "إزاي تنسّق القطع مع بعض", en: "How to pair pieces" },
    excerpt: { ar: "مش لازم كل حاجة تبقى من نفس الطقم.", en: "Not everything has to come from the same set." },
    hero: images.bohoLiving,
    readingMinutes: 3,
    publishedAt: "2026-06-30",
    body: [
      { heading: { ar: "خيط مشترك", en: "A common thread" }, text: { ar: "لون خشب واحد أو معدن واحد بيربط قطع مختلفة.", en: "One wood tone or one metal finish ties different pieces together." } },
      { heading: { ar: "قطعة بطلة", en: "One hero piece" }, text: { ar: "فوتيه بلون جريء وسط ألوان هادية بيدّي الغرفة شخصية.", en: "A boldly coloured armchair among calm tones gives the room character." }, image: images.armchairYellow },
    ],
    relatedCategories: ["accessories", "living-rooms"],
    relatedProducts: ["p-arc-armchair", "p-elena-sofa", "p-orbit-coffee-table"],
  },
  {
    slug: "complete-home",
    topic: "interior",
    title: { ar: "من الفكرة للبيت المتكامل", en: "From idea to a complete home" },
    excerpt: { ar: "لما كل عناصر المكان تبقى جزء من تصميم واحد.", en: "When every element of a space belongs to one design." },
    hero: images.openLiving,
    readingMinutes: 4,
    publishedAt: "2026-06-12",
    body: [
      { heading: { ar: "تصميم واحد", en: "One design" }, text: { ar: "الأثاث والمطبخ والستائر والإضاءة لما يتصمموا مع بعض، النتيجة بتبقى متناسقة أكتر.", en: "When furniture, kitchen, curtains and lighting are designed together, the result is simply more coherent." } },
      { heading: { ar: "قرارات بالترتيب", en: "Decisions in order" }, text: { ar: "الفكرة ← التصميم ← الخامات والألوان ← الأثاث ← التفاصيل. كل خطوة بتسهّل اللي بعدها.", en: "Idea → design → materials & colours → furniture → details. Each step makes the next easier." }, image: images.kitchenDark },
    ],
    relatedCategories: ["kitchens", "living-rooms", "bedrooms"],
    relatedProducts: ["p-atelier-kitchen", "p-milan-living"],
  },
];

export const articleBySlug = (slug: string) => articles.find((a) => a.slug === slug);
