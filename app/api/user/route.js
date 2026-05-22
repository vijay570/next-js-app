// app/api/user/route.js
import connectDB from "@/lib/connectDB";
import { getLoggedInUser } from "@/lib/auth";

export async function GET() {
  await connectDB();
  const result = await getLoggedInUser();
  if (result instanceof Response) return result;

  return Response.json({ name: result.name, email: result.email });
}