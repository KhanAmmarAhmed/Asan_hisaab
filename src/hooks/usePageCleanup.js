import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Hook to cleanup when page unmounts or route changes
 * Useful for closing modals, aborting requests, etc.
 */
export function usePageCleanup(cleanupFn) {
  const location = useLocation();

  useEffect(() => {
    return () => {
      // Run cleanup when component unmounts or route changes
      if (cleanupFn) {
        cleanupFn();
      }
    };
  }, [location.pathname, cleanupFn]);
}

/**
 * Hook to create and manage an AbortController for API calls
 * Automatically aborts on unmount or route change
 */
export function useAbortController() {
  const controllerRef = useRef(null);
  const location = useLocation();

  // Initialize AbortController
  if (!controllerRef.current) {
    controllerRef.current = new AbortController();
  }

  // Cleanup on route change or unmount
  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [location.pathname]);

  return controllerRef.current;
}
