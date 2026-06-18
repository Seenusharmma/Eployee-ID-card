import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Employee } from "@/lib/models/employee"

export async function GET() {
  try {
    await connectDB()
    const total = await Employee.countDocuments()
    const active = await Employee.countDocuments({ status: "active" })
    const departments = await Employee.distinct("department")
    return NextResponse.json({ total, active, inactive: total - active, departments: departments.length })
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 })
  }
}
