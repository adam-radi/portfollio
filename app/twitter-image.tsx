import { ImageResponse } from "next/og";

export const alt = "Adam Radi — Full Stack Developer in Morocco";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0d",
          color: "#ffffff",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-160px",
            width: "520px",
            height: "520px",
            borderRadius: "9999px",
            background:
              "linear-gradient(135deg, rgba(255,107,44,0.35), rgba(255,138,77,0.08))",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "30px",
                color: "#0b0b0d",
                background:
                  "linear-gradient(135deg,#FF6B2C,#FF8C4D,#fbbf24)",
              }}
            >
              AR
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ fontSize: "28px", color: "#ffffff" }}>Adam Radi</span>
              <span
                style={{ fontSize: "20px", color: "#FF6B2C", letterSpacing: "4px" }}
              >
                DEVELOPER
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "880px",
          }}
        >
          <span style={{ fontSize: "68px", color: "#ffffff", lineHeight: 1.05 }}>
            Full Stack Developer in Morocco
          </span>
          <span style={{ fontSize: "30px", color: "#a1a1aa", lineHeight: 1.4 }}>
            Modern web applications with Next.js, React, TypeScript and Laravel —
            plus IT support and digital dental CAD with Exocad.
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "16px",
            fontSize: "24px",
            color: "#f4f4f5",
          }}
        >
          <span
            style={{
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,107,44,0.45)",
              background: "rgba(255,107,44,0.12)",
            }}
          >
            Next.js
          </span>
          <span
            style={{
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,107,44,0.45)",
              background: "rgba(255,107,44,0.12)",
            }}
          >
            React
          </span>
          <span
            style={{
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,107,44,0.45)",
              background: "rgba(255,107,44,0.12)",
            }}
          >
            Laravel
          </span>
          <span
            style={{
              padding: "12px 28px",
              borderRadius: "9999px",
              border: "1px solid rgba(255,107,44,0.45)",
              background: "rgba(255,107,44,0.12)",
            }}
          >
            Exocad
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}