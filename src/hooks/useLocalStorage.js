import { useState, useEffect, useCallback } from 'react';

/**
 * React hook that syncs state with localStorage.
 *
 * @param {string} key - localStorage key
 * @param {*} initialValue - Default value when nothing is stored
 * @returns {[any, Function]} Tuple of [storedValue, setValue]
 */
export default function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        // Allow functional updates like useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // Fail silently if localStorage is unavailable
      }
    },
    [key, storedValue]
  );

  // Sync across tabs / windows via the storage event
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // ignore malformed JSON
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
