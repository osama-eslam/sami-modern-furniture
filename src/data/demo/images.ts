/**
 * ILLUSTRATIVE IMAGERY (Unsplash) — NOT Samy Modern products or spaces.
 * Every asset built from here is flagged `illustrative: true` so the UI can
 * caption it. Replace with the brand's own photography: swap the `src` values
 * (or point them to /public/images/...) and drop the flag.
 */
import type { ImageAsset, L10n } from "@/types/content";

const u = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2400&q=80`;

const img = (id: string, alt: L10n): ImageAsset => ({ src: u(id), alt, illustrative: true });

export const images = {
  heroLiving: img("1618221195710-dd6b41faaea6", { ar: "غرفة معيشة مودرن بإضاءة طبيعية دافئة", en: "Modern living room in warm natural light" }),
  openLiving: img("1600607687939-ce8a6c25118c", { ar: "مساحة معيشة مفتوحة بتصميم معاصر", en: "Open-plan contemporary living space" }),
  creamSectional: img("1616486338812-3dadae4b4ace", { ar: "كنبة ركنة بلون الكريم في غرفة معيشة هادئة", en: "Cream sectional sofa in a calm living room" }),
  editorialLiving: img("1600210492486-724fe5c67fb0", { ar: "غرفة معيشة بأثاث خشبي ومقاعد جلدية", en: "Living room with wood and leather pieces" }),
  creamLiving: img("1631679706909-1844bbd07221", { ar: "ليفينج بألوان الكريم والبيج", en: "Living room in cream and beige tones" }),
  brightLiving: img("1633505899118-4ca6bd143043", { ar: "ليفينج مضيء بنباتات خضراء", en: "Bright living room with greenery" }),
  libraryLiving: img("1598928506311-c55ded91a20c", { ar: "غرفة معيشة بمكتبة مدمجة", en: "Living room with built-in shelving" }),
  whiteLiving: img("1613545325278-f24b0cae1224", { ar: "غرفة معيشة بيضاء بمدفأة", en: "White living room with fireplace" }),
  greyLiving: img("1583847268964-b28dc8f51f92", { ar: "كنبة رمادية مع طاولة خشبية", en: "Grey sofa with wooden coffee table" }),
  bohoLiving: img("1556228453-efd6c1ff04f6", { ar: "غرفة معيشة بكنبة جلد عسلي", en: "Living room with a cognac leather sofa" }),
  loftLiving: img("1554995207-c18c203602cb", { ar: "ليفينج مفتوح بإضاءة طبيعية", en: "Open living with natural light" }),
  greyRoom: img("1616137466211-f939a420be84", { ar: "غرفة معيشة رمادية كلاسيكية", en: "Classic grey living room" }),
  sparseRoom: img("1484101403633-562f891dc89a", { ar: "غرفة بسيطة بكنبة واحدة", en: "A sparse room with a single sofa" }),
  tuftedSofaRoom: img("1493663284031-b7e3aefcae8e", { ar: "كنبة كابتونيه رمادية", en: "Grey tufted sofa" }),

  bedroomDark: img("1616594039964-ae9021a400a0", { ar: "غرفة نوم فاخرة بألوان داكنة", en: "Luxurious dark-toned bedroom" }),
  bedroomNoir: img("1617104678098-de229db51175", { ar: "غرفة نوم بحائط داكن وإطلالة على الأشجار", en: "Bedroom with a dark wall and garden view" }),
  bedroomArt: img("1617098900591-3f90928e8c54", { ar: "غرفة نوم مع نجفة كريستال", en: "Bedroom with a crystal chandelier" }),
  bedroomRust: img("1616627561839-074385245ff6", { ar: "سرير بمفارش بلون الصدأ", en: "Bed dressed in rust-toned linen" }),
  bedroomHeadboard: img("1631049307264-da0ec9d70304", { ar: "سرير بظهر منجّد رمادي", en: "Bed with a grey upholstered headboard" }),
  bedroomPlants: img("1615874959474-d609969a20ed", { ar: "غرفة نوم هادئة بالنباتات", en: "Calm bedroom with plants" }),
  bedroomWhite: img("1595526114035-0d45ed16cfbf", { ar: "غرفة نوم بيضاء مضيئة", en: "Bright white bedroom" }),
  bedroomClassic: img("1505693416388-ac5ce068fe85", { ar: "غرفة نوم بسرير كابتونيه", en: "Bedroom with a tufted bed" }),
  bedroomNight: img("1522771739844-6a9f6d5f14af", { ar: "كومودينو وأباجورة بجوار السرير", en: "Nightstand and lamp beside the bed" }),

  diningGreen: img("1617806118233-18e1de247200", { ar: "سفرة بكراسي مخمل خضراء", en: "Dining table with green velvet chairs" }),
  diningWood: img("1604578762246-41134e37f9cc", { ar: "طاولة سفرة خشبية", en: "Solid wood dining table" }),
  diningSmall: img("1519710164239-da123dc03ef4", { ar: "ركن سفرة صغير مضيء", en: "Small bright dining corner" }),

  sofaLeather: img("1540574163026-643ea20ade25", { ar: "كنبة جلد عسلي ثلاثية", en: "Three-seat cognac leather sofa" }),
  sofaVelvet: img("1555041469-a586c61ea9bc", { ar: "كنبة مخمل خضراء", en: "Green velvet sofa" }),
  sofaCream: img("1512212621149-107ffe572d2f", { ar: "كنبة مزدوجة بلون الكريم", en: "Cream two-seat sofa" }),
  sofaOrange: img("1567016432779-094069958ea5", { ar: "تفاصيل كنبة برتقالية", en: "Detail of an orange sofa" }),
  cornerOrange: img("1616047006789-b7af5afb8c20", { ar: "ركنة بلون الكراميل", en: "Caramel corner sofa" }),
  cornerDark: img("1550581190-9c1c48d21d6c", { ar: "ركنة رمادية داكنة", en: "Charcoal corner sofa" }),

  sideTable: img("1532372320572-cda25653a26d", { ar: "ترابيزة جانبية خشبية", en: "Wooden side table" }),
  tvWall: img("1594026112284-02bb6f3352fe", { ar: "وحدة تلفزيون خشبية معلّقة", en: "Floating wooden TV unit" }),
  tvDark: img("1600121848594-d8644e57abab", { ar: "وحدة تلفزيون ومكتبة داكنة", en: "Dark TV and shelving unit" }),
  wardrobe: img("1558997519-83ea9252edf8", { ar: "دولاب خشبي بدرفتين", en: "Two-door wooden wardrobe" }),
  sideboardGreen: img("1616046229478-9901c5536a45", { ar: "بوفيه خشبي على حائط أخضر", en: "Wooden sideboard on a green wall" }),
  consoleRattan: img("1618219908412-a29a1bb7b86e", { ar: "كونسول بواجهة من الخيزران", en: "Console with rattan fronts" }),
  consoleGold: img("1618220179428-22790b461013", { ar: "كونسول ذهبي مع كرسي برتقالي", en: "Brass console with an orange chair" }),

  kitchenWhite: img("1541123437800-1bb1317badc2", { ar: "مطبخ أبيض بإضاءة معلّقة", en: "White kitchen with pendant lights" }),
  kitchenDetail: img("1565538810643-b5bdb714032a", { ar: "تفاصيل رخام وخلاط نحاسي", en: "Marble and brass tap detail" }),
  kitchenDark: img("1588854337236-6889d631faa8", { ar: "مطبخ بدواليب داكنة وجزيرة رخام", en: "Dark kitchen with a marble island" }),

  officeGreen: img("1600494603989-9650cf6ddd3d", { ar: "مكتب منزلي بحائط أخضر", en: "Home office with a green wall" }),
  deskMinimal: img("1611269154421-4e27233ac5c7", { ar: "مكتب خشبي بسيط", en: "Minimal wooden desk" }),
  wallDesk: img("1597072689227-8882273e8f6a", { ar: "مكتب معلّق ورف خشبي", en: "Wall-mounted desk and shelf" }),
  lounge: img("1524758631624-e2822e304c36", { ar: "مساحة جلوس بإضاءة أرضية", en: "Lounge with a floor lamp" }),

  armchairYellow: img("1586023492125-27b2c045efd7", { ar: "فوتيه أصفر بجوار أباجورة", en: "Yellow armchair beside a floor lamp" }),
  loungeChair: img("1580480055273-228ff5388ef8", { ar: "كرسي استرخاء من القماش", en: "Upholstered lounge chair" }),
  chairPlant: img("1519947486511-46149fa0a254", { ar: "كرسي أبيض ونبات", en: "White chair and plant" }),
  chairBlack: img("1592078615290-033ee584e267", { ar: "كرسي أسود بأرجل خشبية", en: "Black chair with wooden legs" }),
  stool: img("1581539250439-c96689b516dd", { ar: "كرسي بار بأرجل خشبية", en: "Bar stool with wooden legs" }),
  loft: img("1538688525198-9b88f6f53126", { ar: "مساحة عرض واسعة بأثاث متنوع", en: "Large space furnished with mixed pieces" }),
  livingChairs: img("1503174971373-b1f69850bded", { ar: "جلسة بكراسي داكنة", en: "Seating with dark armchairs" }),
  stairs: img("1502005229762-cf1b2da7c5d6", { ar: "درج خشبي بإضاءة معلّقة", en: "Wooden staircase with pendant lights" }),
};

export type ImageKey = keyof typeof images;
