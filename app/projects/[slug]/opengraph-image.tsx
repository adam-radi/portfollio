import { ImageResponse } from "next/og";
import { projects } from "@/data/projects";
import { SITE_CONFIG } from "@/lib/constants";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export const alt = "Adam Radi — Project Case Study";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

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
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
                background: "linear-gradient(135deg,#FF6B2C,#FF8C4D,#fbbf24)",
              }}
            >
              AR
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "28px" }}>Adam Radi</span>
              <span style={{ fontSize: "20px", color: "#FF6B2C", letterSpacing: "4px" }}>
                CASE STUDY
              </span>
            </div>
          </div>
          <span style={{ fontSize: "22px", color: "#71717a" }}>{SITE_CONFIG.domain}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "900px",
          }}
        >
          <span style={{ fontSize: "84px", lineHeight: 1.05 }}>
            {project?.title ?? slug}
          </span>
          <span style={{ fontSize: "28px", color: "#a1a1aa", lineHeight: 1.4 }}>
            {project?.description ??
              "A project case study by Adam Radi, Full Stack Developer in Morocco."}
          </span>
        </div>

        <div style={{ display: "flex", gap: "16px", fontSize: "22px" }}>
          {(project?.technologies ?? []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                border: "1px solid rgba(255,107,44,0.45)",
                background: "rgba(255,107,44,0.12)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
