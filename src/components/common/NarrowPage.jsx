import React from "react";

export default function NarrowPage({ children }) {
  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto", padding: "0 1rem" }}>
      {children}
    </div>
  );
}
