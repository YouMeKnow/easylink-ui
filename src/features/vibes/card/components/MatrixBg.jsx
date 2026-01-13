import React, { useMemo } from "react";
import "./MatrixBg.css";

export default function MatrixBg({ columns = 48 }) {
  const items = useMemo(() => {
    return Array.from({ length: columns }).map((_, i) => {
      // рандомим скорость/задержку (стабильно по i)
      const dur = 2.3 + (i % 7) * 0.35;
      const delay = -((i % 10) * 0.35);
      const left = `${(i / columns) * 100}%`;
      return { dur, delay, left };
    });
  }, [columns]);

  return (
    <div className="matrix-container">
      {items.map((it, i) => (
        <div
          key={i}
          className="matrix-column"
          style={{
            left: it.left,
            animationDuration: `${it.dur}s`,
            animationDelay: `${it.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
