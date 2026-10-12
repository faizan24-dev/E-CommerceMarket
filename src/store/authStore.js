import { create } from "zustand";
import { api } from "@/lib/apiClient";

/*
 * Client-side view of the signed-in user.
 *
 * The session itself lives in an httpOnly cookie that JavaScript can't read;
 * this store only mirrors what /api/auth/me reports. Server pages never rely
 * on it: they check the session on the server. Other tabs are told about
 * logins and logouts through a BroadcastChannel (see AppBootstrap).
 */

export const AUTH_CHANNEL = "em-auth";
const LOGOUT_MIN_MS = 700; // keeps the "Logging you out" card visible long enough to read

function broadcast() {
  try {
    const channel = new BroadcastChannel(AUTH_CHANNEL);
    channel.postMessage("changed");
    channel.close();
  } catch {
    // BroadcastChannel unavailable: other tabs update on their next navigation.
  }
}

const signedOut = { status: "unauthenticated", user: null, ownedProductIds: [] };

export const useAuthStore = create((set, get) => ({
  status: "loading", // "loading" | "authenticated" | "unauthenticated"
  user: null,
  ownedProductIds: [],
  isLoggingOut: false,

  /** Re-reads the session from the server. Network errors keep the current state. */
  async refresh() {
    try {
      const { user, ownedProductIds } = await api.get("/auth/me");
      set(user ? { status: "authenticated", user, ownedProductIds } : signedOut);
    } catch (error) {
      if (error.status === 401 || get().status === "loading") set(signedOut);
    }
  },

  async login(credentials) {
    const { user } = await api.post("/auth/login", credentials);
    set({ status: "authenticated", user });
    broadcast();
    get().refresh();
    return user;
  },

  async signup(values) {
    const { user } = await api.post("/auth/signup", values);
    return user;
  },

  async logout() {
    if (get().isLoggingOut) return;
    set({ isLoggingOut: true });
    const minDelay = new Promise((resolve) => setTimeout(resolve, LOGOUT_MIN_MS));
    try {
      await api.post("/auth/logout");
    } catch {
      // Even if the request fails, forget the user locally; the cookie expires on its own.
    }
    await minDelay;
    set({ ...signedOut, isLoggingOut: false });
    broadcast();
  },

  /** Updates the user after a profile or seller change. */
  setUser(user) {
    set({ user });
    broadcast();
  },

  markOwned(productIds) {
    set((state) => ({ ownedProductIds: [...new Set([...state.ownedProductIds, ...productIds])] }));
  },
}));
