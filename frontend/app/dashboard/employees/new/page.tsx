"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmployeeForm } from "@/components/shared/employee-form"
import IDCard from "@/components/shared/id-card"
import { createEmployee } from "@/lib/storage"
import type { EmployeeFormValues } from "@/lib/validations/employee"
import { toast } from "sonner"

export default function NewEmployeePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    address: "",
    photoUrl: "",
    signatureUrl: "",
  })

  async function onSubmit(data: EmployeeFormValues) {
    setLoading(true)
    try {
      const employee = createEmployee(data as any)
      toast.success("Employee created successfully")
      router.push(`/dashboard/employees/${employee.employeeId}`)
    } catch {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/employees">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
            Add Employee
          </h1>
          <p className="text-sm text-muted-foreground">
            Create a new employee record
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
                onSubmit={onSubmit}
                loading={loading}
                submitLabel="Create Employee"
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
                        employeeId: previewData.employeeId || "LGM-KT-•••",
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
