import React from "react";

interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Renders a JSON-LD script tag with basic XSS sanitization
 * (recommended by the Next.js JSON-LD guide).
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}