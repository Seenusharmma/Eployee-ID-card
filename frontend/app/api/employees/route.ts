import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Employee } from "@/lib/models/employee"
import { Settings } from "@/lib/models/settings"

export async function GET(req: Request) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search") || ""
    const department = searchParams.get("department") || ""
    const status = searchParams.get("status") || ""

    const filter: Record<string, unknown> = {}
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ]
    }
    if (department) filter.department = { $regex: department, $options: "i" }
    if (status) filter.status = { $regex: status, $options: "i" }

    const employees = await Employee.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json(employees)
  } catch {
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()

    if (!body.employeeId) {
      const brandDoc = await Settings.findOne({ key: "brandConfig" })
      const prefix = brandDoc?.value?.idPrefix || "LGM-KT"
      const last = await Employee.findOne({ employeeId: new RegExp(`^${prefix}-\\d{3}$`) })
        .sort({ employeeId: -1 })
        .lean()
      const lastNum = last ? parseInt(last.employeeId.split("-")[2], 10) : 0
      body.employeeId = `${prefix}-${String(lastNum + 1).padStart(3, "0")}`
    }

    const employee = await Employee.create(body)
    return NextResponse.json(employee, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create employee"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
