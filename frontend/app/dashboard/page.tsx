"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  UserCheck,
  UserX,
  Building2,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getStats } from "@/lib/storage"

interface DashboardStats {
  total: number
  active: number
  inactive: number
  departments: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, active: 0, inactive: 0, departments: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setStats(getStats())
    setLoading(false)
  }, [])

  const statCards = [
    {
      title: "Total Employees",
      value: stats?.total ?? 0,
      icon: Users,
      color: "from-[#7A003C] to-[#C9A15D]",
      href: "/dashboard/employees",
    },
    {
      title: "Active Employees",
      value: stats?.active ?? 0,
      icon: UserCheck,
      color: "from-green-600 to-green-400",
      href: "/dashboard/employees?status=active",
    },
    {
      title: "Inactive Employees",
      value: stats?.inactive ?? 0,
      icon: UserX,
      color: "from-red-600 to-red-400",
      href: "/dashboard/employees?status=inactive",
    },
    {
      title: "Departments",
      value: stats?.departments ?? 0,
      icon: Building2,
      color: "from-blue-600 to-blue-400",
      href: "/dashboard/settings",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#7A003C]">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back to Legends Microbrewery HR Portal
          </p>
        </div>
        <Link href="/dashboard/employees/new">
          <Button className="bg-gradient-to-r from-[#7A003C] to-[#C9A15D] text-white hover:from-[#6a0032] hover:to-[#b8914d]">
            <TrendingUp className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-8 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </CardContent>
              </Card>
            ))
          : statCards.map((stat, i) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={stat.href}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </CardTitle>
                      <div
                        className={`h-8 w-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                      >
                        <stat.icon className="h-4 w-4 text-white" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                        Live update
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-[#7A003C]">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/employees/new">
              <Button variant="outline" className="w-full justify-start border-[#7A003C]/20 hover:bg-[#7A003C]/5">
                <Users className="mr-2 h-4 w-4 text-[#7A003C]" />
                Add New Employee
              </Button>
            </Link>
            <Link href="/dashboard/employees">
              <Button variant="outline" className="w-full justify-start border-[#7A003C]/20 hover:bg-[#7A003C]/5">
                <UserCheck className="mr-2 h-4 w-4 text-[#7A003C]" />
                View All Employees
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full justify-start border-[#7A003C]/20 hover:bg-[#7A003C]/5">
                <Building2 className="mr-2 h-4 w-4 text-[#7A003C]" />
                Manage Departments
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg font-heading text-[#7A003C]">
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Active Rate</span>
              <span className="text-sm font-semibold">
                {stats?.total
                  ? Math.round((stats.active / stats.total) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: stats?.total
                    ? `${(stats.active / stats.total) * 100}%`
                    : "0%",
                }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#7A003C] to-[#C9A15D]"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Departments</span>
              <span className="text-sm font-semibold">{stats?.departments}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Inactive</span>
              <span className="text-sm font-semibold">{stats?.inactive}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
