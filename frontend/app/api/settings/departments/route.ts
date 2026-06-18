import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Settings } from "@/lib/models/settings"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { department } = await req.json()
    const doc = await Settings.findOne({ key: "departments" })
    const deps: string[] = doc?.value || []
    if (!deps.includes(department)) {
      deps.push(department)
      await Settings.findOneAndUpdate({ key: "departments" }, { value: deps }, { upsert: true })
    }
    return NextResponse.json({ success: true, departments: deps })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB()
    const { department } = await req.json()
    const doc = await Settings.findOne({ key: "departments" })
    const deps: string[] = doc?.value || []
    const filtered = deps.filter((d) => d !== department)
    await Settings.findOneAndUpdate({ key: "departments" }, { value: filtered }, { upsert: true })
    return NextResponse.json({ success: true, departments: filtered })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 400 })
  }
}
