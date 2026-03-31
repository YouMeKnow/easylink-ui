import React from "react";

export default function Loader() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center"
      style={{
        minHeight: "70vh", 
      }}
    >
      <div className="spinner-border text-primary" role="status"></div>
      <div className="mt-2">Loading Vibes...</div>
    </div>
  );
}
