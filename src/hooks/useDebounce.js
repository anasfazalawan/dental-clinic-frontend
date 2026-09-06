import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value (e.g. search input).
 * Prevents rapid API requests while the user is typing.
 *
 * @param {any} value - The input value to debounce
 * @param {number} delay - Delay in milliseconds (default: 350ms)
 * @returns {any} debouncedValue
 */
export const useDebounce = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
