import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Admin } from "@/lib/models/admin"
import { Settings } from "@/lib/models/settings"
import { DEPARTMENTS, BRAND } from "@/lib/constants"

export async function POST() {
  try {
    await connectDB()

    await Admin.findOneAndUpdate(
      { email: process.env.ADMIN_EMAIL },
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: "Admin",
      },
      { upsert: true }
    )

    const settingsExist = await Settings.findOne({ key: "departments" })
    if (!settingsExist) {
      await Settings.create({ key: "departments", value: DEPARTMENTS })
      await Settings.create({ key: "designations", value: [] })
      await Settings.create({
        key: "brandConfig",
        value: {
          idPrefix: "LGM-KT",
          ...BRAND,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 })
  }
}
