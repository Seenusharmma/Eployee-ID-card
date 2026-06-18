"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, BadgeCheck, BadgeX, Mail, Phone, Calendar, MapPin, Droplets, BadgeAlert, Fingerprint, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { getEmployee } from "@/lib/storage"

function safeDate(value: string) {
  const d = new Date(value)
  return isNaN(d.getTime()) ? value : d.toLocaleDateString("en-IN")
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    async function load() {
      if (!id) return
      const data = await getEmployee(id)
      if (data) setEmployee(data)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7A003C] to-[#2a000d] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    )
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#7A003C] to-[#2a000d] flex items-center justify-center p-4">
        <Card className="p-8 text-center shadow-xl border-0" style={{ backgroundColor: "#F7EFE8" }}>
          <p className="text-lg font-medium text-[#7A003C]">
            Employee not found
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7A003C] to-[#2a000d] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl overflow-hidden" style={{ backgroundColor: "#F7EFE8" }}>
          {/* Header */}
          <div
            className="px-6 pt-8 pb-6 text-center relative"
            style={{ background: "linear-gradient(180deg, #7A003C 0%, #4A001A 100%)" }}
          >
            <div className="absolute top-2 left-2 w-8 h-8 border-l border-t border-[#C9A15D]/30 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-8 h-8 border-r border-t border-[#C9A15D]/30 rounded-tr-lg" />
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center border border-[#C9A15D]/50">
                <span className="text-xs font-bold text-[#C9A15D]">LM</span>
              </div>
              <h1 className="text-base font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                Legends Microbrewery
              </h1>
            </div>
            <p className="text-[9px] tracking-[0.3em] text-[#C9A15D] uppercase">Employee Verification</p>
          </div>

          <CardContent className="px-6 pt-6 pb-8">
            {/* Photo & Name */}
            <div className="flex flex-col items-center -mt-14 mb-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                  <AvatarImage src={employee.photoUrl} />
                  <AvatarFallback className="bg-gradient-to-br from-[#7A003C] to-[#C9A15D] text-white text-3xl">
                    {employee.name?.charAt(0)?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1">
                  {employee.status === "active" ? (
                    <BadgeCheck className="h-6 w-6 text-green-500 bg-white rounded-full" />
                  ) : (
                    <BadgeX className="h-6 w-6 text-red-500 bg-white rounded-full" />
                  )}
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#7A003C] mt-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                {employee.name}
              </h2>
              <p className="text-sm font-medium text-[#C9A15D]">{employee.designation}</p>
              <Badge
                className={`mt-2 ${
                  employee.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {employee.status}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-0 rounded-lg overflow-hidden border border-[#C9A15D]/20">
              <div className="flex justify-between items-center py-3 px-4 bg-white">
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Fingerprint className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Employee ID
                </span>
                <code className="text-sm font-mono font-bold text-gray-800">{employee.employeeId}</code>
              </div>
              <div className="flex justify-between items-center py-3 px-4" style={{ backgroundColor: "#F7EFE8" }}>
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Father&apos;s Name
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.fatherName || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white">
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Email
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4" style={{ backgroundColor: "#F7EFE8" }}>
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Contact
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.contactNumber}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white">
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Emergency
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.emergencyContact || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4" style={{ backgroundColor: "#F7EFE8" }}>
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Blood Group
                </span>
                <span className="text-sm font-bold text-gray-800">{employee.bloodGroup}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white">
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#C9A15D]" />
                  DOB
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.dateOfBirth ? safeDate(employee.dateOfBirth) : "—"}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4" style={{ backgroundColor: "#F7EFE8" }}>
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-[#C9A15D]" />
                  DOJ
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.dateOfJoining ? safeDate(employee.dateOfJoining) : "—"}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4 bg-white">
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <BadgeAlert className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Department
                </span>
                <span className="text-sm font-medium text-gray-800">{employee.department}</span>
              </div>
              <div className="flex justify-between items-center py-3 px-4" style={{ backgroundColor: "#F7EFE8" }}>
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <BadgeAlert className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Aadhaar No.
                </span>
                <span className="text-sm font-mono font-medium text-gray-800">{employee.aadhaarNumber || "—"}</span>
              </div>
              <div className="flex justify-between items-start py-3 px-4 bg-white">
                <span className="text-xs font-semibold text-[#7A003C] uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[#C9A15D]" />
                  Address
                </span>
                <span className="text-sm font-medium text-gray-800 text-right max-w-[200px]">{employee.address}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-[10px] text-gray-400">
                Legends Microbrewery &middot; Employee Verification Portal
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
