/**
 * PAYMENT METHODS (configuration only — no provider logic here).
 * A method is offered at checkout only when `enabled` is true AND, for online
 * providers, the server reports the provider as configured
 * (see services/payments/registry.ts).
 */
import type { PaymentMethodConfig } from "@/types/commerce";

export const paymentMethods: PaymentMethodConfig[] = [
  {
    id: "cash_on_delivery",
    enabled: true,
    provider: "none",
    name: { ar: "الدفع عند الاستلام", en: "Cash on delivery" },
    description: { ar: "ادفع نقداً عند استلام طلبك.", en: "Pay in cash when your order arrives." },
  },
  {
    id: "whatsapp_confirmation",
    enabled: true,
    provider: "manual",
    name: { ar: "التأكيد عبر واتساب", en: "Confirm on WhatsApp" },
    description: { ar: "يتواصل فريقنا معك لترتيب طريقة الدفع المناسبة.", en: "Our team contacts you to arrange a suitable payment method." },
  },
  {
    id: "card",
    enabled: true, // still hidden unless PAYMOB_* env vars are configured on the server
    provider: "paymob",
    name: { ar: "بطاقة بنكية", en: "Debit / credit card" },
    description: { ar: "ادفع أونلاين بأمان.", en: "Pay securely online." },
  },
  {
    id: "bank_transfer",
    enabled: false,
    provider: "manual",
    name: { ar: "تحويل بنكي", en: "Bank transfer" },
    description: { ar: "نرسل لك بيانات التحويل بعد تأكيد الطلب.", en: "We send transfer details after confirming your order." },
  },
];
