import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Autopilot One";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#0f172a",
          color: "#f8fafc",
          padding: "80px",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 700, color: "#38bdf8" }}>Autopilot One</div>
        <div style={{ marginTop: 28, fontSize: 76, lineHeight: 1.05, fontWeight: 900 }}>
          Angajați AI pentru IMM-uri
        </div>
        <div style={{ marginTop: 28, fontSize: 32, lineHeight: 1.35, color: "#dbeafe" }}>
          Widget AI, captare lead-uri, inbox și CRM Lite pentru website-uri.
        </div>
      </div>
    ),
    size,
  );
}
