"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeForm } from "@/components/shared/employee-form"
import IDCard from "@/components/shared/id-card"
import { getEmployee, updateEmployee } from "@/lib/storage"
import type { EmployeeFormValues } from "@/lib/validations/employee"
import { toast } from "sonner"

export default function EditEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [employee, setEmployee] = useState<any>(null)
  const [previewData, setPreviewData] = useState<EmployeeFormValues>({
    employeeId: "",
    name: "",
    fatherName: "",
    contactNumber: "",
    email: "",
    bloodGroup: "",
    dateOfBirth: "",
    dateOfJoining: "",
    department: "",
    designation: "",
    emergencyContact: "",
    aadhaarNumber: "",
    address: "",
    photoUrl: "",
    signatureUrl: "",
  })
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  function toDateInput(value: string): string {
    if (!value) return ""
    try {
      const d = new Date(value)
      if (isNaN(d.getTime())) return value
      return d.toISOString().split("T")[0]
    } catch {
      return value
    }
  }

  useEffect(() => {
    async function load() {
      if (!id) return
      const data = await getEmployee(id)
      if (!data) {
        toast.error("Employee not found")
        router.push("/dashboard/employees")
        return
      }
      setEmployee(data)
      const formValues: EmployeeFormValues = {
      employeeId: data.employeeId || "",
      name: data.name || "",
      fatherName: data.fatherName || "",
      contactNumber: data.contactNumber || "",
      email: data.email || "",
      bloodGroup: data.bloodGroup || "",
      dateOfBirth: toDateInput(data.dateOfBirth),
      dateOfJoining: toDateInput(data.dateOfJoining),
      department: data.department || "",
      designation: data.designation || "",
      emergencyContact: data.emergencyContact || "",
      aadhaarNumber: data.aadhaarNumber || "",
      address: data.address || "",
      photoUrl: data.photoUrl || "",
      signatureUrl: data.signatureUrl || "",
    }
      setPreviewData(formValues)
      setLoading(false)
    }
    load()
  }, [id, router])

  async function onSubmit(data: EmployeeFormValues) {
    setSaving(true)
    try {
      await updateEmployee(id, data as any)
      toast.success("Employee updated successfully")
      router.push(`/dashboard/employees/${id}`)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#7A003C]" />
      </div>
    )
  }

  if (!employee) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/employees/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
            Edit Employee
          </h1>
          <p className="text-sm text-muted-foreground">
            {employee.name} &middot; {employee.employeeId}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-[#7A003C]">
                Employee Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmployeeForm
                defaultValues={previewData}
                onSubmit={onSubmit}
                loading={saving}
                submitLabel="Update Employee"
                onValuesChange={setPreviewData}
              />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-heading text-[#7A003C]">
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={JSON.stringify(previewData)}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <IDCard
                    employee={
                      {
                        ...previewData,
                        employeeId: employee.employeeId,
                        status: "active",
                      } as any
                    }
                    preview
                  />
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
