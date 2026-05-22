import Session from "@/models/sessionModel";
import User from "@/models/userModel";
import connectDB from "@/lib/connectDB";
import { createHmac } from "crypto";
import { cookies } from "next/headers";

export async function getLoggedInUser() {
  try {
    await connectDB(); // ← THIS was missing
    
    const cookieStore = await cookies();
    const errorResponse = Response.json({ error: "Please login" }, { status: 401 });

    const cookie = cookieStore.get("sid")?.value;
    if (!cookie) return errorResponse;

    const sessionId = verifyCookie(cookie);
    if (!sessionId) return errorResponse;

    const session = await Session.findById(sessionId);
    if (!session) return errorResponse;

    const user = await User.findById(session.userId).select("-password -__v");
    if (!user) return errorResponse;

    return user;
  } catch (err) {
    console.error("getLoggedInUser ERROR:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function getUserSessionId() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("sid")?.value;
  return verifyCookie(cookie);
}

export function signCookie(cookie) {
  if (!process.env.COOKIE_SECRET) throw new Error("COOKIE_SECRET is not set");
  const signature = createHmac("sha256", process.env.COOKIE_SECRET)
    .update(cookie)
    .digest("hex");
  return `${cookie}.${signature}`;
}

export function verifyCookie(signedCookie) {
  if (!signedCookie) return null;

  const parts = signedCookie.split(".");
  if (parts.length !== 2) return null;

  const [cookiePayload, providedSignature] = parts;
  const calculatedSignature = createHmac("sha256", process.env.COOKIE_SECRET)
    .update(cookiePayload)
    .digest("hex");

  return calculatedSignature === providedSignature ? cookiePayload : null;
}