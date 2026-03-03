// components/common/PageLayout.jsx
import "@/components/styles/PageLayout.css";

export default function PageLayout({ title, left, right, children }) {
  return (
    <div className="container py-5 page-layout" style={{ maxWidth: 900 }}>
      {(title || left || right) && (
        <header className="page-layout__header">
          <div className="page-layout__slot page-layout__slot--left">
            {left || null}
          </div>

          {title ? (
            <h2 className="page-layout__title fw-bold mb-0" style={{ letterSpacing: ".02em" }}>
              {title}
            </h2>
          ) : (
            <div />
          )}

          <div className="page-layout__slot page-layout__slot--right">
            {right || null}
          </div>
        </header>
      )}

      {children}
    </div>
  );
}