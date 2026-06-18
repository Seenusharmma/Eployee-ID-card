import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Settings } from "@/lib/models/settings"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { designation } = await req.json()
    const doc = await Settings.findOne({ key: "designations" })
    const desigs: string[] = doc?.value || []
    if (!desigs.includes(designation)) {
      desigs.push(designation)
      await Settings.findOneAndUpdate({ key: "designations" }, { value: desigs }, { upsert: true })
    }
    return NextResponse.json({ success: true, designations: desigs })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { designation } = await req.json()
    const doc = await Settings.findOne({ key: "designations" })
    const desigs: string[] = doc?.value || []
    const filtered = desigs.filter((d) => d !== designation)
    await Settings.findOneAndUpdate({ key: "designations" }, { value: filtered }, { upsert: true })
    return NextResponse.json({ success: true, designations: filtered })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 })
  }
}
