/**
 * POLICIES — structure ready, business terms pending. Sections marked
 * `pending: true` render a clear "to be confirmed" notice. Replace the body
 * text with Samy Modern's official wording and remove the flag.
 */
import type { PolicyDoc } from "@/types/content";

const pending = (heading: { ar: string; en: string }) => ({ heading, body: { ar: "", en: "" }, pending: true });

export const policies: PolicyDoc[] = [
  {
    slug: "privacy",
    title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
    intro: { ar: "توضح هذه الصفحة كيف يتعامل موقع سامي مودرن مع بياناتك.", en: "This page explains how the Samy Modern website handles your data." },
    updatedAt: null,
    sections: [
      { heading: { ar: "البيانات التي نجمعها", en: "Data we collect" }, body: { ar: "الاسم، رقم الموبايل، البريد الإلكتروني (اختياري) وعنوان التوصيل عند تسجيل طلب أو إرسال استفسار.", en: "Name, mobile number, email (optional) and delivery address when you place an order or send an inquiry." } },
      { heading: { ar: "التخزين على جهازك", en: "Storage on your device" }, body: { ar: "السلة والمفضلة والمقارنة وآخر ما شاهدته تُحفظ في متصفحك (localStorage) ولا تُرسل إلينا.", en: "Your cart, wishlist, comparison and recently viewed items are stored in your browser (localStorage) and are not sent to us." } },
      { heading: { ar: "بيانات الدفع", en: "Payment data" }, body: { ar: "الموقع لا يخزّن بيانات البطاقات البنكية نهائياً.", en: "This website never stores payment card details." } },
      pending({ ar: "مدة الاحتفاظ بالبيانات ومشاركتها", en: "Retention and sharing" }),
    ],
  },
  {
    slug: "terms",
    title: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
    intro: { ar: "الشروط المنظمة لاستخدام موقع سامي مودرن والطلب من خلاله.", en: "The terms governing use of, and ordering through, the Samy Modern website." },
    updatedAt: null,
    sections: [
      { heading: { ar: "تأكيد الطلبات", en: "Order confirmation" }, body: { ar: "يعتبر الطلب مؤكداً بعد تواصل فريق سامي مودرن معك وتأكيد التوفر والتفاصيل.", en: "An order is confirmed once the Samy Modern team contacts you and confirms availability and details." } },
      { heading: { ar: "الأسعار والصور", en: "Prices and images" }, body: { ar: "قد تختلف الألوان قليلاً حسب الشاشة. في حال وجود خطأ في السعر، يتواصل فريقنا معك قبل التنفيذ.", en: "Colours may vary slightly by screen. If a price is shown in error, our team will contact you before fulfilment." } },
      pending({ ar: "الإلغاء والتعديل", en: "Cancellation and changes" }),
      pending({ ar: "الضمان", en: "Warranty" }),
    ],
  },
  {
    slug: "shipping-policy",
    title: { ar: "سياسة الشحن والتوصيل", en: "Shipping Policy" },
    intro: { ar: "كيف يتم التوصيل ورسومه.", en: "How delivery works and how it's priced." },
    updatedAt: null,
    sections: [
      { heading: { ar: "رسوم التوصيل", en: "Delivery fees" }, body: { ar: "تختلف رسوم التوصيل حسب المنطقة ويؤكدها فريقنا بعد تسجيل الطلب.", en: "Delivery fees vary by area and are confirmed by our team after you place your order." } },
      pending({ ar: "مناطق التوصيل والمدد المتوقعة", en: "Delivery areas and timeframes" }),
      pending({ ar: "التركيب", en: "Installation" }),
    ],
  },
  {
    slug: "returns-policy",
    title: { ar: "سياسة الاسترجاع", en: "Returns Policy" },
    intro: { ar: "الاسترجاع والاستبدال.", en: "Returns and exchanges." },
    updatedAt: null,
    sections: [
      { heading: { ar: "قبل أي استرجاع", en: "Before any return" }, body: { ar: "تواصل مع فريقنا أولاً على واتساب أو التليفون لترتيب أي استرجاع أو استبدال.", en: "Contact our team first by WhatsApp or phone to arrange any return or exchange." } },
      pending({ ar: "مدة وشروط الاسترجاع", en: "Return window and conditions" }),
      pending({ ar: "القطع المصنوعة حسب الطلب", en: "Made-to-order pieces" }),
    ],
  },
];

export const policyBySlug = (slug: string) => policies.find((p) => p.slug === slug);
