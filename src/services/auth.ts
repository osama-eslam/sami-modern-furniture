"use client";
/**
 * AUTH ADAPTER
 * The UI talks to `auth` only. Today it is a device-local preview adapter
 * (clearly labelled in the UI). To go live, implement the same interface
 * against a real backend (e.g. OTP by SMS/WhatsApp, NextAuth, Supabase) and
 * implement `mergeGuestData` to push the guest cart/wishlist to the account.
 */
import { accountStore, cartStore, wishlistStore, type LocalUser } from "@/store/stores";
import { normalizePhone, uid } from "@/lib/utils";

export type SignInInput = { fullName: string; phone: string; email?: string };

export interface AuthAdapter {
  signIn(input: SignInInput): Promise<LocalUser>;
  signOut(): Promise<void>;
  updateProfile(patch: Partial<SignInInput>): Promise<LocalUser | null>;
  /** Called after sign-in: merge the guest cart & wishlist into the account. */
  mergeGuestData(user: LocalUser): Promise<void>;
}

const localAdapter: AuthAdapter = {
  async signIn(input) {
    const user: LocalUser = {
      id: uid("u_"),
      fullName: input.fullName.trim(),
      phone: normalizePhone(input.phone),
      email: input.email?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };
    accountStore.set((s) => ({ ...s, user }));
    await this.mergeGuestData(user);
    return user;
  },
  async signOut() {
    accountStore.set((s) => ({ ...s, user: null }));
  },
  async updateProfile(patch) {
    let next: LocalUser | null = null;
    accountStore.set((s) => {
      if (!s.user) return s;
      next = { ...s.user, ...patch, phone: patch.phone ? normalizePhone(patch.phone) : s.user.phone };
      return { ...s, user: next };
    });
    return next;
  },
  async mergeGuestData() {
    // Local adapter: guest cart & wishlist already belong to this device.
    // Backend adapter: POST cartStore.get() / wishlistStore.get() then replace
    // local state with the merged server response.
    void cartStore;
    void wishlistStore;
  },
};

export const auth: AuthAdapter = localAdapter;
