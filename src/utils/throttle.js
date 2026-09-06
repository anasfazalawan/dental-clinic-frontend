/**
 * Debounce function: delays invoking fn until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 */
export function debounce(fn, wait = 300) {
  let timeoutId = null;
  return function (...args) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

/**
 * Throttle function: limits the maximum number of times a function may be called over time.
 */
export function throttle(fn, limit = 300) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}
