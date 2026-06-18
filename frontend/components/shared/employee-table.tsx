"use client"

import { motion } from "framer-motion"
import {
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  MoreHorizontal,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DEPARTMENTS } from "@/lib/constants"

interface Employee {
  _id: string
  employeeId: string
  name: string
  department: string
  designation: string
  email: string
  contactNumber: string
  photoUrl: string
  status: string
}

interface EmployeeTableProps {
  employees: Employee[]
  loading: boolean
  search: string
  setSearch: (v: string) => void
  departmentFilter: string
  setDepartmentFilter: (v: string) => void
  onDelete: (id: string) => void
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export function EmployeeTable({
  employees,
  loading,
  search,
  setSearch,
  departmentFilter,
  setDepartmentFilter,
  onDelete,
  selectedIds,
  onSelectionChange,
}: EmployeeTableProps) {
  const allSelected =
    employees.length > 0 && selectedIds.length === employees.length
  const someSelected = selectedIds.length > 0 && !allSelected

  function toggleAll() {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(employees.map((e) => e.employeeId))
    }
  }

  function toggleOne(id: string) {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((x) => x !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={departmentFilter} onValueChange={(v) => v && setDepartmentFilter(v)}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="glass-card rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 accent-[#7A003C]"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={toggleAll}
                />
              </TableHead>
              <TableHead>Employee</TableHead>
              <TableHead className="hidden md:table-cell">ID</TableHead>
              <TableHead className="hidden md:table-cell">Department</TableHead>
              <TableHead className="hidden lg:table-cell">Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
              {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-[#7A003C]" />
                </TableCell>
              </TableRow>
            ) : employees.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  No employees found
                </TableCell>
              </TableRow>
            ) : (
              employees.map((emp, i) => (
                <motion.tr
                  key={emp._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="w-10">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 accent-[#7A003C]"
                      checked={selectedIds.includes(emp.employeeId)}
                      onChange={() => toggleOne(emp.employeeId)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-[#C9A15D]/30">
                        <AvatarImage src={emp.photoUrl} />
                        <AvatarFallback className="bg-gradient-to-br from-[#7A003C] to-[#C9A15D] text-white text-xs">
                          {emp.name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{emp.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {emp.employeeId}
                    </code>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {emp.department}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {emp.designation}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={emp.status === "active" ? "default" : "secondary"}
                      className={
                        emp.status === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <Link href={`/dashboard/employees/${emp.employeeId}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          href={`/dashboard/employees/${emp.employeeId}/edit`}
                        >
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <Link
                          href={`/dashboard/employees/${emp.employeeId}/card`}
                        >
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            ID Card
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(emp.employeeId)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
