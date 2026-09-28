/**
 * A tiny localStorage-backed store designed for React's useSyncExternalStore.
 *
 * - The server snapshot is always `initialValue`, so hydration never mismatches.
 * - Snapshots are cached by their raw string, so getSnapshot stays referentially stable.
 * - Changes made in other tabs are picked up through the `storage` event.
 */
export function createPersistentStore(key, initialValue) {
  const listeners = new Set();
  let cachedRaw = null;
  let cachedValue = initialValue;

  function getSnapshot() {
    let raw;
    try {
      raw = window.localStorage.getItem(key);
    } catch {
      return cachedValue;
    }
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      try {
        cachedValue = raw === null ? initialValue : JSON.parse(raw);
      } catch {
        cachedValue = initialValue;
      }
    }
    return cachedValue;
  }

  function getServerSnapshot() {
    return initialValue;
  }

  function set(next) {
    const value = typeof next === "function" ? next(getSnapshot()) : next;
    const raw = JSON.stringify(value);
    try {
      window.localStorage.setItem(key, raw);
    } catch {
      // Storage may be unavailable (private mode, quota). Keep the value in memory.
    }
    cachedRaw = raw;
    cachedValue = value;
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener) {
    listeners.add(listener);
    const onStorage = (event) => {
      if (event.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return { getSnapshot, getServerSnapshot, set, subscribe };
}
