"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, BadgeCheck, BadgeX } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { getEmployee } from "@/lib/storage"

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
    if (!id) return
    const data = getEmployee(id)
    if (data) setEmployee(data)
    setLoading(false)
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
      <div className="min-h-screen bg-gradient-to-br from-[#7A003C] to-[#2a000d] flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <p className="text-lg font-medium text-muted-foreground">
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
        className="w-full max-w-sm"
      >
        <Card className="glass-card border-0 shadow-2xl text-center overflow-hidden">
          <div className="gradient-footer px-6 py-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A15D] to-[#7A003C] flex items-center justify-center">
                <span className="text-sm font-bold text-white">LM</span>
              </div>
              <div>
                <h1 className="text-lg font-heading font-bold text-white">
                  Legends Microbrewery
                </h1>
                <p className="text-[10px] tracking-[0.2em] text-[#C9A15D] uppercase">
                  Kingdom of Brews
                </p>
              </div>
            </div>
          </div>

          <CardContent className="px-6 pt-6 pb-8">
            <div className="flex flex-col items-center -mt-16 mb-4">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-white shadow-xl">
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
              <h2 className="text-xl font-heading font-bold text-[#7A003C] mt-4">
                {employee.name}
              </h2>
              <p className="text-sm text-[#C9A15D] font-medium">
                {employee.designation}
              </p>
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

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Employee ID</span>
                <code className="font-mono font-medium">
                  {employee.employeeId}
                </code>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Department</span>
                <span className="font-medium">{employee.department}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Designation</span>
                <span className="font-medium">{employee.designation}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
