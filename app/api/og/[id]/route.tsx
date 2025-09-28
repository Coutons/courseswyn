import { ImageResponse } from "next/og";
import { getDealByIdOrSlug } from "@/lib/store";

const FONT_URL = "https://raw.githubusercontent.com/googlefonts/noto-fonts/main/ttf/NotoSans/NotoSans-Regular.ttf";
let fontDataPromise: Promise<ArrayBuffer> | null = null;

async function loadFont() {
  if (!fontDataPromise) {
    fontDataPromise = fetch(FONT_URL).then((res) => {
      if (!res.ok) throw new Error(`Failed to load font: ${res.status}`);
      return res.arrayBuffer();
    });
  }
  return fontDataPromise;
}

export const runtime = "nodejs";
export const revalidate = 300;

const WIDTH = 1200;
const HEIGHT = 630;

function sanitize(text: string, max = 120) {
  const trimmed = text.trim().replace(/\s+/g, " ");
  if (trimmed.length <= max) return trimmed;
  return trimmed.slice(0, max - 1).trimEnd() + "…";
}

export async function GET(
  _request: Request,
  context: { params: { id: string } }
): Promise<ImageResponse> {
  const { id } = context.params;
  let title = "Udemy Coupons";
  let found = false;
  try {
    const deal = await getDealByIdOrSlug(id);
    if (deal?.title) {
      title = sanitize(String(deal.title), 90);
      found = true;
    }
  } catch (error) {
    console.error("Failed to build OG image", error);
  }

  const subtitle = "Daily curated course deals";

  if (!found) {
    return new ImageResponse(
      (
        <div
          style={{
            width: WIDTH,
            height: HEIGHT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f172a 0%, #1f2937 100%)",
            color: "#e2e8f0",
            fontFamily: "'Noto Sans', Arial, sans-serif",
            fontSize: 48,
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Udemy Coupons
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
      }
    );
  }

  const fontData = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #0f172a 100%)",
          color: "#e2e8f0",
          fontFamily: "'Noto Sans', Arial, sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase", color: "#93c5fd" }}>
          Udemy Coupons
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.1 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 28 }}>
          <div>{subtitle}</div>
          <div style={{ fontWeight: 600 }}>coursespeak.com</div>
        </div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      fonts: [
        {
          name: "Noto Sans",
          data: fontData,
        },
      ],
    }
  );
}
