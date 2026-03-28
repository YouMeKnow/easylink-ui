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
          <div className="page-layout__slot page-layout__slot--right">
            {right || null}
          </div>
        </header>
      )}

      {children}
    </div>
  );
}