// components/common/PageLayout.jsx
import "@/components/styles/PageLayout.css";
export default function PageLayout({ title, children }) {
  return (
    <div className="container py-5 page-layout" style={{ maxWidth: 900 }}>
      {title && (
        <div className="mb-4 text-center">
          <h2 className="fw-bold mb-0 page-layout__title" style={{ letterSpacing: ".02em" }}>
            {title}
          </h2>
        </div>
      )}
      {children}
    </div>
  );
}
