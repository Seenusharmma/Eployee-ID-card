import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { jwtVerify } from "jose"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value
    if (!token) return NextResponse.json({ authenticated: false })

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "legends-secret-key")
    const { payload } = await jwtVerify(token, secret)
    return NextResponse.json({ authenticated: true, email: payload.email, name: payload.name })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}
