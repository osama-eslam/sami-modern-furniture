import "server-only";
/**
 * PAYMENT ABSTRACTION (server only)
 * ---------------------------------------------------------------------------
 * Each provider declares whether it is configured (from environment variables
 * that never reach the browser) and how to start a payment for an order.
 * Checkout only offers methods whose provider reports `isConfigured()`.
 *
 * Card data never touches this application — online providers redirect to a
 * hosted checkout.
 */
import { paymentMethods } from "@/data/config/payments";
import type { Order, PaymentMethodConfig, PaymentMethodId } from "@/types/commerce";

export type PaymentInitiation = { kind: "none" } | { kind: "redirect"; url: string };

export interface PaymentProvider {
  id: PaymentMethodConfig["provider"];
  isConfigured(): boolean;
  initiate(order: Order): Promise<PaymentInitiation>;
}

/** Cash on delivery / manual confirmation: nothing to initiate online. */
const offlineProvider = (id: "none" | "manual"): PaymentProvider => ({
  id,
  isConfigured: () => true,
  initiate: async () => ({ kind: "none" }),
});

/**
 * Paymob Unified Checkout (Intention API).
 * Requires PAYMOB_SECRET_KEY, PAYMOB_PUBLIC_KEY, PAYMOB_CARD_INTEGRATION_ID.
 * Before enabling in production: verify the request shape against Paymob's
 * current docs and implement the transaction callback (HMAC-verified) at
 * app/api/payments/paymob/callback to move orders to "confirmed".
 */
const paymobProvider: PaymentProvider = {
  id: "paymob",
  isConfigured: () =>
    Boolean(process.env.PAYMOB_SECRET_KEY && process.env.PAYMOB_PUBLIC_KEY && process.env.PAYMOB_CARD_INTEGRATION_ID),
  async initiate(order) {
    const res = await fetch("https://accept.paymob.com/v1/intention/", {
      method: "POST",
      headers: { Authorization: `Token ${process.env.PAYMOB_SECRET_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Math.round(order.totals.total * 100),
        currency: "EGP",
        payment_methods: [Number(process.env.PAYMOB_CARD_INTEGRATION_ID)],
        special_reference: order.number,
        billing_data: {
          first_name: order.customer.fullName.split(" ")[0] || "-",
          last_name: order.customer.fullName.split(" ").slice(1).join(" ") || "-",
          phone_number: order.customer.phone,
          email: order.customer.email || "na@samymodern.com",
          street: order.address.street,
          building: order.address.building,
          floor: order.address.floor || "-",
          apartment: order.address.apartment || "-",
          city: order.address.city,
          state: order.address.governorate,
          country: "EG",
        },
      }),
    });
    if (!res.ok) throw new Error(`Paymob intention failed: ${res.status}`);
    const data = (await res.json()) as { client_secret: string };
    return {
      kind: "redirect",
      url: `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${data.client_secret}`,
    };
  },
};

const providers: Record<PaymentMethodConfig["provider"], PaymentProvider> = {
  none: offlineProvider("none"),
  manual: offlineProvider("manual"),
  paymob: paymobProvider,
};

export const availablePaymentMethods = (): PaymentMethodConfig[] =>
  paymentMethods.filter((m) => m.enabled && providers[m.provider].isConfigured());

export const providerFor = (method: PaymentMethodId): PaymentProvider | null => {
  const config = availablePaymentMethods().find((m) => m.id === method);
  return config ? providers[config.provider] : null;
};
