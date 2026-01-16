import React, { useEffect, useLayoutEffect, useRef } from "react";
import "./ModeSwitch.css";

export default function ModeSwitch({ mode, onChange }) {
  const rootRef = useRef(null);
  const passRef = useRef(null);
  const memRef = useRef(null);

  const updateIndicator = () => {
    const root = rootRef.current;
    const btn = (mode === "password" ? passRef.current : memRef.current);
    if (!root || !btn) return;

    const rootRect = root.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();

    const x = btnRect.left - rootRect.left;
    const w = btnRect.width;

    root.style.setProperty("--ix", `${x}px`);
    root.style.setProperty("--iw", `${w}px`);
  };

  useLayoutEffect(() => {
    // 2 RAF — чтобы после layout/шрифтов/загрузок всё стало на место
    const r1 = requestAnimationFrame(() => {
      updateIndicator();
      const r2 = requestAnimationFrame(updateIndicator);
      // cleanup второго RAF
      return () => cancelAnimationFrame(r2);
    });
    return () => cancelAnimationFrame(r1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    const onResize = () => updateIndicator();
    window.addEventListener("resize", onResize);

    // если браузер поддерживает fonts.ready — обновим после догруза шрифтов
    let cancelled = false;
    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) updateIndicator();
      }).catch(() => {});
    }

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="mode-switch" role="tablist" aria-label="Sign up mode">
      <button
        ref={passRef}
        type="button"
        role="tab"
        aria-selected={mode === "password"}
        className={`mode-switch-btn ${mode === "password" ? "is-active" : ""}`}
        onClick={() => onChange("password")}
      >
        Password
      </button>

      <button
        ref={memRef}
        type="button"
        role="tab"
        aria-selected={mode === "memory"}
        className={`mode-switch-btn ${mode === "memory" ? "is-active" : ""}`}
        onClick={() => onChange("memory")}
      >
        Memory Locks <span className="mode-switch-badge">Beta</span>
      </button>
    </div>
  );
}
