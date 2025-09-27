import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  verifyAdminToken,
  setAdminSession,
  clearAdminSession,
  extractTokenFromRequest,
} from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = extractTokenFromRequest(req);
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const token = body.token?.trim();
  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  if (!verifyAdminToken(token)) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  setAdminSession(token);
  return NextResponse.json({ authenticated: true });
}

export async function DELETE() {
  clearAdminSession();
  return NextResponse.json({ ok: true });
}
