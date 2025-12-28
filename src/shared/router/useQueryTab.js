import { useCallback, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * URL query tab state: keeps tabs in sync with ?tab=
 * Example:
 * const [tab, setTab] = useQueryTab({ allowed: ["main","offers","menu"], fallback:"main" })
 */
export default function useQueryTab({ key = "tab", allowed = [], fallback }) {
  const nav = useNavigate();
  const loc = useLocation();

  const value = useMemo(() => {
    const qp = new URLSearchParams(loc.search);
    const v = qp.get(key);
    return allowed.includes(v) ? v : fallback;
  }, [loc.search, key, allowed, fallback]);

  const setValue = useCallback(
    (next) => {
      const qp = new URLSearchParams(loc.search);
      qp.set(key, next);
      nav({ pathname: loc.pathname, search: `?${qp.toString()}` }, { replace: true });
    },
    [nav, loc.pathname, loc.search, key]
  );

  return [value, setValue];
}
