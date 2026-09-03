import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  const logoData = readFileSync(join(process.cwd(), "public/logo.png"));
  const base64 = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0d",
        borderRadius: "40px",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={base64}
        alt="Adam Radi Logo"
        style={{ width: "80%", height: "80%", objectFit: "contain" }}
      />
    </div>,
    { ...size }
  );
}