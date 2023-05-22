import { NextRequest, NextResponse } from "next/server";

import { api } from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const memoriesRedirectUrl = request.cookies.get("redirectTo")?.value;

  const registerUserResponse = await api.post("/register", {
    code,
  });

  const { token } = registerUserResponse.data;

  const redirectUrl = memoriesRedirectUrl ?? new URL("/", request.url);

  const cookieExpirationTimeInSeconds = 60 * 60 * 24 * 30;

  return NextResponse.redirect(redirectUrl, {
    headers: {
      "Set-Cookie": `token=${token}; Path=/; max-age=${cookieExpirationTimeInSeconds}`,
    },
  });
}
