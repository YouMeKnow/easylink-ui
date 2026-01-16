import React, { useState } from "react";
import { resolveUploadUrl } from "@/shared/utils/resolveUploadUrl";

export default function SmartImage({
  src,
  alt = "",
  fallback = null,
  ...props
}) {
  const [broken, setBroken] = useState(false);

  const resolved = resolveUploadUrl(src);

  if (!resolved || broken) {
    return fallback;
  }

  return (
    <img
      src={resolved}
      alt={alt}
      onError={() => setBroken(true)}
      {...props}
    />
  );
}
