import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "SprintsPlans — Run better agile retrospectives online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f172a 0%, #1e40af 55%, #0ea5e9 100%)",
          padding: "64px",
          justifyContent: "space-between",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              color: "#bae6fd",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Free online retrospective board
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              maxWidth: "95%",
            }}
          >
            Run better retrospectives with your team
          </div>
          <div style={{ fontSize: 28, color: "#e2e8f0", lineHeight: 1.4, maxWidth: "90%" }}>
            Real-time collaboration, anonymous voting, actionable insights — no login required.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.2)",
            paddingTop: 32,
          }}
        >
          <div style={{ fontSize: 36, fontWeight: 700, color: "#ffffff" }}>SprintsPlans</div>
          <div style={{ fontSize: 24, color: "#bae6fd" }}>sprintsplans.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
