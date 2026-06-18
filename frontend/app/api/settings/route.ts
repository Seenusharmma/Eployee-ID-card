import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Settings } from "@/lib/models/settings"

export async function GET() {
  try {
    await connectDB()
    const all = await Settings.find({}).lean()
    const result: Record<string, unknown> = {}
    for (const s of all) {
      result[s.key] = s.value
    }
    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    for (const [key, value] of Object.entries(body)) {
      await Settings.findOneAndUpdate({ key }, { value }, { upsert: true })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 })
  }
}
