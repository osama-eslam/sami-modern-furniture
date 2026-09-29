import { ImageResponse } from "next/og";

export const alt = "Samy Modern — Modern Furniture, Alexandria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#171717",
          color: "#F6F3EE",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 10, opacity: 0.6 }}>SAMY MODERN / ALEXANDRIA</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 118, fontWeight: 300, letterSpacing: -4, lineHeight: 1 }}>Details Make</div>
          <div style={{ fontSize: 118, fontWeight: 300, letterSpacing: -4, lineHeight: 1 }}>The Difference</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, opacity: 0.7 }}>
          <span>Modern Furniture · Fleming, Alexandria</span>
          <span>samymodern.com</span>
        </div>
      </div>
    ),
    size,
  );
}
