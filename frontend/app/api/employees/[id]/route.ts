import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Employee } from "@/lib/models/employee"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const employee = await Employee.findOne({ employeeId: id }).lean()
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(employee)
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await req.json()
    const employee = await Employee.findOneAndUpdate({ employeeId: id }, body, { new: true }).lean()
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(employee)
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 400 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const employee = await Employee.findOneAndDelete({ employeeId: id }).lean()
    if (!employee) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 400 })
  }
}
