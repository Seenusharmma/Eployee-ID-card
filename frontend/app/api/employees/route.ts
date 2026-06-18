import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Employee } from "@/lib/models/employee"

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
    const employee = await Employee.create(body)
    return NextResponse.json(employee, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create employee"
    return NextResponse.json({ error: msg }, { status: 400 })
  }
}
