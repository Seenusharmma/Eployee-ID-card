import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { connectDB } from "@/lib/mongodb"
import { Admin } from "@/lib/models/admin"
import { SignJWT } from "jose"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    await connectDB()

    const admin = await Admin.findOne({ email })
    if (!admin || admin.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "legends-secret-key")
    const token = await new SignJWT({ email: admin.email, name: admin.name })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(secret)

    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      maxAge: 604800,
    })

    return NextResponse.json({ success: true, email: admin.email, name: admin.name })
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
