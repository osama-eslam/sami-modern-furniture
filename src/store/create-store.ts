"use client";

import { useSyncExternalStore } from "react";

type Updater<T> = T | ((prev: T) => T);

/**
 * Tiny external store with optional localStorage persistence.
 * - Server render & hydration use `initial` (no mismatch); the persisted value
 *   is read lazily on the client.
 * - Syncs across tabs through the `storage` event.
 */
export function createStore<T>(initial: T, persist?: { key: string; version: number }) {
  let state = initial;
  let hydrated = !persist;
  const listeners = new Set<() => void>();

  const load = () => {
    if (hydrated || typeof window === "undefined" || !persist) return;
    hydrated = true;
    try {
      const raw = window.localStorage.getItem(persist.key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as { v: number; d: T };
      if (parsed?.v === persist.version && parsed.d) state = { ...initial, ...parsed.d };
    } catch {
      /* corrupted or blocked storage — fall back to initial */
    }
  };

  const get = () => {
    load();
    return state;
  };

  const set = (updater: Updater<T>) => {
    load();
    state = typeof updater === "function" ? (updater as (p: T) => T)(state) : updater;
    if (persist && typeof window !== "undefined") {
      try {
        window.localStorage.setItem(persist.key, JSON.stringify({ v: persist.version, d: state }));
      } catch {
        /* quota / private mode */
      }
    }
    listeners.forEach((l) => l());
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (persist && e.key === persist.key) {
        hydrated = false;
        load();
        listeners.forEach((l) => l());
      }
    };
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
    };
  };

  const getServer = () => initial;

  function use(): T {
    return useSyncExternalStore(subscribe, get, getServer);
  }

  return { get, set, subscribe, use };
}

/** True after hydration — use to avoid flashing server defaults for persisted UI. */
const noopSubscribe = () => () => {};
export const useHydrated = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
