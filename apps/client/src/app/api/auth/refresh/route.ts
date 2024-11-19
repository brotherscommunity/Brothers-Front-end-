import { updateTokens } from "@/lib/session";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  console.log("oops");
  const body = await req.json();
  const { accessToken } = body;

  if (!accessToken) return new Response("No tokens provided", { status: 401 });

  await updateTokens({ accessToken });

  return new Response("OK", { status: 200 });
}
