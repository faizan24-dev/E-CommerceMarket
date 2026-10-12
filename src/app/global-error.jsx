"use client";

import { useEffect } from "react";

/** Last-resort boundary for errors in the root layout. It replaces the whole document, so styles are inline. */
export default function GlobalError({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", background: "#faf8f5", color: "#1c1b19", margin: 0 }}>
        <title>Something went wrong</title>
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "96px 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ color: "#6b6760", lineHeight: 1.6 }}>
            The site couldn&apos;t load. Please try again in a moment.
            {error?.digest ? ` Reference: ${error.digest}` : ""}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              padding: "12px 24px",
              borderRadius: 999,
              border: "none",
              background: "#1c1b19",
              color: "#fff",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
