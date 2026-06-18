"use client"

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Edit,
  Download,
  Trash2,
  Loader2,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Droplets,
  BadgeAlert,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import IDCard from "@/components/shared/id-card"
import { getEmployee, deleteEmployee } from "@/lib/storage"
import { toast } from "sonner"

function safeDate(value: string) {
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleDateString("en-IN")
}

export default function ViewEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return
    const emp = getEmployee(id)
    if (!emp) {
      toast.error("Employee not found")
      router.push("/dashboard/employees")
      return
    }
    setEmployee(emp)
    setLoading(false)
  }, [id, router])

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this employee?")) return
    const ok = deleteEmployee(id)
    if (ok) {
      toast.success("Employee deleted")
      router.push("/dashboard/employees")
    } else {
      toast.error("Failed to delete")
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/employees">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-[#7A003C]">
              {employee.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {employee.employeeId} &middot; {employee.department}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/employees/${id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Link href={`/dashboard/employees/${id}/card`}>
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#7A003C] to-[#C9A15D] text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              ID Card
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={handleDelete}>
            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-[#7A003C]">
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Contact</p>
                    <p className="text-sm font-medium">
                      {employee.contactNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">DOB</p>
                    <p className="text-sm font-medium">
                      {safeDate(employee.dateOfBirth)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">DOJ</p>
                    <p className="text-sm font-medium">
                      {safeDate(employee.dateOfJoining)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Droplets className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Blood Group</p>
                    <p className="text-sm font-medium">{employee.bloodGroup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BadgeAlert className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Emergency Contact</p>
                    <p className="text-sm font-medium">
                      {employee.emergencyContact}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BadgeAlert className="h-4 w-4 text-[#C9A15D]" />
                  <div>
                    <p className="text-xs text-muted-foreground">Aadhaar Number</p>
                    <p className="text-sm font-medium font-mono">
                      {employee.aadhaarNumber || "—"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-[#C9A15D] mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium">{employee.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-[#7A003C]">
                Work Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{employee.department}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Designation</p>
                  <p className="text-sm font-medium">{employee.designation}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Father&apos;s Name</p>
                  <p className="text-sm font-medium">{employee.fatherName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      employee.status === "active" ? "default" : "secondary"
                    }
                    className={
                      employee.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {employee.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-28 h-28 border-4 border-[#C9A15D] shadow-lg mb-4">
                  <AvatarImage src={employee.photoUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#7A003C] to-[#C9A15D] text-white text-3xl">
                    {employee.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-heading font-bold text-[#7A003C]">
                  {employee.name}
                </h3>
                <p className="text-sm text-[#C9A15D]">{employee.designation}</p>
                <code className="text-xs bg-muted px-2 py-1 rounded font-mono mt-2">
                  {employee.employeeId}
                </code>
              </div>
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <IDCard employee={employee} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
