// app/api/login/route.js
import { signCookie } from "@/lib/auth";
import connectDB from "@/lib/connectDB";
import Session from "@/models/sessionModel";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return Response.json({ error: "Invalid Credentials!" }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return Response.json({ error: "Invalid Credentials!" }, { status: 400 });
    }

    const session = await Session.create({ userId: user._id });
    cookieStore.set("sid", signCookie(session.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return Response.json({ name: user.name, email: user.email }, { status: 200 });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}