import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "72px",
        fontWeight: 800,
        color: "#0b0b0d",
        background: "linear-gradient(135deg,#FF6B2C,#FF8C4D,#fbbf24)",
        borderRadius: "40px",
      }}
    >
      AR
    </div>,
    { ...size }
  );
}