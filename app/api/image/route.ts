import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const src = searchParams.get("src");

    if (!src) {
      return NextResponse.json({ error: "Missing src parameter" }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(src);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    // Fetch the image from external source
    const response = await fetch(src, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Coursespeak/1.0)",
        "Accept": "image/*",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();

    // Determine content type
    const contentType = response.headers.get("content-type") || "image/jpeg";

    // Return the image with proper headers
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
