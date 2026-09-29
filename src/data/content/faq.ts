/**
 * FAQ — answers only state what is verified (address, hours, phones,
 * "delivery fee confirmed by the team") or describe how this website works.
 * Anything policy-related points to the team until Samy Modern confirms it.
 */
import type { FaqGroup } from "@/types/content";

export const faqGroups: FaqGroup[] = [
  {
    id: "orders",
    title: { ar: "الطلبات", en: "Orders" },
    items: [
      { q: { ar: "إزاي أطلب من الموقع؟", en: "How do I order on the website?" }, a: { ar: "اختار القطعة والاختيارات المناسبة، أضفها للسلة، ثم أكمل بيانات التوصيل وأكّد الطلب. فريقنا بيتواصل معاك لتأكيد التفاصيل.", en: "Choose a piece and its options, add it to your cart, then complete your delivery details and place the order. Our team contacts you to confirm the details." } },
      { q: { ar: "إزاي أتابع طلبي؟", en: "How do I track my order?" }, a: { ar: "من صفحة تتبع الطلب باستخدام رقم الطلب ورقم الموبايل، أو من قسم طلباتي في حسابك.", en: "Use the Track Order page with your order number and phone, or open Orders in your account." } },
      { q: { ar: "أقدر أطلب عن طريق واتساب؟", en: "Can I order on WhatsApp?" }, a: { ar: "أكيد. كل منتج فيه زرار «اطلب عبر واتساب» بيبعت تفاصيل القطعة لفريقنا مباشرة على 01552085870.", en: "Yes. Every product has an “Order via WhatsApp” button that sends the piece's details straight to our team on +20 155 208 5870." } },
    ],
  },
  {
    id: "payment",
    title: { ar: "الدفع", en: "Payment" },
    items: [
      { q: { ar: "ما هي طرق الدفع المتاحة؟", en: "Which payment methods are available?" }, a: { ar: "طرق الدفع المتاحة بتظهر في صفحة إتمام الطلب. لأي استفسار عن الدفع تواصل مع فريقنا.", en: "Available payment methods are shown at checkout. For any payment question, contact our team." } },
    ],
  },
  {
    id: "delivery",
    title: { ar: "التوصيل", en: "Delivery" },
    items: [
      { q: { ar: "كام رسوم التوصيل؟", en: "How much is delivery?" }, a: { ar: "رسوم التوصيل بتختلف حسب المنطقة، ويؤكدها فريقنا بعد تسجيل الطلب.", en: "Delivery fees depend on your area and are confirmed by our team after you place your order." } },
      { q: { ar: "التوصيل بياخد قد إيه؟", en: "How long does delivery take?" }, a: { ar: "المدة بتختلف حسب القطعة (متاحة أو تُصنع حسب الطلب) والمنطقة. فريقنا بيأكد الموعد معاك.", en: "It depends on the piece (available or made to order) and your area. Our team confirms the date with you." } },
    ],
  },
  {
    id: "products",
    title: { ar: "المنتجات", en: "Products" },
    items: [
      { q: { ar: "إيه معنى «يُصنع حسب الطلب»؟", en: "What does “made to order” mean?" }, a: { ar: "القطعة بتتجهّز بعد تأكيد طلبك بالاختيارات اللي حددتها.", en: "The piece is prepared after your order is confirmed, in the options you selected." } },
      { q: { ar: "الألوان في الصور مطابقة؟", en: "Are colours in photos accurate?" }, a: { ar: "الألوان ممكن تختلف قليلاً حسب الشاشة والإضاءة. ننصح بزيارة المعرض أو طلب عينات من فريقنا.", en: "Colours may vary slightly by screen and lighting. We recommend visiting the showroom or asking our team for samples." } },
    ],
  },
  {
    id: "customization",
    title: { ar: "التخصيص", en: "Customization" },
    items: [
      { q: { ar: "أقدر أطلب مقاس أو لون مختلف؟", en: "Can I request a different size or colour?" }, a: { ar: "ابعت طلبك من صفحة «التصميم حسب الطلب» وفريقنا هيراجعه ويتواصل معاك.", en: "Send your request through the Custom Furniture page and our team will review it and get back to you." } },
    ],
  },
  {
    id: "showroom",
    title: { ar: "المعرض", en: "Showroom" },
    items: [
      { q: { ar: "فين المعرض؟", en: "Where is the showroom?" }, a: { ar: "59 شارع الفتح، فلمنج، الإسكندرية — محطة ترام فلمنج، بجوار بنك مصر وأمام مستشفى البترول.", en: "59 El Fath Street, Fleming, Alexandria — Fleming tram stop, next to Banque Misr and opposite the Petroleum Hospital." } },
      { q: { ar: "مواعيد العمل؟", en: "Opening hours?" }, a: { ar: "الجمعة والأحد: 12 ظهراً – 11 مساءً. السبت والاثنين – الخميس: 11 صباحاً – 11 مساءً.", en: "Friday & Sunday: 12:00 pm – 11:00 pm. Saturday & Monday – Thursday: 11:00 am – 11:00 pm." } },
    ],
  },
  {
    id: "returns",
    title: { ar: "الاسترجاع", en: "Returns" },
    items: [
      { q: { ar: "إيه سياسة الاسترجاع؟", en: "What is the returns policy?" }, a: { ar: "راجع صفحة سياسة الاسترجاع، أو تواصل مع فريقنا قبل ترتيب أي استرجاع.", en: "See the Returns Policy page, or contact our team before arranging any return." } },
    ],
  },
];
