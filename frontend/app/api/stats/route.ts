import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Employee } from "@/lib/models/employee"

export async function GET() {
  try {
    await connectDB()
    const total = await Employee.countDocuments()
    const active = await Employee.countDocuments({ status: "active" })
    const departments = await Employee.distinct("department")
    const withPhoto = await Employee.countDocuments({ photoUrl: { $ne: "" } })
    const withSignature = await Employee.countDocuments({ signatureUrl: { $ne: "" } })
    const withBoth = await Employee.countDocuments({
      photoUrl: { $ne: "" },
      signatureUrl: { $ne: "" },
    })
    const withNeither = await Employee.countDocuments({
      photoUrl: "",
      signatureUrl: "",
    })
    return NextResponse.json({
      total,
      active,
      inactive: total - active,
      departments: departments.length,
      withPhoto,
      withSignature,
      withBoth,
      withNeither,
    })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
