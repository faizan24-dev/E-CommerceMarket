"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { createPersistentStore } from "@/lib/persistentStore";

/*
 * Authentication backed by the Express API (see server.js and src/routes).
 * The session ({ token, user }) is kept in localStorage so it survives reloads
 * and stays in sync across tabs; the JWT is sent as a Bearer token.
 */
const sessionStore = createPersistentStore("em_auth", null);

const noopSubscribe = () => () => {};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// How long the "Logging you out…" screen stays up, so the change is clearly visible.
const LOGOUT_DELAY_MS = 900;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const session = useSyncExternalStore(
    sessionStore.subscribe,
    sessionStore.getSnapshot,
    sessionStore.getServerSnapshot,
  );
  // False during SSR and hydration, true once localStorage can be read.
  const isReady = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const token = session?.token ?? null;

  // Re-validate a stored token with the server: refresh the profile, or sign out if it was rejected.
  useEffect(() => {
    if (!token) return undefined;
    const controller = new AbortController();
    apiRequest("/auth/me", { token, signal: controller.signal })
      .then(({ user }) => {
        sessionStore.set((current) => (current?.token === token ? { token, user } : current));
      })
      .catch((error) => {
        if (error.status === 401) {
          sessionStore.set((current) => (current?.token === token ? null : current));
        }
        // Network errors keep the session, so the site still works while the API is briefly offline.
      });
    return () => controller.abort();
  }, [token]);

  async function signup({ name, email, password }) {
    const data = await apiRequest("/auth/signup", {
      method: "POST",
      body: { name: name.trim(), email: email.trim(), password },
    });
    // New accounts are not signed in automatically: the user is sent to the login page next.
    return data.user;
  }

  async function login({ email, password }) {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: { email: email.trim(), password },
    });
    sessionStore.set({ token: data.token, user: data.user });
    return data.user;
  }

  /**
   * Shows the logging-out screen, clears the session, then navigates to `redirectTo`
   * (home by default). Pass `redirectTo: null` to stay on the current page.
   */
  async function logout({ redirectTo = "/" } = {}) {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await wait(LOGOUT_DELAY_MS);
    sessionStore.set(null);
    if (redirectTo) router.push(redirectTo);
    // Keep the overlay up briefly while the next page renders.
    await wait(250);
    setIsLoggingOut(false);
  }

  const value = {
    user: session?.user ?? null,
    token,
    isAuthenticated: Boolean(token),
    isReady,
    isLoggingOut,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>.");
  return context;
}
