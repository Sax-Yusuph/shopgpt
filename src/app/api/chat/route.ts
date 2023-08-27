import { NextRequest, NextResponse } from "next/server";

import { COMPLETION_MODEL } from "../utils/constants";

export const runtime = "edge";
export async function POST(request: NextRequest) {
  const json = await request.json();
  const { messages, model = COMPLETION_MODEL, preferredStore, id: sessionId } = json;

  if (!messages) {
    return handleError("Missing text parameter");
  }
  return NextResponse.json("WIP");
}

const handleError = (error: string, status: number = 400) => {
  return NextResponse.json({ error }, { status });
};
