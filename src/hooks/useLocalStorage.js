import { useState, useEffect, useCallback } from 'react';

// ── Predefined storage keys used across the app ─────────────────────────────
export const KEYS = {
  API_KEY: 'placeprep_api_key',
  ROLE_ID: 'placeprep_role_id',
  ACTIVE_VIEW: 'placeprep_active_view',
  THEME: 'placeprep_theme',
};

/**
 * useLocalStorage — useState that persists to localStorage.
 *
 * Reads/writes JSON-serialized values under `key`.
 * Syncs across tabs via the `storage` event.
 *
 * @param {string} key           localStorage key
 * @param {*}      initialValue  fallback when nothing is stored
 * @returns {[*, function]}      [value, setValue] — same API as useState
 */
export default function useLocalStorage(key, initialValue) {
  // ── Lazy initializer ────────────────────────────────────────────────────
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // ── Setter (supports functional updates like useState) ──────────────────
  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const nextValue = typeof value === 'function' ? value(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(nextValue));
        } catch {
          // quota exceeded or unavailable — keep in-memory value
        }
        return nextValue;
      });
    },
    [key],
  );

  // ── Cross-tab sync via "storage" event ──────────────────────────────────
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key !== key) return;
      try {
        const newValue = e.newValue !== null ? JSON.parse(e.newValue) : initialValue;
        setStoredValue(newValue);
      } catch {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [key, initialValue]);

  return [storedValue, setValue];
}
